import React from 'react';
import {
  ShieldCheck,
  Ruler,
  Camera,
  Layers,
  Footprints,
  ShoppingBag,
  Gem,
  Palette,
  Heart,
  ThumbsUp,
  Sparkles,
  TrendingUp,
  Grid
} from 'lucide-react';

const ICON_MAP = {
  authenticity: ShieldCheck,
  fit: Ruler,
  photoMatch: Camera,
  fabricFeel: Layers,
  comfortFeel: Footprints,
  materialFeel: ShoppingBag,
  finishDurability: Gem,
  shadeMatch: Palette,
  overallSatisfaction: ThumbsUp
};

/**
 * BadgeAggregates Component
 * 
 * Implements the exact wireframe design from pdp_reviews_dashboard/code.html:
 * - "Trust-Verified Dashboard" header
 * - Centered vertical cards in horizontal scrollable carousel
 * - Large iconic glyph at top (Shield, Camera, Grid/Fabric, ThumbsUp)
 * - Prominent bold percentage / metric in center
 * - Clean descriptive label at bottom
 */
export default function BadgeAggregates({ aggregates, onSelectBadge, activeBadge }) {
  if (!aggregates || Object.keys(aggregates).length === 0) return null;

  // Filter badges that have at least 1 response
  const validBadges = Object.entries(aggregates).filter(([_, agg]) => agg.total > 0);
  if (validBadges.length === 0) return null;

  return (
    <div className="bg-white p-3.5 border-b border-[#EAEAEC]">
      {/* Section Header (matching wireframe: Trust-Verified Dashboard) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FF3F6C]" />
          <h2 className="text-sm font-extrabold text-[#282C3F] tracking-tight">
            Trust-Verified Dashboard
          </h2>
        </div>
        <span className="text-[10px] font-bold text-[#03A685] bg-[#E6F9F5] px-2 py-0.5 rounded-full border border-[#03A685]/30">
          Verified Buyer Data
        </span>
      </div>

      {/* Trust-Verified Aggregates Carousel (matching code.html wireframe) */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5">
        {validBadges.map(([key, agg]) => {
          const IconComponent = ICON_MAP[key] || ShieldCheck;
          const isSelected = activeBadge === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectBadge && onSelectBadge(isSelected ? null : key)}
              className={`flex-shrink-0 min-w-[136px] max-w-[150px] p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-2 border-[#FF3F6C] bg-[#FFF0F3] shadow-xs'
                  : 'border-[#EAEAEC] bg-white hover:border-[#D4D5D9] shadow-2xs'
              }`}
            >
              {/* 1. Large Top Icon (matching wireframe: text-primary text-3xl mb-2) */}
              <div className="mb-2 text-[#FF3F6C] flex items-center justify-center">
                <IconComponent className={`w-7 h-7 stroke-[1.8] ${isSelected ? 'text-[#FF3F6C]' : 'text-[#FF3F6C]'}`} />
              </div>

              {/* 2. Prominent Metric (matching wireframe: text-headline-lg text-tertiary mb-1) */}
              {!agg.belowThreshold ? (
                <span className="text-xl font-black text-[#03A685] mb-1 leading-none tracking-tight">
                  {agg.percentPositive}%
                </span>
              ) : (
                <span className="text-base font-black text-[#F5A623] mb-1 leading-none flex items-center gap-1">
                  <span>{agg.positiveCount}+</span>
                  <span className="text-[10px] font-bold text-[#94969F]">buyers</span>
                </span>
              )}

              {/* 3. Bottom Label (matching wireframe: text-body-sm text-secondary) */}
              <span className="text-xs font-semibold text-[#535766] text-center leading-tight">
                {agg.displayLabel}
              </span>

              {/* Low sample momentum hint */}
              {agg.belowThreshold && (
                <span className="text-[9px] text-[#94969F] mt-1 font-medium block">
                  Gaining traction
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
