import React, { useState } from 'react';
import { Star, Heart, Share2, Layers, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImageUrl } from '../../utils/imageHelper';

export default function ImageGallery({ product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const { isWishlisted, toggleWishlist, showToast } = useApp();

  const wishlisted = isWishlisted(product.id);
  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['/images/placeholder.jpg'];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Myntra`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Main Hero Image View with Swipe / Controls */}
      <div className="relative w-full pb-[115%] bg-[#F5F5F6] overflow-hidden select-none group">
        <img
          src={getProductImageUrl(images[activeIdx], product.category, activeIdx + 1)}
          alt={`${product.name} view ${activeIdx + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-300"
        />

        {/* 1. Purple Tag: "House of Brands" (Top-Left, matching screenshot) */}
        <div className="absolute top-3 left-0 bg-[#7C3AED] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-r shadow-xs flex items-center gap-1">
          <span>House of Brands</span>
        </div>

        {/* Previous / Next Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs text-[#282C3F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs text-[#282C3F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* 2. Rating Pill Overlay: "3.9 ★ | 67" (Bottom-Right of Image, matching screenshot) */}
        {product.rating > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 border border-[#EAEAEC]">
            <span className="text-xs font-black text-[#282C3F]">
              {product.rating}
            </span>
            <Star className="w-3 h-3 fill-[#03A685] text-[#03A685]" />
            <span className="text-[#D4D5D9] text-xs font-normal">|</span>
            <span className="text-[11px] text-[#535766] font-bold">
              {product.reviewCount}
            </span>
          </div>
        )}

        {/* Carousel Indicator Bars (Bottom-Center) */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`h-1 rounded-full transition-all cursor-pointer ${
                  activeIdx === idx ? 'w-4 bg-white' : 'w-1 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Three Equal Action Buttons Under Hero Image: [Similar], [♡ Wishlist], [Share] (matching screenshot) */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-white border-b border-[#F5F5F6]">
        {/* Button 1: Complete The Look / Similar Styles */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('outfit-pairing-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              showToast('Matching complete outfit styles...');
            }
          }}
          aria-label="Complete The Look"
          className="flex items-center justify-center py-2 px-2 rounded-lg bg-[#F5F5F6] hover:bg-[#EAEAEC] active:scale-95 transition-all text-[#282C3F] cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#535766]" />
        </button>

        {/* Button 2: Wishlist Heart */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label="Wishlist"
          className={`flex items-center justify-center py-2 px-2 rounded-lg active:scale-95 transition-all cursor-pointer ${
            wishlisted
              ? 'bg-[#FFF0F3] text-[#FF3F6C]'
              : 'bg-[#F5F5F6] hover:bg-[#EAEAEC] text-[#282C3F]'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#FF3F6C] text-[#FF3F6C]' : 'text-[#282C3F]'}`} />
        </button>

        {/* Button 3: Share */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share"
          className="flex items-center justify-center py-2 px-2 rounded-lg bg-[#F5F5F6] hover:bg-[#EAEAEC] active:scale-95 transition-all text-[#282C3F] cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#535766]" />
        </button>
      </div>
    </div>
  );
}
