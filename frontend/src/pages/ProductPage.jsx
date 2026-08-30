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
import ReviewFilterChips from '../components/pdp/ReviewFilterChips';
import ReviewCard from '../components/pdp/ReviewCard';
import StickyActions from '../components/pdp/StickyActions';
import { Star, RefreshCw } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Filter States
  const [activeBadge, setActiveBadge] = useState(searchParams.get('filter') || null);
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

      const reviewData = await api.getReviews(id, filters);
      setReviews(reviewData);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, activeBadge, activeRating, disagreeOnly]);

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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3F6C] border border-[#FF3F6C] px-4 py-2 rounded-full cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F6] pb-8">
      {/* 1. Hero Image Gallery */}
      <ImageGallery product={product} />

      {/* 2. Brand, Title, Price & Coupon Card */}
      <ProductInfo product={product} />

      {/* 3. Size Selection */}
      <SizeSelector
        product={product}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />

      {/* 4. Action Buttons (Buy Now & Add to Bag - In-flow position) */}
      <StickyActions product={product} selectedSize={selectedSize} />

      {/* 5. Delivery & Product Specifications */}
      <ProductDetails product={product} />

      {/* 5. Fit and Length Bar Feedback */}
      <FitLengthBars product={product} />

      {/* 6. AI Summarized Tags */}
      <AiTags product={product} />

      {/* 7. Trust-Verified Badges Aggregate Dashboard (Part B / Step 4 Target) */}
      <div id="trust-dashboard-section">
        <BadgeAggregates
          aggregates={product.badgeAggregates}
          activeBadge={activeBadge}
          onSelectBadge={setActiveBadge}
        />
      </div>

      {/* 8. Customer Photo Gallery Strip */}
      <div id="customer-photos-section">
        <CustomerPhotoGallery
          images={product.customerPhotos || []}
          product={product}
        />
      </div>

      {/* 9. Ratings & Customer Reviews Section (Step 5 Target) */}
      <div id="reviews-filter-section" className="bg-white mt-2 border-t border-[#EAEAEC]">
        
        {/* Rating Score Summary */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-extrabold text-[#282C3F] uppercase tracking-wider">
                Ratings & Customer Reviews
              </h3>
              <p className="text-[11px] text-[#535766]">
                Verified buyer community feedback
              </p>
            </div>

            {product.rating > 0 && (
              <div className="flex items-center gap-1 bg-[#03A685] text-white px-2 py-1 rounded text-xs font-black">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
            )}
          </div>

          {/* Rating Breakdown Bar Chart */}
          <div className="flex items-center gap-4 bg-[#F5F5F6] p-3 rounded-lg">
            <div className="text-center pr-3 border-r border-[#D4D5D9]">
              <span className="text-2xl font-black text-[#282C3F] block leading-none">
                {product.rating}
              </span>
              <div className="flex text-[#03A685] justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) ? 'fill-[#03A685]' : 'text-[#D4D5D9]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] text-[#94969F] mt-1 block">
                {product.reviewCount} Verified
              </span>
            </div>

            <div className="flex-1 space-y-1 text-[10px] text-[#535766]">
              <div className="flex items-center gap-1.5">
                <span>5★</span>
                <div className="flex-1 h-1.5 bg-[#EAEAEC] rounded-full overflow-hidden">
                  <div className="bg-[#03A685] h-full w-[70%]"></div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span>4★</span>
                <div className="flex-1 h-1.5 bg-[#EAEAEC] rounded-full overflow-hidden">
                  <div className="bg-[#03A685] h-full w-[20%]"></div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span>3★</span>
                <div className="flex-1 h-1.5 bg-[#EAEAEC] rounded-full overflow-hidden">
                  <div className="bg-[#F5A623] h-full w-[7%]"></div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span>2★</span>
                <div className="flex-1 h-1.5 bg-[#EAEAEC] rounded-full overflow-hidden">
                  <div className="bg-[#D5284F] h-full w-[3%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10. Real Customer Photo Reviews Gallery & Lightbox */}
        <CustomerPhotoGallery product={product} reviews={reviews} />

        {/* 11. Filter Chips for Reviews (Part B) */}
        <ReviewFilterChips
          category={product.category}
          totalReviews={product.reviewCount || reviews.length}
          activeBadge={activeBadge}
          onBadgeChange={setActiveBadge}
          activeRating={activeRating}
          onRatingChange={setActiveRating}
          disagreeOnly={disagreeOnly}
          onDisagreeToggle={() => setDisagreeOnly((prev) => !prev)}
          onClearFilters={handleClearFilters}
        />

        {/* 11. Filtered Review List */}
        <div className="p-3 space-y-3">
          {reviewsLoading ? (
            <div className="py-6 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#FF3F6C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-6 bg-[#FAFAFB] rounded-xl border border-dashed border-[#D4D5D9]">
              <p className="text-xs font-bold text-[#535766]">No reviews match this filter.</p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-2 text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
          )}
        </div>
      </div>
    </div>
  );
}
