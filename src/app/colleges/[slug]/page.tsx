'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSaved } from '@/frontend/hooks/useSaved';
import { useCompare } from '@/frontend/hooks/useCompare';
import { CollegeWithRelations, Review } from '@/shared/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/frontend/components/ui/Tabs';
import { StarRating } from '@/frontend/components/ui/StarRating';
import { Badge } from '@/frontend/components/ui/Badge';
import { Skeleton } from '@/frontend/components/ui/Skeleton';
import { ReviewCard } from '@/frontend/components/college/ReviewCard';
import { ReviewForm } from '@/frontend/components/college/ReviewForm';
import { Button } from '@/frontend/components/ui/Button';
import {
  GraduationCap,
  Star,
  MapPin,
  Calendar,
  Award,
  Maximize,
  Globe,
  Heart,
  GitCompare,
  TrendingUp,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Layers,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

function CollegeDetailPageContent() {
  const { slug } = useParams() as { slug: string };
  const queryClient = useQueryClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [reviewPage, setReviewPage] = useState(1);

  // 1. Fetch main college details
  const {
    data: college,
    isLoading,
    isError,
    refetch: refetchCollege,
  } = useQuery<CollegeWithRelations>({
    queryKey: ['college', slug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}`);
      if (!res.ok) {
        throw new Error('College not found');
      }
      return res.json();
    },
  });

  // 2. Fetch paginated reviews (only if reviews tab is active or prefetching)
  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery<{
    data: Review[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ['reviews', slug, reviewPage],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${slug}/reviews?page=${reviewPage}&limit=5`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
    enabled: !!college, // only run if college is loaded
  });

  const { isSaved, toggleSave } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse w-full">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-6 flex flex-col items-center">
        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 flex items-center justify-center mb-4">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-md font-bold text-white uppercase tracking-wider">Institution Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-sm">
          The college directory entry you requested could not be resolved. It may have been updated or removed.
        </p>
        <Link
          href="/colleges"
          className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-xs font-bold px-4 py-2 rounded-xl text-slate-200 hover:text-white transition-all border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const saved = isSaved(college.id);
  const comparing = isInCompare(college.id);
  const reviewsList = reviewsResponse?.data || [];
  const reviewsCount = reviewsResponse?.total || college._count?.reviews || 0;
  const totalReviewPages = Math.ceil(reviewsCount / 5);

  const handleReviewSuccess = () => {
    // Refresh both details and reviews list on post
    refetchCollege();
    queryClient.invalidateQueries({ queryKey: ['reviews', slug] });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 w-full">
      {/* Back button */}
      <div>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1 text-xs text-slate-550 hover:text-sky-400 font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Search Directory
        </Link>
      </div>

      {/* College Banner Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Action Bookmark/Compare Controls inside Image wrapper */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                if (comparing) {
                  removeFromCompare(college.id, college.name);
                } else {
                  addToCompare(college.id, college.name);
                }
              }}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                comparing
                  ? 'bg-sky-500 border-sky-500 text-white shadow-lg'
                  : 'bg-slate-950/50 border-white/10 text-white hover:bg-slate-950/80 hover:scale-105'
              }`}
              title={comparing ? 'Comparing' : 'Compare College'}
            >
              <GitCompare className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => toggleSave(college.id)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                saved
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-950/50 border-white/10 text-white hover:bg-slate-950/80 hover:scale-105'
              }`}
              title={saved ? 'Unsave' : 'Save'}
            >
              <Heart className={`w-4.5 h-4.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Floating Details Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <Badge variant="warning" className="w-max text-[9px] uppercase tracking-widest font-bold py-0.5 px-2 mb-1.5 shadow-md">
                {college.accreditation}
              </Badge>
              <h1 className="text-xl md:text-3xl font-black text-white leading-tight shadow-sm">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-300 text-xs font-semibold mt-2.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {college.location}, {college.state}
                </span>
                <span className="h-3 w-px bg-slate-800 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Established in {college.established}
                </span>
              </div>
            </div>

            {/* Float Ratings */}
            <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl max-w-max shadow-lg">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-md font-black text-white leading-none">
                  {college.rating.toFixed(1)}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                  {reviewsCount} Student Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Programs</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviewsCount})</TabsTrigger>
        </TabsList>

        {/* Tab content: Overview */}
        <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">About the Institution</h3>
              <p className="text-xs text-slate-350 leading-relaxed font-medium whitespace-pre-wrap">
                {college.description}
              </p>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3">
              Key Metrics
            </h3>

            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accreditation</span>
                <span className="block text-xs font-bold text-slate-200 mt-0.5">{college.accreditation}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Maximize className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Campus Area</span>
                <span className="block text-xs font-bold text-slate-200 mt-0.5">{college.campusSize} Acres</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Established Year</span>
                <span className="block text-xs font-bold text-slate-200 mt-0.5">{college.established}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-850 pt-4">
              <Globe className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex-grow">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Official Webpage</span>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 mt-1 cursor-pointer"
                >
                  Visit Website
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab content: Courses */}
        <TabsContent value="courses" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <FileSpreadsheet className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Available Programs</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-850">
            <table className="w-full min-w-[500px] border-collapse text-left text-xs text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="p-4 w-1/2">Course Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Annual Intake</th>
                  <th className="p-4 text-right">Annual Fees</th>
                </tr>
              </thead>
              <tbody>
                {college.courses?.map((course) => (
                  <tr key={course.id} className="border-b border-slate-850/50 hover:bg-slate-850/20 transition-colors">
                    <td className="p-4 font-bold text-white">{course.name}</td>
                    <td className="p-4 font-medium">{course.duration} Years</td>
                    <td className="p-4 font-medium">{course.seats} Seats</td>
                    <td className="p-4 text-right font-black text-sky-400">
                      ₹{course.fees.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab content: Placements */}
        <TabsContent value="placements" className="flex flex-col gap-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Placement Analytics</h3>
          </div>

          {college.placement ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Highlight metrics cards */}
              <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Salary</span>
                <span className="block text-3xl font-extrabold text-white mt-1.5">
                  {college.placement.avgSalary} LPA
                </span>
                <span className="block text-[10px] text-slate-450 mt-1 font-medium">Lakhs Per Annum</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Highest Salary</span>
                <span className="block text-3xl font-extrabold text-sky-400 mt-1.5">
                  {college.placement.highestSalary} LPA
                </span>
                <span className="block text-[10px] text-slate-450 mt-1 font-medium">International/Domestic</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Placement Rate</span>
                <span className="block text-3xl font-extrabold text-emerald-400 mt-1.5">
                  {college.placement.placementPercent}%
                </span>
                <span className="block text-[10px] text-slate-450 mt-1 font-medium">Selected Batch Students</span>
              </div>

              {/* Recruiters badges row */}
              <div className="md:col-span-3 bg-slate-950/40 border border-slate-850 p-6 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  Top Hiring Recruiters
                </div>
                <div className="flex flex-wrap gap-2.5 mt-1.5">
                  {college.placement.topRecruiters.map((rec) => (
                    <Badge key={rec} variant="dark" className="text-xs py-1 px-3 border-slate-850 font-bold text-slate-350 bg-slate-950 shadow-sm">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs font-semibold">
              No placement statistics records are available for this institution.
            </div>
          )}
        </TabsContent>

        {/* Tab content: Reviews */}
        <TabsContent value="reviews" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Submission Form (Left) */}
          <div className="lg:col-span-1 lg:sticky lg:top-20">
            <ReviewForm collegeSlug={college.slug} onSuccess={handleReviewSuccess} />
          </div>

          {/* Reviews list (Right) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Student Testimonials
            </h3>

            {reviewsLoading && (
              <div className="flex flex-col gap-4 animate-pulse">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            )}

            {!reviewsLoading && reviewsList.length === 0 && (
              <div className="text-center py-16 bg-slate-900/20 border border-slate-850 rounded-2xl p-6 text-slate-500 font-semibold text-xs">
                No reviews have been posted for this college yet. Be the first to share!
              </div>
            )}

            {!reviewsLoading &&
              reviewsList.map((review) => <ReviewCard key={review.id} review={review} />)}

            {/* Pagination Controls */}
            {!reviewsLoading && totalReviewPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Page {reviewPage} of {totalReviewPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={reviewPage === 1}
                    onClick={() => setReviewPage(reviewPage - 1)}
                    className="p-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950/40 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={reviewPage === totalReviewPages}
                    onClick={() => setReviewPage(reviewPage + 1)}
                    className="p-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg bg-slate-950/40 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CollegeDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6 animate-pulse w-full text-slate-400 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-2" />
        Loading college details...
      </div>
    }>
      <CollegeDetailPageContent />
    </React.Suspense>
  );
}
