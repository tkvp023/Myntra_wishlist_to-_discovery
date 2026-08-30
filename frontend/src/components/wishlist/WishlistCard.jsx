import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Star, Sparkles, ShieldCheck, Share2, BarChart2, ChevronDown, ChevronUp, Check, Tag } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';
import { useApp } from '../../context/AppContext';
import TagItemModal from './TagItemModal';

export default function WishlistCard({ item, index, onRemove }) {
  const navigate = useNavigate();
  const { addToBag, moveToBagFromWishlist, showToast, wishlistTags } = useApp();
  const product = item.product;

  // First 4 items in wishlist auto-show trust stats; remaining items have clickable [View Trust Stats] toggle
  const isFirstFour = index < 4;
  const [showStats, setShowStats] = useState(isFirstFour);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  if (!product) return null;

  const currentTags = wishlistTags[product.id] || [];

  const mainImage = getProductImageUrl(product.images?.[0], product.category, 1);

  // Extract top 1-2 positive stats for Section 8 wishlist rule
  const topStats = [];
  if (product.badgeAggregates) {
    for (const [key, agg] of Object.entries(product.badgeAggregates)) {
      if (!agg.belowThreshold && agg.percentPositive >= 70) {
        topStats.push({ label: agg.displayLabel, percent: agg.percentPositive, isCount: false, key });
      } else if (agg.total > 0 && agg.belowThreshold) {
        topStats.push({ label: agg.displayLabel, count: agg.positiveCount, total: agg.total, isCount: true, key });
      }
      if (topStats.length >= 2) break;
    }
  }

  const handleProductClick = () => {
    // Navigates directly to Product Page
    const filterKey = topStats[0]?.key || 'authenticity';
    navigate(`/product/${product.id}?filter=${filterKey}`);
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    addToBag(product, defaultSize, 1);
    setIsAddedToBag(true);
    setTimeout(() => setIsAddedToBag(false), 2000);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Myntra`,
        url: `${window.location.origin}/product/${product.id}`
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/product/${product.id}`);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleToggleStats = (e) => {
    e.stopPropagation();
    setShowStats((prev) => !prev);
  };

  const discountVal = Math.max(0, product.mrp - product.finalPrice);

  return (
    <div className="group flex flex-col bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all select-none relative">
      
      {/* 1. Product Picture (Clicking goes to Product Page) */}
      <div
        onClick={handleProductClick}
        className="relative w-full pb-[133%] bg-[#F5F5F6] overflow-hidden cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />

        {/* Rating Overlay (Bottom-Left of photo) */}
        {product.rating > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm border border-[#EAEAEC]/60">
            <span className="text-[10px] font-black text-[#282C3F] flex items-center gap-0.5">
              {product.rating} <Star className="w-2.5 h-2.5 fill-[#03A685] text-[#03A685]" />
            </span>
          </div>
        )}

        {/* [🛍️ Add] Button (Bottom-Right of photo — matching authentic Myntra screenshot) */}
        <button
          type="button"
          onClick={handleAddToBag}
          className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 text-[10px] font-black tracking-tight transition-all active:scale-95 cursor-pointer ${
            isAddedToBag
              ? 'bg-[#14958F] text-white border border-[#14958F]'
              : 'bg-white/95 hover:bg-[#FFF0F3] text-[#FF3F6C] border border-[#FF3F6C]/40 hover:border-[#FF3F6C]'
          }`}
        >
          {isAddedToBag ? (
            <>
              <Check className="w-3 h-3 text-white stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3 h-3 text-[#FF3F6C]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Product Details Block (Clicking text goes to Product Page) */}
      <div className="p-2.5 flex flex-col flex-1 justify-between bg-white">
        <div onClick={handleProductClick} className="cursor-pointer">
          <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide truncate group-hover:text-[#FF3F6C] transition-colors">
            {product.brand}
          </h3>
          <p className="text-[11px] text-[#535766] truncate font-normal leading-tight mt-0.5">
            {product.name}
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xs font-black text-[#282C3F]">
              ₹{product.finalPrice}
            </span>
            {product.discountPercent > 0 ? (
              <span className="text-[10px] font-bold text-[#03A685]">
                {product.discountPercent}% OFF
              </span>
            ) : discountVal > 0 ? (
              <span className="text-[10px] font-bold text-[#03A685]">
                Rs. {discountVal} OFF
              </span>
            ) : null}
            {product.mrp > product.finalPrice && (
              <span className="text-[10px] text-[#94969F] line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Delivery Tag & Custom Collection Tags */}
          <div className="flex items-center gap-1 text-[9px] text-[#535766] mt-1 flex-wrap">
            <span>Delivery by <strong className="text-[#282C3F]">Tomorrow</strong></span>
            <span className="text-[#FF3F6C] font-extrabold text-[8px] bg-[#FFF0F3] px-1 rounded">EXPRESS</span>
          </div>

          {/* Active Collection Tag Badges (Tap to manage) */}
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {currentTags.map((tag, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTagModalOpen(true);
                }}
                className="inline-flex items-center gap-0.5 text-[8.5px] font-bold bg-[#FFF0F3] text-[#FF3F6C] border border-[#FF3F6C]/30 px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-[#FFE0E6] transition-colors"
              >
                <span>{tag}</span>
              </span>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTagModalOpen(true);
              }}
              className="text-[8.5px] font-bold text-[#535766] hover:text-[#FF3F6C] flex items-center gap-0.5 px-1 py-0.5 rounded border border-dashed border-[#D4D5D9] hover:border-[#FF3F6C] cursor-pointer"
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{currentTags.length === 0 ? '+ Tag' : '+'}</span>
            </button>
          </div>
        </div>

        {/* 3. TRUST STATS PRESENTATION (Bolder & Eye-Catchy) */}
        <div className="mt-2 pt-2 border-t border-[#F5F5F6]">
          {/* A. If First 4 items (Auto-shown on its own) */}
          {isFirstFour ? (
            topStats.length > 0 ? (
              <div className="space-y-1">
                {topStats.map((stat, idx) => (
                  <div
                    key={idx}
                    onClick={handleProductClick}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#E6F9F5] to-[#D5F5EE] border border-[#03A685]/40 px-2 py-1 rounded-md text-[9.5px] font-black text-[#047857] truncate cursor-pointer hover:border-[#03A685] transition-all shadow-2xs"
                  >
                    <ShieldCheck className="w-3 h-3 text-[#03A685] stroke-[2.5] flex-shrink-0" />
                    <span className="truncate tracking-tight">
                      {stat.isCount
                        ? (idx === 0 ? '🔥 Trending: More buyers noticing this' : `✨ Early reviews positive: ${stat.label}`)
                        : `${stat.percent}% ${stat.label}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[9px] text-[#94969F] font-bold italic">✓ Verified Buyer SKU</div>
            )
          ) : (
            /* B. If index >= 4: Clickable button to reveal / toggle stats on demand */
            <div>
              {!showStats ? (
                <button
                  type="button"
                  onClick={handleToggleStats}
                  className="w-full py-1.5 px-2 bg-[#FFF0F3] hover:bg-[#FFE3E9] border border-[#FF3F6C]/40 rounded-md text-[9.5px] font-black text-[#FF3F6C] flex items-center justify-between transition-all cursor-pointer shadow-2xs group/btn"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-[#FF3F6C] stroke-[2.5]" />
                    <span>View Trust Stats</span>
                  </span>
                  <ChevronDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
                </button>
              ) : (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex items-center justify-between text-[9.5px] font-black text-[#047857] mb-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#03A685] stroke-[2.5]" /> Verified Stats
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleStats}
                      className="text-[#94969F] hover:text-[#535766] p-0.5 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {topStats.map((stat, idx) => (
                    <div
                      key={idx}
                      onClick={handleProductClick}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-[#E6F9F5] to-[#D5F5EE] border border-[#03A685]/40 px-2 py-1 rounded-md text-[9.5px] font-black text-[#047857] truncate cursor-pointer hover:border-[#03A685] transition-all shadow-2xs"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#03A685] stroke-[2.5] flex-shrink-0" />
                      <span className="truncate tracking-tight">
                        {stat.isCount
                          ? (idx === 0 ? '🔥 Trending: More buyers noticing this' : `✨ Early reviews positive: ${stat.label}`)
                          : `${stat.percent}% ${stat.label}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Bottom Action Icons (Delete, Tag/Organize, Toggle Stats, Share) */}
        <div className="mt-2.5 pt-2 border-t border-[#EAEAEC] flex items-center justify-around text-[#94969F]">
          {/* Action 1: Delete from Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(product.id);
            }}
            aria-label="Remove item"
            className="p-1.5 rounded-full hover:text-[#D5284F] hover:bg-[#FEF0EF] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <span className="h-3 w-px bg-[#EAEAEC]"></span>

          {/* Action 2: Tag & Organize */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsTagModalOpen(true);
            }}
            aria-label="Tag item"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              currentTags.length > 0 ? 'text-[#FF3F6C] bg-[#FFF0F3]' : 'hover:text-[#FF3F6C] hover:bg-[#F5F5F6]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
          </button>

          <span className="h-3 w-px bg-[#EAEAEC]"></span>

          {/* Action 3: Stats Toggle / Inspector */}
          <button
            type="button"
            onClick={handleToggleStats}
            aria-label="Toggle stats"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showStats ? 'text-[#14958F] bg-[#E8F8F5]' : 'hover:text-[#14958F] hover:bg-[#F5F5F6]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>

          <span className="h-3 w-px bg-[#EAEAEC]"></span>

          {/* Action 4: Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share product"
            className="p-1.5 rounded-full hover:text-[#282C3F] hover:bg-[#F5F5F6] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. DEDICATED FULL-WIDTH "ADD TO BAG" BOTTOM BAR */}
      <button
        type="button"
        onClick={handleAddToBag}
        className={`w-full py-2 px-3 border-t text-[11px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
          isAddedToBag
            ? 'bg-[#E8F8F5] text-[#14958F] border-[#14958F]/30'
            : 'bg-white hover:bg-[#FFF0F3] text-[#FF3F6C] hover:text-[#E72744] border-[#EAEAEC]'
        }`}
      >
        {isAddedToBag ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3] text-[#14958F]" />
            <span>ADDED TO BAG</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ADD TO BAG</span>
          </>
        )}
      </button>

      {/* 6. Tag Management Modal */}
      <TagItemModal
        product={product}
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </div>
  );
}
