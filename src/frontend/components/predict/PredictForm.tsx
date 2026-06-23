'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictSchema, PredictInput } from '@/shared/validators';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Sparkles, HelpCircle, MapPin, Compass, GraduationCap } from 'lucide-react';

interface PredictFormProps {
  onSubmit: (data: PredictInput) => void;
  isLoading: boolean;
}

const EXAMS = ['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE'] as const;

export function PredictForm({ onSubmit, isLoading }: PredictFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PredictInput>({
    resolver: zodResolver(predictSchema),
    defaultValues: {
      exam: 'JEE Main',
      rank: undefined,
      location: '',
      branch: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-850">
        <span className="p-1.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
          <Sparkles className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-bold text-white text-md">AI Admission Predictor</h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Powered by Groq Llama 3 Admissions Intelligence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Exam Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            Competitive Exam
          </label>
          <select
            {...register('exam')}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.8 text-xs text-white outline-none focus:ring-4 focus:ring-sky-500/10 transition-all cursor-pointer"
          >
            {EXAMS.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
          {errors.exam && <p className="text-xs text-rose-450 mt-1">{errors.exam.message}</p>}
        </div>

        {/* Student Rank */}
        <Input
          label="Your Rank / Percentile"
          type="number"
          placeholder="e.g. 1500"
          error={errors.rank?.message}
          disabled={isLoading}
          {...register('rank', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Location Preference */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-355 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Location Preference (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Karnataka, or North India"
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-805 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.8 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
            {...register('location')}
          />
          {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location.message}</p>}
        </div>

        {/* Branch Preference */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-355 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            Preferred Branch / Course (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Computer Science, MBA, MBBS"
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-805 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.8 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
            {...register('branch')}
          />
          {errors.branch && <p className="text-xs text-rose-400 mt-1">{errors.branch.message}</p>}
        </div>
      </div>

      {/* Info Tip */}
      <div className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-850 p-4 rounded-xl text-xs text-slate-450 leading-normal">
        <HelpCircle className="w-4.5 h-4.5 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>
          Our counselor algorithm cross-references your rank with placement metrics, fees, and geographical location parameters across our database, returning structured options parsed through LLM analysis.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full md:w-auto">
          Predict Recommendations
        </Button>
      </div>
    </form>
  );
}
export default PredictForm;
