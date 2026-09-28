'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { getPlan } from '@/lib/auth';
import { ADDRESS_LIMIT } from '@/lib/plans';
import { Card, CardTitle, Field } from './DashUI';

export default function DashAddresses() {
  const { notify } = useDashCtx();
  const [d, up] = useDash();
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label: '', line: '', note: '' });

  const planId = getPlan() || 'family';
  const limit  = ADDRESS_LIMIT[planId] ?? 5;
  const canAdd = d.addresses.length < limit;

  const setF = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    if (!form.label || !form.line) return;
    if (editId) {
      up((s) => ({ ...s, addresses: s.addresses.map((a) => a.id === editId ? { ...a, ...form } : a) }));
      notify('Address updated.');
    } else {
      up((s) => ({ ...s, addresses: [...s.addresses, { id: 'a' + Date.now(), ...form, primary: false }] }));
      notify('Address saved.');
    }
    setAdding(false);
    setEditId(null);
    setForm({ label: '', line: '', note: '' });
  };

  const remove = (id) => {
    up((s) => ({ ...s, addresses: s.addresses.filter((a) => a.id !== id) }));
    notify('Address removed.');
  };

  const makePrimary = (id) => {
    up((s) => ({ ...s, addresses: s.addresses.map((a) => ({ ...a, primary: a.id === id })) }));
    notify('Default address updated.');
  };

  const startEdit = (a) => {
    setEditId(a.id);
    setForm({ label: a.label, line: a.line, note: a.note || '' });
    setAdding(true);
  };

  const cancel = () => { setAdding(false); setEditId(null); setForm({ label: '', line: '', note: '' }); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-navy text-2xl">Saved Addresses</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-navy/40">{d.addresses.length}/{limit}</span>
          {canAdd && (
            <button
              onClick={() => { setAdding(!adding); setEditId(null); setForm({ label: '', line: '', note: '' }); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
              type="button"
            >
              <Icons.Plus size={15} stroke={2.5} />
              Add address
            </button>
          )}
        </div>
      </div>

      {!canAdd && (
        <div className="text-sm text-navy/55 bg-navy/5 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
          <span>You have reached the address limit for your plan ({limit} addresses).</span>
          <Link
            href="/dashboard/subscription"
            className="text-xs font-semibold text-navy px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 transition whitespace-nowrap"
          >
            Upgrade plan →
          </Link>
        </div>
      )}

      {adding && (
        <Card>
          <CardTitle>{editId ? 'Edit Address' : 'New Address'}</CardTitle>
          <form onSubmit={save} className="space-y-4">
            <Field label="Label (e.g. Home, Office)">
              <input value={form.label} onChange={setF('label')} className="field" placeholder="Home" required />
            </Field>
            <Field label="Address">
              <input value={form.line} onChange={setF('line')} className="field" placeholder="123 Main St, Columbus, IN" required />
            </Field>
            <Field label="Delivery notes (optional)">
              <input value={form.note} onChange={setF('note')} className="field" placeholder="Leave at side door" />
            </Field>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition">
                {editId ? 'Save changes' : 'Add address'}
              </button>
              <button type="button" onClick={cancel} className="px-5 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {d.addresses.length === 0 ? (
          <div className="py-10 text-center">
            <Icons.Pin size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No saved addresses</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {d.addresses.map((a) => (
              <div key={a.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="grid place-items-center w-9 h-9 rounded-xl bg-navy/5 text-navy flex-shrink-0 mt-0.5">
                  <Icons.Pin size={18} stroke={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy text-sm">{a.label}</span>
                    {a.primary && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-amber-700 font-semibold">Default</span>
                    )}
                  </div>
                  <div className="text-xs text-navy/55 mt-0.5">{a.line}</div>
                  {a.note && <div className="text-xs text-navy/35 mt-0.5 italic">{a.note}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!a.primary && (
                    <button type="button" onClick={() => makePrimary(a.id)} className="text-xs text-navy/40 hover:text-navy transition border border-navy/12 rounded-lg px-2.5 py-1.5">
                      Set default
                    </button>
                  )}
                  <button type="button" onClick={() => startEdit(a)} className="text-xs text-navy/40 hover:text-navy transition">
                    <Icons.Arrow size={14} stroke={2} style={{ transform: 'rotate(-45deg)' }} />
                  </button>
                  <button type="button" onClick={() => remove(a.id)} className="text-navy/30 hover:text-red-500 transition">
                    <Icons.X size={16} stroke={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
