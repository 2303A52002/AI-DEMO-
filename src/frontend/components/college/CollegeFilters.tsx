'use client';

import React from 'react';
import { Slider } from '@/frontend/components/ui/Slider';
import { Star, RotateCcw, Filter, MapPin } from 'lucide-react';

interface CollegeFiltersProps {
  state: string;
  setState: (state: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  maxFees: number;
  setMaxFees: (fees: number) => void;
  onClear: () => void;
}

const INDIAN_STATES = [
  'Bihar',
  'Chandigarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Meghalaya',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export function CollegeFilters({
  state,
  setState,
  rating,
  setRating,
  maxFees,
  setMaxFees,
  onClear,
}: CollegeFiltersProps) {
  const hasActiveFilters = state !== '' || rating > 0 || maxFees < 2500000;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-max flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* State Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          Location (State)
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
        >
          <option value="">All States</option>
          {INDIAN_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Slider Filter */}
      <div className="flex flex-col gap-2">
        <Slider
          min={50000}
          max={2500000}
          step={50000}
          value={maxFees}
          onChange={setMaxFees}
          label="Max Annual Fees"
        />
      </div>

      {/* Rating Filter */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Rating</label>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((stars) => (
            <button
              key={stars}
              onClick={() => setRating(stars)}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                rating === stars
                  ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {stars === 0 ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <span>{stars}+</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default CollegeFilters;
