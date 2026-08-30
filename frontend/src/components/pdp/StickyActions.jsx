import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StickyActions({ product, selectedSize }) {
  const navigate = useNavigate();
  const { addToBag } = useApp();

  const handleAddToBag = () => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    addToBag(product, size, 1);
  };

  const handleBuyNow = () => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    addToBag(product, size, 1);
    navigate('/bag');
  };

  return (
    <div className="bg-white border-y border-[#EAEAEC] px-3 py-3 flex items-center gap-2.5 my-1.5 shadow-2xs select-none">
      {/* 1. Buy Now (Outlined Pink Button) */}
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 py-3 px-3 rounded-xl border-2 border-[#FF3F6C] bg-white text-[#FF3F6C] hover:bg-[#FFF0F3] active:scale-[0.98] font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
        <span>Buy Now</span>
      </button>

      {/* 2. Add to Bag (Solid Hot Pink Button) */}
      <button
        type="button"
        onClick={handleAddToBag}
        className="flex-1 py-3 px-3 rounded-xl bg-[#FF3F6C] hover:bg-[#E72744] active:scale-[0.98] text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md shadow-[#FF3F6C]/30 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
        <span>Add to Bag</span>
      </button>
    </div>
  );
}
