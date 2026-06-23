import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
  formatValue?: (value: number) => string;
}

export function Slider({
  min,
  max,
  step = 50000,
  value,
  onChange,
  className = '',
  label,
  formatValue = (v) => v.toLocaleString('en-IN'),
}: SliderProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </span>
        )}
        <span className="text-sm font-bold text-sky-400">Up to ₹{formatValue(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
      />
      <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-semibold">
        <span>₹{formatValue(min)}</span>
        <span>₹{formatValue(max)}</span>
      </div>
    </div>
  );
}
export default Slider;
