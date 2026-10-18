'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function OpsCustomers() {
  const [result, setResult]     = useState(null);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [defaulted, setDefaulted] = useState('');
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await api.ops.customers({
        page, pageSize: 20,
        search:    search || undefined,
        defaulted: defaulted || undefined,
        from:      from || undefined,
        to:        to || undefined,
      });
      setResult(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, defaulted, from, to]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h2 className="font-display font-black text-navy text-2xl mb-6">Customers</h2>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="search" placeholder="Search name, email, phone…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <select
          value={defaulted} onChange={(e) => { setDefaulted(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
        >
          <option value="">All customers</option>
          <option value="true">Defaulted only</option>
          <option value="false">Active only</option>
        </select>
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
        />
        <span className="self-center text-gray-400 text-sm">to</span>
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
        />
      </div>

      {err && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-xl">{err}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Sub Status</th>
              <th className="px-4 py-3 text-left">Period End</th>
              <th className="px-4 py-3 text-left">Payment Method</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading…</td></tr>
            )}
            {!loading && result?.data?.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No customers found.</td></tr>
            )}
            {!loading && result?.data?.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{c.name}</p>
                  <p className="text-gray-400 text-xs">{c.email}</p>
                  {c.phone && <p className="text-gray-400 text-xs">{c.phone}</p>}
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{c.planId ?? <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3">
                  {c.subStatus ? (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      c.isDefaulted ? 'bg-red-50 text-red-700' :
                      c.subStatus === 'active' ? 'bg-green-50 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {c.isDefaulted ? 'Defaulted' : c.subStatus}
                    </span>
                  ) : <span className="text-gray-300 text-xs">No sub</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(c.periodEnd)}</td>
                <td className="px-4 py-3 capitalize text-gray-600 text-xs">{c.lastPaymentMethod ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result && result.pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {result.page} of {result.pages} · {result.total} total</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={result.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Prev</button>
            <button onClick={() => setPage((p) => Math.min(result.pages, p + 1))} disabled={result.page >= result.pages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
