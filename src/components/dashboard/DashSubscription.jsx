'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';
import { useDashCtx } from '@/lib/dash-context';
import { getPlan } from '@/lib/auth';
import { PLANS, planPrice, yearlySavings } from '@/lib/plans';
import { api } from '@/lib/api';
import { Card, CardTitle } from './DashUI';

const ICON_MAP = { Briefcase: Icons.Briefcase, Heart: Icons.Heart, Building: Icons.Building };

const STATUS_STYLE = {
  active:    'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-500',
  expired:   'bg-navy/8 text-navy/50',
  past_due:  'bg-amber-50 text-amber-700',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtCents(c) {
  return `$${(c / 100).toFixed(2)}`;
}

// ── Downgrade blocked modal ──────────────────────────────────────────
function DowngradeBlockedModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
            <Icons.Arrow size={20} stroke={2} className="rotate-90" />
          </div>
          <h3 className="font-display font-bold text-navy text-lg">Can&apos;t downgrade here</h3>
        </div>
        <p className="text-navy/60 text-sm">
          Switching to a plan with fewer errands or from yearly to monthly billing isn&apos;t available
          from this screen. Our support team can help with downgrades and refunds.
        </p>
        <div className="flex gap-2">
          <Link
            href="/dashboard/support"
            className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-semibold text-sm text-center hover:bg-gold-deep transition"
          >
            Contact support
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cancel confirmation ──────────────────────────────────────────────
function CancelModal({ sub, onConfirm, onClose, busy }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <h3 className="font-display font-bold text-navy text-lg">Cancel subscription?</h3>
        <p className="text-navy/60 text-sm">
          Your plan will remain active until <strong>{fmtDate(sub?.currentPeriodEnd)}</strong>. You
          won&apos;t be charged again after that.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition disabled:opacity-50"
          >
            {busy ? 'Cancelling…' : 'Yes, cancel'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition"
          >
            Keep plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Plan card used in the "Change plan" section ──────────────────────
function PlanCard({ plan, currentRank, currentCycle, cycle, onSelect, busy }) {
  const PI = ICON_MAP[plan.iconKey] || Icons.Briefcase;
  const price = planPrice(plan.id, cycle);
  const savings = yearlySavings(plan.id);
  const isCurrent = plan.rank === currentRank && cycle === currentCycle;
  // upgrade: higher tier OR same tier monthly→yearly
  const isUpgrade =
    plan.rank > currentRank ||
    (plan.rank === currentRank && currentCycle === 'monthly' && cycle === 'yearly');
  const isDowngrade = !isCurrent && !isUpgrade;

  return (
    <div className={`relative rounded-2xl border-2 p-4 transition-all ${
      isCurrent
        ? 'border-gold bg-gold/5'
        : isDowngrade
          ? 'border-navy/8 bg-navy/2 opacity-60'
          : plan.popular
            ? 'border-navy/20 bg-navy text-white'
            : 'border-navy/12 bg-white'
    }`}>
      {isCurrent && (
        <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-gold text-navy text-[10px] font-bold uppercase tracking-wider">
          Current plan
        </span>
      )}
      {plan.popular && !isCurrent && (
        <span className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isDowngrade ? 'bg-navy/15 text-navy/50' : 'bg-gold text-navy'
        }`}>
          Most popular
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className={`grid place-items-center w-10 h-10 rounded-xl flex-shrink-0 ${
          isCurrent ? 'bg-gold text-navy' : plan.popular && !isDowngrade ? 'bg-gold text-navy' : 'bg-navy/8 text-navy'
        }`}>
          <PI size={20} stroke={1.9} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className={`font-display font-bold text-base ${plan.popular && !isCurrent && !isDowngrade ? 'text-white' : 'text-navy'}`}>
                {plan.name}
              </div>
              <div className={`text-xs ${plan.popular && !isCurrent && !isDowngrade ? 'text-white/55' : 'text-navy/45'}`}>
                {plan.tagline}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`font-display font-bold text-xl ${plan.popular && !isCurrent && !isDowngrade ? 'text-white' : 'text-navy'}`}>
                ${price.toFixed(2)}
              </div>
              <div className={`text-[10px] ${plan.popular && !isCurrent && !isDowngrade ? 'text-white/50' : 'text-navy/45'}`}>
                /{cycle === 'yearly' ? 'yr' : 'mo'}
              </div>
              {cycle === 'yearly' && (
                <div className="text-[10px] text-amber-500 font-semibold">Save ${savings.toFixed(2)}</div>
              )}
            </div>
          </div>

          <div className={`text-xs mt-1 mb-3 ${plan.popular && !isCurrent && !isDowngrade ? 'text-white/60' : 'text-navy/50'}`}>
            {plan.errands} errands/month · ${(plan.price / plan.errands).toFixed(2)} per errand
          </div>

          {isCurrent ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Icons.Check size={14} stroke={2.5} className="text-gold" />
              You&apos;re on this plan
            </div>
          ) : isDowngrade ? (
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-1.5 text-xs text-navy/45 hover:text-navy transition"
            >
              <Icons.Arrow size={12} stroke={2} className="rotate-90" />
              Contact support to downgrade
            </Link>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => onSelect(plan, cycle)}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                plan.popular
                  ? 'bg-gold text-navy hover:bg-gold-deep'
                  : 'bg-navy text-white hover:bg-navy-deep'
              }`}
            >
              {busy ? 'Loading…' : `Upgrade to ${plan.name}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function DashSubscription() {
  const { notify } = useDashCtx();
  const router = useRouter();

  const [sub, setSub]               = useState(undefined); // undefined = loading, null = no sub
  const [apiErr, setApiErr]         = useState(false);
  const [cycle, setCycle]           = useState('monthly');
  const [showDowngrade, setShowDowngrade] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [busy, setBusy]             = useState(false);
  const [err, setErr]               = useState('');

  // Plan from local auth store (fallback when backend is unreachable)
  const localPlanId = getPlan();
  const localPlan   = PLANS.find((p) => p.id === localPlanId);

  useEffect(() => {
    api.subscription.me()
      .then((data) => { setSub(data); if (data) setCycle(data.billingCycle ?? 'monthly'); })
      .catch(() => { setSub(null); setApiErr(true); });
  }, []);

  const loading = sub === undefined;
  const currentPlan = PLANS.find((p) => p.id === sub?.planId) ?? localPlan ?? null;
  const currentRank = currentPlan?.rank ?? 0;
  const currentCycle = sub?.billingCycle ?? 'monthly';

  // ── Upgrade: preview proration → checkout ─────────────────────────
  const requestSwitch = async (plan, selectedCycle) => {
    setErr('');
    setBusy(true);
    try {
      const result = await api.subscription.previewSwitch(plan.id, selectedCycle);
      const params = new URLSearchParams({
        switch:       'true',
        planId:       plan.id,
        billingCycle: selectedCycle,
        creditCents:  String(result.prorationCreditCents),
        chargeCents:  String(result.chargedCents),
      });
      router.push(`/checkout?${params.toString()}`);
    } catch (ex) {
      const raw = ex.message ?? '';
      try {
        const parsed = JSON.parse(raw);
        if (parsed.code === 'DOWNGRADE_NOT_ALLOWED') { setShowDowngrade(true); setBusy(false); return; }
      } catch { /* ignore parse error */ }
      setErr(raw || 'Could not calculate switch cost. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // ── New subscription → checkout ────────────────────────────────────
  const subscribeTo = (plan, selectedCycle) => {
    router.push(`/checkout?planId=${plan.id}&billingCycle=${selectedCycle}`);
  };

  // ── Cancel ─────────────────────────────────────────────────────────
  const confirmCancel = async () => {
    setBusy(true);
    try {
      const updated = await api.subscription.cancel();
      setSub(updated);
      setShowCancel(false);
      notify('Subscription cancelled. Active until ' + fmtDate(updated.currentPeriodEnd));
    } catch (ex) {
      setErr(ex.message ?? 'Could not cancel.');
    } finally {
      setBusy(false);
    }
  };

  // ── Auto-renew ─────────────────────────────────────────────────────
  const toggleAutoRenew = async () => {
    if (!sub) return;
    try {
      const updated = await api.subscription.toggleAutoRenew(!sub.autoRenew);
      setSub(updated);
      notify(updated.autoRenew ? 'Auto-renewal enabled.' : 'Auto-renewal disabled.');
    } catch (ex) {
      setErr(ex.message ?? 'Could not update auto-renewal.');
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="h-8 w-40 bg-navy/8 rounded-xl animate-pulse" />
        <div className="h-48 bg-white rounded-2xl border border-navy/8 animate-pulse" />
        <div className="h-96 bg-white rounded-2xl border border-navy/8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Subscription</h1>

      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <Icons.X size={15} stroke={2} className="shrink-0 mt-0.5" />
          {err}
        </div>
      )}

      {apiErr && !sub && (
        <div className="text-xs text-navy/45 bg-navy/5 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Icons.Clock size={14} stroke={1.8} />
          Live subscription data unavailable — showing local plan info.
        </div>
      )}

      {/* ── Current subscription (from backend) ── */}
      {sub && (
        <Card>
          <CardTitle>Current Plan</CardTitle>
          <div className="flex items-center gap-4 mb-4">
            {currentPlan && (
              <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/10 text-navy flex-shrink-0">
                {(() => { const I = ICON_MAP[currentPlan.iconKey] || Icons.Briefcase; return <I size={24} stroke={1.9} />; })()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-navy text-lg">{currentPlan?.name ?? sub.planId}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_STYLE[sub.status] ?? 'bg-navy/8 text-navy'}`}>
                  {sub.status}
                </span>
                {sub.cancelAtPeriodEnd && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-semibold">
                    Cancels {fmtDate(sub.currentPeriodEnd)}
                  </span>
                )}
              </div>
              <div className="text-navy/55 text-sm capitalize">
                {sub.billingCycle} billing · {fmtCents(sub.amountCents)}/{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}
              </div>
            </div>
          </div>

          {/* Period dates */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-navy/3 rounded-xl p-3">
              <div className="text-xs text-navy/45 font-semibold uppercase tracking-wide mb-1">Period start</div>
              <div className="text-sm font-semibold text-navy">{fmtDate(sub.currentPeriodStart)}</div>
            </div>
            <div className="bg-navy/3 rounded-xl p-3">
              <div className="text-xs text-navy/45 font-semibold uppercase tracking-wide mb-1">
                {sub.cancelAtPeriodEnd ? 'Ends on' : 'Next renewal'}
              </div>
              <div className="text-sm font-semibold text-navy">{fmtDate(sub.currentPeriodEnd)}</div>
            </div>
          </div>

          {/* Auto-renew toggle */}
          {!sub.cancelAtPeriodEnd && sub.status === 'active' && (
            <div className="flex items-center justify-between py-3 border-t border-navy/8">
              <div>
                <div className="text-sm font-semibold text-navy">Auto-renewal</div>
                <div className="text-xs text-navy/45">Renews 1 day before your plan expires</div>
              </div>
              <button
                type="button"
                onClick={toggleAutoRenew}
                className={`toggle${sub.autoRenew ? ' on' : ''}`}
                aria-pressed={sub.autoRenew}
              />
            </div>
          )}

          {/* Cancel */}
          {sub.status === 'active' && !sub.cancelAtPeriodEnd && (
            <div className="pt-3 border-t border-navy/8">
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
              >
                Cancel subscription
              </button>
            </div>
          )}
        </Card>
      )}

      {/* ── No subscription — show local plan if available ── */}
      {!sub && (
        <Card>
          {localPlan ? (
            <div className="flex items-center gap-4">
              {(() => { const I = ICON_MAP[localPlan.iconKey] || Icons.Briefcase; return (
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/10 text-navy flex-shrink-0">
                  <I size={24} stroke={1.9} />
                </div>
              ); })()}
              <div className="flex-1">
                <div className="font-display font-bold text-navy text-lg">{localPlan.name}</div>
                <div className="text-navy/55 text-sm">{localPlan.errands} errands/month · ${localPlan.price.toFixed(2)}/mo</div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">
                Not active
              </span>
            </div>
          ) : (
            <div className="py-6 text-center">
              <Icons.Briefcase size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
              <div className="font-semibold text-navy mb-1">No active subscription</div>
              <div className="text-navy/50 text-sm">Choose a plan below to get started.</div>
            </div>
          )}
        </Card>
      )}

      {/* ── Change / Choose Plan ── */}
      <Card>
        <CardTitle>
          {sub && sub.status === 'active' && !sub.cancelAtPeriodEnd ? 'Change Plan' : 'Choose a Plan'}
        </CardTitle>

        <p className="text-xs text-navy/50 mb-4">
          {sub && sub.status === 'active'
            ? 'Upgrade to a higher plan at any time — your remaining balance is prorated as a credit. Downgrading requires contacting support.'
            : 'Subscribe to a plan to get started. Cancel anytime.'}
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-navy/6 border border-navy/10 mb-4 w-fit">
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

        <div className="space-y-3">
          {PLANS.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              currentRank={currentRank}
              currentCycle={currentCycle}
              cycle={cycle}
              busy={busy}
              onSelect={(plan, selectedCycle) => {
                if (sub && sub.status === 'active') {
                  requestSwitch(plan, selectedCycle);
                } else {
                  subscribeTo(plan, selectedCycle);
                }
              }}
            />
          ))}
        </div>
      </Card>

      {/* ── Modals ── */}
      {showDowngrade && <DowngradeBlockedModal onClose={() => setShowDowngrade(false)} />}

      {showCancel && (
        <CancelModal
          sub={sub}
          onConfirm={confirmCancel}
          onClose={() => setShowCancel(false)}
          busy={busy}
        />
      )}
    </div>
  );
}
