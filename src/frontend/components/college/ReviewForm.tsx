'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewInput } from '@/shared/validators';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { StarRating } from '@/frontend/components/ui/StarRating';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { useToast } from '@/frontend/components/ui/Toast';
import { MessageSquarePlus, Lock } from 'lucide-react';

interface ReviewFormProps {
  collegeSlug: string;
  onSuccess?: () => void;
}

export function ReviewForm({ collegeSlug, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const { success, error: errorToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      title: '',
      body: '',
    },
  });

  const onSubmit = async (data: ReviewInput) => {
    try {
      const res = await fetch(`/api/colleges/${collegeSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit review');
      }

      success('Review Submitted', 'Thank you! Your review has been successfully posted.');
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      errorToast('Submission Failed', err.message || 'An error occurred while posting your review.');
    }
  };

  if (!session?.user) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-4">
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-200">Share Your Experience</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Have you studied at this college? Log in to leave a review and help other students make informed decisions.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="bg-sky-500 hover:bg-sky-600 border border-sky-400/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 mt-2"
        >
          Sign In to Review
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
        <MessageSquarePlus className="w-5 h-5 text-sky-400" />
        <h3 className="font-bold text-white text-sm">Write a Review</h3>
      </div>

      {/* Star Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Rating Star Count
        </label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              rating={field.value}
              onChange={field.onChange}
              size="lg"
              readonly={false}
            />
          )}
        />
        {errors.rating && <p className="text-xs text-rose-400 mt-1">{errors.rating.message}</p>}
      </div>

      {/* Title */}
      <Input
        label="Review Headline"
        placeholder="e.g. Excellent college infrastructure and coding culture"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description Body */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
          Review Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe your student experience, including campus resources, placement opportunities, faculty members, and student clubs..."
          className={`w-full px-4 py-2.5 bg-slate-950 border ${
            errors.body ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/10'
          } rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 outline-none focus:ring-4`}
          {...register('body')}
        />
        {errors.body && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.body.message}</p>}
      </div>

      {/* Action Submit */}
      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full sm:w-auto">
          Submit Review
        </Button>
      </div>
    </form>
  );
}
export default ReviewForm;
