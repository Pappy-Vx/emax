'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const STATUS_FLOW = ['scheduled', 'confirmed', 'picked-up', 'on-the-way'];

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function isTimeReached(scheduledAt) {
  if (!scheduledAt) return true;
  return Date.now() >= new Date(scheduledAt).getTime() + 60_000;
}

export default function RiderErrandDetail({ errandId }) {
  const router = useRouter();
  const [errand, setErrand]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [err, setErr]               = useState('');
  const [updating, setUpdating]     = useState(false);
  const [code, setCode]             = useState('');
  const [codeErr, setCodeErr]       = useState('');
  const [completing, setCompleting] = useState(false);

  // Time lock — re-check every 30s so the page unlocks automatically
  const [timeReached, setTimeReached] = useState(false);

  // Cancel-request form
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason]     = useState('');
  const [cancelErr, setCancelErr]           = useState('');
  const [cancelling, setCancelling]         = useState(false);

  useEffect(() => {
    api.rider.errand(errandId)
      .then((e) => {
        setErrand(e);
        setTimeReached(isTimeReached(e.scheduledAt));
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [errandId]);

  // Poll time-lock every 30s until it unlocks
  useEffect(() => {
    if (!errand || timeReached) return;
    const id = setInterval(() => {
      if (isTimeReached(errand.scheduledAt)) {
        setTimeReached(true);
        clearInterval(id);
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [errand, timeReached]);

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

  async function submitCancelRequest(e) {
    e.preventDefault();
    if (!cancelReason.trim()) { setCancelErr('Please provide a reason.'); return; }
    setCancelErr('');
    setCancelling(true);
    try {
      const updated = await api.rider.requestCancellation(errandId, cancelReason.trim());
      setErrand(updated);
      setShowCancelForm(false);
      setCancelReason('');
    } catch (e) {
      setCancelErr(e.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>;
  if (err)     return <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{err}</p>;
  if (!errand) return null;

  const isDone      = ['completed', 'cancelled'].includes(errand.status);
  const canAdvance  = !isDone && timeReached && !errand.cancellationRequested
    && STATUS_FLOW.includes(errand.status)
    && STATUS_FLOW.indexOf(errand.status) < STATUS_FLOW.length - 1;
  const canComplete = !isDone && timeReached && !errand.cancellationRequested && errand.status === 'on-the-way';
  const canRequestCancel = !isDone && !errand.cancellationRequested;

  const nextLabel = {
    scheduled:   'Mark as Confirmed',
    confirmed:   'Mark as Picked Up',
    'picked-up': 'Mark On the Way',
  }[errand.status];

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-navy mb-5 flex items-center gap-1">
        ← Back
      </button>

      {/* Errand card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <p className="font-display font-black text-navy text-xl capitalize">{errand.type} Errand</p>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              errand.status === 'completed' ? 'bg-green-50 text-green-700' :
              errand.status === 'cancelled' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {errand.status}
            </span>
            {errand.cancellationRequested && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
                Cancellation Pending
              </span>
            )}
          </div>
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
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Notes from customer</p>
              <p className="text-navy bg-amber-50 rounded-xl px-3 py-2 text-sm">{errand.notes}</p>
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

      {/* Time lock banner */}
      {!isDone && !timeReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex gap-3">
          <span className="text-2xl shrink-0">🔒</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Errand not yet active</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Scheduled for <strong>{fmt(errand.scheduledAt)}</strong>.
              Status changes and completion are locked until at least 1 minute past that time.
            </p>
          </div>
        </div>
      )}

      {/* Cancellation pending banner */}
      {errand.cancellationRequested && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4 flex gap-3">
          <span className="text-2xl shrink-0">⏳</span>
          <div>
            <p className="font-semibold text-orange-800 text-sm">Cancellation request pending</p>
            <p className="text-xs text-orange-700 mt-0.5">
              Your request is waiting for admin review. No further actions can be taken until a decision is made.
            </p>
            {errand.cancellationRequestReason && (
              <p className="text-xs text-orange-600 mt-1 italic">Reason: "{errand.cancellationRequestReason}"</p>
            )}
          </div>
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

          {/* Request cancellation */}
          {canRequestCancel && !showCancelForm && (
            <button
              onClick={() => setShowCancelForm(true)}
              className="w-full border border-red-200 text-red-600 rounded-full py-3 font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              Request Cancellation
            </button>
          )}

          {showCancelForm && (
            <form onSubmit={submitCancelRequest} className="bg-white rounded-2xl border border-red-100 p-5">
              <p className="font-semibold text-navy mb-1">Request cancellation</p>
              <p className="text-xs text-gray-500 mb-4">
                Cancellations require admin approval. Please explain why you cannot complete this errand.
              </p>
              <textarea
                rows={3}
                placeholder="Reason for cancellation…"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none mb-3"
              />
              {cancelErr && <p className="text-red-600 text-sm mb-3">{cancelErr}</p>}
              <div className="flex gap-3">
                <button
                  type="button" onClick={() => { setShowCancelForm(false); setCancelReason(''); setCancelErr(''); }}
                  className="flex-1 border border-gray-200 text-gray-500 rounded-full py-2.5 font-semibold text-sm"
                >
                  Discard
                </button>
                <button
                  type="submit" disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 bg-red-600 text-white rounded-full py-2.5 font-semibold text-sm disabled:opacity-50"
                >
                  {cancelling ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
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

      {errand.status === 'cancelled' && (
        <div className="text-center py-6 bg-red-50 rounded-2xl">
          <p className="text-red-700 font-bold text-lg">Cancelled</p>
          <p className="text-red-600 text-sm mt-1">This errand was cancelled.</p>
        </div>
      )}
    </div>
  );
}
