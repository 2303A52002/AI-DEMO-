import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'dark';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const variants = {
    primary: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700/50',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    dark: 'bg-slate-950 text-slate-400 border-slate-900',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
}
export default Badge;
