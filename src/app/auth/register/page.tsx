'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/shared/validators';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { useToast } from '@/frontend/components/ui/Toast';
import { GraduationCap, UserPlus, AlertCircle } from 'lucide-react';

function RegisterPageContent() {
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
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    setServerError('');

    try {
      // 1. Submit details to Registration API
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const registerResult = await registerRes.json().catch(() => ({}));

      if (!registerRes.ok) {
        throw new Error(registerResult.error || 'Failed to register account.');
      }

      // 2. Perform immediate auto-login on successful registration
      const loginRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        // Registration succeeded, but login failed. Redirect to login to sign in manually
        success('Account Created', 'Registration successful! Please log in to your new account.');
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        success('Account Created', 'Registration successful! You are now logged in.');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || 'An unexpected error occurred during signup.');
      errorToast('Registration Failed', err.message || 'Validation errors or database conflicts.');
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
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Create a new account</h2>
        <p className="text-xs text-slate-500 mt-1">Get started to discover, compare, and bookmark colleges.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-2xl">
        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="bg-rose-500/5 border border-rose-500/15 p-3.5 rounded-xl flex items-start gap-2 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            placeholder="Rahul Sharma"
            error={errors.name?.message}
            disabled={submitting}
            {...register('name')}
          />

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
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            disabled={submitting}
            {...register('password')}
          />

          <Button type="submit" variant="primary" size="md" isLoading={submitting} className="w-full mt-2 font-bold">
            Register and Sign In
          </Button>
        </form>

        {/* Redirect Links */}
        <p className="text-center text-xs text-slate-500 font-medium mt-2">
          Already have an account?{' '}
          <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-md w-full mx-auto px-4 py-16 flex flex-col gap-6 flex-grow justify-center items-center text-slate-400 font-semibold text-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mb-2"></div>
        Loading registration...
      </div>
    }>
      <RegisterPageContent />
    </React.Suspense>
  );
}
