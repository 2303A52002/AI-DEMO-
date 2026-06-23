'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, GraduationCap, MapPin } from 'lucide-react';
import { CollegeWithRelations } from '@/shared/types';
import { useToast } from '@/frontend/components/ui/Toast';

interface CollegePickerProps {
  onSelect: (collegeId: string, name: string) => void;
  excludeIds: string[];
  placeholder?: string;
}

export function CollegePicker({ onSelect, excludeIds, placeholder = 'Search and add college to compare...' }: CollegePickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CollegeWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { error } = useToast();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search recommendations based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(query)}&limit=5`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error(err);
        error('Search Error', 'Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, error]);

  const handleSelect = (college: CollegeWithRelations) => {
    if (excludeIds.includes(college.id)) {
      error('Already Added', `${college.name} is already in comparison.`);
      return;
    }
    onSelect(college.id, college.name);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
        />
      </div>

      {/* Floating Suggestions Panel */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-xs text-slate-500 font-semibold animate-pulse">
              Searching available colleges...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">No matching colleges found</div>
          )}

          {!loading &&
            results.map((college) => {
              const isExcluded = excludeIds.includes(college.id);
              return (
                <button
                  key={college.id}
                  onClick={() => !isExcluded && handleSelect(college)}
                  disabled={isExcluded}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors border-b border-slate-850 last:border-b-0 hover:bg-slate-850 cursor-pointer ${
                    isExcluded ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="p-1 bg-slate-950 rounded-lg text-slate-500 flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-250 truncate">{college.name}</h5>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {college.location}, {college.state}
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-bold bg-sky-500/5 px-2 py-0.5 border border-sky-500/10 rounded-md">
                    {isExcluded ? 'Added' : 'Select'}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
export default CollegePicker;
