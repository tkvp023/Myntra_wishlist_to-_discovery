import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Camera,
  Video,
  Sun,
  Trash2,
  Play,
  ShoppingBag
} from 'lucide-react';
import StarRatingInput from './StarRatingInput';
import BadgeInput from './BadgeInput';
import { getBadgesForCategory } from '../../utils/badgeConfig';
import { getProductImageUrl } from '../../utils/imageHelper';
import { api } from '../../api/client';

export default function ReviewModal({ product, isOpen, onClose, onReviewSubmitted }) {
  // Form State
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [sizeBought, setSizeBought] = useState(product?.sizes?.[0] || '');
  const [reviewText, setReviewText] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState([]); // { type: 'image' | 'video', url: string, name: string }
  const [isNaturalLight, setIsNaturalLight] = useState(true);
  
  // Badge states keyed by badgeType.dbField or key
  const [badgeValues, setBadgeValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const applicableBadges = getBadgesForCategory(product?.category);

  const handleBadgeChange = (badgeKey, value) => {
    setBadgeValues((prev) => ({
      ...prev,
      [badgeKey]: value
    }));
  };

  const handleFileUpload = (e, mediaType) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedMedia((prev) => [
            ...prev,
            {
              type: mediaType,
              url: uploadEvent.target.result,
              name: file.name
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (indexToRemove) => {
    setUploadedMedia((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setErrorMessage('Please select an overall star rating.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const imagesOnly = uploadedMedia
      .filter((m) => m.type === 'image')
      .map((m) => m.url);

    // Map badge values to expected backend fields
    const payload = {
      userName: userName.trim() || 'Verified Buyer',
      rating,
      text: reviewText.trim() || null,
      sizeBought: sizeBought || null,
      images: imagesOnly.length > 0 ? imagesOnly : null,
      isNaturalLight,
      badgeAuthenticity: badgeValues['authenticity'] || null,
      badgeFit: badgeValues['fit'] || null,
      badgePhotoMatch: badgeValues['photoMatch'] || null,
      badgeFabricFeel: badgeValues['fabricFeel'] || null,
      badgeComfortFeel: badgeValues['comfortFeel'] || null,
      badgeMaterialFeel: badgeValues['materialFeel'] || null,
      badgeFinishDurability: badgeValues['finishDurability'] || null,
      badgeShadeMatch: badgeValues['shadeMatch'] || null,
      badgeOverallSatisfaction: badgeValues['overallSatisfaction'] || null
    };

    try {
      await api.submitReview(product.id, payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onReviewSubmitted) onReviewSubmitted();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setErrorMessage(err.message || 'Could not submit review. Please try again.');
      setSubmitting(false);
    }
  };

  const mainImage = getProductImageUrl(product.images?.[0], product.category, 1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden animate-in slide-in-from-bottom duration-250 select-none"
    >
      {/* 1. Header Bar with Back Arrow */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAEAEC] bg-white sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to orders"
            className="p-1 -ml-1 rounded-full text-[#282C3F] hover:bg-[#F5F5F6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 id="review-modal-title" className="text-sm font-black text-[#282C3F] uppercase tracking-wide">
              Rate & Review Product
            </h2>
            <p className="text-[10px] text-[#03A685] font-bold">
              ✓ Verified Delivered Order #{product.id || 'MYN-89342'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review dialog"
          className="p-1.5 rounded-full text-[#535766] hover:bg-[#F5F5F6] hover:text-[#282C3F] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Content Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {success ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#E6F9F5] text-[#03A685] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-black text-[#282C3F]">Verified Review Published!</h3>
            <p className="text-xs text-[#535766] mt-1 max-w-xs">
              Your feedback and trust badges have been added to the community Trust Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            
            {/* Product Summary Card */}
            <div className="flex items-center gap-3 p-3 bg-[#F5F5F6] rounded-xl border border-[#EAEAEC]">
              <img
                src={mainImage}
                alt={product.name}
                className="w-12 h-14 object-cover object-top rounded-lg border border-[#EAEAEC] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-[#282C3F] uppercase tracking-wider block truncate">
                  {product.brand}
                </span>
                <p className="text-xs text-[#535766] truncate font-medium">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-[#282C3F]">₹{product.finalPrice}</span>
                  <span className="text-[10px] text-[#03A685] font-bold bg-[#E6F9F5] px-1.5 py-0.5 rounded">
                    ✓ Delivered Purchase
                  </span>
                </div>
              </div>
            </div>

            {/* Prototype Approximation Disclaimer */}
            <div className="p-2.5 bg-[#F9F9FB] border border-[#D4D5D9] rounded-xl text-[10.5px] text-[#535766] flex items-start gap-2">
              <span className="text-xs flex-shrink-0">ℹ️</span>
              <p className="leading-tight">
                <strong className="text-[#282C3F]">Disclaimer:</strong> This is an approximation of how a Myntra review screen might look. It may vary from the original one.
              </p>
            </div>

            {/* 1. Overall Star Rating */}
            <div className="bg-[#FFF0F3]/50 border border-[#FF3F6C]/20 rounded-xl p-3.5 text-center space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-[#282C3F] block">
                Overall Product Rating *
              </label>
              <StarRatingInput rating={rating} onChange={setRating} />
            </div>

            {/* 2. Trust-Verified Badges (All options visible and accessible) */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF3F6C]" />
                  <h3 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
                    Trust-Verified Attribute Ratings
                  </h3>
                </div>
                <p className="text-[11px] text-[#535766] mt-0.5">
                  Select the option that matches your delivered item to power the community Trust Dashboard:
                </p>
              </div>

              <div className="space-y-2.5">
                {applicableBadges.map((badgeConfig) => (
                  <BadgeInput
                    key={badgeConfig.key}
                    badgeConfig={badgeConfig}
                    value={badgeValues[badgeConfig.key] ?? null}
                    onChange={(val) => handleBadgeChange(badgeConfig.key, val)}
                  />
                ))}
              </div>
            </div>

            {/* 3. Photo & Video Upload Section */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-[#282C3F] uppercase tracking-wide block">
                Upload Real Photos & Videos (Optional)
              </label>
              <p className="text-[11px] text-[#535766]">
                Show actual fit, texture, and daylight lighting to help other buyers.
              </p>

              {/* Media Preview Strip */}
              {uploadedMedia.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {uploadedMedia.map((media, idx) => (
                    <div key={idx} className="relative w-16 h-20 rounded-xl overflow-hidden border border-[#D4D5D9] flex-shrink-0 bg-black/5 group">
                      {media.type === 'image' ? (
                        <img src={media.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1E2235] text-white flex flex-col items-center justify-center p-1 relative">
                          <Video className="w-5 h-5 text-[#FF3F6C]" />
                          <span className="text-[8px] font-bold mt-1 text-center truncate w-full px-1">Video</span>
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(idx)}
                        aria-label={`Remove ${media.name}`}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#D5284F] transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {/* Photo Upload */}
                <label className="py-2.5 px-3 rounded-xl border border-dashed border-[#D4D5D9] hover:border-[#FF3F6C] bg-[#FAFAFB] hover:bg-[#FFF0F3]/40 flex items-center justify-center gap-2 text-xs font-bold text-[#535766] hover:text-[#FF3F6C] transition-colors cursor-pointer">
                  <Camera className="w-4 h-4 text-[#FF3F6C]" />
                  <span>+ Add Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                </label>

                {/* Video Upload */}
                <label className="py-2.5 px-3 rounded-xl border border-dashed border-[#D4D5D9] hover:border-[#FF3F6C] bg-[#FAFAFB] hover:bg-[#FFF0F3]/40 flex items-center justify-center gap-2 text-xs font-bold text-[#535766] hover:text-[#FF3F6C] transition-colors cursor-pointer">
                  <Video className="w-4 h-4 text-[#FF3F6C]" />
                  <span>+ Add Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />
                </label>
              </div>

              {/* Natural Daylight Lighting Checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 bg-[#FFFDF5] border border-[#F5A623]/30 rounded-xl cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNaturalLight}
                  onChange={(e) => setIsNaturalLight(e.target.checked)}
                  className="w-4 h-4 text-[#FF3F6C] rounded focus:ring-[#FF3F6C] accent-[#FF3F6C]"
                />
                <Sun className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                <span className="text-xs text-[#282C3F] font-semibold">
                  Taken in Natural Daylight <span className="text-[#94969F] font-normal">(adds Daylight Verified badge)</span>
                </span>
              </label>
            </div>

            {/* 4. Reviewer Details & Size Bought */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-xs font-bold text-[#535766] block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul S."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4D5D9] focus:border-[#FF3F6C] focus:outline-none bg-white text-[#282C3F]"
                />
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-[#535766] block mb-1">
                    Size Purchased
                  </label>
                  <select
                    value={sizeBought}
                    onChange={(e) => setSizeBought(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4D5D9] focus:border-[#FF3F6C] focus:outline-none bg-white text-[#282C3F]"
                  >
                    {product.sizes.map((s) => (
                      <option key={s} value={s}>
                        Size {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 5. Written Review Textarea */}
            <div>
              <label className="text-xs font-bold text-[#535766] block mb-1">
                Written Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share details about the fabric quality, stitching, comfort, and color accuracy..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4D5D9] focus:border-[#FF3F6C] focus:outline-none bg-white text-[#282C3F] resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-[#FEF0EF] border border-[#D5284F]/30 rounded-xl text-[#D5284F] text-xs font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit CTA Button */}
            <div className="pt-2 pb-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#FF3F6C] hover:bg-[#E0355E] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Submit Verified Buyer Review</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
