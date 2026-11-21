'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { SERVICE_ICON } from '@/components/dashboard/DashUI';

const ERRAND_TYPES = Object.keys(SERVICE_ICON);

const ERRAND_CATEGORIES = [
  'Shopping & Retail',
  'Delivery & Drop-Off',
  'Mail, Shipping & Courier',
  'Pharmacy & Care Support',
  'Home & Personal Tasks',
  'Business & Office Support',
  'Events & Flexible Help',
];

const EMPTY = {
  customerName: '', customerPhone: '', customerEmail: '',
  category: '', type: '', fromAddress: '', toAddress: '',
  scheduledAt: '', notes: '', paymentStatus: 'unpaid', amount: '',
};

export function trackingUrl(token) {
  if (!token) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://emaxerrands.com';
  return `${origin}/track/${token}`;
}

export function CopyLinkButton({ token, className = '' }) {
  const [copied, setCopied] = useState(false);
  if (!token) return null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(trackingUrl(token));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this tracking link:', trackingUrl(token));
    }
  }
  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? 'Copied!' : 'Copy tracking link'}
    </button>
  );
}

const input = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20';
const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

export default function OpsNewErrand({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [created, setCreated] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!form.scheduledAt) { setErr('Choose a date and time.'); return; }
    setSaving(true);
    try {
      const errand = await api.ops.createErrand({
        customerName:  form.customerName,
        customerPhone: form.customerPhone || undefined,
        customerEmail: form.customerEmail || undefined,
        category:      form.category,
        type:          form.type,
        fromAddress:   form.fromAddress,
        toAddress:     form.toAddress,
        scheduledAt:   new Date(form.scheduledAt).toISOString(),
        notes:         form.notes || undefined,
        paymentStatus: form.paymentStatus,
        amount:        form.amount === '' ? undefined : Number(form.amount),
      });
      setCreated(errand);
      onCreated?.();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 my-8">
        {created ? (
          <div>
            <h3 className="font-display font-black text-navy text-xl mb-1">Errand created</h3>
            <p className="text-sm text-gray-500 mb-5">
              {created.riderId ? 'A runner has been assigned.' : 'No runner was free yet — it will be assigned automatically when one is available.'}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm mb-5">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Customer</span>
                <span className="font-semibold text-navy text-right">{created.customerName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Delivery code</span>
                <span className="font-mono font-black text-navy tracking-widest">{created.code}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Tracking link</span>
                <input readOnly value={trackingUrl(created.trackingToken)} onFocus={(e) => e.target.select()} className={`${input} font-mono text-xs`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Send the customer the tracking link and their delivery code. The map goes live once the runner starts sharing their location.
            </p>
            <div className="flex gap-3">
              <CopyLinkButton token={created.trackingToken} className="flex-1 bg-gold text-navy rounded-full py-2.5 font-semibold text-sm" />
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 rounded-full py-2.5 font-semibold text-sm">
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-display font-black text-navy text-xl">New errand</h3>
                <p className="text-sm text-gray-500">For a customer booking by phone or in person — no account needed.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-navy text-xl leading-none px-1">×</button>
            </div>

            <p className="text-xs font-bold text-navy uppercase tracking-wide mb-3">Customer</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ne-name">Name *</label>
                <input id="ne-name" required maxLength={100} value={form.customerName} onChange={set('customerName')} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="ne-phone">Phone</label>
                <input id="ne-phone" type="tel" maxLength={30} value={form.customerPhone} onChange={set('customerPhone')} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="ne-email">Email</label>
                <input id="ne-email" type="email" value={form.customerEmail} onChange={set('customerEmail')} className={input} />
              </div>
            </div>

            <p className="text-xs font-bold text-navy uppercase tracking-wide mb-3">Errand</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <div>
                <label className={label} htmlFor="ne-category">Category *</label>
                <select id="ne-category" required value={form.category} onChange={set('category')} className={input}>
                  <option value="">Select…</option>
                  {ERRAND_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="ne-type">Errand type *</label>
                <select id="ne-type" required value={form.type} onChange={set('type')} className={input}>
                  <option value="">Select…</option>
                  {ERRAND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ne-from">Pickup address *</label>
                <input id="ne-from" required maxLength={300} value={form.fromAddress} onChange={set('fromAddress')} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ne-to">Drop-off address *</label>
                <input id="ne-to" required maxLength={300} value={form.toAddress} onChange={set('toAddress')} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ne-when">Date &amp; time *</label>
                <input id="ne-when" type="datetime-local" required value={form.scheduledAt} onChange={set('scheduledAt')} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ne-notes">Instructions for the runner</label>
                <textarea id="ne-notes" rows={2} maxLength={1000} value={form.notes} onChange={set('notes')} className={`${input} resize-none`} />
              </div>
            </div>

            <p className="text-xs font-bold text-navy uppercase tracking-wide mb-3">Payment</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <fieldset>
                <legend className={label}>Status *</legend>
                <div className="flex gap-2">
                  {['paid', 'unpaid'].map((s) => (
                    <label key={s} className={`flex-1 text-center rounded-xl border px-3 py-2.5 text-sm font-semibold cursor-pointer capitalize ${
                      form.paymentStatus === s ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600'
                    }`}>
                      <input type="radio" name="paymentStatus" value={s} checked={form.paymentStatus === s} onChange={set('paymentStatus')} className="sr-only" />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className={label} htmlFor="ne-amount">Amount ($)</label>
                <input id="ne-amount" type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} className={input} placeholder="e.g. 19.99" />
              </div>
            </div>

            {err && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2 mb-4">{err}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 rounded-full py-2.5 font-semibold text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-navy text-white rounded-full py-2.5 font-semibold text-sm disabled:opacity-50">
                {saving ? 'Creating…' : 'Create errand'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
