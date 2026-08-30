import React from 'react';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

export default function AiTags({ product }) {
  const tags = product.aiTags || [
    { label: 'Style', score: 9, positive: true },
    { label: 'Value for Money', score: 8, positive: true },
    { label: 'Fabric Softness', score: 8, positive: true },
    { label: 'Stitching Quality', score: 2, positive: false }
  ];

  if (tags.length === 0) return null;

  return (
    <div className="p-3 bg-white border-b border-[#EAEAEC]">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#FF3F6C]" />
        <h3 className="text-xs font-bold text-[#282C3F] uppercase tracking-wide">
          What Customers Mentioned
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              tag.positive
                ? 'bg-[#F5F5F6] border-[#D4D5D9] text-[#282C3F]'
                : 'bg-[#FEF0EF] border-[#D5284F]/30 text-[#D5284F]'
            }`}
          >
            {tag.positive ? (
              <ThumbsUp className="w-3 h-3 text-[#03A685]" />
            ) : (
              <ThumbsDown className="w-3 h-3 text-[#D5284F]" />
            )}
            <span>{tag.label}</span>
            <span className="text-[10px] text-[#94969F] font-semibold">({tag.score})</span>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-[#94969F] mt-2 italic">
        AI summarised from customer feedback. Refer to Terms of Use.
      </p>
    </div>
  );
}
