import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function StarRating({
  rating,
  maxStars = 5,
  onChange,
  size = 'md',
  readonly = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        
        // Handle decimal stars (e.g. 4.6 rating fills 4 stars, and represents 5th partially/empty)
        // If starValue <= currentRating: completely filled
        // Else if starValue - 0.5 <= currentRating: partially filled
        const isFilled = starValue <= currentRating;
        const isHalf = !isFilled && starValue - 0.6 <= currentRating;

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            className={`transition-all duration-150 focus:outline-none ${
              readonly ? 'cursor-default' : 'cursor-pointer active:scale-90'
            }`}
          >
            <Star
              className={`${starSizes[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-700 fill-slate-900/40 hover:text-slate-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
export default StarRating;
