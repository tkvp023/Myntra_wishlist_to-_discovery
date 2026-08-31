import React, { useState } from 'react';
import { Star, X, CheckCircle, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductUgcPhotos } from '../../utils/ugcPhotosHelper';

export default function CustomerPhotoGallery({
  product,
  reviews = [],
  selectedPhoto: externalSelectedPhoto,
  onSelectPhoto,
  onClosePhoto
}) {
  const [internalSelectedPhoto, setInternalSelectedPhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const selectedPhoto = externalSelectedPhoto !== undefined ? externalSelectedPhoto : internalSelectedPhoto;

  // Get curated product-relevant customer UGC photos
  const allPhotos = getProductUgcPhotos(product);

  if (!allPhotos || allPhotos.length === 0) return null;

  const handleOpenLightbox = (photo, index) => {
    setPhotoIndex(index);
    if (onSelectPhoto) {
      onSelectPhoto(photo);
    } else {
      setInternalSelectedPhoto(photo);
    }
  };

  const handleCloseLightbox = () => {
    if (onClosePhoto) {
      onClosePhoto();
    } else {
      setInternalSelectedPhoto(null);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const nextIdx = (photoIndex - 1 + allPhotos.length) % allPhotos.length;
    setPhotoIndex(nextIdx);
    const nextPhoto = allPhotos[nextIdx];
    if (onSelectPhoto) onSelectPhoto(nextPhoto);
    else setInternalSelectedPhoto(nextPhoto);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (photoIndex + 1) % allPhotos.length;
    setPhotoIndex(nextIdx);
    const nextPhoto = allPhotos[nextIdx];
    if (onSelectPhoto) onSelectPhoto(nextPhoto);
    else setInternalSelectedPhoto(nextPhoto);
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
          onClick={handleCloseLightbox}
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
              onClick={handleCloseLightbox}
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
