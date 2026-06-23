'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, IndianRupee, GitCompare, ExternalLink } from 'lucide-react';
import { CollegeWithRelations } from '@/shared/types';
import { Badge } from '@/frontend/components/ui/Badge';
import { Card } from '@/frontend/components/ui/Card';

interface CollegeCardProps {
  college: CollegeWithRelations;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  isInCompare: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
}

export function CollegeCard({
  college,
  isSaved,
  onToggleSave,
  isInCompare,
  onToggleCompare,
}: CollegeCardProps) {
  const isTopRanked = college.rating >= 4.7;

  return (
    <Card className="group relative flex flex-col h-full bg-slate-900 border border-slate-800 hover:border-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
      {/* College Image Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={college.imageUrl}
          alt={college.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback image if unsplash link expires
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600';
          }}
        />
        {/* Gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Floating Top Rank Badge */}
        {isTopRanked && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning" className="shadow-lg shadow-amber-500/10">
              Top Ranked
            </Badge>
          </div>
        )}

        {/* Save Toggle (Heart) */}
        <button
          onClick={onToggleSave}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            isSaved
              ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-950/40 border-white/10 text-white hover:bg-slate-950/80 hover:scale-105'
          }`}
          title={isSaved ? 'Remove Bookmark' : 'Save College'}
        >
          <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* College Card Details */}
      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
            {college.accreditation}
          </Badge>
          {college.established && (
            <span className="text-[10px] text-slate-500 font-semibold">Est. {college.established}</span>
          )}
        </div>

        <Link href={`/colleges/${college.slug}`} className="block focus:outline-none">
          <h4 className="text-md font-bold text-white leading-snug group-hover:text-sky-400 transition-colors line-clamp-2">
            {college.name}
          </h4>
        </Link>

        {/* Location & Star Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">
              {college.location}, {college.state}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-850 px-2 py-0.5 rounded-lg w-max flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-extrabold text-white">{college.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Course Fee and Placements */}
        <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg Fees</span>
            <div className="flex items-center text-xs font-bold text-slate-200 mt-0.5">
              <IndianRupee className="w-3 h-3 text-slate-400" />
              <span>₹{college.fees.toLocaleString('en-IN')}/yr</span>
            </div>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg Salary</span>
            <span className="block text-xs font-bold text-emerald-400 mt-0.5">
              {college.placement?.avgSalary ? `${college.placement.avgSalary} LPA` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Compare Trigger and Detail Redirect */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-850">
          <button
            onClick={onToggleCompare}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              isInCompare
                ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/10'
                : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
          </button>

          <Link
            href={`/colleges/${college.slug}`}
            className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
export default CollegeCard;
