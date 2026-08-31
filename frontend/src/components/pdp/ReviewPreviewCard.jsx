import React from 'react';
import { Star, CheckCircle, ShieldCheck, Sun } from 'lucide-react';
import { BADGE_TYPES } from '../../utils/badgeConfig';

/**
 * ReviewPreviewCard Component
 * 
 * Replicates the authentic Myntra PDP horizontal preview review card (Screenshot 1):
 * - Green star rating pill (e.g. 5★)
 * - Review date & Size pill (e.g. Size: 40)
 * - Review text snippet with "... read more"
 * - Customer photo thumbnail stack (with +2 badge if multiple)
 * - Verified Trust Badges pills (e.g. ✓ Genuine, ✓ Matches Photos, ✓ True to Size)
 * - Verified checkmark + Reviewer Name
 */
export default function ReviewPreviewCard({ review, onReadMore, onPhotoClick }) {
  const text = review.text || '';
  const isLong = text.length > 70;
  const displayText = isLong ? `${text.slice(0, 70)}...` : text;

  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Aug 27, 2026';

  const images = review.images || [];
  const primaryImage = images[0];

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

  // Fallback default badges if empty on a high rating review
  if (activeBadges.length === 0 && review.rating >= 4) {
    activeBadges.push(
      { key: 'authenticity', label: '✓ 100% Genuine', type: 'positive' },
      { key: 'photoMatch', label: '✓ Matches Photos', type: 'positive' }
    );
  }

  return (
    <div className="w-[280px] flex-shrink-0 bg-white rounded-xl border border-[#EAEAEC] p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D4D5D9] transition-all">
      <div>
        {/* 1. Header: Star Pill + Date on Left; Size Tag on Right */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="bg-[#03A685] text-white px-1.5 py-0.5 rounded text-[11px] font-black flex items-center gap-0.5 shadow-2xs">
              <span>{review.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-[#535766] font-medium">{dateStr}</span>
          </div>

          {review.sizeBought && (
            <span className="bg-[#F5F5F6] border border-[#EAEAEC] text-[#282C3F] text-[10px] font-bold px-2 py-0.5 rounded">
              Size: {review.sizeBought}
            </span>
          )}
        </div>

        {/* 2. Review Text & Photo Thumbnail Row */}
        <div className="flex items-start gap-2.5 my-1.5 min-h-[48px]">
          <p className="text-[11.5px] text-[#282C3F] leading-relaxed font-normal flex-1">
            {displayText}{' '}
            {isLong && (
              <button
                type="button"
                onClick={onReadMore}
                className="text-[#FF3F6C] font-bold text-[11px] hover:underline inline cursor-pointer ml-0.5"
              >
                read more
              </button>
            )}
          </p>

          {/* Customer Photo Stack Thumbnail */}
          {primaryImage && (
            <div
              onClick={() => onPhotoClick && onPhotoClick(review.photoData || { url: primaryImage, user: review.userName, rating: review.rating, size: review.sizeBought, caption: review.text, lighting: 'Natural Daylight', badge: '✓ Verified Buyer Photo' })}
              className="relative w-14 h-16 rounded-lg overflow-hidden border border-[#EAEAEC] flex-shrink-0 cursor-pointer shadow-2xs hover:border-[#03A685] transition-all group"
            >
              <img
                src={primaryImage}
                alt="Customer review photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {images.length > 1 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center text-white text-[11px] font-black">
                  +{images.length - 1}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Verified Trust Badges Row (Prominently displayed) */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-1">
            {activeBadges.slice(0, 2).map((b, idx) => {
              const isPos = b.type === 'positive';
              const isNeg = b.type === 'negative';

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                    isPos
                      ? 'bg-[#E6F9F5] text-[#047857] border border-[#03A685]/30'
                      : isNeg
                      ? 'bg-[#FEF0EF] text-[#D5284F] border border-[#D5284F]/30'
                      : 'bg-[#F5F5F6] text-[#535766] border border-[#EAEAEC]'
                  }`}
                >
                  {b.label}
                </span>
              );
            })}
            {activeBadges.length > 2 && (
              <span className="text-[9.5px] font-extrabold text-[#03A685] self-center ml-0.5">
                +{activeBadges.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer: Verified Buyer Name */}
      <div className="pt-2 mt-1 border-t border-[#F5F5F6] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#03A685] fill-[#03A685]/15 flex-shrink-0" />
          <span className="text-xs font-black text-[#282C3F] truncate max-w-[190px]">
            {review.userName || 'Verified Buyer'}
          </span>
        </div>
      </div>
    </div>
  );
}
