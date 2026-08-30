import React from 'react';

export default function ProductInfo({ product }) {
  const discountAmount = Math.max(0, product.mrp - product.finalPrice);

  return (
    <div className="px-3 pt-3 pb-2 bg-white">
      {/* 1. Brand & Title inline / clean (matching screenshot: INVICTUS Pure Cotton Casual Shirt) */}
      <div className="leading-snug">
        <span className="text-sm font-black text-[#282C3F] tracking-wide uppercase mr-1.5">
          {product.brand}
        </span>
        <span className="text-sm font-normal text-[#535766]">
          {product.name}
        </span>
      </div>

      {/* 2. Price Row (matching screenshot: MRP ₹2,299 ₹829 Rs. 1470 OFF!) */}
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        {product.mrp > product.finalPrice && (
          <span className="text-xs text-[#94969F] line-through font-normal">
            MRP ₹{product.mrp}
          </span>
        )}
        
        <span className="text-base font-black text-[#282C3F]">
          ₹{product.finalPrice}
        </span>

        {/* Coral/Red Pill (matching screenshot: Rs. 1470 OFF! / 62% OFF!) */}
        {discountAmount > 0 ? (
          <span className="bg-[#FF3F6C] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-tight uppercase shadow-2xs">
            Rs. {discountAmount} OFF!
          </span>
        ) : product.discountPercent > 0 ? (
          <span className="bg-[#FF3F6C] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-tight uppercase shadow-2xs">
            {product.discountPercent}% OFF!
          </span>
        ) : null}
      </div>
    </div>
  );
}
