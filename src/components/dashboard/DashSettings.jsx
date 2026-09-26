'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { getUser, setUser, logout } from '@/lib/auth';
import { Card, CardTitle, Toggle, Field } from './DashUI';

export default function DashSettings() {
  const router = useRouter();
  const { notify } = useDashCtx();
  const [d, up] = useDash();
  const user = getUser();

  const [profile, setProfile] = useState({
    name:      user?.name  || '',
    email:     user?.email || '',
    phone:     d.profile?.phone     || '',
    caregiver: d.profile?.caregiver || '',
    notes:     d.profile?.notes     || '',
  });
  const [confirm, setConfirm] = useState(false);

  const setP = (k) => (e) => setProfile((s) => ({ ...s, [k]: e.target.value }));

  const saveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: profile.name, email: profile.email });
    up((s) => ({ ...s, profile: { phone: profile.phone, caregiver: profile.caregiver, notes: profile.notes } }));
    notify('Profile saved!');
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleDelete = () => {
    logout();
    notify('Account deleted.');
    router.replace('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Profile & Settings</h1>

      {/* Profile form */}
      <Card>
        <CardTitle>Your Profile</CardTitle>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <input type="text" value={profile.name} onChange={setP('name')} className="field" required />
            </Field>
            <Field label="Email">
              <input type="email" value={profile.email} onChange={setP('email')} className="field" required />
            </Field>
          </div>
          <Field label="Phone">
            <input type="tel" value={profile.phone} onChange={setP('phone')} className="field" placeholder="(812) 555-0000" />
          </Field>
          <Field label="Caregiver / secondary contact (optional)" hint="This person will also receive errand updates">
            <input type="text" value={profile.caregiver} onChange={setP('caregiver')} className="field" placeholder="Name & phone number" />
          </Field>
          <Field label="Delivery notes (for all errands)">
            <textarea value={profile.notes} onChange={setP('notes')} rows={3} className="field resize-none" placeholder="E.g. Please text before arriving." />
          </Field>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition">
            Save changes
          </button>
        </form>
      </Card>

      {/* Live tracking toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-navy text-sm">Live errand tracking</div>
            <div className="text-xs text-navy/45 mt-0.5">Share your real-time location with your runner (coming soon)</div>
          </div>
          <Toggle on={d.tracking} onToggle={() => { up((s) => ({ ...s, tracking: !s.tracking })); notify(d.tracking ? 'Tracking off.' : 'Tracking on.'); }} />
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardTitle>Security</CardTitle>
        <div className="space-y-3">
          <button type="button" className="w-full flex items-center justify-between p-3.5 rounded-xl border border-navy/10 hover:bg-navy/3 transition text-left">
            <div>
              <div className="text-sm font-semibold text-navy">Change password</div>
              <div className="text-xs text-navy/45">Last changed: never</div>
            </div>
            <Icons.Arrow size={16} stroke={2} className="text-navy/30" />
          </button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardTitle>Account</CardTitle>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-navy/12 text-navy/60 text-sm hover:bg-navy/5 transition"
          >
            <Icons.LogOut size={16} stroke={1.8} />
            Sign out of all devices
          </button>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition"
          >
            <Icons.X size={16} stroke={2} />
            Delete account
          </button>
        </div>
      </Card>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display font-bold text-navy text-lg mb-2">Delete your account?</h3>
            <p className="text-navy/55 text-sm mb-5">This will permanently delete your account and all data. This cannot be undone.</p>
            <div className="flex gap-2">
              <button type="button" onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">Delete account</button>
              <button type="button" onClick={() => setConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
