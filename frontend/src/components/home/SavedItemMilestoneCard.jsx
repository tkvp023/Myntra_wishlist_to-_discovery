import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

/**
 * SavedItemMilestoneCard Component
 * 
 * Renders individual cards within the 'Saved Items with Trust Milestones' row.
 * Supports a subtle Von Restorff isolation effect on a specific card via the `isHighlighted` prop.
 *
 * @param {Object} props
 * @param {Object} props.item - Wishlist item with product details and trust re-engagement data
 * @param {number} [props.idx=0] - Index of the item in the list
 * @param {boolean} [props.isHighlighted=false] - Whether to apply the subtle coral isolation treatment
 * @param {string} [props.highlightLabel='Trending pick'] - Static text label shown above the card
 * @param {string} props.compactStats - Formatted trust statistics string (e.g. '93% Genuine · 85% Fits')
 * @param {number|string} [props.daysSaved] - Number of days since wishlisted
 * @param {Function} [props.onClick] - Optional custom click handler
 */
export default function SavedItemMilestoneCard({
  item,
  idx = 0,
  isHighlighted = false,
  highlightLabel = 'Trending pick',
  compactStats,
  daysSaved,
  onClick
}) {
  const navigate = useNavigate();
  const p = item?.product;

  if (!p) return null;

  const img = getProductImageUrl(p?.images?.[0], p?.category, 1);
  const days = daysSaved || item.daysStalled || (idx + 2);
  const deepLink = `/product/${p.id}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(deepLink);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2 bg-white rounded-lg p-1.5 transition-colors cursor-pointer min-w-[210px] flex-shrink-0 shadow-2xs group relative ${
        isHighlighted
          ? 'border border-[#FF6B4A]'
          : 'border border-[#FF3F6C]/20 hover:border-[#FF3F6C]'
      }`}
    >
      {/* Thumbnail */}
      <img
        src={img}
        alt={p.name}
        className="w-10 h-13 object-cover object-top rounded border border-[#EAEAEC] flex-shrink-0"
      />

      {/* Details Container */}
      <div className="flex-1 min-w-0">
        {/* Small static text label for Von Restorff isolated item */}
        {isHighlighted && (
          <span className="text-[8px] font-bold text-[#FF6B4A] uppercase tracking-wider block mb-0.5 leading-none">
            {highlightLabel}
          </span>
        )}

        <span
          className={`text-[10px] font-black text-[#282C3F] truncate block ${
            isHighlighted ? 'group-hover:text-[#FF6B4A]' : 'group-hover:text-[#FF3F6C]'
          }`}
        >
          {p.brand}
        </span>
        <span className="text-[9px] text-[#535766] truncate block leading-tight">
          {p.name}
        </span>

        {/* Days-Saved Tag */}
        <span className="text-[8px] text-[#94969F] font-semibold block mt-0.5 leading-none">
          Saved {days}d ago
        </span>

        {/* Dual Compact Stat: Coral variant if highlighted, standard green otherwise — Bolder & Eye-Catchy */}
        <span
          className={`inline-flex items-center gap-1 text-[8.5px] font-black px-1.5 py-0.5 rounded-md mt-1 truncate max-w-full shadow-2xs ${
            isHighlighted
              ? 'bg-gradient-to-r from-[#FFF0EB] to-[#FFE5DC] text-[#C2410C] border border-[#FF6B4A]/40'
              : 'bg-gradient-to-r from-[#E6F8F4] to-[#D2F5EC] text-[#047857] border border-[#03A685]/35'
          }`}
        >
          <ShieldCheck
            className={`w-2.5 h-2.5 stroke-[2.5] flex-shrink-0 ${
              isHighlighted ? 'text-[#FF6B4A]' : 'text-[#03A685]'
            }`}
          />
          <span className="truncate tracking-tight">{compactStats}</span>
        </span>

        {/* Micro-CTA Text */}
        <div className="mt-0.5 flex items-center justify-end">
          <span
            className={`text-[8px] font-extrabold flex items-center gap-0.5 group-hover:underline ${
              isHighlighted ? 'text-[#FF6B4A]' : 'text-[#FF3F6C]'
            }`}
          >
            <span>See why</span>
            <span className="text-[9px] leading-none">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
