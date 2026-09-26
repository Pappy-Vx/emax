'use client';
import { useRouter } from 'next/navigation';
import Icons from './icons';
import { PLANS } from '@/lib/plans';
import { setSelectedPlan } from '@/lib/auth';
import { getUser } from '@/lib/auth';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };
const PHONE = '(812) 565-9585';
const TEL = 'tel:+18125659585';

export default function PricingPage() {
  const router = useRouter();

  const choose = (planId) => {
    setSelectedPlan(planId);
    const user = getUser();
    router.push(user ? '/dashboard/billing' : '/login');
  };

  return (
    <main className="page-in">
      {/* Hero */}
      <section className="relative bg-navy text-white pt-[130px] pb-40 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-50 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em]">
            Monthly Plans
          </div>
          <h1 className="mt-6 font-display font-black text-[44px] sm:text-[64px] leading-[1.02]">
            Errands on repeat,{' '}
            <span className="text-gold">for less.</span>
          </h1>
          <p className="mt-6 text-lg text-white/75 max-w-xl mx-auto">
            Pick a monthly plan, book from your dashboard or by text, and we handle the rest. Cancel or pause anytime.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-cream pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-28 relative grid md:grid-cols-3 gap-5">
          {PLANS.map((p, i) => {
            const PlanIcon = ICON_MAP[p.iconKey] || Icons.Briefcase;
            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  p.popular
                    ? 'bg-navy text-white ring-4 ring-gold shadow-gold'
                    : 'bg-white text-navy border border-navy/8 shadow-card'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-gold text-navy text-[11px] font-bold uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <div
                  className={`grid place-items-center w-12 h-12 rounded-2xl ${
                    p.popular ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
                  }`}
                >
                  <PlanIcon size={24} stroke={1.9} />
                </div>
                <h3 className="mt-5 font-display font-bold text-2xl">{p.name}</h3>
                <p className={`text-sm ${p.popular ? 'text-white/65' : 'text-navy/60'}`}>{p.for}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display font-black text-5xl">${p.price}</span>
                  <span className={`mb-1.5 ${p.popular ? 'text-white/60' : 'text-navy/55'}`}>/month</span>
                </div>
                <p className={`text-sm mt-1 ${p.popular ? 'text-gold' : 'text-navy/60'}`}>
                  ≈ ${(p.price / p.errands).toFixed(2)} per errand · {p.errands} errands/month
                </p>
                <ul className="mt-6 flex flex-col gap-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px]">
                      <Icons.Check size={18} stroke={2.5} className="text-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => choose(p.id)}
                  className={`mt-8 w-full rounded-full py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                    p.popular
                      ? 'bg-gold text-navy hover:bg-gold-deep'
                      : 'bg-navy text-white hover:bg-navy-deep'
                  }`}
                >
                  Choose {p.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pay per errand */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-8">
          <div className="rounded-3xl bg-white border border-dashed border-navy/20 p-7 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-navy/55 font-semibold">No subscription needed</div>
              <h3 className="mt-1 font-display font-bold text-2xl text-navy">Pay per errand, from $9.99</h3>
              <p className="text-navy/65 mt-1">Price depends on distance and wait time. Call or text for a quick quote.</p>
            </div>
            <a
              href={TEL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy font-semibold shadow-gold hover:bg-gold-deep hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <Icons.Phone size={16} stroke={2.2} />
              Call or Text {PHONE}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
            {[
              ['Cancel or pause anytime', 'Clock'],
              ['Secure checkout with Stripe', 'Check'],
              ['Card or Apple Pay', 'Sparkle'],
            ].map(([label, iconKey]) => {
              const I = Icons[iconKey];
              return (
                <div key={label} className="flex items-center justify-center gap-2 text-navy/70 text-sm font-medium">
                  {I && <I size={18} stroke={2} className="text-gold" />}
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
