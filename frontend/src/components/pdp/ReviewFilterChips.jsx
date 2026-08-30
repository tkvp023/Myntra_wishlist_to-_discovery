import React from 'react';
import { Filter, Star, Check, AlertCircle, X } from 'lucide-react';
import { getBadgesForCategory } from '../../utils/badgeConfig';

export default function ReviewFilterChips({
  category,
  totalReviews,
  activeBadge,
  onBadgeChange,
  activeRating,
  onRatingChange,
  disagreeOnly,
  onDisagreeToggle,
  onClearFilters
}) {
  const applicableBadges = getBadgesForCategory(category);
  const hasActiveFilters = Boolean(activeBadge || activeRating || disagreeOnly);

  return (
    <div className="bg-white px-3 py-2.5 border-b border-[#EAEAEC]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#282C3F] uppercase tracking-wider">
          <Filter className="w-3 h-3 text-[#FF3F6C]" />
          <span>Filter Reviews</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[10px] font-bold text-[#FF3F6C] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {/* All Reviews Chip */}
        <button
          type="button"
          onClick={() => {
            onBadgeChange(null);
            onRatingChange(null);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            !activeBadge && !activeRating
              ? 'bg-[#282C3F] text-white shadow-2xs'
              : 'bg-[#F5F5F6] text-[#535766] hover:bg-[#EAEAEC]'
          }`}
        >
          All ({totalReviews})
        </button>

        {/* Badge Specific Filter Chips */}
        {applicableBadges.map((badge) => {
          const isSelected = activeBadge === badge.key;
          return (
            <button
              key={badge.key}
              type="button"
              onClick={() => onBadgeChange(isSelected ? null : badge.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FF3F6C] text-white shadow-2xs'
                  : 'bg-[#FFF0F3] text-[#FF3F6C] border border-[#FF3F6C]/25 hover:bg-[#FFE5EB]'
              }`}
            >
              <span>{badge.label}</span>
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}

        {/* Star Rating Filters */}
        {[5, 4, 3, 2, 1].map((stars) => {
          const isSelected = activeRating === stars;
          return (
            <button
              key={stars}
              type="button"
              onClick={() => onRatingChange(isSelected ? null : stars)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-0.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#03A685] text-white shadow-2xs'
                  : 'bg-[#F5F5F6] text-[#535766] hover:bg-[#EAEAEC]'
              }`}
            >
              <span>{stars}</span>
              <Star className={`w-3 h-3 ${isSelected ? 'fill-white' : 'fill-[#535766]'}`} />
            </button>
          );
        })}
      </div>

      {/* Disagree Only Secondary Toggle */}
      <div className="mt-2 pt-2 border-t border-[#F5F5F6] flex items-center justify-between">
        <label
          htmlFor="disagree-toggle"
          className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-bold text-[#535766]"
        >
          <AlertCircle className={`w-3.5 h-3.5 ${disagreeOnly ? 'text-[#D5284F]' : 'text-[#94969F]'}`} />
          <span>Show Disagree / Critical Badges Only</span>
        </label>

        <button
          id="disagree-toggle"
          type="button"
          role="switch"
          aria-checked={disagreeOnly}
          onClick={onDisagreeToggle}
          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
            disagreeOnly ? 'bg-[#D5284F]' : 'bg-[#D4D5D9]'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
              disagreeOnly ? 'right-0.75' : 'left-0.75'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
