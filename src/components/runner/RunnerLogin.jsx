'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { applyRunnerSession, getRunnerUser } from '@/lib/auth';

export default function RunnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.otpRequired) { setErr('2FA not supported for runner login.'); return; }
      applyRunnerSession(res);
      const user = getRunnerUser();
      if (user?.role !== 'runner') {
        setErr('Access denied. Runner credentials required.');
        return;
      }
      router.replace('/runner/errands');
    } catch (e) {
      setErr(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="font-display font-black text-navy text-2xl mb-1">Runner Portal</h1>
        <p className="text-navy/50 text-sm mb-7">Sign in with your runner account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/25"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/60 mb-1.5">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/25"
            />
          </div>

          {err && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">{err}</p>}

          <button
            type="submit" disabled={loading}
            className="mt-2 w-full bg-gold text-navy rounded-full py-3 font-semibold text-sm hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
