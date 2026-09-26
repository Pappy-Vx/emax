'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { getPlan, setPlan } from '@/lib/auth';
import { PLANS } from '@/lib/plans';
import { Card, CardTitle, Pill } from './DashUI';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

export default function DashBilling() {
  const { notify } = useDashCtx();
  const [d, up] = useDash();
  const [planId, setPlanId] = useState(getPlan() || 'family');
  const [confirm, setConfirm] = useState(null); // 'pause' | 'cancel'

  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];
  const PlanIcon = ICON_MAP[plan.iconKey] || Icons.Heart;

  const handleConfirm = (action) => {
    if (action === 'pause') {
      up((s) => ({ ...s, paused: true }));
      notify('Plan paused. You can resume anytime.');
    } else {
      up((s) => ({ ...s, cancelled: true }));
      notify('Plan cancelled. Active until end of billing period.');
    }
    setConfirm(null);
  };

  const changePlan = (id) => {
    setPlanId(id);
    setPlan(id);
    notify('Plan updated!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Billing</h1>

      {/* Current plan */}
      <Card>
        <CardTitle>Current Plan</CardTitle>
        <div className="flex items-center gap-4">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/10 text-navy flex-shrink-0">
            <PlanIcon size={24} stroke={1.9} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-navy text-lg">{plan.name}</div>
            <div className="text-navy/55 text-sm">${plan.price}/month · {plan.errands} errands</div>
            {d.paused && <div className="text-xs text-amber-600 font-semibold mt-1">⏸ Plan paused</div>}
            {d.cancelled && <div className="text-xs text-red-500 font-semibold mt-1">✕ Cancelled — active until next renewal</div>}
          </div>
        </div>
        {!d.paused && !d.cancelled && (
          <div className="flex gap-2 mt-5 pt-4 border-t border-navy/8">
            <button
              type="button"
              onClick={() => setConfirm('pause')}
              className="flex-1 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm font-medium hover:bg-navy/5 transition"
            >
              Pause plan
            </button>
            <button
              type="button"
              onClick={() => setConfirm('cancel')}
              className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
            >
              Cancel plan
            </button>
          </div>
        )}
        {d.paused && (
          <button
            type="button"
            onClick={() => { up((s) => ({ ...s, paused: false })); notify('Plan resumed!'); }}
            className="w-full mt-4 py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
          >
            Resume plan
          </button>
        )}
      </Card>

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display font-bold text-navy text-lg mb-2">
              {confirm === 'pause' ? 'Pause your plan?' : 'Cancel your plan?'}
            </h3>
            <p className="text-navy/55 text-sm mb-5">
              {confirm === 'pause'
                ? "Your errands will be paused and you won’t be charged next month. Resume anytime."
                : 'Your plan will remain active until the end of your billing period.'}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleConfirm(confirm)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${confirm === 'cancel' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gold text-navy hover:bg-gold-deep'}`}>
                {confirm === 'pause' ? 'Yes, pause' : 'Yes, cancel'}
              </button>
              <button type="button" onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition">
                Keep plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change plan */}
      <Card>
        <CardTitle>Change Plan</CardTitle>
        <div className="space-y-2">
          {PLANS.map((p) => {
            const PI = ICON_MAP[p.iconKey] || Icons.Briefcase;
            const active = p.id === planId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => changePlan(p.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition text-left ${active ? 'border-gold bg-gold/5' : 'border-navy/10 hover:border-navy/20'}`}
              >
                <PI size={18} stroke={1.9} className={active ? 'text-gold' : 'text-navy/50'} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy">{p.name}</div>
                  <div className="text-xs text-navy/45">{p.errands} errands · ${p.price}/month</div>
                </div>
                {active && <Icons.Check size={16} stroke={2.5} className="text-gold flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardTitle>Billing History</CardTitle>
        {d.invoices.length === 0 ? (
          <div className="py-6 text-center text-navy/40 text-sm">No invoices yet</div>
        ) : (
          <div className="divide-y divide-navy/6">
            {d.invoices.map((inv) => (
              <div key={inv.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-navy">{inv.id}</div>
                  <div className="text-xs text-navy/45">{inv.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">{inv.status}</span>
                  <button type="button" className="text-xs text-navy/45 hover:text-navy transition flex items-center gap-1">
                    <Icons.Doc size={14} stroke={1.8} />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
