'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Icons from '@/components/icons';
import { api } from '@/lib/api';
import { Card, Pill } from './DashUI';

const LiveMap = dynamic(() => import('@/components/LiveMap'), {
  ssr: false,
  loading: () => <div className="h-72 sm:h-96 rounded-xl bg-navy/5 animate-pulse" />,
});

const POLL_MS = 10_000;
const STALE_MS = 2 * 60_000;

const STEPS = [
  { key: 'scheduled',  label: 'Scheduled' },
  { key: 'confirmed',  label: 'Runner confirmed' },
  { key: 'picked-up',  label: 'Picked up' },
  { key: 'on-the-way', label: 'On the way' },
  { key: 'completed',  label: 'Delivered' },
];

function ago(iso, now) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  return `${m} min ago`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function DashTrack({ errandId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(
    () =>
      api.errands
        .tracking(errandId)
        .then((d) => { setData(d); setError(''); })
        .catch((e) => setError(e.message || 'Could not load tracking.')),
    [errandId],
  );

  const finished = data ? ['completed', 'cancelled'].includes(data.status) : false;

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (finished) return;
    const poll = () => { if (!document.hidden) load(); };
    const id = setInterval(poll, POLL_MS);
    document.addEventListener('visibilitychange', poll);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [load, finished]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="py-10 text-center text-sm text-navy/50">{error || 'Loading tracking…'}</div>
        </Card>
      </div>
    );
  }

  const runner = data.runnerName || 'Your runner';
  const loc = data.location;
  const stale = loc && now - new Date(loc.updatedAt).getTime() > STALE_MS;
  const stepIdx = STEPS.findIndex((s) => s.key === data.status);

  let emptyMessage = `Waiting for ${runner} to share their location…`;
  if (data.status === 'scheduled') emptyMessage = "Your runner's live location will appear here once they confirm and start your errand.";
  if (data.status === 'completed') emptyMessage = 'Delivered. Live tracking has ended for this errand.';
  if (data.status === 'cancelled') emptyMessage = 'This errand was cancelled.';

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link href="/dashboard/errands" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition">
        <Icons.ChevLeft size={16} stroke={2} />
        My errands
      </Link>

      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="font-display font-bold text-navy text-2xl capitalize">Track {data.type}</h1>
        <Pill status={data.status} />
      </div>

      <Card>
        {loc ? (
          <div className="space-y-3">
            <LiveMap lat={loc.lat} lng={loc.lng} accuracy={loc.accuracy} label={runner} className="h-72 sm:h-96 rounded-xl overflow-hidden" />
            <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
              <div className="flex items-center gap-2 text-navy">
                <span className={`w-2 h-2 rounded-full ${stale ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="font-semibold">{runner}</span>
                <span className="text-navy/50">· updated {ago(loc.updatedAt, now)}</span>
              </div>
              {loc.accuracy != null && <span className="text-xs text-navy/40">Accurate to about {loc.accuracy} m</span>}
            </div>
            {stale && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                {runner}&rsquo;s signal hasn&rsquo;t updated for a while — their phone may be in a low-signal area. The map will refresh automatically.
              </p>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Icons.Pin size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <p className="text-sm text-navy/55 max-w-sm mx-auto">{emptyMessage}</p>
            {!finished && <p className="text-xs text-navy/35 mt-2">This page updates automatically.</p>}
          </div>
        )}
      </Card>

      {data.status !== 'cancelled' && (
        <Card>
          <ol className="space-y-3">
            {STEPS.map((s, i) => {
              const done = i <= stepIdx;
              return (
                <li key={s.key} className="flex items-center gap-3 text-sm">
                  <span className={`w-6 h-6 grid place-items-center rounded-full shrink-0 ${done ? 'bg-gold text-navy' : 'bg-navy/6 text-navy/30'}`}>
                    {done ? <Icons.Check size={13} stroke={3} /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                  </span>
                  <span className={done ? 'text-navy font-semibold' : 'text-navy/40'}>{s.label}</span>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      <Card>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-navy/40 font-semibold uppercase tracking-wide">Pickup from</dt>
            <dd className="text-navy mt-0.5">{data.fromAddress}</dd>
          </div>
          <div>
            <dt className="text-xs text-navy/40 font-semibold uppercase tracking-wide">Deliver to</dt>
            <dd className="text-navy mt-0.5">{data.toAddress}</dd>
          </div>
          <div>
            <dt className="text-xs text-navy/40 font-semibold uppercase tracking-wide">Scheduled</dt>
            <dd className="text-navy mt-0.5">{fmtDate(data.scheduledAt)}</dd>
          </div>
          {data.code && !finished && (
            <div>
              <dt className="text-xs text-navy/40 font-semibold uppercase tracking-wide">Delivery code</dt>
              <dd className="mt-1">
                <span className="font-mono font-black text-navy text-lg tracking-widest bg-gold/20 px-2 py-0.5 rounded-lg">{data.code}</span>
                <span className="block text-xs text-navy/40 mt-1">Give this to your runner at delivery.</span>
              </dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  );
}
