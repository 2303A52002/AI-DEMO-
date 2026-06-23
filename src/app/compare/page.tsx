'use client';

import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCompare } from '@/frontend/hooks/useCompare';
import { CollegePicker } from '@/frontend/components/compare/CollegePicker';
import { CompareTable } from '@/frontend/components/compare/CompareTable';
import { Skeleton } from '@/frontend/components/ui/Skeleton';
import { Button } from '@/frontend/components/ui/Button';
import { CollegeWithRelations } from '@/shared/types';
import { GitCompare, Loader2, RefreshCw } from 'lucide-react';

function CompareClient() {
  const {
    comparedIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isMounted,
  } = useCompare();

  // Fetch complete details for compared colleges in a single query
  const { data: collegesList = [], isLoading } = useQuery<CollegeWithRelations[]>({
    queryKey: ['compare-details', comparedIds],
    queryFn: async () => {
      if (comparedIds.length === 0) return [];
      const res = await fetch(`/api/colleges?ids=${comparedIds.join(',')}&limit=5`);
      if (!res.ok) {
        throw new Error('Failed to fetch details for comparison');
      }
      const result = await res.json();
      return result.data || [];
    },
    enabled: isMounted && comparedIds.length > 0,
  });

  // Hydration safety check
  if (!isMounted) {
    return <CompareLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1 w-full">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-sky-400" />
            Compare Colleges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze up to 3 colleges side by side across fee modules, placement packages, ratings, and accreditation levels.
          </p>
        </div>

        {comparedIds.length > 0 && (
          <Button
            onClick={clearCompare}
            variant="outline"
            size="sm"
            className="border-slate-800 hover:bg-slate-900 font-bold shrink-0"
          >
            Clear Comparison
          </Button>
        )}
      </div>

      {/* College Picker Search Bar (only show if under 3 compared slots) */}
      <div className="w-full max-w-xl">
        {comparedIds.length < 3 ? (
          <div className="flex flex-col gap-2">
            <CollegePicker onSelect={addToCompare} excludeIds={comparedIds} />
            <span className="text-[10px] text-slate-500 font-semibold px-1">
              You can add <span className="text-sky-400 font-extrabold">{3 - comparedIds.length}</span> more college(s) to compare.
            </span>
          </div>
        ) : (
          <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl text-xs text-slate-500 font-semibold">
            Maximum slot capacity reached (3/3 colleges). Remove an institution to add another.
          </div>
        )}
      </div>

      {/* Table Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-4 py-12 justify-center items-center">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Loading comparison metrics...</span>
        </div>
      )}

      {/* Comparison Grid Matrix Table */}
      {!isLoading && (
        <div className="w-full mt-2 animate-slide-in">
          <CompareTable
            colleges={collegesList}
            onRemove={(id, name) => removeFromCompare(id, name)}
          />
        </div>
      )}
    </div>
  );
}

function CompareLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1 animate-pulse">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-12 w-1/2 rounded-xl" />
      <div className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoadingSkeleton />}>
      <CompareClient />
    </Suspense>
  );
}
