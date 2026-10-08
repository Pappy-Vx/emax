'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icons from '@/components/icons';
import { PLANS, planPrice, yearlySavings } from '@/lib/plans';
import { getSelectedPlan, setSelectedPlan, setPlan, getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { ApplePayButton, GooglePayButton, cardBrand, fmtCard, fmtExp } from '@/components/dashboard/DashUI';
import { useGooglePay } from '@/lib/use-google-pay';
import PaymentResultModal from '@/components/PaymentResultModal';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

// ── Payment method selector ──────────────────────────────────────
function MethodTab({ id, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-xs font-semibold ${
        active
          ? 'border-gold bg-gold/5 text-navy'
          : 'border-navy/10 bg-white text-navy/55 hover:border-navy/20 hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

// ── Stripe card-brand pill icons ─────────────────────────────────
function CardBrandLogos() {
  return (
    <div className="flex items-center gap-1.5">
      {/* Visa */}
      <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded border border-navy/10">
        <rect width="34" height="22" rx="3" fill="white"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1A1F71" fontSize="8" fontWeight="bold" fontFamily="Arial,sans-serif">VISA</text>
      </svg>
      {/* Mastercard */}
      <svg width="34" height="22" viewBox="0 0 34 22" xmlns="http://www.w3.org/2000/svg" className="rounded border border-navy/10">
        <rect width="34" height="22" rx="3" fill="white"/>
        <circle cx="13" cy="11" r="6.5" fill="#EB001B"/>
        <circle cx="21" cy="11" r="6.5" fill="#F79E1B"/>
        <path d="M17 5.9a6.5 6.5 0 010 10.2A6.5 6.5 0 0117 5.9z" fill="#FF5F00"/>
      </svg>
      {/* Amex */}
      <svg width="34" height="22" viewBox="0 0 34 22" xmlns="http://www.w3.org/2000/svg" className="rounded border border-navy/10">
        <rect width="34" height="22" rx="3" fill="#2E77BC"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial,sans-serif">AMEX</text>
      </svg>
    </div>
  );
}

export default function CheckoutPage() {
  const router        = useRouter();
  const params        = useSearchParams();

  // When coming from /dashboard/subscription, these are pre-filled
  const switchMode    = params.get('switch') === 'true';
  const errandSingle  = params.get('errand') === 'single';
  const paramPlanId   = errandSingle ? 'single_errand' : params.get('planId');
  const paramCycle    = params.get('billingCycle');
  const paramCredit   = parseInt(params.get('creditCents') ?? '0', 10);
  const paramCharge   = parseInt(params.get('chargeCents') ?? '0', 10);

  const [selectedId, setSelectedId_local] = useState(
    () => paramPlanId || getSelectedPlan() || PLANS.find(p => p.id === 'family').id,
  );
  const [billingCycle, setBillingCycle] = useState(paramCycle || 'monthly');
  const [payMethod, setPayMethod] = useState('card');
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [state, setState] = useState('idle'); // idle | processing | done | failed
  const [err, setErr]   = useState('');
  const [failMsg, setFailMsg] = useState('');

  const plan      = PLANS.find((p) => p.id === selectedId) || PLANS[1];
  // In switch mode the charge amount was pre-calculated by the backend (proration applied)
  const price     = switchMode && paramCharge > 0
    ? paramCharge / 100
    : planPrice(plan.id, billingCycle);
  const savings   = yearlySavings(plan.id);
  const brand     = cardBrand(card.number);
  const { ready: gpayReady, requestPayment: gpayRequest } = useGooglePay();

  const setC = (k) => (e) => setCard((s) => ({ ...s, [k]: e.target.value }));
  const setNumber = (e) => setCard((s) => ({ ...s, number: fmtCard(e.target.value) }));
  const setExp = (e) => setCard((s) => ({ ...s, exp: fmtExp(e.target.value) }));

  const choosePlan = (id) => {
    setSelectedId_local(id);
    setSelectedPlan(id);
  };

  const guardUser = () => {
    const user = getUser();
    if (!user) { router.push('/login'); return null; }
    return user;
  };

  const handleSuccess = (planId) => {
    setPlan(planId);
    setState('done');
  };

  const handleFailure = (msg) => {
    setFailMsg(msg || 'Something went wrong. Please try again.');
    setState('failed');
  };

  // ── Core charge dispatcher ───────────────────────────────────────
  const processCharge = async (paymentPayload) => {
    if (switchMode) {
      return api.subscription.switch(selectedId, billingCycle);
    }
    return api.payment.process({ ...paymentPayload, planId: selectedId, billingCycle: errandSingle ? 'monthly' : billingCycle });
  };

  // ── Card payment ─────────────────────────────────────────────────
  const submitCard = async (e) => {
    e.preventDefault();
    if (!guardUser()) return;
    setErr('');
    setState('processing');
    try {
      await processCharge({
        paymentMethod:  'card',
        cardNumber:     card.number.replace(/\s/g, ''),
        cardExpiry:     card.exp.replace(/\s/g, ''),
        cardCvv:        card.cvc,
        cardholderName: card.name,
      });
      handleSuccess(selectedId);
    } catch (ex) {
      handleFailure(ex.message);
    }
  };

  // ── Google Pay ────────────────────────────────────────────────────
  const submitGooglePay = async () => {
    if (!guardUser()) return;
    setErr('');
    setState('processing');
    try {
      const token = await gpayRequest({ amountCents: price * 100 });
      await processCharge({ paymentMethod: 'google_pay', paymentToken: token });
      handleSuccess(selectedId);
    } catch (ex) {
      if (ex?.statusCode === 'CANCELED') { setState('idle'); return; }
      handleFailure(ex.message ?? 'Google Pay failed. Please try another method.');
    }
  };

  // ── Apple Pay (stub) ─────────────────────────────────────────────
  const submitApplePay = async () => {
    if (!guardUser()) return;
    setErr('');
    setState('processing');
    try {
      await processCharge({ paymentMethod: 'apple_pay', paymentToken: 'apple_pay_stub_token' });
      handleSuccess(selectedId);
    } catch (ex) {
      handleFailure(ex.message);
    }
  };

  if (state === 'done') {
    return (
      <PaymentResultModal
        type="success"
        title={errandSingle ? 'Errand unlocked!' : switchMode ? 'Plan switched!' : 'You are all set!'}
        message={
          errandSingle
            ? 'Your single errand has been paid. Heading to your dashboard to schedule it…'
            : switchMode
            ? `You are now on the ${plan.name} plan (${billingCycle}). Taking you to your dashboard…`
            : `Your ${plan.name} plan is active. Taking you to your dashboard…`
        }
        redirectTo="/dashboard"
        redirectMs={3000}
      />
    );
  }

  if (state === 'failed') {
    return (
      <PaymentResultModal
        type="failure"
        title="Payment failed"
        message={failMsg}
        redirectMs={0}
        onClose={() => setState('idle')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream page-in">
      {/* Header */}
      <div className="bg-white border-b border-navy/8 px-5 py-4 flex items-center gap-3">
        <Link
          href={errandSingle ? '/dashboard' : switchMode ? '/dashboard/subscription' : '/pricing'}
          className="flex items-center gap-1 text-navy/55 hover:text-navy text-sm font-medium transition"
        >
          <Icons.ChevLeft size={16} stroke={2} />
          {errandSingle ? 'Dashboard' : switchMode ? 'Subscription' : 'Pricing'}
        </Link>
        <div className="flex-1 text-center font-display font-bold text-navy text-base">
          {errandSingle ? 'Buy a single errand' : switchMode ? 'Switch plan' : 'Complete your order'}
        </div>
        <div className="w-16" />
      </div>

      {/* Switch mode proration banner */}
      {switchMode && paramCredit > 0 && (
        <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2 text-sm text-green-700">
          <Icons.Check size={16} stroke={2.5} />
          <span>
            <strong>${(paramCredit / 100).toFixed(2)}</strong> prorated credit from your current plan applied.
            You&apos;ll be charged <strong>${(paramCharge / 100).toFixed(2)}</strong> today.
          </span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-5 py-10 grid lg:grid-cols-2 gap-8">
        {/* Left: order summary (fixed when plan pre-selected) or plan picker */}
        <div>
          {paramPlanId ? (
            /* ── Fixed plan — show summary only ── */
            <>
              <h2 className="font-display font-bold text-navy text-xl mb-4">Order Summary</h2>
              <div className="bg-white rounded-2xl border border-navy/8 overflow-hidden">
                {/* Plan header */}
                <div className="p-5 border-b border-navy/8 flex items-center gap-4">
                  <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gold text-navy flex-shrink-0">
                    {(() => { const PI = ICON_MAP[plan.iconKey] || Icons.Briefcase; return <PI size={22} stroke={1.9} />; })()}
                  </div>
                  <div>
                    <div className="font-display font-bold text-navy text-lg">{plan.name}</div>
                    <div className="text-navy/55 text-sm">
                      {errandSingle ? 'One-time charge · No subscription' : `${plan.errands} errands/month · ${plan.tagline}`}
                    </div>
                  </div>
                </div>
                {/* Features */}
                <ul className="p-5 space-y-2.5 border-b border-navy/8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-navy/70">
                      <Icons.Check size={14} stroke={2.5} className="text-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Totals */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-navy/60">{plan.name} plan</span>
                    <span className="font-semibold text-navy">${planPrice(plan.id, billingCycle).toFixed(2)}</span>
                  </div>
                  {!errandSingle && (
                    <div className="flex items-center justify-between text-[14px] pb-3 border-b border-navy/8">
                      <span className="text-navy/60">Billing</span>
                      <span className="text-navy capitalize">{billingCycle}</span>
                    </div>
                  )}
                  {billingCycle === 'yearly' && savings > 0 && (
                    <div className="flex items-center justify-between text-[13px] pb-3 border-b border-navy/8 text-green-600 font-semibold">
                      <span>Yearly savings</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  {switchMode && paramCredit > 0 && (
                    <div className="flex items-center justify-between text-[13px] pb-3 border-b border-navy/8 text-green-600 font-semibold">
                      <span>Prorated credit</span>
                      <span>-${(paramCredit / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-display font-bold text-navy text-lg pt-1">
                    <span>Total today</span>
                    <span>${price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-navy/40">
                    {errandSingle ? 'One-time charge — schedule your errand after payment.' : 'Cancel or pause anytime from your dashboard.'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* ── No plan pre-selected — show picker ── */
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy text-xl">Choose a plan</h2>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-navy/5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg transition ${billingCycle === 'monthly' ? 'bg-white shadow text-navy' : 'text-navy/55 hover:text-navy'}`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white shadow text-navy' : 'text-navy/55 hover:text-navy'}`}
                  >
                    Yearly
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold text-navy font-bold">-17%</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {PLANS.filter((p) => p.id !== 'single_errand').map((p) => {
                  const PI = ICON_MAP[p.iconKey] || Icons.Briefcase;
                  const active = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => choosePlan(p.id)}
                      className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        active ? 'border-gold bg-gold/5 shadow-gold' : 'border-navy/10 bg-white hover:border-navy/20'
                      }`}
                    >
                      <div className={`grid place-items-center w-10 h-10 rounded-xl flex-shrink-0 ${active ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'}`}>
                        <PI size={20} stroke={1.9} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-navy text-sm flex items-center gap-2">
                          {p.name}
                          {p.popular && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-amber-700 font-semibold">Popular</span>}
                        </div>
                        <div className="text-navy/55 text-xs">{p.errands} errands/month</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display font-bold text-navy text-lg">
                          ${(billingCycle === 'yearly' ? p.yearlyPrice : p.price).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-navy/45">{billingCycle === 'yearly' ? '/yr' : '/mo'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 bg-white rounded-2xl border border-navy/8 p-5">
                <div className="flex items-center justify-between text-[15px] mb-2">
                  <span className="text-navy/60">{plan.name} plan</span>
                  <span className="font-semibold text-navy">${price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[15px] mb-3 pb-3 border-b border-navy/8">
                  <span className="text-navy/60">Billing</span>
                  <span className="text-navy capitalize">{billingCycle}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="flex items-center justify-between text-[13px] mb-3 pb-3 border-b border-navy/8 text-green-600 font-semibold">
                    <span>You save</span>
                    <span>${savings.toFixed(2)} vs monthly</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-display font-bold text-navy text-lg">
                  <span>Total today</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs text-navy/40">Cancel or pause anytime from your dashboard.</p>
              </div>
            </>
          )}
        </div>

        {/* Payment section */}
        <div>
          <h2 className="font-display font-bold text-navy text-xl mb-4">Payment</h2>
          <div className="bg-white rounded-2xl border border-navy/8 p-6 space-y-5">

            {/* ── Method selector ── */}
            <div>
              <p className="text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-2">Payment method</p>
              <div className="flex gap-2">
                {/* Card / Stripe */}
                <MethodTab id="card" active={payMethod === 'card'} onClick={setPayMethod}>
                  <img src="/stripepay.png" alt="Stripe" className="h-5 w-auto object-contain" />
                  Card
                </MethodTab>

                {/* Google Pay */}
                <MethodTab id="google_pay" active={payMethod === 'google_pay'} onClick={setPayMethod}>
                  <img src="/googlepay.png" alt="Google Pay" className="h-5 w-auto object-contain" />
                  Google Pay
                </MethodTab>

                {/* Apple Pay */}
                <MethodTab id="apple_pay" active={payMethod === 'apple_pay'} onClick={setPayMethod}>
                  <img src="/applepay.png" alt="Apple Pay" className="h-5 w-auto object-contain" />
                  Apple Pay
                </MethodTab>
              </div>
            </div>

            {/* ── Card form ── */}
            {payMethod === 'card' && (
              <form onSubmit={submitCard} className="space-y-4">
                <div className="flex items-center justify-between">
                  <img src="/stripepay.png" alt="Stripe" className="h-6 w-auto object-contain opacity-70" />
                  <CardBrandLogos />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Name on card</label>
                  <input type="text" placeholder="Jane Smith" value={card.name} onChange={setC('name')} required className="field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">
                    Card number
                    {brand && <span className="ml-2 normal-case font-semibold text-navy/70">{brand}</span>}
                  </label>
                  <input
                    type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
                    value={card.number} onChange={setNumber} required maxLength={19}
                    className="field font-mono tracking-widest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Expiry</label>
                    <input type="text" inputMode="numeric" placeholder="MM / YY" value={card.exp} onChange={setExp} required maxLength={7} className="field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">CVC</label>
                    <input type="text" inputMode="numeric" placeholder="000" value={card.cvc} onChange={setC('cvc')} required maxLength={4} className="field" />
                  </div>
                </div>

                {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>}

                <button
                  type="submit"
                  disabled={state === 'processing'}
                  className="w-full rounded-full py-3.5 bg-gold text-navy font-semibold hover:bg-gold-deep transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {state === 'processing' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>Subscribe · ${price}/{billingCycle === 'yearly' ? 'yr' : 'mo'}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-navy/40">
                  <Icons.Check size={14} stroke={2} className="text-navy/30" />
                  SSL encrypted · Stripe secured
                </div>
              </form>
            )}

            {/* ── Google Pay ── */}
            {payMethod === 'google_pay' && (
              <div className="space-y-3">
                {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>}
                {gpayReady ? (
                  <>
                    <GooglePayButton
                      onClick={submitGooglePay}
                      disabled={state === 'processing'}
                    />
                    <p className="text-xs text-center text-navy/40">
                      {state === 'processing' ? 'Processing…' : 'A payment sheet will open to confirm.'}
                    </p>
                  </>
                ) : (
                  <div className="py-6 text-center text-sm text-navy/50 bg-navy/3 rounded-xl">
                    Google Pay is not available on this device or browser.
                    <br />
                    <span className="text-xs text-navy/40">Try Chrome on Android or desktop.</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Apple Pay ── */}
            {payMethod === 'apple_pay' && (
              <div className="space-y-3">
                {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>}
                <ApplePayButton
                  onClick={submitApplePay}
                  disabled={state === 'processing'}
                />
                <p className="text-xs text-center text-navy/40">
                  {state === 'processing' ? 'Processing…' : 'Confirm via Touch ID or Face ID.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
