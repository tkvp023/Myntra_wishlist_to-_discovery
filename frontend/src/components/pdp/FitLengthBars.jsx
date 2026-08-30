import React from 'react';

export default function FitLengthBars({ product }) {
  const fitTight = product.fitTight || 10;
  const fitJustRight = product.fitJustRight || 80;
  const fitLoose = product.fitLoose || 10;

  const lengthShort = product.lengthShort || 8;
  const lengthJustRight = product.lengthJustRight || 84;
  const lengthLong = product.lengthLong || 8;

  // Skip for non-clothing categories that don't have fit/length (like makeup/skincare)
  if (!product.fitJustRight && product.category !== 'clothing') {
    return null;
  }

  return (
    <div className="p-3 bg-white border-b border-[#EAEAEC]">
      <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide mb-3">
        Customer Feedback on Size & Fit
      </h3>

      {/* 1. Fit Distribution Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-[#282C3F]">Fit</span>
          <span className="text-[#03A685] font-bold text-[11px]">{fitJustRight}% say Just Right</span>
        </div>
        <div className="h-2 w-full bg-[#F5F5F6] rounded-full overflow-hidden flex">
          <div style={{ width: `${fitTight}%` }} className="bg-[#F5A623] h-full" title={`Tight: ${fitTight}%`}></div>
          <div style={{ width: `${fitJustRight}%` }} className="bg-[#03A685] h-full" title={`Just Right: ${fitJustRight}%`}></div>
          <div style={{ width: `${fitLoose}%` }} className="bg-[#94969F] h-full" title={`Loose: ${fitLoose}%`}></div>
        </div>
        <div className="flex justify-between text-[10px] text-[#94969F] mt-1 font-medium">
          <span>Tight ({fitTight}%)</span>
          <span className="text-[#03A685] font-bold">Just Right ({fitJustRight}%)</span>
          <span>Loose ({fitLoose}%)</span>
        </div>
      </div>

      {/* 2. Length Distribution Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-[#282C3F]">Length</span>
          <span className="text-[#03A685] font-bold text-[11px]">{lengthJustRight}% say Just Right</span>
        </div>
        <div className="h-2 w-full bg-[#F5F5F6] rounded-full overflow-hidden flex">
          <div style={{ width: `${lengthShort}%` }} className="bg-[#F5A623] h-full" title={`Short: ${lengthShort}%`}></div>
          <div style={{ width: `${lengthJustRight}%` }} className="bg-[#03A685] h-full" title={`Just Right: ${lengthJustRight}%`}></div>
          <div style={{ width: `${lengthLong}%` }} className="bg-[#94969F] h-full" title={`Long: ${lengthLong}%`}></div>
        </div>
        <div className="flex justify-between text-[10px] text-[#94969F] mt-1 font-medium">
          <span>Short ({lengthShort}%)</span>
          <span className="text-[#03A685] font-bold">Just Right ({lengthJustRight}%)</span>
          <span>Long ({lengthLong}%)</span>
        </div>
      </div>
    </div>
  );
}
