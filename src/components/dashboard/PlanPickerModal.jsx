'use client';
import { useState } from 'react';
import Icons from '@/components/icons';
import { PLANS, yearlySavings } from '@/lib/plans';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

function fmt(n) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export default function PlanPickerModal({ onClose, onSelect, currentPlanId, currentCycle }) {
  const [cycle, setCycle] = useState(currentCycle || 'monthly');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-navy/8 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl z-10">
          <div>
            <h2 className="font-display font-bold text-navy text-lg">Choose a Plan</h2>
            <p className="text-navy/50 text-xs mt-0.5">All plans include same-day scheduling &amp; text updates</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 text-navy transition"
          >
            <Icons.X size={16} stroke={2} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-navy/6 border border-navy/10">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  cycle === 'monthly' ? 'bg-white text-navy shadow-sm' : 'text-navy/50 hover:text-navy'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  cycle === 'yearly' ? 'bg-white text-navy shadow-sm' : 'text-navy/50 hover:text-navy'
                }`}
              >
                Yearly
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-amber-700 font-bold">
                  2 months free
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          {PLANS.map((p) => {
            const PI = ICON_MAP[p.iconKey] || Icons.Briefcase;
            const price = cycle === 'yearly' ? p.yearlyPrice : p.price;
            const savings = yearlySavings(p.id);
            const isCurrentPlan = p.id === currentPlanId && cycle === (currentCycle || 'monthly');

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border-2 p-4 transition-all ${
                  p.popular
                    ? 'bg-navy text-white border-gold'
                    : 'bg-white text-navy border-navy/10'
                } ${isCurrentPlan ? 'opacity-60 cursor-default' : ''}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-gold text-navy text-[10px] font-bold uppercase tracking-wider">
                    Most popular
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className={`grid place-items-center w-10 h-10 rounded-xl flex-shrink-0 ${
                    p.popular ? 'bg-gold text-navy' : 'bg-navy/6 text-navy'
                  }`}>
                    <PI size={20} stroke={1.9} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-display font-bold text-base">{p.name}</div>
                        <div className={`text-xs ${p.popular ? 'text-white/60' : 'text-navy/50'}`}>{p.tagline}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display font-black text-2xl">{fmt(price)}</div>
                        <div className={`text-xs ${p.popular ? 'text-white/55' : 'text-navy/45'}`}>
                          /{cycle === 'yearly' ? 'yr' : 'mo'}
                        </div>
                        {cycle === 'yearly' && (
                          <div className="text-[10px] text-amber-500 font-semibold mt-0.5">
                            Save {fmt(savings)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`text-xs mt-1 mb-3 ${p.popular ? 'text-white/55' : 'text-navy/50'}`}>
                      {p.errands} errands · {p.for}
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-3">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className={`flex items-start gap-1.5 text-[12px] ${p.popular ? 'text-white/80' : 'text-navy/70'}`}>
                          <Icons.Check size={13} stroke={2.5} className="text-gold shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled={isCurrentPlan}
                      onClick={() => !isCurrentPlan && onSelect(p.id, cycle)}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isCurrentPlan
                          ? 'bg-navy/10 text-navy/40 cursor-default'
                          : p.popular
                            ? 'bg-gold text-navy hover:bg-gold-deep'
                            : 'bg-navy text-white hover:bg-navy-deep'
                      }`}
                    >
                      {isCurrentPlan ? 'Current plan' : `Choose ${p.name}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
