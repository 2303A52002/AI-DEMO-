'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, GraduationCap, GitCompare, BrainCircuit, Heart, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/colleges', label: 'Find Colleges', icon: GraduationCap },
    { href: '/compare', label: 'Compare', icon: GitCompare },
    { href: '/predict', label: 'AI Predictor', icon: BrainCircuit },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
                <GraduationCap className="w-6 h-6" />
              </span>
              <span className="text-lg font-black text-white tracking-wider uppercase">
                Campus<span className="text-sky-400">IQ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'text-sky-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Auth State */}
          <div className="hidden md:flex items-center gap-4">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-6 h-6 rounded-full border border-sky-500/30"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                      <User className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span className="font-semibold text-xs max-w-[100px] truncate">
                    {session.user.name || 'Student'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                    <Link
                      href="/saved"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-850 hover:text-white"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Bookmarks
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-850 hover:text-white cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-sky-500 hover:bg-sky-600 border border-sky-400/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 p-4 flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-sm font-semibold py-2 px-3 rounded-lg ${
                  isActive(link.href)
                    ? 'bg-sky-500/10 text-sky-400'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <hr className="border-slate-900 my-1" />
          {session?.user ? (
            <>
              <Link
                href="/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-semibold text-slate-400 hover:text-white py-2 px-3"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Bookmarks
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex w-full items-center gap-3 text-sm font-semibold text-slate-400 hover:text-white py-2 px-3 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-semibold text-slate-400 hover:text-white py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-bold bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl border border-sky-400/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
