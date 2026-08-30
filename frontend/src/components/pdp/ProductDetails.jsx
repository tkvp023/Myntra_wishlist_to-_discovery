import React, { useState } from 'react';
import { Truck, RotateCcw, Banknote, ShieldCheck, Award, MapPin } from 'lucide-react';

export default function ProductDetails({ product }) {
  const [pincode, setPincode] = useState('560001');

  return (
    <div className="bg-white border-b border-[#EAEAEC] flex flex-col">
      {/* 1. Delivery & Services */}
      <div className="p-3 border-b border-[#F5F5F6]">
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#535766]" />
          <span>Delivery & Services</span>
        </h3>

        {/* Pincode Input */}
        <div className="flex items-center border border-[#D4D5D9] rounded-md px-3 py-1.5 focus-within:border-[#FF3F6C] mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-[#94969F] mr-2" />
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            maxLength={6}
            className="text-xs text-[#282C3F] font-semibold flex-1 outline-none bg-transparent"
          />
          <button className="text-xs font-bold text-[#FF3F6C]">Check</button>
        </div>

        {/* Delivery Highlights */}
        <div className="space-y-1.5 text-[11px] text-[#535766]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#03A685]"></span>
            <span>Get it by <strong className="text-[#282C3F]">Monday, 31 Aug</strong> (M-Express Delivery)</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote className="w-3.5 h-3.5 text-[#03A685]" />
            <span>Pay on Delivery is available</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-[#03A685]" />
            <span>Hassle-free 7 days Return & Exchange</span>
          </div>
        </div>
      </div>

      {/* 2. Product Specifications Grid */}
      <div className="p-3 border-b border-[#F5F5F6]">
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide mb-2.5">
          Product Specifications
        </h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-[#F5F5F6] p-3 rounded-lg text-xs">
          <div>
            <span className="text-[10px] text-[#94969F] block">Fabric</span>
            <span className="font-semibold text-[#282C3F]">{product.material || 'Pure Cotton'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94969F] block">Fit</span>
            <span className="font-semibold text-[#282C3F]">{product.fit || 'Regular Fit'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94969F] block">Weave Pattern</span>
            <span className="font-semibold text-[#282C3F]">Knitted / Regular</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94969F] block">Transparency</span>
            <span className="font-semibold text-[#282C3F]">Opaque</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94969F] block">Sustainability</span>
            <span className="font-semibold text-[#282C3F]">Regular Cotton</span>
          </div>
          <div>
            <span className="text-[10px] text-[#94969F] block">Wash Care</span>
            <span className="font-semibold text-[#282C3F]">Machine Wash</span>
          </div>
        </div>
      </div>

      {/* 3. Product Description Paragraph */}
      <div className="p-3 border-b border-[#F5F5F6]">
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide mb-1.5">
          Product Details
        </h3>
        <p className="text-xs text-[#535766] leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {/* 4. Quality & Authenticity Guarantee Seals */}
      <div className="p-3 flex items-center justify-around bg-[#FFF0F3]/40">
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] border border-[#FF3F6C]/30 flex items-center justify-center text-[#FF3F6C] mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#282C3F]">100% Genuine</span>
          <span className="text-[9px] text-[#94969F]">Direct from Brand</span>
        </div>

        <div className="h-8 w-px bg-[#D4D5D9]"></div>

        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] border border-[#FF3F6C]/30 flex items-center justify-center text-[#FF3F6C] mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#282C3F]">Quality Checked</span>
          <span className="text-[9px] text-[#94969F]">Multi-point Verified</span>
        </div>
      </div>
    </div>
  );
}
