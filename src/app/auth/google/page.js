'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applySession, setToken } from '@/lib/auth';
import { api } from '@/lib/api';

function GoogleCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        // Store token first so api.users.me() picks it up via getStoredToken()
        setToken(token);

        // Fetch full user profile with the new token
        const user = await api.users.me();
        applySession({ access_token: token, user });

        // If user has no plan yet → checkout, otherwise → dashboard
        router.replace(user.planId ? '/dashboard' : '/checkout');
      } catch {
        setMessage('Something went wrong. Redirecting you back…');
        setTimeout(() => router.replace('/login'), 1500);
      }
    })();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gold text-navy mx-auto mb-5">
          <span className="font-display font-black text-2xl leading-none">e</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-navy/60 text-sm">
          <svg className="animate-spin w-4 h-4 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          {message}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallback />
    </Suspense>
  );
}
