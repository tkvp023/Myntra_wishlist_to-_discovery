import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import WishlistCard from '../components/wishlist/WishlistCard';
import ReengagementCard from '../components/wishlist/ReengagementCard';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  MapPin,
  ChevronDown,
  Edit3,
  Layers,
  Archive,
  CreditCard
} from 'lucide-react';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistCount, removeFromWishlist, bagCount, wishlistTags } = useApp();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'collections' | 'outofstock'
  const [selectedTag, setSelectedTag] = useState('all');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWishlist();
      setWishlistItems(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Could not load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    window.scrollTo(0, 0);
  }, []);

  const handleRemove = async (productId) => {
    try {
      // Optimistic update locally
      setWishlistItems((prev) => prev.filter((item) => item.product?.id !== productId));
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      fetchWishlist();
    }
  };

  // Collect all unique collection tags across saved items
  const allAvailableTags = Array.from(
    new Set(
      Object.values(wishlistTags || {}).flat()
    )
  );

  // Filter items based on collection tag and out of stock tab
  const displayedItems = wishlistItems.filter((item) => {
    if (activeFilter === 'outofstock') return false;
    if (selectedTag !== 'all') {
      const itemTags = wishlistTags[item.product?.id] || [];
      return itemTags.includes(selectedTag);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#FF3F6C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#535766] mt-3 font-semibold">Loading your saved items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <p className="text-xs text-[#D5284F] font-bold mb-3">{error}</p>
        <button
          type="button"
          onClick={fetchWishlist}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3F6C] border border-[#FF3F6C] px-4 py-2 rounded-full cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Filter items that have re-engagement prompts (stalled items with badge data)
  const reengagementItems = wishlistItems.filter(
    (item) => item.reengagement?.hasData && item.reengagement?.message
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F6] pb-16 select-none">
      
      {/* 1. Header Bar (matching attached Myntra screenshot: Back, Wishlist X items, Edit, Bag) */}
      <div className="bg-white px-3 py-2.5 border-b border-[#EAEAEC] sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="text-[#282C3F] hover:text-[#FF3F6C] p-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
              Wishlist
            </h1>
            <p className="text-[10px] text-[#94969F] font-semibold">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#282C3F]">
          <button type="button" aria-label="Edit wishlist" className="p-1 hover:text-[#FF3F6C] cursor-pointer">
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/bag')}
            aria-label="Shopping bag"
            className="p-1 relative hover:text-[#FF3F6C] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {bagCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF3F6C] text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Delivery Address Selector Bar (matching screenshot) */}
      <div className="bg-[#FFF8F9] px-3 py-2 border-b border-[#FF3F6C]/15 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#9333EA] flex-shrink-0" />
          <span className="text-[11px] text-[#282C3F] truncate font-semibold">
            <strong>BBCL Vajra</strong> - Service Rd, Nolambur, Ambattur...
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#535766] flex-shrink-0" />
      </div>

      {/* 3. Filter Action Tabs: Collections | Out of Stock */}
      <div id="wishlist-tags-section" className="flex items-center gap-2 px-3 pt-2.5 pb-1.5 bg-white border-b border-[#F5F5F6]">
        <button
          type="button"
          onClick={() => {
            if (activeFilter === 'collections') {
              setActiveFilter('all');
              setSelectedTag('all');
            } else {
              setActiveFilter('collections');
            }
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'collections' || selectedTag !== 'all'
              ? 'border-[#FF3F6C] bg-[#FFF0F3] text-[#FF3F6C]'
              : 'border-[#D4D5D9] text-[#282C3F] hover:bg-[#F5F5F6]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#535766]" />
          <span>Collections {allAvailableTags.length > 0 ? `(${allAvailableTags.length})` : ''}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveFilter(activeFilter === 'outofstock' ? 'all' : 'outofstock');
            setSelectedTag('all');
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'outofstock'
              ? 'border-[#FF3F6C] bg-[#FFF0F3] text-[#FF3F6C]'
              : 'border-[#D4D5D9] text-[#282C3F] hover:bg-[#F5F5F6]'
          }`}
        >
          <Archive className="w-3.5 h-3.5 text-[#535766]" />
          <span>Out of Stock</span>
        </button>
      </div>

      {/* 3.1 Dynamic Custom Collection Intent Tags Scroll Bar */}
      <div className="px-3 py-2 bg-[#FAFAFB] border-b border-[#EAEAEC] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedTag === 'all'
              ? 'bg-[#282C3F] text-white shadow-xs'
              : 'bg-white text-[#535766] border border-[#D4D5D9] hover:border-[#282C3F]'
          }`}
        >
          All Items ({wishlistItems.length})
        </button>

        {allAvailableTags.map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              selectedTag === tag
                ? 'bg-[#FF3F6C] text-white border border-[#FF3F6C] shadow-2xs'
                : 'bg-white text-[#282C3F] border border-[#D4D5D9] hover:border-[#FF3F6C]'
            }`}
          >
            <span>{tag}</span>
          </button>
        ))}
      </div>

      {/* 4. Subcategory Pills Scroll (Tshirts, Shirts, Shoes, Handbags) */}
      <div className="flex items-center gap-3 px-3 py-2 bg-white border-b border-[#EAEAEC] overflow-x-auto no-scrollbar">
        <div className="flex flex-col items-center min-w-[50px] cursor-pointer opacity-100">
          <div className="w-11 h-11 rounded-full bg-[#FFF0F3] border-2 border-[#FF3F6C] flex items-center justify-center text-base">
            👕
          </div>
          <span className="text-[10px] font-bold text-[#FF3F6C] mt-1 truncate">Tshirts</span>
        </div>
        <div className="flex flex-col items-center min-w-[50px] cursor-pointer opacity-80 hover:opacity-100">
          <div className="w-11 h-11 rounded-full bg-[#F5F5F6] border border-[#D4D5D9] flex items-center justify-center text-base">
            👔
          </div>
          <span className="text-[10px] font-semibold text-[#535766] mt-1 truncate">Shirts</span>
        </div>
        <div className="flex flex-col items-center min-w-[50px] cursor-pointer opacity-80 hover:opacity-100">
          <div className="w-11 h-11 rounded-full bg-[#F5F5F6] border border-[#D4D5D9] flex items-center justify-center text-base">
            👟
          </div>
          <span className="text-[10px] font-semibold text-[#535766] mt-1 truncate">Shoes</span>
        </div>
        <div className="flex flex-col items-center min-w-[50px] cursor-pointer opacity-80 hover:opacity-100">
          <div className="w-11 h-11 rounded-full bg-[#F5F5F6] border border-[#D4D5D9] flex items-center justify-center text-base">
            👜
          </div>
          <span className="text-[10px] font-semibold text-[#535766] mt-1 truncate">Bags</span>
        </div>
      </div>

      {/* 5. Promotional Cashback Banner */}
      <div className="mx-3 mt-3 bg-gradient-to-r from-[#9D174D] via-[#BE185D] to-[#E11D48] rounded-xl p-3 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black leading-tight">Get 7.5% Cashback</h3>
            <p className="text-[10px] text-pink-100 mt-0.5">With Flipkart Axis Credit Card</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-[10px] font-black bg-white text-[#BE185D] px-2.5 py-1 rounded-full shadow-2xs hover:bg-pink-50 cursor-pointer"
        >
          Apply Now &gt;
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white my-3 mx-3 rounded-2xl border border-[#EAEAEC]">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#FF3F6C] flex items-center justify-center mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-sm font-black text-[#282C3F]">Your wishlist is empty</h2>
          <p className="text-xs text-[#535766] mt-1 max-w-[240px]">
            Explore trending collections and tap the ♡ icon to save items with verified trust signals.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2.5 bg-[#FF3F6C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E0355E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : displayedItems.length === 0 ? (
        /* No items in selected collection tag */
        <div className="p-8 text-center bg-white my-3 mx-3 rounded-2xl border border-dashed border-[#D4D5D9]">
          <span className="text-2xl block mb-1">🏷️</span>
          <h3 className="text-xs font-black text-[#282C3F]">No items in "{selectedTag}"</h3>
          <p className="text-[11px] text-[#535766] mt-1">Tap the 🏷️ Tag button on any wishlist item to add it to this collection.</p>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className="mt-3 px-4 py-1.5 bg-[#FF3F6C] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#E0355E]"
          >
            Show All Items ({wishlistItems.length})
          </button>
        </div>
      ) : (
        <div className="p-3 space-y-3.5">
          {/* 6. Stalled Intent Re-Engagement Cards Section (Part C) */}
          {reengagementItems.length > 0 && selectedTag === 'all' && (
            <div className="space-y-2">
              {reengagementItems.slice(0, 1).map((item) => (
                <ReengagementCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* 7. Wishlist Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {displayedItems.map((item, index) => (
              <WishlistCard
                key={item.id}
                item={item}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* 8. Authentic Myntra Footer Quote */}
          <div className="pt-8 pb-4 text-center text-[#94969F]">
            <p className="text-[11px] italic font-serif leading-relaxed text-[#535766]">
              "The great thing about fashion is that it always looks forward."
            </p>
            <p className="text-[10px] font-bold text-[#94969F] mt-1 tracking-wider uppercase">
              — Oscar De La Renta
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
