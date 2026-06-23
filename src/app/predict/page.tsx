'use client';

import React, { useState } from 'react';
import { PredictForm } from '@/frontend/components/predict/PredictForm';
import { PredictResultCard } from '@/frontend/components/predict/PredictResultCard';
import { Skeleton } from '@/frontend/components/ui/Skeleton';
import { useToast } from '@/frontend/components/ui/Toast';
import { PredictInput } from '@/shared/validators';
import { PredictResult } from '@/backend/lib/groq';
import { CollegeWithRelations } from '@/shared/types';
import { Sparkles, BrainCircuit, AlertTriangle, ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictResult[]>([]);
  const [colleges, setColleges] = useState<CollegeWithRelations[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const { success, error: errorToast } = useToast();

  const handlePredict = async (data: PredictInput) => {
    setIsLoading(true);
    setErrorMsg('');
    setPredictions([]);
    setColleges([]);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Prediction request failed');
      }

      const recs = (result.recommendations || []) as PredictResult[];
      const cols = (result.colleges || []) as CollegeWithRelations[];

      setPredictions(recs);
      setColleges(cols);

      if (recs.length === 0) {
        success('Counselling Complete', 'No direct matches found in database for this criteria. Try adjusting rank constraints.');
      } else {
        success('Predictions Loaded', `Found ${recs.length} personalized recommendations!`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during matching.');
      errorToast('Prediction Failed', err.message || 'An error occurred during matching.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-grow w-full">
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-sky-400" />
          AI College Predictor
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Predict your admissions odds. Enter competitive examination scores to receive real-time recommendations.
        </p>
      </div>

      {/* Predict Form */}
      <div className="animate-slide-in">
        <PredictForm onSubmit={handlePredict} isLoading={isLoading} />
      </div>

      {/* Error Output */}
      {errorMsg && (
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">Matching Error</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeletons Section */}
      {isLoading && (
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <LoaderIcon className="w-4 h-4 text-sky-500 animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              AI counselor analyzing options...
            </span>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
              <Skeleton className="w-full md:w-1/4 aspect-video md:aspect-[4/3]" />
              <div className="flex-grow flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Rendering Section */}
      {!isLoading && predictions.length > 0 && (
        <div className="flex flex-col gap-6 animate-slide-in">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
            <Sparkles className="w-4.5 h-4.5 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Personalized Recommendations ({predictions.length})
            </h3>
          </div>

          <div className="flex flex-col gap-6">
            {predictions.map((pred) => {
              const matchedCollege = colleges.find((c) => c.id === pred.collegeId);
              if (!matchedCollege) return null; // safety check
              return (
                <PredictResultCard
                  key={pred.collegeId}
                  prediction={pred}
                  college={matchedCollege}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty Welcome State */}
      {!isLoading && predictions.length === 0 && !errorMsg && (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto flex flex-col items-center">
          <GraduationCap className="w-12 h-12 text-slate-500 mb-4" />
          <h4 className="text-sm font-bold text-slate-200">Start Admission Predictor</h4>
          <p className="text-xs text-slate-550 mt-1 max-w-xs leading-relaxed">
            Fill out the score profile above to let the counselor AI generate matching colleges.
          </p>
          <Link
            href="/colleges"
            className="text-xs font-bold text-sky-400 hover:text-sky-300 mt-5 flex items-center gap-1 group"
          >
            Explore Directory Instead
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
