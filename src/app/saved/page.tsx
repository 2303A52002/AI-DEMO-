'use client';

import React from 'react';
import { useSaved } from '@/frontend/hooks/useSaved';
import { useCompare } from '@/frontend/hooks/useCompare';
import { CollegeCard } from '@/frontend/components/college/CollegeCard';
import { Skeleton } from '@/frontend/components/ui/Skeleton';
import { Heart, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SavedPageContent() {
  const { savedList = [], isLoading, toggleSave, isSaved } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const handleToggleCompare = (collegeId: string, name: string) => {
    if (isInCompare(collegeId)) {
      removeFromCompare(collegeId, name);
    } else {
      addToCompare(collegeId, name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-grow w-full">
      {/* Page Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          Bookmarked Colleges
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your personal directory. Quick-reference saved colleges for placements, fees, and admissions comparison.
        </p>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="flex flex-col gap-4 items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Loading bookmarked colleges...</span>
        </div>
      )}

      {/* College Cards Grid */}
      {!isLoading && savedList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
          {savedList.map((item) => {
            const college = item.college;
            if (!college) return null; // safety check
            
            return (
              <CollegeCard
                key={college.id}
                college={college}
                isSaved={isSaved(college.id)}
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
            );
          })}
        </div>
      )}

      {/* Empty Bookmarks State */}
      {!isLoading && savedList.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto flex flex-col items-center animate-fade-in">
          <Heart className="w-12 h-12 text-slate-700 mb-4" />
          <h4 className="text-sm font-bold text-slate-200">No bookmarked colleges</h4>
          <p className="text-xs text-slate-550 mt-1 max-w-xs leading-relaxed">
            Your saved colleges will appear here. Start browsing the directory and click the heart icon on any card to bookmark.
          </p>
          <Link
            href="/colleges"
            className="bg-sky-500 hover:bg-sky-600 border border-sky-400/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 mt-6 cursor-pointer"
          >
            Explore Colleges
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SavedPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4 items-center justify-center py-20 flex-grow w-full text-slate-400">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-2" />
        Loading bookmarks page...
      </div>
    }>
      <SavedPageContent />
    </React.Suspense>
  );
}
