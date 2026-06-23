'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/shared/validators';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { useToast } from '@/frontend/components/ui/Toast';
import { GraduationCap, AlertCircle } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: errorToast } = useToast();
  
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    setServerError('');

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res) {
        throw new Error('Authentication service did not respond.');
      }

      if (res.error) {
        // NextAuth returns generic error strings. Translate to student-friendly comments
        if (res.error.includes('password') || res.error.includes('credentials') || res.error.includes('No user found')) {
          setServerError('Invalid email address or password. Please verify and try again.');
        } else {
          setServerError(res.error);
        }
        errorToast('Sign In Failed', 'Invalid credentials or validation issues.');
      } else {
        success('Welcome back!', 'You have successfully signed in.');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16 flex flex-col gap-6 flex-grow justify-center">
      {/* Header Branding */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
          <span className="p-1.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
            <GraduationCap className="w-7 h-7" />
          </span>
          <span className="text-xl font-black text-white tracking-wider uppercase">
            Campus<span className="text-sky-400">IQ</span>
          </span>
        </Link>
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-1">Access your saved colleges, submit reviews, and use predictor tools.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-2xl">
        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="bg-rose-500/5 border border-rose-500/15 p-3.5 rounded-xl flex items-start gap-2 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="student@campusiq.com"
            error={errors.email?.message}
            disabled={submitting}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={submitting}
            {...register('password')}
          />

          <Button type="submit" variant="primary" size="md" isLoading={submitting} className="w-full mt-2 font-bold">
            Sign In with Credentials
          </Button>
        </form>


        {/* Redirect Links */}
        <p className="text-center text-xs text-slate-500 font-medium mt-2">
          New to CampusIQ?{' '}
          <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-sky-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-md w-full mx-auto px-4 py-16 flex flex-col gap-6 flex-grow justify-center items-center text-slate-400 font-semibold text-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mb-2"></div>
        Loading credentials form...
      </div>
    }>
      <LoginPageContent />
    </React.Suspense>
  );
}
