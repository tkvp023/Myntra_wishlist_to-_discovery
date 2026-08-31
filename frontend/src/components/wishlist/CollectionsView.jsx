import React, { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Package,
  ArrowDownCircle,
  Monitor,
  Plus,
  MoreVertical,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SMART_COLLECTIONS = [
  {
    id: 'trending',
    label: 'TRENDING',
    icon: TrendingUp,
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },
  {
    id: 'low-in-stock',
    label: 'Low In Stock',
    icon: Package,
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  {
    id: 'price-drop',
    label: 'Price Drop',
    icon: ArrowDownCircle,
    color: '#DC2626',
    bgColor: '#FEF2F2'
  },
  {
    id: 'recently-viewed',
    label: 'Recently Viewed',
    icon: Monitor,
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  }
];

export default function CollectionsView({ onClose, wishlistItems }) {
  const { wishlistTags } = useApp();
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Derive custom collections from tags
  const allTags = Array.from(
    new Set(Object.values(wishlistTags || {}).flat())
  );

  // Count items per tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = Object.values(wishlistTags || {}).filter((tags) =>
      tags.includes(tag)
    ).length;
    return acc;
  }, {});

  // Get images for a collection (from items that have that tag)
  const getCollectionImages = (tag) => {
    const productIds = Object.entries(wishlistTags || {})
      .filter(([, tags]) => tags.includes(tag))
      .map(([id]) => id);

    return wishlistItems
      .filter((item) => productIds.includes(item.product?.id))
      .slice(0, 2)
      .map((item) => {
        const img = item.product?.images?.[0];
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return img;
      })
      .filter(Boolean);
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#F5F5F6] flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-[#EAEAEC] flex items-center gap-3 shadow-2xs">
        <button
          type="button"
          onClick={onClose}
          className="text-[#282C3F] hover:text-[#FF3F6C] p-0.5 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-black text-[#282C3F]">Collections</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-6">
        {/* Smart Collections Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {SMART_COLLECTIONS.map((col) => {
            const Icon = col.icon;
            return (
              <button
                key={col.id}
                type="button"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[#EAEAEC] bg-white hover:shadow-sm transition-all cursor-pointer group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: col.bgColor }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ color: col.color }}
                  />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-xs font-extrabold text-[#282C3F] block truncate group-hover:text-[#FF3F6C] transition-colors">
                    {col.label}
                  </span>
                  <span className="text-[10px] text-[#94969F] font-semibold">
                    0 Items
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Collections Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* New Collection Card */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setShowNewInput(true)}
              className="aspect-[4/3] rounded-xl bg-[#F0F0F0] border-2 border-dashed border-[#D4D5D9] flex items-center justify-center hover:border-[#FF3F6C] hover:bg-[#FFF8F9] transition-all cursor-pointer group"
            >
              <Plus className="w-10 h-10 text-[#282C3F] stroke-[1.5] group-hover:text-[#FF3F6C] transition-colors" />
            </button>
            <span className="text-xs font-bold text-[#282C3F] mt-2 px-0.5">
              New Collection
            </span>
          </div>

          {/* Existing Custom Collections */}
          {allTags.map((tag) => {
            const images = getCollectionImages(tag);
            const count = tagCounts[tag] || 0;
            // Strip emoji prefix for display name
            const displayName = tag.replace(/^[\p{Emoji}\s]+/u, '').trim() || tag;

            return (
              <div key={tag} className="flex flex-col">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F0F0F0] border border-[#EAEAEC] relative group cursor-pointer">
                  {images.length > 0 ? (
                    <div className="w-full h-full flex">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full"
                          style={{
                            borderRight:
                              i === 0 && images.length > 1
                                ? '1px solid #fff'
                                : 'none'
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">{tag.match(/[\p{Emoji}]/u)?.[0] || '📁'}</span>
                    </div>
                  )}
                  {/* More options button */}
                  <button
                    type="button"
                    className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-[#282C3F]" />
                  </button>
                </div>
                <div className="mt-2 px-0.5 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#282C3F] block">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-[#94969F] font-semibold">
                      {count} {count === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="p-0.5 mt-0.5 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4 text-[#94969F]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fashion Quote */}
        <div className="pt-10 pb-4 text-center">
          <p className="text-[11px] text-[#94969F] mb-1.5">〰️</p>
          <p className="text-sm italic font-serif text-[#535766] leading-relaxed px-6">
            "Fashion is instant language."
          </p>
          <p className="text-[11px] font-semibold text-[#94969F] mt-1.5 italic">
            Miuccia Prada
          </p>
        </div>
      </div>

      {/* New Collection Input Modal */}
      {showNewInput && (
        <div
          onClick={() => setShowNewInput(false)}
          className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#282C3F]">
                New Collection
              </h3>
              <button
                onClick={() => setShowNewInput(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F6] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#535766]" />
              </button>
            </div>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D4D5D9] focus:border-[#FF3F6C] focus:outline-none text-[#282C3F]"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowNewInput(false)}
                className="flex-1 py-2.5 text-xs font-bold text-[#535766] border border-[#D4D5D9] rounded-xl cursor-pointer hover:bg-[#F5F5F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // For now just close - creating collections would need backend support
                  setShowNewInput(false);
                  setNewCollectionName('');
                }}
                className="flex-1 py-2.5 text-xs font-black text-white bg-[#FF3F6C] rounded-xl cursor-pointer hover:bg-[#E0355E]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
