'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export default function OpsRiders() {
  const [result, setResult]   = useState(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  // Add rider form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [formErr, setFormErr]   = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await api.ops.riders({ page, pageSize: 20, search: search || undefined });
      setResult(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function createRider(e) {
    e.preventDefault();
    setFormErr('');
    setCreating(true);
    try {
      await api.ops.createRider(form);
      setShowForm(false);
      setForm({ name: '', email: '', password: '' });
      load();
    } catch (e) {
      setFormErr(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-navy text-2xl">Runners</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy/90"
        >
          {showForm ? 'Cancel' : '+ Add runner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createRider} className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Full name</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-52" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-40" />
          </div>
          <button type="submit" disabled={creating}
            className="px-4 py-2 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-amber-400 disabled:opacity-50">
            {creating ? 'Creating…' : 'Create'}
          </button>
          {formErr && <p className="w-full text-red-600 text-xs mt-1">{formErr}</p>}
        </form>
      )}

      <div className="flex gap-3 mb-5">
        <input
          type="search" placeholder="Search name or email…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {err && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-xl">{err}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Runner</th>
              <th className="px-4 py-3 text-left">Errands today</th>
              <th className="px-4 py-3 text-left">Total completed</th>
              <th className="px-4 py-3 text-left">Daily limit</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading…</td></tr>
            )}
            {!loading && result?.data?.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No runners found.</td></tr>
            )}
            {!loading && result?.data?.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700 font-semibold">{r.errandsToday} / 3</td>
                <td className="px-4 py-3 text-gray-500">{r.totalCompleted}</td>
                <td className="px-4 py-3">
                  {r.atDailyLimit ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold">At limit</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">Available</span>
                  )}
                </td>
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
