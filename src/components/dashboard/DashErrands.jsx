'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';
import { useDashCtx } from '@/lib/dash-context';
import { api } from '@/lib/api';
import { Card, CardTitle, Pill, SvcIcon } from './DashUI';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function DashErrands() {
  const router = useRouter();
  const { openRequest, notify, errandsLeft } = useDashCtx();

  const handleOpenErrand = () => {
    if (errandsLeft === 0) router.push('/checkout?errand=single');
    else openRequest();
  };
  const [errands, setErrands] = useState(null); // null = loading
  const [tab, setTab] = useState('upcoming');

  const load = useCallback(() =>
    api.errands.list()
      .then(setErrands)
      .catch(() => setErrands([])),
  []);

  useEffect(() => { load(); }, [load]);

  const upcoming = (errands ?? []).filter((e) => ['scheduled', 'confirmed', 'picked-up', 'on-the-way'].includes(e.status));
  const past     = (errands ?? []).filter((e) => e.status === 'completed' || e.status === 'cancelled');
  const list     = tab === 'upcoming' ? upcoming : past;

  const cancel = async (id) => {
    try {
      await api.errands.cancel(id);
      setErrands((s) => s.map((e) => e.id === id ? { ...e, status: 'cancelled' } : e));
      notify('Errand cancelled.');
    } catch (err) {
      notify(err.message || 'Could not cancel errand.', 'error');
    }
  };

  const loading = errands === null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-navy text-2xl">My Errands</h1>
        <button
          onClick={handleOpenErrand}
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
        {loading ? (
          <div className="py-10 text-center text-navy/40 text-sm">Loading errands…</div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center">
            <Icons.List size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No {tab} errands</div>
            {tab === 'upcoming' && (
              <button
                onClick={handleOpenErrand}
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
                    <span className="font-semibold text-navy text-sm">{e.type}</span>
                    <Pill status={e.status} />
                  </div>
                  <div className="text-xs text-navy/50 mt-0.5 truncate">{e.fromAddress} → {e.toAddress}</div>
                  <div className="text-xs text-navy/40">{fmtDate(e.scheduledAt)}</div>
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
