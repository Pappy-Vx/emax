'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession, clearSession } from '@/lib/auth';
import Icons from '@/components/icons';
import { GoldButton, TEL } from '@/components/shared';
import { api } from '@/lib/api';

export default function DashAccount() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: '' });
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [prefs, setPrefs] = useState({ sms: true, email: false, weeklyDigest: false });

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    setUser(s);
    setForm({ phone: s.phone ?? '' });
    if (s.prefs) setPrefs(s.prefs);
  }, [router]);

  const handleSave = async () => {
    setSaveErr('');
    try {
      const updated = await api.users.updateProfile({ phone: form.phone });
      const session = { ...getSession(), ...updated };
      saveSession(session);
      setUser(session);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveErr(err.message);
    }
  };

  const handleTogglePref = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    if (user) {
      const updated = { ...user, prefs: next };
      saveSession(updated);
      setUser(updated);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  if (!user) return null;

  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-[26px] text-navy mb-7">My Account</h1>

      {/* Profile card */}
      <section className="bg-white rounded-2xl border border-navy/8 overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-navy/8 flex items-center justify-between">
          <h2 className="font-display font-bold text-navy text-[16px]">Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-[13px] font-semibold text-gold hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gold/20 grid place-items-center text-gold font-black font-display text-xl">
              {initials}
            </div>
            <div>
              <div className="font-display font-bold text-navy text-[17px]">{user.name}</div>
              <div className="text-navy/50 text-[13px]">Customer</div>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Full name</label>
                <div className="field bg-stone/60 text-navy/50 cursor-not-allowed">{user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Email address</label>
                <div className="field bg-stone/60 text-navy/50 cursor-not-allowed">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Phone number</label>
                <input
                  type="tel"
                  className="field"
                  placeholder="(812) 555-0000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              {saveErr && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {saveErr}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <GoldButton as="button" onClick={handleSave} size="sm">
                  <Icons.Check size={15} stroke={2.5} />
                  Save changes
                </GoldButton>
                <button
                  onClick={() => { setEditing(false); setSaveErr(''); }}
                  className="px-4 py-2.5 text-sm font-semibold text-navy/60 hover:text-navy transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="space-y-3.5">
              {[
                { label: 'Name',  value: user.name,              Icon: Icons.User  },
                { label: 'Email', value: user.email,             Icon: Icons.Mail  },
                { label: 'Phone', value: user.phone || '—',      Icon: Icons.Phone },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone grid place-items-center text-navy/40 shrink-0">
                    <Icon size={15} stroke={1.8} />
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[11px] text-navy/40 uppercase tracking-wider font-semibold">{label}</dt>
                    <dd className="text-navy text-[14px] font-medium truncate">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          {saved && (
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[13px] font-semibold">
              <Icons.Check size={15} stroke={2.5} />
              Phone number saved
            </div>
          )}
        </div>
      </section>

      {/* Notification preferences */}
      <section className="bg-white rounded-2xl border border-navy/8 overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-navy/8">
          <h2 className="font-display font-bold text-navy text-[16px]">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'sms',          label: 'SMS updates',       desc: 'Errand status delivered via text' },
            { key: 'email',        label: 'Email updates',     desc: 'Confirmation and completion receipts' },
            { key: 'weeklyDigest', label: 'Weekly digest',     desc: 'Summary of your errands each Monday' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-navy text-[14px] font-semibold">{label}</div>
                <div className="text-navy/45 text-[12px]">{desc}</div>
              </div>
              <button
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => handleTogglePref(key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${prefs[key] ? 'bg-gold' : 'bg-navy/20'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="bg-white rounded-2xl border border-navy/8 overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-navy/8">
          <h2 className="font-display font-bold text-navy text-[16px]">Support</h2>
        </div>
        <div className="p-6 flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <p className="text-navy text-[14px] font-semibold">Need help or have a question?</p>
            <p className="text-navy/50 text-[13px] mt-0.5">We respond within minutes during business hours.</p>
          </div>
          <GoldButton href={TEL} size="sm">
            <Icons.Phone size={15} stroke={2.2} />
            Call or Text
          </GoldButton>
        </div>
      </section>

      {/* Logout */}
      <section className="bg-white rounded-2xl border border-navy/8 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-navy text-[14px] font-semibold">Sign out</div>
            <div className="text-navy/45 text-[12px]">You can sign back in anytime.</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy/15 text-navy/70 text-[13px] font-semibold hover:text-red-500 hover:border-red-300 transition"
          >
            <Icons.LogOut size={15} stroke={1.8} />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
