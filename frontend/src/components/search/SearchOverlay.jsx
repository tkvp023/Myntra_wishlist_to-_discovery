import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Heart, TrendingUp, ArrowRight, ArrowLeft, Sparkles, Info } from 'lucide-react';
import { api } from '../../api/client';
import { useApp } from '../../context/AppContext';
import { useGuide } from '../../context/GuideContext';
import { getProductImageUrl } from '../../utils/imageHelper';

export default function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { wishlist, isWishlisted } = useApp();
  const { isGuideMode, currentStepIndex } = useGuide();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [isSearchingSubmitted, setIsSearchingSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getProducts().then((prods) => setAllProducts(prods)).catch(console.error);
      setIsSearchingSubmitted(false);
    }
  }, [isOpen]);

  // Native Myntra Type-Ahead Suggestions (Pure keywords, unmodified)
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches = new Set();

    allProducts.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) matches.add(p.name);
      if (p.brand.toLowerCase().includes(q)) matches.add(`${p.brand} ${p.category}`);
      if (p.category.toLowerCase().includes(q)) matches.add(`${p.category} styles`);
      if (p.subcategory?.toLowerCase().includes(q)) matches.add(p.subcategory);
    });

    return Array.from(matches).slice(0, 6);
  }, [query, allProducts]);

  // Search Results Grid (when submitted or suggestion tapped)
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (sug) => {
    setQuery(sug);
    setIsSearchingSubmitted(true);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsSearchingSubmitted(true);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const trendingTags = [
    'Roadster Shirts',
    'Campus Sports Shoes',
    'Lavie Tote Bags',
    'Anarkali Kurta Sets',
    'Maybelline Lipsticks',
    'Formal Trousers',
    'Philips Hair Styler'
  ];

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200 select-none">
      
      {/* 1. Myntra Search Input Header */}
      <div className="p-3 border-b border-[#EAEAEC] flex items-center gap-2 bg-white sticky top-0 z-10 shadow-2xs">
        <button
          onClick={onClose}
          aria-label="Back"
          className="p-1 text-[#282C3F] hover:text-[#FF3F6C] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-[#F5F5F6] rounded-full px-3 py-2 border border-transparent focus-within:border-[#FF3F6C] transition-all">
          <Search className="w-4 h-4 text-[#FF3F6C] mr-2 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search for brands, items and categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearchingSubmitted(false);
            }}
            className="w-full text-xs text-[#282C3F] bg-transparent focus:outline-none placeholder:text-[#94969F]"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsSearchingSubmitted(false);
              }}
              className="text-[#94969F] hover:text-[#282C3F] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {query && !isSearchingSubmitted ? (
          <button
            onClick={handleSearchSubmit}
            className="text-xs font-bold text-[#FF3F6C] px-2 py-1 cursor-pointer"
          >
            Search
          </button>
        ) : (
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#535766] px-1 py-1 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 2. Content View Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* STEP 3 GUIDED MESSAGE BAR: Guides the user to type "shirts" */}
        {isGuideMode && currentStepIndex === 2 && !isSearchingSubmitted && (
          <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FFF8F9] border-2 border-[#FF3F6C] rounded-2xl p-3.5 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#FF3F6C] uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#FF3F6C]" />
                <span>Guided Step 3</span>
              </div>
              <span className="text-[10px] font-bold text-[#535766] bg-white px-2 py-0.5 rounded-full border border-[#EAEAEC]">
                Search Discovery
              </span>
            </div>
            
            <p className="text-xs font-bold text-[#282C3F] leading-snug">
              Type <strong className="text-[#FF3F6C]">"shirts"</strong> or tap the button below to search and see how wishlisted items appear in search results:
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery('shirts');
                setIsSearchingSubmitted(true);
              }}
              className="mt-2.5 w-full py-2 px-4 bg-[#FF3F6C] hover:bg-[#E0355E] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search "Shirts"</span>
            </button>
          </div>
        )}

        {/* STAGE A: Native Type-Ahead Suggestions (Unmodified, zero wishlist intrusion during typing) */}
        {query && !isSearchingSubmitted && suggestions.length > 0 && (
          <div className="space-y-1 divide-y divide-[#F5F5F6]">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                className="w-full py-2.5 px-2 flex items-center justify-between text-left hover:bg-[#FFF0F3]/40 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-3.5 h-3.5 text-[#94969F] group-hover:text-[#FF3F6C]" />
                  <span className="text-xs text-[#282C3F] group-hover:text-[#FF3F6C] font-semibold">
                    {sug}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4D5D9] group-hover:text-[#FF3F6C]" />
              </button>
            ))}
          </div>
        )}

        {/* STAGE B: Trending Searches (Initial Empty State) */}
        {!query && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#282C3F] uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF3F6C]" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectSuggestion(tag)}
                  className="px-3 py-2 bg-[#F5F5F6] hover:bg-[#FFF0F3] hover:text-[#FF3F6C] text-[#535766] text-xs font-semibold rounded-full border border-transparent hover:border-[#FF3F6C]/30 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE C: LOCKED-IN FINAL SEARCH SPEC (Results Grid with Inline Wishlist Tile Marker) */}
        {(isSearchingSubmitted || (query && suggestions.length === 0)) && (
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-[#F5F5F6]">
              <h3 className="text-xs font-extrabold text-[#282C3F] uppercase tracking-wider">
                Results for "{query}" ({searchResults.length})
              </h3>
              <span className="text-[10px] text-[#94969F] font-semibold">
                Tap product to view
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 text-[#94969F]">
                <Search className="w-10 h-10 mx-auto text-[#D4D5D9] mb-2" />
                <p className="text-xs font-bold text-[#535766]">No products found for "{query}"</p>
                <p className="text-[11px] mt-1 text-[#94969F]">Try searching for shirts, shoes, kurtas, or makeup.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-2.5 gap-y-4">
                {searchResults.map((product) => {
                  const wishlisted = isWishlisted(product.id);
                  const img = getProductImageUrl(product.images?.[0], product.category, 1);

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className={`group cursor-pointer flex flex-col bg-white rounded-xl transition-all relative pb-2 select-none ${
                        wishlisted && isGuideMode && currentStepIndex === 2
                          ? 'border-2 border-[#FF3F6C] p-1 shadow-md bg-[#FFF5F7]/30'
                          : 'border border-transparent hover:border-[#EAEAEC]'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-full pb-[133%] bg-[#F5F5F6] overflow-hidden rounded-lg">
                        <img
                          src={img}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* FINAL SEARCH SPEC INLINE MARKER: If product is in wishlist, small subtle visual marker directly on tile */}
                        {wishlisted && (
                          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-[#FF3F6C]/40 animate-fade-in">
                            <Heart className="w-2.5 h-2.5 fill-[#FF3F6C] text-[#FF3F6C]" />
                            <span className="text-[9px] font-black text-[#FF3F6C] uppercase tracking-tight">
                              Wishlisted
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details (Thumbnail + Name + Price per Section 8 — NO trust stats shown on search) */}
                      <div className="pt-2 px-1 flex flex-col flex-1">
                        <h4 className="text-xs font-black text-[#282C3F] uppercase tracking-wide truncate group-hover:text-[#FF3F6C]">
                          {product.brand}
                        </h4>
                        <p className="text-[11px] text-[#535766] truncate font-normal leading-tight">
                          {product.name}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-[#282C3F]">₹{product.finalPrice}</span>
                          {product.mrp > product.finalPrice && (
                            <span className="text-[10px] text-[#94969F] line-through font-normal">
                              ₹{product.mrp}
                            </span>
                          )}
                          {product.discountPercent > 0 && (
                            <span className="text-[10px] font-bold text-[#FF905A]">
                              ({product.discountPercent}% OFF)
                            </span>
                          )}
                        </div>

                        {/* STEP 3 POINTER CALLOUT BOX POINTING TO THE WISHLISTED ITEM */}
                        {wishlisted && isGuideMode && currentStepIndex === 2 && (
                          <div className="mt-2 bg-[#282C3F] text-white p-2 rounded-lg text-[9.5px] leading-tight shadow-md border border-[#FF3F6C]/40 animate-fade-in">
                            <div className="flex items-center gap-1 text-[#FF85A0] font-black text-[8.5px] uppercase tracking-wider mb-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Notice [🤍 Wishlisted] Marker</span>
                            </div>
                            <p className="text-white/90 font-medium">
                              Subtle marker reminds you this is saved in your wishlist (trust stats are omitted here to keep search discovery clean).
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
