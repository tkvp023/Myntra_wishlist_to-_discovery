import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImageUrl } from '../../utils/imageHelper';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useApp();

  const wishlisted = isWishlisted(product.id);
  const mainImage = getProductImageUrl(product.images?.[0], product.category, 1);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer flex flex-col bg-white rounded-none border border-transparent hover:border-[#EAEAEC] transition-all pb-2 select-none"
    >
      {/* 3:4 Aspect Ratio Product Image */}
      <div className="relative w-full pb-[133%] bg-[#F5F5F6] overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />

        {/* Rating Pill Overlay (Bottom-Left of Image) */}
        {product.rating > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
            <span className="text-[11px] font-bold text-[#282C3F] flex items-center gap-0.5">
              {product.rating} <Star className="w-2.5 h-2.5 fill-[#03A685] text-[#03A685]" />
            </span>
            <span className="text-[9px] text-[#94969F] border-l border-[#D4D5D9] pl-1 font-medium">
              {product.reviewCount}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button (Top-Right of Image) */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-[#282C3F] hover:text-[#FF3F6C] shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${
              wishlisted ? 'text-[#FF3F6C] fill-[#FF3F6C]' : 'text-[#535766]'
            }`}
          />
        </button>
      </div>

      {/* Product Details Block */}
      <div className="pt-2 px-1 flex flex-col flex-1">
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide truncate">
          {product.brand}
        </h3>
        <p className="text-[11px] text-[#535766] truncate font-normal leading-tight">
          {product.name}
        </p>

        {/* Price & Discount */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-[#282C3F]">
            ₹{product.finalPrice}
          </span>
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

        {/* Trust Badge Summary Highlight (Part B preview — Bolder & Eye-Catchy) */}
        {product.badgeSummary ? (
          <div className="mt-1.5 inline-flex items-center gap-1 bg-gradient-to-r from-[#E6F9F5] to-[#D5F5EE] border border-[#03A685]/40 px-2 py-0.5 rounded-md text-[9.5px] font-black text-[#047857] self-start truncate max-w-full shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-[#03A685] stroke-[2.5] flex-shrink-0" />
            <span className="truncate tracking-tight">{product.badgeSummary}</span>
          </div>
        ) : (
          <div className="mt-1.5 inline-flex items-center gap-1 bg-[#F5F5F6] border border-[#EAEAEC] px-1.5 py-0.5 rounded text-[8.5px] text-[#535766] font-bold">
            <ShieldCheck className="w-2.5 h-2.5 text-[#94969F]" />
            <span>Trust Verified SKU</span>
          </div>
        )}
      </div>
    </div>
  );
}
