import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

export default function ReengagementCard({ item }) {
  const navigate = useNavigate();
  const { product, reengagement, daysStalled } = item;

  if (!reengagement || !reengagement.hasData || !reengagement.message) {
    return null;
  }

  const mainImage = getProductImageUrl(product.images?.[0], product.category, 1);
  const targetFilter = reengagement.deepLinkFilter || 'all';

  const handleCtaClick = () => {
    navigate(`/product/${product.id}?filter=${targetFilter}`);
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFF5F7] border border-[#FF3F6C]/30 rounded-2xl p-3.5 shadow-xs relative overflow-hidden">
      {/* Top Header Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#FF3F6C] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FF3F6C]" />
          <span>Trust Insight for Saved Item</span>
        </div>
        {daysStalled > 0 && (
          <span className="text-[9px] font-bold text-[#535766] bg-white/80 px-2 py-0.5 rounded-full border border-[#EAEAEC]">
            Wishlisted {daysStalled}d ago
          </span>
        )}
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-3">
        <img
          src={mainImage}
          alt={product.name}
          className="w-14 h-16 object-cover object-top rounded-lg border border-[#FF3F6C]/20 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black text-[#282C3F] truncate">
            {product.brand}
          </h4>
          <p className="text-[11px] text-[#535766] mt-0.5 leading-snug">
            {reengagement.message}
          </p>
        </div>
      </div>

      {/* Badge Pills Row (Bolder & Eye-Catchy) */}
      {reengagement.badgeHighlights && reengagement.badgeHighlights.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
          {reengagement.badgeHighlights.slice(0, 2).map((b, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E6F9F5] to-[#D5F5EE] border border-[#03A685]/40 text-[#047857] px-2.5 py-1 rounded-md text-[10px] font-black whitespace-nowrap shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#03A685] stroke-[2.5]" />
              <span>{!b.belowThreshold ? `${b.percent}% ${b.label}` : '🔥 Trending: More buyers noticing this'}</span>
            </span>
          ))}
        </div>
      )}

      {/* Action CTA Button */}
      <button
        type="button"
        onClick={handleCtaClick}
        className="mt-3 w-full py-2 bg-[#FF3F6C] hover:bg-[#E0355E] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <span>See Verified Reviews & Decide</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
