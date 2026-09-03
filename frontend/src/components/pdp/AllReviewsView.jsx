import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  Sun,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  MoreVertical
} from 'lucide-react';
import CustomerPhotoGallery from './CustomerPhotoGallery';
import ReviewFilterChips from './ReviewFilterChips';
import ReviewCard from './ReviewCard';
import { useGuide } from '../../context/GuideContext';

/**
 * AllReviewsView Component
 * 
 * Replicates the dedicated "Ratings & Reviews" full screen (Screenshot 2):
 * - Top Navigation Header with Back Arrow
 * - Top Rating Summary & 5-Star Breakdown Progress Bars
 * - Customer Photo Gallery Strip with Daylight Tag
 * - Filter Pills Bar (Star ratings & Trust Badges) + Sort Trigger
 * - Full Vertical List of Detailed Review Cards with Photos
 */
export default function AllReviewsView({
  product,
  reviews = [],
  activeBadge,
  onBadgeChange,
  activeRating,
  onRatingChange,
  disagreeOnly,
  onDisagreeToggle,
  onClearFilters,
  onClose,
  selectedLightboxPhoto,
  onSelectPhoto,
  onClosePhoto
}) {
  const [activeSort, setActiveSort] = useState('helpful');
  const containerRef = useRef(null);
  const scrollBodyRef = useRef(null);

  const guideContext = useGuide();
  const isStep6 = guideContext?.isGuideMode && guideContext?.currentStepIndex === 5;

  // Automatically scroll both the parent phone container and inner review list to the top on mount
  useEffect(() => {
    const mainEl = containerRef.current?.closest('main') || document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  const rating = product?.rating || 4.2;
  const reviewCount = product?.reviewCount || reviews.length || 2569;
  const ratingsCount = Math.max(reviewCount * 6, 15464);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-40 bg-white flex flex-col overflow-hidden select-none animate-in fade-in slide-in-from-right-2 duration-200 min-h-full"
    >
      {/* 1. TOP HEADER (Sticky) */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#EAEAEC] px-3 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F5F6] text-[#282C3F] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xs font-black text-[#282C3F] truncate">
              Ratings & Reviews
            </h1>
            <p className="text-[10px] text-[#535766] truncate font-medium">
              {product?.brand} · {product?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#FF3F6C] hover:underline px-1 cursor-pointer"
          >
            Done
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE REVIEWS CONTENT */}
      <div ref={scrollBodyRef} className="flex-1 overflow-y-auto no-scrollbar">
        {/* Rating Breakdown Section (Matching Screenshot 2) */}
        <div className="p-3.5 bg-white border-b border-[#EAEAEC]">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Overall Score & Count */}
            <div className="flex flex-col items-center justify-center pr-3 border-r border-[#EAEAEC] min-w-[100px]">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-[#282C3F] leading-none">
                  {rating}
                </span>
                <Star className="w-5 h-5 text-[#03A685] fill-[#03A685]" />
              </div>
              <span className="text-[10.5px] text-[#535766] font-semibold mt-1">
                {ratingsCount.toLocaleString()} ratings
              </span>
              <span className="text-[9.5px] text-[#94969F]">
                {reviewCount.toLocaleString()} reviews
              </span>
            </div>

            {/* Right: 5-Star to 1-Star Progress Bars */}
            <div className="flex-1 space-y-1 text-[10.5px] font-bold text-[#535766]">
              <div className="flex items-center gap-2">
                <span className="w-3 text-right">5★</span>
                <div className="flex-1 h-1.5 bg-[#F5F5F6] rounded-full overflow-hidden">
                  <div className="bg-[#03A685] h-full w-[65%] rounded-full"></div>
                </div>
                <span className="w-8 text-[9.5px] text-[#94969F] text-right">9.4k</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-right">4★</span>
                <div className="flex-1 h-1.5 bg-[#F5F5F6] rounded-full overflow-hidden">
                  <div className="bg-[#03A685] h-full w-[22%] rounded-full"></div>
                </div>
                <span className="w-8 text-[9.5px] text-[#94969F] text-right">2.9k</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-right">3★</span>
                <div className="flex-1 h-1.5 bg-[#F5F5F6] rounded-full overflow-hidden">
                  <div className="bg-[#71CF48] h-full w-[8%] rounded-full"></div>
                </div>
                <span className="w-8 text-[9.5px] text-[#94969F] text-right">1.0k</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-right">2★</span>
                <div className="flex-1 h-1.5 bg-[#F5F5F6] rounded-full overflow-hidden">
                  <div className="bg-[#F5A623] h-full w-[4%] rounded-full"></div>
                </div>
                <span className="w-8 text-[9.5px] text-[#94969F] text-right">512</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-right">1★</span>
                <div className="flex-1 h-1.5 bg-[#F5F5F6] rounded-full overflow-hidden">
                  <div className="bg-[#D5284F] h-full w-[9%] rounded-full"></div>
                </div>
                <span className="w-8 text-[9.5px] text-[#94969F] text-right">1.4k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Photos Gallery Strip */}
        <CustomerPhotoGallery
          product={product}
          reviews={reviews}
          selectedPhoto={selectedLightboxPhoto}
          onSelectPhoto={onSelectPhoto}
          onClosePhoto={onClosePhoto}
        />

        {/* Filter Pills Section (Stars + Trust Badges) */}
        <div
          id="reviews-filter-section"
          className={`bg-white pt-2.5 pb-1 border-b border-[#EAEAEC] transition-all duration-300 ${
            isStep6
              ? 'ring-2 ring-[#FF3F6C] shadow-[0_0_20px_rgba(255,63,108,0.25)]'
              : ''
          }`}
        >
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#282C3F]">
              Filter photos and reviews by
            </span>
            {isStep6 && (
              <span className="text-[9.5px] font-extrabold text-[#FF3F6C] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#FF3F6C]/30 animate-pulse">
                👉 Tap any badge to filter
              </span>
            )}
          </div>

          <ReviewFilterChips
            category={product?.category}
            totalReviews={reviewCount}
            activeBadge={activeBadge}
            onBadgeChange={onBadgeChange}
            activeRating={activeRating}
            onRatingChange={onRatingChange}
            disagreeOnly={disagreeOnly}
            onDisagreeToggle={onDisagreeToggle}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Subtitle & Consent Notice */}
        <div className="px-3 pt-3 pb-1 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black text-[#282C3F]">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-[10px] text-[#94969F] mt-0.5">
              Reviews published with verified customers' consent.{' '}
              <span className="text-[#FF3F6C] font-semibold cursor-pointer">Learn more</span>
            </p>
          </div>
        </div>

        {/* Full Vertical Review Cards List */}
        <div className="p-3 space-y-3 pb-8">
          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-[#FAFAFB] rounded-xl border border-dashed border-[#D4D5D9]">
              <p className="text-xs font-bold text-[#535766]">No reviews match your selected filters.</p>
              <button
                type="button"
                onClick={onClearFilters}
                className="mt-2 text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            reviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                onPhotoClick={onSelectPhoto}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
