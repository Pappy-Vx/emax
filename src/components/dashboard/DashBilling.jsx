'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';
import { PLANS, PLAN_MAP } from '@/lib/plans';
import { Card, CardTitle, Pill } from './DashUI';
import PlanPickerModal from './PlanPickerModal';
import { api } from '@/lib/api';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMethod(method = '') {
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashBilling() {
  const router = useRouter();
  const [sub, setSub]                   = useState(undefined); // undefined = loading
  const [history, setHistory]           = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  useEffect(() => {
    api.subscription.me()
      .then(setSub)
      .catch(() => setSub(null));

    api.payment.history()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  const plan    = sub ? PLAN_MAP.get(sub.planId) : null;
  const PlanIcon = plan ? (ICON_MAP[plan.iconKey] || Icons.Heart) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Billing</h1>

      {/* Current plan — only shown when there's an active subscription */}
      {sub === undefined ? (
        <Card>
          <div className="py-6 text-center text-navy/40 text-sm">Loading…</div>
        </Card>
      ) : sub ? (
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
              {PlanIcon && <PlanIcon size={24} stroke={1.9} />}
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-navy text-lg">{plan?.name ?? sub.planId}</div>
              <div className="text-navy/55 text-sm">
                ${plan ? plan.price.toFixed(2) : (sub.amountCents / 100).toFixed(2)}/{sub.billingCycle ?? 'month'} · {plan?.errands ?? '—'} errands
              </div>
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
      ) : (
        <Card>
          <div className="py-6 text-center">
            <Icons.Briefcase size={28} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm mb-3">No active subscription</div>
            <Link
              href="/checkout"
              className="inline-block px-5 py-2 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
            >
              Choose a plan
            </Link>
          </div>
        </Card>
      )}

      {/* Billing history */}
      <Card>
        <CardTitle>Billing History</CardTitle>
        {historyLoading ? (
          <div className="py-8 text-center text-navy/40 text-sm">Loading…</div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center">
            <Icons.Doc size={28} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/45 text-sm">No billing history yet</div>
            <div className="text-navy/30 text-xs mt-1">Your receipts will appear here after each payment.</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {history.map((p) => {
              const invPlan = PLAN_MAP.get(p.planId) ?? null;
              const I       = invPlan ? (ICON_MAP[invPlan.iconKey] || Icons.Briefcase) : Icons.Briefcase;
              const isPaid  = p.status === 'succeeded';
              return (
                <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid place-items-center w-8 h-8 rounded-lg bg-navy/5 text-navy flex-shrink-0">
                      <I size={16} stroke={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy truncate">
                        {invPlan ? invPlan.name : p.planId}
                      </div>
                      <div className="text-xs text-navy/45">
                        {fmtDate(p.createdAt)} · {fmtMethod(p.paymentMethod)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-sm font-semibold text-navy">
                      ${(p.amountCents / 100).toFixed(2)}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isPaid ? 'bg-green-50 text-green-700' : 'bg-navy/8 text-navy/55'
                    }`}>
                      {isPaid ? 'Paid' : p.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {showPlanPicker && (
        <PlanPickerModal
          currentPlanId={sub?.planId}
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
