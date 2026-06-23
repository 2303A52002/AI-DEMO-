import React from 'react';
import Link from 'next/link';
import { prisma } from '@/backend/lib/prisma';
import { GraduationCap, GitCompare, BrainCircuit, Star, ArrowRight, Compass, Users, CheckCircle } from 'lucide-react';
import { Badge } from '@/frontend/components/ui/Badge';

export const revalidate = 3600; // Cache page for 1 hour

async function getTopColleges() {
  try {
    return await prisma.college.findMany({
      take: 3,
      orderBy: { rating: 'desc' },
      include: {
        placement: true,
      },
    });
  } catch (err) {
    console.error('Failed to load top colleges for landing page:', err);
    return [];
  }
}

export default async function LandingPage() {
  const topColleges = await getTopColleges();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-[#070b13] to-[#070b13]">
        {/* Background glow grids */}
        <div className="absolute top-0 inset-x-0 h-96 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          <Badge variant="primary" className="mb-4 text-xs font-bold tracking-wider py-1 px-3 bg-sky-500/5 border border-sky-500/20">
            ✨ India\'s Premier College Discovery Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
            Empowering Higher Education Choices with <span className="text-sky-400">CampusIQ</span>
          </h1>
          
          <p className="mt-5 text-sm md:text-md text-slate-400 max-w-2xl leading-relaxed">
            Discover premier Indian colleges, analyze placement reports, perform side-by-side comparison matrix reviews, and receive AI-driven admission recommendations based on your exam rank.
          </p>

          {/* Quick Search Form */}
          <form
            action="/colleges"
            method="GET"
            className="mt-8 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl"
          >
            <input
              type="text"
              name="search"
              placeholder="Search by college name, city, state, or branch..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 outline-none w-full"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 border border-sky-400/20 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Search Colleges
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-16 pt-8 border-t border-slate-905/60">
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">50+</span>
              <span className="block text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Premium Institutes</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">200+</span>
              <span className="block text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Specialized Courses</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">100%</span>
              <span className="block text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Verified Placements</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-white">10k+</span>
              <span className="block text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Aspirants Guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Features Highlights */}
      <section className="py-16 bg-slate-950/30 border-y border-slate-905/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Platform Capabilities</h2>
            <p className="text-xs text-slate-500 mt-2">Engineered to deliver information-dense, data-backed admissions planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: College Listings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/20 transition-all group">
              <div>
                <span className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl inline-block mb-4">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Explore Colleges</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Filter list databases by Indian states, fee caps, and star ratings using cursor-based infinite queries and full-text keyword searches.
                </p>
              </div>
              <Link href="/colleges" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                Find Colleges
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: College Compare */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/20 transition-all group">
              <div>
                <span className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl inline-block mb-4">
                  <GitCompare className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Side-by-Side Compare</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Match up to 3 colleges at once across parameters including placement records, course packages, ratings, and locations.
                </p>
              </div>
              <Link href="/compare" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                Compare Matrix
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: Predictor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/20 transition-all group">
              <div>
                <span className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl inline-block mb-4">
                  <BrainCircuit className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">AI Predictor</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Input competitive exam ranks (JEE Main, Advanced, NEET, CAT, GATE) to retrieve matching recommendations verified by LLM reasoning.
                </p>
              </div>
              <Link href="/predict" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                Predict Match
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top Rated Colleges Grid */}
      {topColleges.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Top Rated Institutions</h2>
              <p className="text-xs text-slate-500 mt-1">High student rating aggregates in academic reviews and placements.</p>
            </div>
            <Link
              href="/colleges"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 shrink-0"
            >
              View All 50+ Colleges
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topColleges.map((college) => (
              <div
                key={college.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/50 hover:shadow-xl hover:shadow-sky-500/2 transition-all flex flex-col h-full"
              >
                <div className="relative aspect-video">
                  <img
                    src={college.imageUrl}
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/90 border border-slate-805 px-2 py-0.5 rounded-lg text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-white">{college.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                      {college.accreditation}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mt-1">{college.name}</h4>
                    <p className="text-[11px] text-slate-450 line-clamp-2 mt-2 leading-relaxed">
                      {college.description}
                    </p>
                  </div>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="w-full text-center text-xs font-bold bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white py-2 rounded-xl transition-all"
                  >
                    View Admissions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
