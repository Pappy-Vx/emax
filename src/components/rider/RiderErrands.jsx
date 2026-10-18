'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const STATUS_COLORS = {
  scheduled:    'bg-blue-50 text-blue-700',
  confirmed:    'bg-indigo-50 text-indigo-700',
  'picked-up':  'bg-yellow-50 text-yellow-700',
  'on-the-way': 'bg-amber-50 text-amber-700',
  completed:    'bg-green-50 text-green-700',
  cancelled:    'bg-red-50 text-red-700',
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function RiderErrands() {
  const router = useRouter();
  const [errands, setErrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');

  useEffect(() => {
    api.rider.errands()
      .then(setErrands)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>;
  if (err)     return <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{err}</p>;

  const active   = errands.filter((e) => !['completed', 'cancelled'].includes(e.status));
  const finished = errands.filter((e) => ['completed', 'cancelled'].includes(e.status));

  function Section({ title, items }) {
    if (!items.length) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">{title}</h3>
        <div className="flex flex-col gap-3">
          {items.map((e) => (
            <button
              key={e.id}
              onClick={() => router.push(`/rider/errands/${e.id}`)}
              className="text-left w-full bg-white rounded-2xl border border-gray-100 p-4 hover:border-navy/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="font-mono font-bold text-navy text-base">{e.code ?? '—'}</span>
                  <span className="ml-2 text-xs text-gray-400 capitalize">{e.type}</span>
                </div>
                <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {e.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{e.fromAddress} → {e.toAddress}</p>
              <p className="text-xs text-gray-400 mt-1">{fmt(e.scheduledAt)}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!errands.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-semibold text-navy mb-2">No errands assigned</p>
        <p className="text-sm">You don't have any errands yet. Check back later.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display font-black text-navy text-2xl mb-6">My Errands</h2>
      <Section title="Active" items={active} />
      <Section title="Completed / Cancelled" items={finished} />
    </div>
  );
}
