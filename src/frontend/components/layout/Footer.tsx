import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="p-1 bg-sky-500/10 rounded-lg border border-sky-500/20 text-sky-400">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-md font-extrabold text-white tracking-wider uppercase">
                Campus<span className="text-sky-400">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mt-2">
              Discover, compare, and get AI-powered recommendations for premier Indian colleges. Accelerating admissions planning with modern full-stack discovery solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Discovery</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-white transition-colors">
                  Find Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Colleges
                </Link>
              </li>
              <li>
                <Link href="/predict" className="hover:text-white transition-colors">
                  AI Predictor Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Meta */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Tech Stack</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built using Next.js 14, React 19, TypeScript, TailwindCSS, Prisma ORM, PostgreSQL, NextAuth.js, and Groq Llama 3 API.
            </p>
          </div>
        </div>

        <hr className="border-slate-900 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CampusIQ MVP. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
