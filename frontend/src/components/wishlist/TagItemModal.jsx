import React, { useState } from 'react';
import { X, Tag, Plus, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProductImageUrl } from '../../utils/imageHelper';

const PRESET_TAGS = [
  '⚖️ Price Comparison',
  '🏖️ Vacation',
  '🎉 Festive / Party',
  '🎯 Must-Have'
];

export default function TagItemModal({ product, isOpen, onClose }) {
  const { wishlistTags, toggleWishlistTag, addCustomWishlistTag, showToast } = useApp();
  const [customTagInput, setCustomTagInput] = useState('');

  if (!isOpen || !product) return null;

  const currentTags = wishlistTags[product.id] || [];

  const handleToggle = (tag) => {
    toggleWishlistTag(product.id, tag);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    addCustomWishlistTag(product.id, `🏷️ ${customTagInput.trim()}`);
    showToast(`Added tag "${customTagInput.trim()}"`);
    setCustomTagInput('');
  };

  const img = getProductImageUrl(product.images?.[0], product.category, 1);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAEAEC]">
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#FF3F6C]" />
            <h2 className="text-xs font-black text-[#282C3F] uppercase tracking-wide">
              Tag & Organize Saved Item
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#535766] hover:bg-[#F5F5F6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3 bg-[#FAFAFB] border-b border-[#EAEAEC]">
          <img
            src={img}
            alt={product.name}
            className="w-12 h-14 object-cover object-top rounded-lg border border-[#EAEAEC] flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-black text-[#282C3F] block truncate uppercase">
              {product.brand}
            </span>
            <span className="text-[11px] text-[#535766] block truncate leading-tight mt-0.5">
              {product.name}
            </span>
            <span className="text-xs font-black text-[#282C3F] block mt-1">
              ₹{product.finalPrice}
            </span>
          </div>
        </div>

        {/* Tagging Content Area */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Active Tags on This Item */}
          <div>
            <span className="text-[10px] font-extrabold text-[#535766] uppercase tracking-wider block mb-1.5">
              Active Tags ({currentTags.length})
            </span>
            {currentTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentTags.map((t, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleToggle(t)}
                    className="inline-flex items-center gap-1.5 bg-[#FFF0F3] border border-[#FF3F6C] text-[#FF3F6C] px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-[#FFE0E6] transition-colors"
                  >
                    <span>{t}</span>
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94969F] italic">No tags assigned yet. Pick a collection below.</p>
            )}
          </div>

          {/* Quick Preset Tags */}
          <div>
            <span className="text-[10px] font-extrabold text-[#535766] uppercase tracking-wider block mb-1.5">
              Popular Collections & Intent Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag, idx) => {
                const isSelected = currentTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggle(tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF3F6C] text-white border-[#FF3F6C] shadow-2xs'
                        : 'bg-white text-[#282C3F] border-[#D4D5D9] hover:border-[#FF3F6C] hover:bg-[#FFF8F9]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Custom Tag Input */}
          <form onSubmit={handleAddCustom} className="pt-2 border-t border-[#F5F5F6]">
            <label className="text-[10px] font-extrabold text-[#535766] uppercase tracking-wider block mb-1.5">
              Create Custom Tag
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="e.g. Goa Trip, Saree for Mom..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#D4D5D9] focus:border-[#FF3F6C] focus:outline-none bg-white text-[#282C3F]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#282C3F] hover:bg-[#1E2235] text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Done Footer CTA */}
        <div className="p-3 border-t border-[#EAEAEC] bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#FF3F6C] hover:bg-[#E0355E] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
