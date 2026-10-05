'use client';
import { useState, useEffect } from 'react';

const DASH_KEY = 'emax_dash_v1';

const dayStr = (off, t) => {
  const d = new Date();
  d.setDate(d.getDate() + off);
  const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return t ? label + ' · ' + t : label;
};

export const DEFAULT_DASH = () => ({
  tracking: false,
  paused: false,
  cancelled: false,
  points: 0,
  errands:   [],
  recurring: [],
  addresses: [],
  notifications: [],
  prefs: { sms: true, email: true, push: false, reminders: true, receipts: true, promos: false },
  profile: { phone: '', caregiver: '', notes: '' },
});

export function useDash() {
  const [d, setD] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DASH_KEY));
      return saved ? { ...DEFAULT_DASH(), ...saved } : DEFAULT_DASH();
    } catch { return DEFAULT_DASH(); }
  });
  useEffect(() => {
    try { localStorage.setItem(DASH_KEY, JSON.stringify(d)); } catch {}
  }, [d]);
  const up = (patch) => setD((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  return [d, up];
}
