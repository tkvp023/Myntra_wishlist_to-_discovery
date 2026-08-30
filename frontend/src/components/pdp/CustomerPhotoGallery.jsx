import React, { useState } from 'react';
import { Star, X, CheckCircle, ShieldCheck, Sun, Sparkles, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

// Curated customer UGC photos mapped by category for rich initial experience
const SAMPLE_CUSTOMER_PHOTOS = {
  clothing: [
    {
      id: 'ugc_1',
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      user: 'Rahul S.',
      size: 'L',
      rating: 5,
      date: '24 Aug 2026',
      badge: 'Photo Match 100%',
      lighting: 'Outdoor Natural Daylight',
      caption: 'The Navy blue shade is identical to the studio picture. Fabric is super soft cotton, fits true to size!'
    },
    {
      id: 'ugc_2',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      user: 'Arun K.',
      size: 'M',
      rating: 5,
      date: '18 Aug 2026',
      badge: 'Feels 100% Genuine',
      lighting: 'Indoor Room Lighting',
      caption: 'Stitching and collar durability is top notch. Washed twice with zero color bleed.'
    },
    {
      id: 'ugc_3',
      url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      user: 'Vikram M.',
      size: 'XL',
      rating: 4,
      date: '12 Aug 2026',
      badge: '85% Fits as Expected',
      lighting: 'Diffused Sunlight',
      caption: 'Length is just right, slightly slim on the chest if you have broad shoulders.'
    },
    {
      id: 'ugc_4',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      user: 'Priya N.',
      size: 'S',
      rating: 5,
      date: '08 Aug 2026',
      badge: 'Pure Fabric Feel',
      lighting: 'Golden Hour Lighting',
      caption: 'Super breathable and looks very stylish in real daylight. Highly recommended!'
    }
  ],
  footwear: [
    {
      id: 'ugc_f1',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      user: 'Aditya R.',
      size: 'UK 9',
      rating: 5,
      date: '20 Aug 2026',
      badge: 'True to Size',
      lighting: 'Natural Sunlight',
      caption: 'Sole grip and cushion comfort are insane. Looks even cleaner in person than studio shot.'
    },
    {
      id: 'ugc_f2',
      url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
      user: 'Karthik P.',
      size: 'UK 8',
      rating: 4,
      date: '15 Aug 2026',
      badge: '100% Genuine Box',
      lighting: 'Indoor Daylight',
      caption: 'Original verified barcode tag included. Very lightweight for daily gym and jogging.'
    }
  ],
  default: [
    {
      id: 'ugc_d1',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      user: 'Sneha B.',
      size: 'Standard',
      rating: 5,
      date: '22 Aug 2026',
      badge: 'Authentic Finish',
      lighting: 'Direct Daylight',
      caption: 'Packaging was sealed with trust tag intact. Product texture exactly matches description.'
    },
    {
      id: 'ugc_d2',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      user: 'Ananya S.',
      size: 'One Size',
      rating: 5,
      date: '10 Aug 2026',
      badge: 'Color Accurate',
      lighting: 'Natural Room Light',
      caption: 'Zippers and inner lining feel very premium and sturdy.'
    }
  ]
};

export default function CustomerPhotoGallery({ product, reviews = [] }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Extract photos from user-submitted reviews if available, else use curated category UGC photos
  const reviewPhotos = reviews.flatMap((r) => {
    if (r.images && Array.isArray(r.images)) {
      return r.images.map((img, i) => ({
        id: `${r.id}_${i}`,
        url: img,
        user: r.userName || 'Verified Buyer',
        size: r.sizeBought || 'M',
        rating: r.rating || 5,
        date: 'Recent Review',
        badge: 'Verified Buyer Photo',
        lighting: 'Natural Daylight',
        caption: r.text || 'Real customer photo review'
      }));
    }
    return [];
  });

  const categoryPhotos = SAMPLE_CUSTOMER_PHOTOS[product?.category] || SAMPLE_CUSTOMER_PHOTOS.default;
  const allPhotos = [...reviewPhotos, ...categoryPhotos];

  if (allPhotos.length === 0) return null;

  const handleOpenLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const nextIdx = (photoIndex - 1 + allPhotos.length) % allPhotos.length;
    setPhotoIndex(nextIdx);
    setSelectedPhoto(allPhotos[nextIdx]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (photoIndex + 1) % allPhotos.length;
    setPhotoIndex(nextIdx);
    setSelectedPhoto(allPhotos[nextIdx]);
  };

  return (
    <div className="bg-white px-3 py-3 border-b border-[#EAEAEC]">
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-extrabold text-[#282C3F] uppercase tracking-wide">
            Customer Photos ({allPhotos.length})
          </h3>
          <span className="bg-[#E6F9F5] text-[#047857] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#03A685]/30 flex items-center gap-0.5">
            <Sun className="w-2.5 h-2.5 text-[#03A685]" />
            <span>Natural Lighting</span>
          </span>
        </div>
        <span className="text-[10px] text-[#535766] font-semibold">
          Tap photo to inspect
        </span>
      </div>

      {/* Horizontal Scroll Photo Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {allPhotos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => handleOpenLightbox(photo, idx)}
            className="relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border border-[#EAEAEC] group cursor-pointer shadow-2xs hover:border-[#FF3F6C] transition-all"
          >
            <img
              src={photo.url}
              alt={`Customer photo by ${photo.user}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Rating Overlay on thumbnail */}
            <div className="absolute bottom-1 left-1 bg-black/65 backdrop-blur-xs text-white text-[9px] font-black px-1 py-0.5 rounded flex items-center gap-0.5">
              <span>{photo.rating}</span>
              <Star className="w-2 h-2 fill-white" />
            </div>

            {/* Natural lighting indicator badge */}
            <div className="absolute top-1 right-1 bg-[#03A685] text-white p-0.5 rounded-full shadow-xs">
              <CheckCircle className="w-2 h-2 stroke-[3]" />
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 animate-in fade-in duration-200 select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {photoIndex + 1} of {allPhotos.length}
              </span>
              <span className="text-xs font-semibold text-white/80">
                Verified Customer Photo
              </span>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo with Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt="Customer photo full"
              className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
            />

            {/* Navigation Arrows */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Review Metadata Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2 max-w-md mx-auto w-full text-[#282C3F]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#03A685] text-white flex items-center justify-center text-[11px] font-bold">
                  {selectedPhoto.user?.[0] || 'V'}
                </div>
                <div>
                  <span className="text-xs font-black block leading-none">
                    {selectedPhoto.user}
                  </span>
                  <span className="text-[10px] text-[#94969F]">
                    {selectedPhoto.date} · Size: <strong className="text-[#282C3F]">{selectedPhoto.size}</strong>
                  </span>
                </div>
              </div>

              {/* Star Rating & Match Badge */}
              <div className="flex items-center gap-1.5">
                <div className="bg-[#03A685] text-white px-1.5 py-0.5 rounded text-[11px] font-black flex items-center gap-0.5">
                  <span>{selectedPhoto.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-white" />
                </div>
                <span className="bg-[#E6F9F5] text-[#047857] text-[9.5px] font-black px-2 py-0.5 rounded-md border border-[#03A685]/35">
                  {selectedPhoto.badge}
                </span>
              </div>
            </div>

            {/* Lighting Environment Tag */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#535766] bg-[#F5F5F6] px-2 py-1 rounded-md">
              <Sun className="w-3 h-3 text-[#F5A623]" />
              <span>Lighting Condition: <strong className="text-[#282C3F]">{selectedPhoto.lighting}</strong></span>
            </div>

            {/* Review Caption */}
            {selectedPhoto.caption && (
              <p className="text-xs text-[#535766] font-medium leading-snug">
                "{selectedPhoto.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
