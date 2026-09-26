'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { getUser, getPlan } from '@/lib/auth';
import { PLANS } from '@/lib/plans';
import { Card, CardTitle, Pill, SvcIcon } from './DashUI';

const STEPS = ['Requested', 'Confirmed', 'Picked up', 'On the way', 'Delivered'];
const STATUS_STEP = { scheduled: 0, confirmed: 1, 'on-the-way': 3, completed: 4 };

function stepIndex(status) {
  return STATUS_STEP[status] ?? 0;
}

const HIVE_NEXT = 500;
const HIVE_TIER = 'Busy Bee';

export default function DashHome() {
  const router = useRouter();
  const { openRequest } = useDashCtx();
  const [d] = useDash();
  const user = getUser();
  const planId = getPlan() || 'family';
  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];

  const upcoming = d.errands.filter((e) => ['scheduled', 'confirmed', 'on-the-way'].includes(e.status));
  const recent   = d.errands.filter((e) => e.status === 'completed').slice(0, 4);
  const active   = upcoming.find((e) => e.status === 'on-the-way') || upcoming[0];

  const usedErrands = d.errands.filter((e) => e.status === 'completed').length;
  const usedThisMonth = Math.min(usedErrands, plan.errands);
  const usagePercent = Math.round((usedThisMonth / plan.errands) * 100);

  const renewIn = 14; // placeholder days until renewal

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Plan hero */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-navy text-gold flex-shrink-0">
            <Icons.Bee size={30} stroke={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-navy text-lg">{plan.name} Plan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-amber-700 font-semibold">{plan.errands} errands/month</span>
            </div>
            <div className="text-navy/55 text-sm mb-3">
              {usedThisMonth} of {plan.errands} errands used · renews in {renewIn} days
            </div>
            <div className="w-full bg-navy/8 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-navy/40 mt-1.5">
              <span>{usedThisMonth} used</span>
              <span>{plan.errands - usedThisMonth} remaining</span>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="hidden sm:flex items-center gap-1 text-sm text-navy/55 hover:text-navy transition flex-shrink-0"
          >
            Manage plan
            <Icons.Arrow size={14} stroke={2} />
          </Link>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Hive Rewards */}
        <Card>
          <CardTitle
            action={
              <Link href="/dashboard/refer" className="text-xs text-gold font-semibold hover:underline">
                Earn more →
              </Link>
            }
          >
            🐝 Hive Rewards
          </CardTitle>
          <div className="flex items-end gap-1 mb-1">
            <span className="font-display font-black text-navy text-4xl">{d.points}</span>
            <span className="text-navy/55 text-sm mb-1.5">pts</span>
          </div>
          <div className="text-navy/55 text-sm mb-3">{HIVE_TIER} · next reward at {HIVE_NEXT} pts</div>
          <div className="w-full bg-navy/8 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${Math.min((d.points / HIVE_NEXT) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-navy/40 mt-1.5">{HIVE_NEXT - d.points} pts to next reward</div>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'New Errand',   icon: 'Plus',    action: openRequest },
              { label: 'Repeat Last',  icon: 'Repeat',  action: openRequest },
              { label: 'Schedule',     icon: 'Calendar',action: openRequest },
              { label: 'Refer Friend', icon: 'Gift',    href: '/dashboard/refer' },
            ].map(({ label, icon, action, href }) => {
              const I = Icons[icon] || Icons.Plus;
              const inner = (
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-navy/3 hover:bg-navy/8 transition cursor-pointer text-center">
                  <I size={20} stroke={1.8} className="text-gold" />
                  <span className="text-xs font-medium text-navy">{label}</span>
                </div>
              );
              if (href) return <Link key={label} href={href}>{inner}</Link>;
              return <div key={label} onClick={action}>{inner}</div>;
            })}
          </div>
        </Card>
      </div>

      {/* Active errand tracker */}
      {active && (
        <Card>
          <CardTitle
            action={
              <Link href="/dashboard/errands" className="text-xs text-gold font-semibold hover:underline">
                View all →
              </Link>
            }
          >
            Active Errand #{active.id}
          </CardTitle>
          <div className="flex items-center gap-3 mb-5">
            <SvcIcon type={active.type} />
            <div>
              <div className="font-semibold text-navy text-sm">{active.type}</div>
              <div className="text-navy/55 text-xs">{active.from} → {active.to}</div>
              <div className="text-navy/40 text-xs mt-0.5">{active.when}</div>
            </div>
            <div className="ml-auto"><Pill status={active.status} /></div>
          </div>

          {/* 5-step tracker */}
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-navy/8" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-gold transition-all duration-500"
              style={{ width: `${(stepIndex(active.status) / (STEPS.length - 1)) * (100 - (8 / (STEPS.length * 2 - 1) * 100))}%` }}
            />
            <div className="relative flex justify-between">
              {STEPS.map((step, i) => {
                const cur = stepIndex(active.status);
                const done = i < cur;
                const isCur = i === cur;
                return (
                  <div key={step} className="flex flex-col items-center gap-2 text-center" style={{ width: `${100 / STEPS.length}%` }}>
                    <div
                      className={`w-8 h-8 rounded-full border-2 grid place-items-center text-xs font-bold z-10 transition-all ${
                        done ? 'bg-gold border-gold text-navy'
                          : isCur ? 'bg-white border-gold text-gold ring-2 ring-gold/30'
                          : 'bg-white border-navy/15 text-navy/30'
                      }`}
                    >
                      {done ? <Icons.Check size={14} stroke={2.5} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium leading-tight hidden sm:block ${isCur ? 'text-navy' : done ? 'text-navy/60' : 'text-navy/30'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {active.runner && (
            <div className="mt-4 pt-4 border-t border-navy/8 flex items-center gap-2 text-sm text-navy/60">
              <div className="grid place-items-center w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex-shrink-0">
                {active.runner[0]}
              </div>
              <span><strong className="text-navy">{active.runner}</strong> is your runner today</span>
            </div>
          )}
        </Card>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card>
          <CardTitle
            action={
              <Link href="/dashboard/errands" className="text-xs text-gold font-semibold hover:underline">
                View all →
              </Link>
            }
          >
            Upcoming Errands
          </CardTitle>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <SvcIcon type={e.type} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy">{e.type}</div>
                  <div className="text-xs text-navy/50">{e.when}</div>
                </div>
                <Pill status={e.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent errands */}
      {recent.length > 0 && (
        <Card>
          <CardTitle>Recent Errands</CardTitle>
          <div className="space-y-3">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <SvcIcon type={e.type} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy">{e.type}</div>
                  <div className="text-xs text-navy/50">{e.when}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill status={e.status} />
                  <span className="text-xs font-semibold text-amber-600">+20 pts</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
