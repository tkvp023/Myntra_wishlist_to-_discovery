import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ImageGallery from '../components/pdp/ImageGallery';
import ProductInfo from '../components/pdp/ProductInfo';
import SizeSelector from '../components/pdp/SizeSelector';
import ProductDetails from '../components/pdp/ProductDetails';
import FitLengthBars from '../components/pdp/FitLengthBars';
import AiTags from '../components/pdp/AiTags';
import BadgeAggregates from '../components/pdp/BadgeAggregates';
import CustomerPhotoGallery from '../components/pdp/CustomerPhotoGallery';
import ReviewPreviewCard from '../components/pdp/ReviewPreviewCard';
import AllReviewsView from '../components/pdp/AllReviewsView';
import StickyActions from '../components/pdp/StickyActions';
import { enrichReviewsWithPhotos } from '../utils/ugcPhotosHelper';
import { useGuide } from '../context/GuideContext';
import { Star, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isGuideMode, currentStepIndex } = useGuide();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);

  // Dedicated All Reviews Full View overlay state (only opened when user clicks View All or rating breakdown)
  const [showAllReviews, setShowAllReviews] = useState(() => {
    return searchParams.get('view') === 'all' || searchParams.get('view') === 'reviews';
  });

  // Review Filter States
  const [activeBadge, setActiveBadge] = useState(null);
  const [activeRating, setActiveRating] = useState(null);
  const [disagreeOnly, setDisagreeOnly] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch product detail & aggregates
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      const prodData = await api.getProduct(id);
      setProduct(prodData);
      if (prodData.sizes && prodData.sizes.length > 0) {
        setSelectedSize(prodData.sizes[0]);
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews with current active filters
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const filters = {};
      if (activeBadge) filters.badge = activeBadge;
      if (activeRating) filters.rating = activeRating;
      if (disagreeOnly) filters.disagreeOnly = true;

      const rawReviews = await api.getReviews(id, filters);
      const enriched = enrichReviewsWithPhotos(rawReviews, product);
      setReviews(enriched);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, activeBadge, activeRating, disagreeOnly, product]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product, fetchReviews]);

  const handleClearFilters = () => {
    setActiveBadge(null);
    setActiveRating(null);
    setDisagreeOnly(false);
  };

  const handleSelectBadgeFromDashboard = (badgeKey) => {
    handleOpenAllReviews(badgeKey);
  };

  const handleOpenAllReviews = (badgeKey = null) => {
    if (typeof badgeKey === 'string') {
      setActiveBadge(badgeKey);
    }
    setShowAllReviews(true);
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#FF3F6C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#535766] mt-3 font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <p className="text-xs text-[#D5284F] font-bold mb-3">{error || 'Product not found'}</p>
        <button
          onClick={fetchProductData}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FF3F6C] text-white text-xs font-bold rounded-lg hover:bg-[#E0355E] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const reviewCount = product.reviewCount || reviews.length || 2569;
  const ratingsCount = Math.max(reviewCount * 6, 15464);

  return (
    <div className="flex-1 pb-16 bg-[#F5F5F6] relative">
      {/* 1. Image Carousel Gallery */}
      <ImageGallery product={product} />

      {/* 2. Product Brand, Name, Pricing & Discount */}
      <ProductInfo product={product} />

      {/* 3. Size Selector Pill Matrix */}
      <SizeSelector
        product={product}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />

      {/* 4. Action Buttons (Buy Now & Add to Bag) */}
      <StickyActions
        product={product}
        selectedSize={selectedSize}
      />

      {/* 5. Product Details Accordion / Specification Table */}
      <ProductDetails product={product} />

      {/* 6. Fit & Length Consensus Bars (Part A) */}
      <FitLengthBars product={product} />

      {/* 7. AI Summary Tags (Part A) */}
      <AiTags product={product} />

      {/* 8. Trust-Verified Badges Aggregate Dashboard (Part B / Step 5 Target) */}
      <div id="trust-dashboard-section">
        <BadgeAggregates
          aggregates={product.badgeAggregates}
          activeBadge={activeBadge}
          onSelectBadge={handleSelectBadgeFromDashboard}
        />
      </div>

      {/* 9. Ratings & Reviews Section (Matching Screenshot 1) */}
      <div id="reviews-filter-section" className="bg-white mt-2 border-t border-[#EAEAEC]">
        {/* Section Heading */}
        <div className="px-3 pt-3.5 pb-1">
          <h2 className="text-sm font-black text-[#282C3F]">
            Ratings & Reviews
          </h2>
        </div>

        {/* Rating Score Summary Pill Bar (Tap to View All) */}
        <div
          onClick={() => handleOpenAllReviews()}
          className="mx-3 my-2 p-2.5 bg-[#FAFAFB] hover:bg-[#F5F5F6] border border-[#EAEAEC] rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-[#03A685] text-white px-2 py-0.5 rounded text-xs font-black flex items-center gap-0.5 shadow-xs">
              <span>{product.rating || 4.2}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <div className="text-xs text-[#535766] font-semibold flex items-center gap-1.5">
              <span>{ratingsCount.toLocaleString()} ratings</span>
              <span>•</span>
              <span>{reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#535766] group-hover:text-[#FF3F6C] transition-colors" />
        </div>

        {/* Customer Photo Gallery Strip */}
        <div id="customer-photos-section">
          <CustomerPhotoGallery
            product={product}
            reviews={reviews}
            selectedPhoto={selectedLightboxPhoto}
            onSelectPhoto={setSelectedLightboxPhoto}
            onClosePhoto={() => setSelectedLightboxPhoto(null)}
          />
        </div>

        {/* Customer Reviews Subsection Header with 'View All' Link */}
        <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
          <h3 className="text-xs font-black text-[#282C3F]">
            Customer Reviews ({reviewCount.toLocaleString()})
          </h3>
          <div className="flex items-center gap-1.5">
            {isGuideMode && (
              <span className="inline-flex items-center gap-1 bg-[#FFF0F3] text-[#FF3F6C] border border-[#FF3F6C]/40 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-2xs">
                👉 Click to view all reviews
              </span>
            )}
            <button
              type="button"
              onClick={() => handleOpenAllReviews()}
              className="text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer flex items-center gap-0.5 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform">View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Carousel of Preview Cards (Matching Screenshot 1) */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar px-3 pb-4 pt-1">
          {reviews.slice(0, 6).map((rev) => (
            <ReviewPreviewCard
              key={rev.id}
              review={rev}
              onReadMore={() => handleOpenAllReviews()}
              onPhotoClick={setSelectedLightboxPhoto}
            />
          ))}
        </div>
      </div>

      {/* 10. Dedicated All Reviews Full Screen View (Matching Screenshot 2) */}
      {showAllReviews && (
        <AllReviewsView
          product={product}
          reviews={reviews}
          activeBadge={activeBadge}
          onBadgeChange={setActiveBadge}
          activeRating={activeRating}
          onRatingChange={setActiveRating}
          disagreeOnly={disagreeOnly}
          onDisagreeToggle={() => setDisagreeOnly((prev) => !prev)}
          onClearFilters={handleClearFilters}
          onClose={() => setShowAllReviews(false)}
          selectedLightboxPhoto={selectedLightboxPhoto}
          onSelectPhoto={setSelectedLightboxPhoto}
          onClosePhoto={() => setSelectedLightboxPhoto(null)}
        />
      )}
    </div>
  );
}
