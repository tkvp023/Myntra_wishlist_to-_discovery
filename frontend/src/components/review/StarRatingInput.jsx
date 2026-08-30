import React from 'react';
import { Star } from 'lucide-react';

export default function StarRatingInput({ rating, onChange }) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Loved it!';
      case 4: return 'Liked it';
      case 3: return 'Just OK';
      case 2: return 'Disliked it';
      case 1: return 'Hated it';
      default: return 'Tap to rate';
    }
  };

  const activeVal = hoverRating || rating;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= activeVal;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className="p-1.5 focus:outline-none transition-transform active:scale-90 hover:scale-110 cursor-pointer"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  filled ? 'fill-[#FFC700] text-[#FFC700]' : 'text-[#D4D5D9]'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className={`text-xs font-bold mt-1.5 transition-colors ${
        activeVal > 0 ? 'text-[#282C3F]' : 'text-[#94969F]'
      }`}>
        {getRatingLabel(activeVal)}
      </span>
    </div>
  );
}
