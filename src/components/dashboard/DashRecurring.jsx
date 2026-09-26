'use client';
import { useState } from 'react';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle, Toggle, Field, SvcIcon, SERVICE_ICON } from './DashUI';

const SERVICE_TYPES = Object.keys(SERVICE_ICON);
const FREQS   = ['Every week', 'Every 2 weeks', 'Every month'];
const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TIMES   = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

export default function DashRecurring() {
  const { notify } = useDashCtx();
  const [d, up] = useDash();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ type: 'Pharmacy Pickup', from: '', freq: 'Every week', day: 'Tuesday', time: '10:00 AM' });

  const toggleActive = (id) => {
    up((s) => ({
      ...s,
      recurring: s.recurring.map((r) => r.id === id ? { ...r, active: !r.active } : r),
    }));
  };

  const remove = (id) => {
    up((s) => ({ ...s, recurring: s.recurring.filter((r) => r.id !== id) }));
    notify('Recurring errand removed.');
  };

  const addNew = (e) => {
    e.preventDefault();
    if (!form.from) return;
    up((s) => ({
      ...s,
      recurring: [...s.recurring, { id: 'r' + Date.now(), ...form, active: true }],
    }));
    notify('Recurring errand added!');
    setAdding(false);
    setForm({ type: 'Pharmacy Pickup', from: '', freq: 'Every week', day: 'Tuesday', time: '10:00 AM' });
  };

  const setF = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-navy text-2xl">Recurring Errands</h1>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
          type="button"
        >
          <Icons.Plus size={15} stroke={2.5} />
          Add schedule
        </button>
      </div>

      {adding && (
        <Card>
          <CardTitle>New Recurring Errand</CardTitle>
          <form onSubmit={addNew} className="space-y-4">
            <Field label="Service type">
              <select value={form.type} onChange={setF('type')} className="field">
                {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Pick up from">
              <input value={form.from} onChange={setF('from')} className="field" placeholder="Address or place name" required />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Frequency">
                <select value={form.freq} onChange={setF('freq')} className="field">
                  {FREQS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Day">
                <select value={form.day} onChange={setF('day')} className="field">
                  {DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Time">
                <select value={form.time} onChange={setF('time')} className="field">
                  {TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition">Add</button>
              <button type="button" onClick={() => setAdding(false)} className="px-5 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {d.recurring.length === 0 ? (
          <div className="py-10 text-center">
            <Icons.Repeat size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No recurring errands yet</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {d.recurring.map((r) => (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3">
                <SvcIcon type={r.type} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-sm">{r.type}</div>
                  <div className="text-xs text-navy/50">{r.freq} · {r.day} · {r.time}</div>
                  <div className="text-xs text-navy/40 truncate">{r.from}</div>
                </div>
                <Toggle on={r.active} onToggle={() => toggleActive(r.id)} />
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="text-navy/30 hover:text-red-500 transition"
                >
                  <Icons.X size={16} stroke={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
