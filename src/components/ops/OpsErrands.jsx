'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

function CancellationRequests({ onResolved }) {
  const [requests, setRequests] = useState([]);
  const [acting, setActing]     = useState(null);

  async function load() {
    try { setRequests(await api.ops.cancellations()); } catch {}
  }

  useEffect(() => { load(); }, []);

  async function act(id, approve) {
    setActing(id);
    try {
      if (approve) await api.ops.approveCancellation(id);
      else         await api.ops.denyCancellation(id);
      await load();
      onResolved?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setActing(null);
    }
  }

  if (!requests.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold">
          {requests.length}
        </span>
        <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wide">Cancellation Requests</h3>
      </div>
      <div className="flex flex-col gap-3">
        {requests.map((e) => (
          <div key={e.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-navy">{e.code ?? '—'}</span>
                <span className="text-xs text-gray-500 capitalize">{e.type}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-600 font-medium">{e.user?.name ?? '—'}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mb-1">{e.fromAddress} → {e.toAddress}</p>
              <p className="text-xs text-orange-700 italic">
                Reason: "{e.cancellationRequestReason ?? 'No reason provided'}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Requested {e.cancellationRequestedAt ? new Date(e.cancellationRequestedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => act(e.id, true)} disabled={acting === e.id}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50"
              >
                Approve Cancel
              </button>
              <button
                onClick={() => act(e.id, false)} disabled={acting === e.id}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUSES = ['', 'scheduled', 'confirmed', 'picked-up', 'on-the-way', 'completed', 'cancelled'];

const STATUS_COLORS = {
  scheduled:   'bg-blue-50 text-blue-700',
  confirmed:   'bg-indigo-50 text-indigo-700',
  'picked-up': 'bg-yellow-50 text-yellow-700',
  'on-the-way':'bg-amber-50 text-amber-700',
  completed:   'bg-green-50 text-green-700',
  cancelled:   'bg-red-50 text-red-700',
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function OpsErrands() {
  const [result, setResult]   = useState(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [from, setFrom]       = useState('');
  const [to, setTo]           = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');
  const [overriding, setOverriding] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await api.ops.errands({ page, pageSize: 20, search: search || undefined, status: status || undefined, from: from || undefined, to: to || undefined });
      setResult(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, from, to]);

  useEffect(() => { load(); }, [load]);

  async function override(id, action) {
    if (!confirm(`${action === 'complete' ? 'Mark as completed' : 'Cancel'} this errand?`)) return;
    setOverriding(id);
    try {
      await api.ops.overrideErrand(id, action);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setOverriding(null);
    }
  }

  return (
    <div>
      <h2 className="font-display font-black text-navy text-2xl mb-6">Errands</h2>

      {/* Pending cancellation requests — resolving one also refreshes the errand table */}
      <CancellationRequests onResolved={load} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="search" placeholder="Search name, email, address, code…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <select
          value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
        />
        <span className="self-center text-gray-400 text-sm">to</span>
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {err && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-xl">{err}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">From → To</th>
              <th className="px-4 py-3 text-left">Scheduled</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading…</td></tr>
            )}
            {!loading && result?.data?.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No errands found.</td></tr>
            )}
            {!loading && result?.data?.map((e) => (
              <tr key={e.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 ${e.cancellationRequested ? 'bg-orange-50/60' : ''}`}>
                <td className="px-4 py-3 font-mono font-bold text-navy">{e.code ?? '—'}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{e.user?.name ?? '—'}</p>
                  <p className="text-gray-400 text-xs">{e.user?.email ?? ''}</p>
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{e.type}</td>
                <td className="px-4 py-3 max-w-[220px]">
                  <p className="text-xs text-gray-500 truncate">{e.fromAddress}</p>
                  <p className="text-xs text-gray-400 truncate">→ {e.toAddress}</p>
                  {e.notes && (
                    <p className="text-xs text-amber-600 mt-1 truncate italic" title={e.notes}>📝 {e.notes}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(e.scheduledAt)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {e.status}
                  </span>
                  {e.cancellationRequested && (
                    <span className="ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      cancel req.
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {!['completed', 'cancelled'].includes(e.status) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => override(e.id, 'complete')}
                        disabled={overriding === e.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium disabled:opacity-50"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => override(e.id, 'cancel')}
                        disabled={overriding === e.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {result && result.pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {result.page} of {result.pages} · {result.total} total</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={result.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >Prev</button>
            <button
              onClick={() => setPage((p) => Math.min(result.pages, p + 1))} disabled={result.page >= result.pages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
