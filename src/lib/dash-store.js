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
  points: 340,
  errands: [
    { id: 1048, type: 'Pharmacy Pickup',    from: 'CVS Pharmacy · 25th St',           to: 'Home', when: dayStr(0, '2:30 PM'),   status: 'on-the-way', runner: 'Elizabeth' },
    { id: 1049, type: 'Post Office Runs',   from: 'USPS · Washington St',             to: 'Home', when: dayStr(2, '10:00 AM'),  status: 'scheduled' },
    { id: 1050, type: 'Library Returns',    from: 'Home',                             to: 'Bartholomew County Library', when: dayStr(5, '11:00 AM'), status: 'scheduled' },
    { id: 1044, type: 'Store Returns',      from: 'Home',                             to: 'Target · Columbus', when: dayStr(-3, '1:15 PM'),  status: 'completed', runner: 'Elizabeth' },
    { id: 1041, type: 'Document Delivery',  from: 'Office',                           to: 'Bartholomew County Courthouse', when: dayStr(-8, '9:40 AM'), status: 'completed', runner: 'Elizabeth' },
    { id: 1039, type: 'Store Pickups',      from: 'Kroger · National Rd',             to: 'Home', when: dayStr(-12, '4:05 PM'), status: 'completed', runner: 'Elizabeth' },
  ],
  recurring: [
    { id: 'r1', type: 'Pharmacy Pickup', freq: 'Every week',   day: 'Tuesday',  time: '2:00 PM',  from: 'CVS Pharmacy · 25th St',    active: true },
    { id: 'r2', type: 'Library Returns', freq: 'Every 2 weeks', day: 'Saturday', time: '11:00 AM', from: 'Bartholomew County Library', active: true },
  ],
  addresses: [
    { id: 'a1', label: 'Home',   line: '1420 Lafayette Ave, Columbus, IN 47201', note: 'Leave at side door', primary: true },
    { id: 'a2', label: 'Office', line: '500 Washington St, Columbus, IN 47201',  note: 'Front desk' },
  ],
  notifications: [
    { id: 'n1', title: 'Your runner is on the way',  body: 'Elizabeth picked up your CVS prescription.',              time: '12 min ago',  read: false, kind: 'errand'  },
    { id: 'n2', title: 'Errand scheduled',           body: 'Post office run confirmed for ' + dayStr(2, '10:00 AM'), time: '2 hr ago',    read: false, kind: 'errand'  },
    { id: 'n3', title: 'Payment received',           body: 'Thanks! Your monthly plan renewed.',                     time: 'Yesterday',   read: false, kind: 'billing' },
    { id: 'n4', title: 'You earned 20 Hive points',  body: 'For completing your store return.',                      time: '3 days ago',  read: true,  kind: 'reward'  },
  ],
  prefs: { sms: true, email: true, push: false, reminders: true, receipts: true, promos: false },
  profile: { phone: '(812) 555-0142', caregiver: '', notes: 'Please text before arriving.' },
  invoices: [
    { id: 'INV-2026-09', date: 'Sep 1, 2026', status: 'Paid' },
    { id: 'INV-2026-08', date: 'Aug 1, 2026', status: 'Paid' },
    { id: 'INV-2026-07', date: 'Jul 1, 2026', status: 'Paid' },
  ],
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
