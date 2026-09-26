'use client';
import { useState } from 'react';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle, Pill, SvcIcon } from './DashUI';

export default function DashErrands() {
  const { openRequest, notify } = useDashCtx();
  const [d, up] = useDash();
  const [tab, setTab] = useState('upcoming');

  const upcoming = d.errands.filter((e) => ['scheduled', 'confirmed', 'on-the-way'].includes(e.status));
  const past     = d.errands.filter((e) => e.status === 'completed' || e.status === 'cancelled');
  const list     = tab === 'upcoming' ? upcoming : past;

  const cancel = (id) => {
    up((s) => ({
      ...s,
      errands: s.errands.map((e) => e.id === id ? { ...e, status: 'cancelled' } : e),
    }));
    notify('Errand cancelled.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-navy text-2xl">My Errands</h1>
        <button
          onClick={openRequest}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
          type="button"
        >
          <Icons.Plus size={15} stroke={2.5} />
          New errand
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy/5 p-1 rounded-xl w-fit">
        {['upcoming', 'past'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${tab === t ? 'bg-white text-navy shadow-sm' : 'text-navy/50 hover:text-navy'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        {list.length === 0 ? (
          <div className="py-12 text-center">
            <Icons.List size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No {tab} errands</div>
            {tab === 'upcoming' && (
              <button
                onClick={openRequest}
                className="mt-4 px-5 py-2.5 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
                type="button"
              >
                Schedule your first errand
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {list.map((e) => (
              <div key={e.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3">
                <SvcIcon type={e.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy text-sm">#{e.id} · {e.type}</span>
                    <Pill status={e.status} />
                  </div>
                  <div className="text-xs text-navy/50 mt-0.5">{e.from} → {e.to}</div>
                  <div className="text-xs text-navy/40">{e.when}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {e.status === 'completed' && (
                    <button
                      type="button"
                      className="text-xs text-navy/50 hover:text-navy border border-navy/15 rounded-lg px-3 py-1.5 transition"
                    >
                      Receipt
                    </button>
                  )}
                  {(e.status === 'scheduled' || e.status === 'confirmed') && (
                    <button
                      type="button"
                      onClick={() => cancel(e.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
