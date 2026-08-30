import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState(null);

  const openReviewModal = useCallback((product) => {
    setReviewModalProduct(product);
  }, []);

  const closeReviewModal = useCallback(() => {
    setReviewModalProduct(null);
  }, []);

  // 1. Shopping Bag State (persisted in localStorage)
  const [bag, setBag] = useState(() => {
    try {
      const saved = localStorage.getItem('myntra_bag');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Bag to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('myntra_bag', JSON.stringify(bag));
    } catch (err) {
      console.error('Failed to persist bag:', err);
    }
  }, [bag]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoadingWishlist(true);
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((productId) => {
    return wishlist.some((item) => item.productId === productId || item.product?.id === productId);
  }, [wishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId && item.product?.id !== productId));
      showToast('Removed from Wishlist');
      await api.removeFromWishlist(productId);
      fetchWishlist();
    } catch (err) {
      console.error('Wishlist remove error:', err);
      fetchWishlist();
    }
  }, [fetchWishlist, showToast]);

  const toggleWishlist = useCallback(async (product) => {
    const pId = product.id || product.productId;
    const currentlyWishlisted = isWishlisted(pId);

    try {
      if (currentlyWishlisted) {
        // Optimistic removal
        setWishlist((prev) => prev.filter((item) => item.productId !== pId && item.product?.id !== pId));
        showToast('Removed from Wishlist');
        await api.removeFromWishlist(pId);
      } else {
        // Optimistic addition
        const optimisticItem = {
          id: `temp_${Date.now()}`,
          productId: pId,
          addedAt: new Date().toISOString(),
          product
        };
        setWishlist((prev) => [optimisticItem, ...prev]);
        showToast('Added to Wishlist');
        await api.addToWishlist(pId);
      }
      fetchWishlist();
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      showToast('Could not update wishlist');
      fetchWishlist();
    }
  }, [isWishlisted, showToast, fetchWishlist]);

  // 2. Bag Action Handlers
  const addToBag = useCallback((product, size = null, quantity = 1) => {
    const resolvedProduct = product.product || product;
    const pId = resolvedProduct.id || resolvedProduct.productId;
    const resolvedSize = size || (resolvedProduct.sizes && resolvedProduct.sizes.length > 0 ? resolvedProduct.sizes[0] : 'M');

    setBag((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === pId && item.size === resolvedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          {
            id: `bag_${pId}_${resolvedSize}_${Date.now()}`,
            product: resolvedProduct,
            size: resolvedSize,
            quantity,
            addedAt: new Date().toISOString()
          },
          ...prev
        ];
      }
    });

    showToast(`Added ${resolvedProduct.brand || 'item'} to Bag • Size: ${resolvedSize}`);
  }, [showToast]);

  const removeFromBag = useCallback((productId, size = null) => {
    setBag((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (size && item.size !== size) return true;
        return false;
      })
    );
    showToast('Removed item from Bag');
  }, [showToast]);

  const updateBagQuantity = useCallback((productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromBag(productId, size);
      return;
    }

    setBag((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!size || item.size === size)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromBag]);

  const updateBagSize = useCallback((productId, oldSize, newSize) => {
    setBag((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.size === oldSize) {
          return { ...item, size: newSize };
        }
        return item;
      })
    );
    showToast(`Updated size to ${newSize}`);
  }, [showToast]);

  // Push product from Wishlist to Bag
  const moveToBagFromWishlist = useCallback(async (product, size = null) => {
    const resolvedProduct = product.product || product;
    const pId = resolvedProduct.id || resolvedProduct.productId;
    const resolvedSize = size || (resolvedProduct.sizes && resolvedProduct.sizes.length > 0 ? resolvedProduct.sizes[0] : 'M');

    // Add to bag
    addToBag(resolvedProduct, resolvedSize, 1);

    // Also remove from wishlist
    try {
      setWishlist((prev) => prev.filter((item) => item.productId !== pId && item.product?.id !== pId));
      await api.removeFromWishlist(pId);
      fetchWishlist();
    } catch (err) {
      console.error('Wishlist removal on move to bag error:', err);
    }
  }, [addToBag, fetchWishlist]);

  // Move product from Bag to Wishlist
  const moveToWishlistFromBag = useCallback(async (product, size) => {
    const resolvedProduct = product.product || product;
    const pId = resolvedProduct.id || resolvedProduct.productId;

    removeFromBag(pId, size);

    if (!isWishlisted(pId)) {
      try {
        const optimisticItem = {
          id: `temp_${Date.now()}`,
          productId: pId,
          addedAt: new Date().toISOString(),
          product: resolvedProduct
        };
        setWishlist((prev) => [optimisticItem, ...prev]);
        showToast('Moved item to Wishlist');
        await api.addToWishlist(pId);
        fetchWishlist();
      } catch (err) {
        console.error('Wishlist add on move from bag error:', err);
      }
    } else {
      showToast('Item already in Wishlist');
    }
  }, [removeFromBag, isWishlisted, showToast, fetchWishlist]);

  const clearBag = useCallback(() => {
    setBag([]);
  }, []);

  // Compute Bag Totals
  const bagCount = useMemo(() => {
    return bag.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [bag]);

  const bagTotals = useMemo(() => {
    let totalMrp = 0;
    let totalFinalPrice = 0;

    for (const item of bag) {
      const qty = item.quantity || 1;
      const mrp = item.product.mrp || item.product.finalPrice || 0;
      const finalPrice = item.product.finalPrice || mrp;

      totalMrp += mrp * qty;
      totalFinalPrice += finalPrice * qty;
    }

    const totalDiscount = Math.max(0, totalMrp - totalFinalPrice);
    const platformFee = bag.length > 0 ? 20 : 0;
    const finalAmount = totalFinalPrice + (platformFee > 0 ? platformFee : 0);

    return {
      totalMrp,
      totalFinalPrice,
      totalDiscount,
      platformFee,
      shippingFee: 0, // Free shipping
      finalAmount
    };
  }, [bag]);

  // 3. Wishlist Custom Tagging & Collections (persisted in localStorage)
  const [wishlistTags, setWishlistTagsState] = useState(() => {
    try {
      const saved = localStorage.getItem('myntra_wishlist_tags');
      return saved ? JSON.parse(saved) : {
        prod_1: ['💼 Workwear', '✨ Aspirational'],
        prod_2: ['🎁 Gift Idea'],
        prod_3: ['🏖️ Vacation']
      };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('myntra_wishlist_tags', JSON.stringify(wishlistTags));
    } catch (err) {
      console.error('Failed to persist wishlist tags:', err);
    }
  }, [wishlistTags]);

  const toggleWishlistTag = useCallback((productId, tag) => {
    setWishlistTagsState((prev) => {
      const current = prev[productId] || [];
      const exists = current.includes(tag);
      const nextTags = exists ? current.filter((t) => t !== tag) : [...current, tag];
      return {
        ...prev,
        [productId]: nextTags
      };
    });
  }, []);

  const addCustomWishlistTag = useCallback((productId, newTag) => {
    if (!newTag || !newTag.trim()) return;
    const cleanTag = newTag.trim();
    setWishlistTagsState((prev) => {
      const current = prev[productId] || [];
      if (current.includes(cleanTag)) return prev;
      return {
        ...prev,
        [productId]: [...current, cleanTag]
      };
    });
  }, []);

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loadingWishlist,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    fetchWishlist,
    wishlistTags,
    toggleWishlistTag,
    addCustomWishlistTag,
    bag,
    bagCount,
    bagTotals,
    addToBag,
    removeFromBag,
    updateBagQuantity,
    updateBagSize,
    moveToBagFromWishlist,
    moveToWishlistFromBag,
    clearBag,
    isSearchOpen,
    setIsSearchOpen,
    showToast,
    toastMessage,
    reviewModalProduct,
    openReviewModal,
    closeReviewModal
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
