import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function SizeSelector({ product, selectedSize, onSelectSize }) {
  const sizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : ['One Size'];

  if (sizes.length === 1 && sizes[0] === 'One Size') {
    return null; // Skip for one-size products (accessories, perfume)
  }

  return (
    <div className="p-3 bg-white border-b border-[#EAEAEC]">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide">
          Select Size
        </h3>
        <button className="text-xs font-bold text-[#FF3F6C] hover:underline flex items-center">
          Size Chart <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              className={`min-w-[48px] h-14 rounded-full border flex flex-col items-center justify-center px-2 transition-all active:scale-95 ${
                isSelected
                  ? 'border-[#FF3F6C] bg-[#FFF0F3] shadow-xs'
                  : 'border-[#D4D5D9] bg-white hover:border-[#94969F]'
              }`}
            >
              <span
                className={`text-xs ${
                  isSelected ? 'font-black text-[#FF3F6C]' : 'font-bold text-[#282C3F]'
                }`}
              >
                {size}
              </span>
              <span className="text-[9px] text-[#535766] mt-0.5 font-medium">
                ₹{product.finalPrice}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
