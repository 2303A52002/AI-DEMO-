'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface CollegeSearchProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function CollegeSearch({ value, onSearch, placeholder = 'Search by college name, city, state, or course...' }: CollegeSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  // Synchronize local input state with outer parent state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative flex items-center">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm rounded-2xl pl-11 pr-10 py-3.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
export default CollegeSearch;
