'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icons from '@/components/icons';
import { PLANS } from '@/lib/plans';
import { getSelectedPlan, setSelectedPlan, setPlan, getUser } from '@/lib/auth';
import { ApplePayButton, cardBrand, fmtCard, fmtExp } from '@/components/dashboard/DashUI';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedId, setSelectedId_local] = useState(getSelectedPlan);
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '', zip: '' });
  const [state, setState] = useState('idle'); // idle | processing | done
  const [err, setErr] = useState('');

  const plan = PLANS.find((p) => p.id === selectedId) || PLANS[1];
  const PlanIcon = ICON_MAP[plan.iconKey] || Icons.Heart;
  const brand = cardBrand(card.number);

  const setC = (k) => (e) => setCard((s) => ({ ...s, [k]: e.target.value }));
  const setNumber = (e) => setCard((s) => ({ ...s, number: fmtCard(e.target.value) }));
  const setExp = (e) => setCard((s) => ({ ...s, exp: fmtExp(e.target.value) }));

  const choosePlan = (id) => {
    setSelectedId_local(id);
    setSelectedPlan(id);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setState('processing');
    await new Promise((r) => setTimeout(r, 1800)); // simulate Stripe
    // TODO: replace with real Stripe charge
    const user = getUser();
    if (!user) { router.push('/login'); return; }
    setPlan(selectedId);
    setState('done');
    setTimeout(() => router.push('/dashboard'), 2200);
  };

  if (state === 'done') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl shadow-card p-10 text-center max-w-sm w-full">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto mb-5">
            <Icons.Check size={32} stroke={2.5} />
          </div>
          <h2 className="font-display font-bold text-navy text-2xl mb-2">You're all set!</h2>
          <p className="text-navy/60 text-[15px]">Your {plan.name} plan is active. Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream page-in">
      {/* Header */}
      <div className="bg-white border-b border-navy/8 px-5 py-4 flex items-center gap-3">
        <Link href="/pricing" className="flex items-center gap-1 text-navy/55 hover:text-navy text-sm font-medium transition">
          <Icons.ChevLeft size={16} stroke={2} />
          Pricing
        </Link>
        <div className="flex-1 text-center font-display font-bold text-navy text-base">Complete your order</div>
        <div className="w-16" />
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 grid lg:grid-cols-2 gap-8">
        {/* Plan picker */}
        <div>
          <h2 className="font-display font-bold text-navy text-xl mb-4">Choose a plan</h2>
          <div className="space-y-3">
            {PLANS.map((p) => {
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
                  <div className="font-display font-bold text-navy text-lg flex-shrink-0">${p.price}</div>
                </button>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="mt-6 bg-white rounded-2xl border border-navy/8 p-5">
            <div className="flex items-center justify-between text-[15px] mb-2">
              <span className="text-navy/60">{plan.name} plan</span>
              <span className="font-semibold text-navy">${plan.price}.00</span>
            </div>
            <div className="flex items-center justify-between text-[15px] mb-3 pb-3 border-b border-navy/8">
              <span className="text-navy/60">Billing</span>
              <span className="text-navy">Monthly</span>
            </div>
            <div className="flex items-center justify-between font-display font-bold text-navy text-lg">
              <span>Total today</span>
              <span>${plan.price}.00</span>
            </div>
            <p className="mt-2 text-xs text-navy/40">Cancel or pause anytime from your dashboard.</p>
          </div>
        </div>

        {/* Payment form */}
        <div>
          <h2 className="font-display font-bold text-navy text-xl mb-4">Payment</h2>
          <div className="bg-white rounded-2xl border border-navy/8 p-6 space-y-4">
            <ApplePayButton onClick={submit} />
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-navy/10" />
              <span className="text-xs text-navy/40 font-medium">or pay with card</span>
              <div className="flex-1 h-px bg-navy/10" />
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={setNumber}
                  required
                  maxLength={19}
                  className="field font-mono tracking-widest"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">Expiry</label>
                  <input type="text" inputMode="numeric" placeholder="MM / YY" value={card.exp} onChange={setExp} required maxLength={7} className="field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">CVC</label>
                  <input type="text" inputMode="numeric" placeholder="000" value={card.cvc} onChange={setC('cvc')} required maxLength={4} className="field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">ZIP</label>
                  <input type="text" inputMode="numeric" placeholder="46201" value={card.zip} onChange={setC('zip')} required maxLength={5} className="field" />
                </div>
              </div>

              {err && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>
              )}

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
                  <>Subscribe · ${plan.price}/month</>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-navy/40 mt-1">
                <Icons.Check size={14} stroke={2} className="text-navy/30" />
                Secured by Stripe · SSL encrypted
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
