'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useColleges } from '@/frontend/hooks/useColleges';
import { useSaved } from '@/frontend/hooks/useSaved';
import { useCompare } from '@/frontend/hooks/useCompare';
import { CollegeCard } from '@/frontend/components/college/CollegeCard';
import { CollegeFilters } from '@/frontend/components/college/CollegeFilters';
import { CollegeSearch } from '@/frontend/components/college/CollegeSearch';
import { Skeleton } from '@/frontend/components/ui/Skeleton';
import { GraduationCap, Sparkles, FilterX, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

function CollegesListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initialize Filters from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [rating, setRating] = useState(Number(searchParams.get('rating') || '0'));
  const [maxFees, setMaxFees] = useState(Number(searchParams.get('maxFees') || '2500000'));

  // 2. Synchronize filters with URL search params (prevents back-button losses)
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (state) params.set('state', state);
    if (rating) params.set('rating', rating.toString());
    if (maxFees < 2500000) params.set('maxFees', maxFees.toString());

    const url = `/colleges${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(url, { scroll: false });
  }, [search, state, rating, maxFees, router]);

  // 3. React Query & State hooks integration
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useColleges({
    search,
    state,
    rating: rating || undefined,
    maxFees,
    limit: 9, // Fetch 9 colleges at a time
  });

  const { isSaved: checkIsSaved, toggleSave } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const handleClearFilters = () => {
    setSearch('');
    setState('');
    setRating(0);
    setMaxFees(2500000);
  };

  const handleToggleCompare = (collegeId: string, name: string) => {
    if (isInCompare(collegeId)) {
      removeFromCompare(collegeId, name);
    } else {
      addToCompare(collegeId, name);
    }
  };

  // Flatten infinite scroll page outputs into a single array
  const collegesList = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Discover Colleges</h1>
          <p className="text-xs text-slate-500 mt-1">Explore over 50+ premier Indian universities, IITs, NITs, and B-schools.</p>
        </div>
        <div className="w-full">
          <CollegeSearch value={search} onSearch={setSearch} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Desktop Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <CollegeFilters
            state={state}
            setState={setState}
            rating={rating}
            setRating={setRating}
            maxFees={maxFees}
            setMaxFees={setMaxFees}
            onClear={handleClearFilters}
          />
        </div>

        {/* Right Side: Colleges Grid List */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          {/* Active Filters / Result Summary */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-900 pb-3">
            <span className="text-xs text-slate-400 font-semibold">
              Showing <span className="text-sky-400 font-extrabold">{collegesList.length}</span> of{' '}
              <span className="text-white font-extrabold">{totalCount}</span> colleges
            </span>
            {/* Mobile Filters Trigger Placeholder */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Scroll down for filters</span>
            </div>
          </div>

          {/* Skeletons/Error loading States */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-16 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8">
              <HelpCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
              <h4 className="text-sm font-bold text-slate-200">Failed to load colleges</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {error?.message || 'An unexpected error occurred while communicating with the database.'}
              </p>
            </div>
          )}

          {/* College Card Grid */}
          {!isLoading && collegesList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {collegesList.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isSaved={checkIsSaved(college.id)}
                  onToggleSave={(e) => {
                    e.stopPropagation();
                    toggleSave(college.id);
                  }}
                  isInCompare={isInCompare(college.id)}
                  onToggleCompare={(e) => {
                    e.stopPropagation();
                    handleToggleCompare(college.id, college.name);
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty Search States */}
          {!isLoading && collegesList.length === 0 && !isError && (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col items-center">
              <FilterX className="w-12 h-12 text-slate-500 mb-4" />
              <h4 className="text-md font-bold text-slate-200">No colleges match your criteria</h4>
              <p className="text-xs text-slate-550 mt-1 max-w-sm leading-relaxed">
                Try widening your search terms, raising your budget limits, or clearing state restrictions.
              </p>
              <Button onClick={handleClearFilters} variant="secondary" size="sm" className="mt-5">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Mobile Filter view helper */}
          <div className="block lg:hidden border-t border-slate-900 pt-8 mt-4">
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-4">Adjust Search Filters</h3>
            <CollegeFilters
              state={state}
              setState={setState}
              rating={rating}
              setRating={setRating}
              maxFees={maxFees}
              setMaxFees={setMaxFees}
              onClear={handleClearFilters}
            />
          </div>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div className="flex justify-center pt-8 border-t border-slate-905/60 mt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="md"
                className="w-full sm:w-auto hover:bg-slate-900 border-slate-800"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading More...
                  </>
                ) : (
                  'Load More Colleges'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollegesLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1 animate-pulse">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-14 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Skeleton className="h-96 rounded-2xl" />
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegesLoadingFallback />}>
      <CollegesListClient />
    </Suspense>
  );
}
