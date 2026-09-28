'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { getPlan } from '@/lib/auth';
import { PLANS, PLAN_MAP } from '@/lib/plans';
import { Card, CardTitle, Pill } from './DashUI';
import PlanPickerModal from './PlanPickerModal';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DashBilling() {
  const router = useRouter();
  const [d] = useDash();
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const planId = getPlan() || 'family';
  const plan   = PLANS.find((p) => p.id === planId) || PLANS[1];
  const PlanIcon = ICON_MAP[plan.iconKey] || Icons.Heart;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Billing</h1>

      {/* Current plan snapshot */}
      <Card>
        <CardTitle
          action={
            <Link
              href="/dashboard/subscription"
              className="text-xs text-navy/55 hover:text-navy flex items-center gap-1 transition"
            >
              Manage subscription
              <Icons.Arrow size={12} stroke={2} className="-rotate-90" />
            </Link>
          }
        >
          Current Plan
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/10 text-navy flex-shrink-0">
            <PlanIcon size={24} stroke={1.9} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-navy text-lg">{plan.name}</div>
            <div className="text-navy/55 text-sm">${plan.price.toFixed(2)}/month · {plan.errands} errands</div>
          </div>
          <button
            type="button"
            onClick={() => setShowPlanPicker(true)}
            className="text-xs text-navy/45 hover:text-navy border border-navy/12 rounded-lg px-3 py-1.5 transition"
          >
            See all plans
          </button>
        </div>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardTitle>Billing History</CardTitle>
        {d.invoices.length === 0 ? (
          <div className="py-8 text-center">
            <Icons.Doc size={28} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/45 text-sm">No invoices yet</div>
            <div className="text-navy/30 text-xs mt-1">Your receipts will appear here after each billing cycle.</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {d.invoices.map((inv) => {
              const invPlan = PLAN_MAP.get(inv.planId) ?? null;
              return (
                <div key={inv.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {invPlan && (
                      <div className="grid place-items-center w-8 h-8 rounded-lg bg-navy/5 text-navy flex-shrink-0">
                        {(() => { const I = ICON_MAP[invPlan.iconKey] || Icons.Briefcase; return <I size={16} stroke={1.8} />; })()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy truncate">
                        {invPlan ? invPlan.name : inv.id}
                      </div>
                      <div className="text-xs text-navy/45">{fmtDate(inv.date)} · {inv.cycle ?? 'Monthly'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-sm font-semibold text-navy">{inv.amount ?? (invPlan ? `$${invPlan.price.toFixed(2)}` : '—')}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">{inv.status}</span>
                    <button type="button" className="text-navy/35 hover:text-navy transition flex items-center gap-1 text-xs">
                      <Icons.Doc size={14} stroke={1.8} />
                      PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {showPlanPicker && (
        <PlanPickerModal
          currentPlanId={planId}
          onClose={() => setShowPlanPicker(false)}
          onSelect={(pid, cycle) => {
            setShowPlanPicker(false);
            router.push(`/checkout?planId=${pid}&billingCycle=${cycle}`);
          }}
        />
      )}
    </div>
  );
}
