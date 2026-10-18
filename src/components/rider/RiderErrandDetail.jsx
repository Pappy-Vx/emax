'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const STATUS_FLOW = ['scheduled', 'confirmed', 'picked-up', 'on-the-way'];

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function RiderErrandDetail({ errandId }) {
  const router = useRouter();
  const [errand, setErrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Status update
  const [updating, setUpdating] = useState(false);

  // Completion
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.rider.errand(errandId)
      .then(setErrand)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [errandId]);

  async function advanceStatus() {
    if (!errand) return;
    const idx = STATUS_FLOW.indexOf(errand.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    setUpdating(true);
    try {
      const updated = await api.rider.updateStatus(errandId, next);
      setErrand(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  }

  async function completeErrand(e) {
    e.preventDefault();
    if (code.length !== 4) { setCodeErr('Enter the 4-digit code given by the customer.'); return; }
    setCodeErr('');
    setCompleting(true);
    try {
      const updated = await api.rider.complete(errandId, code);
      setErrand(updated);
      setCode('');
    } catch (e) {
      setCodeErr(e.message);
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>;
  if (err)     return <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{err}</p>;
  if (!errand) return null;

  const isDone     = ['completed', 'cancelled'].includes(errand.status);
  const canAdvance = !isDone && STATUS_FLOW.includes(errand.status) && STATUS_FLOW.indexOf(errand.status) < STATUS_FLOW.length - 1;
  const canComplete = errand.status === 'on-the-way';

  const nextLabel = {
    scheduled:    'Mark as Confirmed',
    confirmed:    'Mark as Picked Up',
    'picked-up':  'Mark On the Way',
  }[errand.status];

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-navy mb-5 flex items-center gap-1">
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Errand code</p>
            <p className="font-mono font-black text-3xl text-navy">{errand.code ?? '—'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            errand.status === 'completed' ? 'bg-green-50 text-green-700' :
            errand.status === 'cancelled' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {errand.status}
          </span>
        </div>

        <div className="grid gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Type</p>
            <p className="text-navy capitalize">{errand.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Pickup from</p>
            <p className="text-navy">{errand.fromAddress}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Deliver to</p>
            <p className="text-navy">{errand.toAddress}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Scheduled</p>
            <p className="text-navy">{fmt(errand.scheduledAt)}</p>
          </div>
          {errand.notes && (
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Notes</p>
              <p className="text-navy">{errand.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer info */}
      {errand.user && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Customer</p>
          <p className="font-semibold text-navy">{errand.user.name}</p>
          <p className="text-sm text-gray-500">{errand.user.email}</p>
          {errand.user.phone && <p className="text-sm text-gray-500">{errand.user.phone}</p>}
        </div>
      )}

      {/* Actions */}
      {!isDone && (
        <div className="flex flex-col gap-3">
          {canAdvance && (
            <button
              onClick={advanceStatus} disabled={updating}
              className="w-full bg-navy text-white rounded-full py-3.5 font-semibold disabled:opacity-50"
            >
              {updating ? 'Updating…' : nextLabel}
            </button>
          )}

          {canComplete && (
            <form onSubmit={completeErrand} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-semibold text-navy mb-1">Complete delivery</p>
              <p className="text-sm text-gray-500 mb-4">Ask the customer for their 4-digit code to confirm delivery.</p>
              <div className="flex gap-3 items-start">
                <input
                  type="text" inputMode="numeric" pattern="\d{4}" maxLength={4}
                  placeholder="0000"
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-center font-mono text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-navy/25"
                />
                <button
                  type="submit" disabled={completing || code.length !== 4}
                  className="flex-1 bg-gold text-navy rounded-full py-2.5 font-semibold disabled:opacity-50"
                >
                  {completing ? 'Confirming…' : 'Confirm delivery'}
                </button>
              </div>
              {codeErr && <p className="text-red-600 text-sm mt-2">{codeErr}</p>}
            </form>
          )}
        </div>
      )}

      {errand.status === 'completed' && (
        <div className="text-center py-6 bg-green-50 rounded-2xl">
          <p className="text-green-700 font-bold text-lg">Delivered!</p>
          <p className="text-green-600 text-sm mt-1">This errand has been completed.</p>
        </div>
      )}
    </div>
  );
}
