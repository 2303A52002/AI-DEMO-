'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, IndianRupee, Sparkles, ExternalLink } from 'lucide-react';
import { CollegeWithRelations } from '@/shared/types';
import { PredictResult } from '@/backend/lib/groq';
import { Card } from '@/frontend/components/ui/Card';
import { Badge } from '@/frontend/components/ui/Badge';

interface PredictResultCardProps {
  prediction: PredictResult;
  college: CollegeWithRelations;
}

export function PredictResultCard({ prediction, college }: PredictResultCardProps) {
  // Score color determinations
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 7) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <Card className="flex flex-col md:flex-row gap-6 p-6 bg-slate-900 border border-slate-800 hover:border-sky-500/20 transition-all duration-300">
      {/* College Image/Stats Column (Left) */}
      <div className="w-full md:w-1/4 flex flex-col gap-3">
        <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black tracking-wide border shadow-md ${getScoreColor(
                prediction.fitScore
              )}`}
            >
              Fit: {prediction.fitScore}/10
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Avg Fees</span>
            <span className="block text-[11px] font-bold text-slate-200 mt-0.5">
              ₹{(college.fees / 100000).toFixed(1)}L/yr
            </span>
          </div>
          <div className="bg-slate-950/40 border border-slate-850 p-2 rounded-xl">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Avg Salary</span>
            <span className="block text-[11px] font-bold text-emerald-400 mt-0.5">
              {college.placement?.avgSalary ? `${college.placement.avgSalary} LPA` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Counselor Justification Column (Right) */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {/* Header metadata */}
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">
              {college.accreditation}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">
                {college.location}, {college.state}
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/colleges/${college.slug}`} className="block focus:outline-none mt-1">
            <h4 className="text-md font-bold text-white leading-tight hover:text-sky-400 transition-colors">
              {college.name}
            </h4>
          </Link>

          {/* AI Reasoning Section */}
          <div className="mt-3 p-4 bg-slate-950/60 border border-slate-850 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Counselor\'s Analysis
              </span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              {prediction.reason}
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex justify-end gap-3 mt-4 border-t border-slate-850/60 pt-3">
          <Link
            href={`/colleges/${college.slug}`}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Visit College Details
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
export default PredictResultCard;
