import React, { useState } from 'react';
import { Star, CheckCircle, Check, ThumbsUp, ShieldCheck, Ruler, Camera, Layers, Footprints, ShoppingBag, Gem, Palette, Heart } from 'lucide-react';
import { BADGE_TYPES } from '../../utils/badgeConfig';

/**
 * ReviewCard Component
 * 
 * Implements the exact review card design from pdp_reviews_dashboard/code.html:
 * - User name with verified green checkmark
 * - Size bought and date
 * - Star pill badge (top-right)
 * - Review text
 * - Customer photo thumbnails
 * - Bottom trust verification badges with checkmark
 */
export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [voted, setVoted] = useState(false);

  const text = review.text || '';
  const isLong = text.length > 140;
  const displayText = expanded || !isLong ? text : `${text.slice(0, 140)}...`;

  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent Buyer';

  // Extract non-null badge entries from the review
  const activeBadges = [];
  const badgeFieldList = [
    { key: 'authenticity', field: 'badgeAuthenticity' },
    { key: 'fit', field: 'badgeFit' },
    { key: 'photoMatch', field: 'badgePhotoMatch' },
    { key: 'fabricFeel', field: 'badgeFabricFeel' },
    { key: 'comfortFeel', field: 'badgeComfortFeel' },
    { key: 'materialFeel', field: 'badgeMaterialFeel' },
    { key: 'finishDurability', field: 'badgeFinishDurability' },
    { key: 'shadeMatch', field: 'badgeShadeMatch' },
    { key: 'overallSatisfaction', field: 'badgeOverallSatisfaction' }
  ];

  for (const item of badgeFieldList) {
    const val = review[item.field];
    if (val) {
      const config = BADGE_TYPES[item.key];
      const stateObj = config?.states.find((s) => s.value === val);
      if (stateObj) {
        activeBadges.push({
          key: item.key,
          label: stateObj.label,
          type: stateObj.type
        });
      }
    }
  }

  const handleHelpful = () => {
    if (!voted) {
      setHelpfulCount((c) => c + 1);
      setVoted(true);
    }
  };

  return (
    <div className="p-3.5 bg-white rounded-xl border border-[#EAEAEC] flex flex-col gap-2.5 shadow-2xs">
      {/* 1. Top Header: User Name + Verified Check on Left; Star Rating Pill on Right (matching wireframe) */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-black text-[#282C3F]">
              {review.userName || 'Verified Buyer'}
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-[#03A685] fill-[#03A685]/15" />
          </div>
          <div className="text-[10.5px] text-[#535766] font-medium">
            {review.sizeBought ? `Size: ${review.sizeBought} | ` : ''}{dateStr}
          </div>
        </div>

        {/* Star Rating Pill (matching wireframe: bg-tertiary text-on-tertiary px-2 py-1) */}
        <div className="bg-[#03A685] text-white px-2 py-0.5 rounded flex items-center gap-0.5 text-xs font-black">
          <span>{review.rating}</span>
          <Star className="w-2.5 h-2.5 fill-white" />
        </div>
      </div>

      {/* 2. Review Text */}
      {text && (
        <p className="text-xs text-[#282C3F] leading-relaxed font-normal">
          {displayText}{' '}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#FF3F6C] font-bold text-xs hover:underline inline cursor-pointer"
            >
              {expanded ? 'read less' : 'read more'}
            </button>
          )}
        </p>
      )}

      {/* 3. Customer Photo Thumbnails (matching wireframe) */}
      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {review.images.map((imgUrl, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg overflow-hidden border border-[#EAEAEC] flex-shrink-0 cursor-pointer shadow-2xs hover:opacity-90 transition-opacity"
              onClick={() => window.open(imgUrl, '_blank')}
            >
              <img src={imgUrl} alt={`Customer review photo ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Bottom Trust Verification Badges (matching wireframe: bg-surface-container px-2 py-1 text-tertiary) */}
      {activeBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeBadges.map((b, idx) => {
            const isPos = b.type === 'positive';
            const isNeg = b.type === 'negative';

            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                  isPos
                    ? 'bg-[#E6F9F5] text-[#047857] border border-[#03A685]/30'
                    : isNeg
                    ? 'bg-[#FEF0EF] text-[#D5284F] border border-[#D5284F]/30'
                    : 'bg-[#F5F5F6] text-[#535766] border border-[#EAEAEC]'
                }`}
              >
                {isPos ? (
                  <Check className="w-3 h-3 text-[#03A685] stroke-[3]" />
                ) : (
                  <span className="text-[10px] leading-none">•</span>
                )}
                <span>{b.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* 5. Helpful Vote Footer */}
      <div className="flex items-center justify-end pt-1.5 border-t border-[#F5F5F6] text-[11px] text-[#94969F]">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 hover:text-[#03A685] transition-colors cursor-pointer ${
            voted ? 'text-[#03A685] font-bold' : ''
          }`}
        >
          <span>Helpful?</span>
          <ThumbsUp className="w-3 h-3" />
          {helpfulCount > 0 && <span>({helpfulCount})</span>}
        </button>
      </div>
    </div>
  );
}
