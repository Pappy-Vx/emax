'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icons from '@/components/icons';
import { signIn, signUp, verifyOtp, resendOtp, getSelectedPlan } from '@/lib/auth';
import { api } from '@/lib/api';
import { PLANS } from '@/lib/plans';
import BeeLoader from '@/components/ui/BeeLoader';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

function PlanSide({ planId: propPlanId }) {
  const planId = propPlanId || getSelectedPlan();
  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];
  const PlanIcon = ICON_MAP[plan.iconKey] || Icons.Heart;
  return (
    <div className="relative h-full min-h-[320px] flex flex-col justify-between p-8 lg:p-12 overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 hex-pattern opacity-40 pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="relative">
        <Link href="/" className="flex items-center gap-2.5 mb-12">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold text-navy">
            <span className="font-display font-black text-xl leading-none">e</span>
          </div>
          <div className="leading-tight">
            <div className="font-display font-black text-white text-lg tracking-tight">eMax</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gold/90 font-semibold">Errands &amp; More</div>
          </div>
        </Link>
        <div className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-2">Your selected plan</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold text-navy">
            <PlanIcon size={20} stroke={1.9} />
          </div>
          <div>
            <div className="font-display font-bold text-xl">{plan.name}</div>
            <div className="text-white/60 text-sm">${plan.price.toFixed(2)}/month · {plan.errands} errands</div>
          </div>
        </div>
        <ul className="space-y-2.5 mt-6">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/80">
              <Icons.Check size={16} stroke={2.5} className="text-gold shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-8">
        <Link href="/pricing" className="text-white/55 text-sm hover:text-white transition flex items-center gap-1">
          <Icons.ChevLeft size={14} stroke={2} />
          Back to pricing
        </Link>
      </div>
    </div>
  );
}

// ── OTP screen ────────────────────────────────────────────────────
function OtpScreen({ email, onVerify, onBack }) {
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setErr('Please enter the 6-digit code.'); return; }
    setErr('');
    setBusy(true);
    try {
      await onVerify(otp);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <BeeLoader show={busy} message="Verifying code…" />
      <button onClick={onBack} type="button" className="flex items-center gap-1 text-navy/50 text-sm mb-8 hover:text-navy transition">
        <Icons.ChevLeft size={14} stroke={2} /> Back
      </button>
      <div className="w-12 h-12 grid place-items-center rounded-xl bg-gold text-navy mx-0 mb-5">
        <Icons.Mail size={22} stroke={1.8} />
      </div>
      <h1 className="font-display font-black text-navy text-3xl mb-1">Check your email</h1>
      <p className="text-navy/55 text-[15px] mb-8">
        We sent a 6-digit code to <strong className="text-navy">{email}</strong>. It expires in 10 minutes.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="field text-center text-2xl tracking-[0.4em] font-bold"
            autoFocus
            required
          />
        </div>

        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || otp.length !== 6}
          className="w-full rounded-full py-3.5 bg-gold text-navy font-semibold hover:bg-gold-deep transition disabled:opacity-60"
        >
          {busy ? 'Verifying…' : 'Verify code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-navy/55">
        {resent ? (
          <span className="text-green-600 font-medium">Code resent!</span>
        ) : (
          <>
            Did not receive it?{' '}
            <button type="button" onClick={handleResend} className="text-navy font-semibold hover:text-gold transition">
              Resend code
            </button>
          </>
        )}
      </p>
    </div>
  );
}

// ── Main login / signup form ──────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const planIdFromRedirect = (() => {
    if (!redirectTo) return null;
    try { return new URL(redirectTo, 'https://x.com').searchParams.get('planId'); } catch { return null; }
  })();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // OTP step
  const [otpEmail, setOtpEmail] = useState('');
  const [otpMode, setOtpMode] = useState(false);

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const afterLogin = (user) =>
    router.push(redirectTo ?? (user?.planId ? '/dashboard' : '/checkout'));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const res = await signIn({ email: form.email, password: form.password });
        if (res.otpRequired) {
          setOtpEmail(form.email);
          setOtpMode(true);
        } else {
          afterLogin(res.user);
        }
      } else {
        // signup always returns { otpRequired: true }
        await signUp({ name: form.name, email: form.email, password: form.password });
        setOtpEmail(form.email);
        setOtpMode(true);
      }
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    const res = await verifyOtp(otpEmail, otp);
    afterLogin(res.user);
  };

  return (
    <div className="min-h-screen flex">
      <BeeLoader
        show={busy}
        message={mode === 'login' ? 'Signing you in…' : 'Creating your account…'}
      />
      {/* Left: plan panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-shrink-0">
        <PlanSide planId={planIdFromRedirect} />
      </div>

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center px-5 py-16 bg-cream">
        {otpMode ? (
          <OtpScreen
            email={otpEmail}
            onVerify={handleOtpVerify}
            onBack={() => { setOtpMode(false); setErr(''); }}
          />
        ) : (
          <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex items-center gap-2.5">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold text-navy">
                <span className="font-display font-black text-xl leading-none">e</span>
              </div>
              <div className="leading-tight">
                <div className="font-display font-black text-navy text-lg tracking-tight">eMax</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-navy/60 font-semibold">Errands &amp; More</div>
              </div>
            </div>

            <h1 className="font-display font-black text-navy text-3xl mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-navy/55 text-[15px] mb-8">
              {mode === 'login'
                ? 'Sign in to manage your errands.'
                : 'Sign up to get started with your plan.'}
            </p>

            {/* Google OAuth button — real browser redirect to backend */}
            <a
              href={api.auth.googleUrl()}
              className="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl border-2 border-navy/12 bg-white hover:bg-navy/3 text-navy font-semibold text-[15px] transition mb-5"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </a>

            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-navy/10" />
              <span className="text-xs text-navy/40 font-medium">or</span>
              <div className="flex-1 h-px bg-navy/10" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Full name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={set('name')}
                    required
                    className="field"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                  className="field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    required
                    minLength={8}
                    className="field pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-navy/35 hover:text-navy transition"
                    tabIndex={-1}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <Icons.EyeOff size={18} stroke={1.8} /> : <Icons.Eye size={18} stroke={1.8} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-navy/45 mt-1.5">
                    Must be at least 8 characters with an uppercase letter, lowercase letter, and a number.
                  </p>
                )}
              </div>

              {err && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full py-3.5 bg-gold text-navy font-semibold hover:bg-gold-deep transition disabled:opacity-60 mt-2"
              >
                {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-navy/55">
              {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); }}
                className="text-navy font-semibold hover:text-gold transition"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
