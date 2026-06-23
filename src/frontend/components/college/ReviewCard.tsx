'use client';

import React from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '@/shared/types';
import { StarRating } from '@/frontend/components/ui/StarRating';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const reviewerName = review.user?.name || 'Anonymous Student';
  const reviewerAvatar = review.user?.image;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
      {/* Reviewer Meta Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {reviewerAvatar ? (
            <img
              src={reviewerAvatar}
              alt={reviewerName}
              className="w-9 h-9 rounded-full border border-sky-500/20"
            />
          ) : (
            <span className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center font-bold text-xs uppercase">
              {reviewerName.charAt(0)}
            </span>
          )}
          <div>
            <h5 className="text-xs font-bold text-slate-200">{reviewerName}</h5>
            <span className="text-[10px] text-slate-500 font-semibold">{formattedDate}</span>
          </div>
        </div>

        <StarRating rating={review.rating} size="sm" readonly />
      </div>

      {/* Review Content */}
      <div>
        <h4 className="text-sm font-bold text-slate-100 mb-1">{review.title}</h4>
        <p className="text-xs text-slate-450 leading-relaxed whitespace-pre-line">{review.body}</p>
      </div>
    </div>
  );
}
export default ReviewCard;
