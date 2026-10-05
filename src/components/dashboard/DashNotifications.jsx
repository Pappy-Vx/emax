'use client';
import { useState, useEffect } from 'react';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle, Toggle } from './DashUI';
import { api } from '@/lib/api';

const PREF_LABELS = {
  sms:       { label: 'Text messages', desc: 'Status updates via SMS' },
  email:     { label: 'Email',         desc: 'Confirmations & receipts' },
  push:      { label: 'Push notifications', desc: 'Browser or app push' },
  reminders: { label: 'Reminders',     desc: '30 min before errand' },
  receipts:  { label: 'Receipts',      desc: 'After each completed errand' },
  promos:    { label: 'Promotions',    desc: 'Deals & seasonal offers' },
};

const KIND_ICON = { errand: 'List', billing: 'Briefcase', reward: 'Sparkle' };

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2)  return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function kindOf(type = '') {
  const t = type.toLowerCase();
  if (t.includes('payment') || t.includes('plan') || t.includes('subscription')) return 'billing';
  if (t.includes('reward') || t.includes('point') || t.includes('hive'))         return 'reward';
  return 'errand';
}

export default function DashNotifications() {
  const { notify } = useDashCtx();
  const [d, up]              = useDash();
  const [notifs, setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.notifications.me()
      .then(setNotifs)
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    setNotifs((s) => s.map((n) => n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n));
    api.notifications.markRead(id).catch(() => {});
  };

  const markAll = () => {
    const now = new Date().toISOString();
    setNotifs((s) => s.map((n) => ({ ...n, readAt: n.readAt ?? now })));
    notifs.filter((n) => !n.readAt).forEach((n) => api.notifications.markRead(n.id).catch(() => {}));
    notify('All notifications marked as read.');
  };

  const togglePref = (key) => {
    up((s) => ({ ...s, prefs: { ...s.prefs, [key]: !s.prefs[key] } }));
  };

  const unreadCount = notifs.filter((n) => !n.readAt).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Notifications</h1>

      {/* Inbox */}
      <Card>
        <CardTitle
          action={
            unreadCount > 0
              ? <button type="button" onClick={markAll} className="text-xs text-gold font-semibold hover:underline">Mark all read</button>
              : null
          }
        >
          Inbox
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gold/15 text-amber-700 text-xs font-semibold">
              {unreadCount} new
            </span>
          )}
        </CardTitle>

        {loading ? (
          <div className="py-10 text-center text-navy/40 text-sm">Loading…</div>
        ) : notifs.length === 0 ? (
          <div className="py-10 text-center">
            <Icons.Bell size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No notifications yet</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {notifs.map((n) => {
              const kind    = kindOf(n.type);
              const iconKey = KIND_ICON[kind] || 'Bell';
              const I       = Icons[iconKey] || Icons.Bell;
              const isRead  = !!n.readAt;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`py-4 first:pt-0 last:pb-0 flex items-start gap-3 cursor-pointer transition hover:bg-navy/2 rounded-xl px-1 ${isRead ? '' : 'bg-gold/3'}`}
                >
                  <div className={`grid place-items-center w-9 h-9 rounded-xl flex-shrink-0 ${isRead ? 'bg-navy/5 text-navy/40' : 'bg-gold/15 text-amber-700'}`}>
                    <I size={16} stroke={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${isRead ? 'text-navy/70' : 'font-semibold text-navy'}`}>{n.title}</div>
                    <div className="text-xs text-navy/50 mt-0.5">{n.body}</div>
                    <div className="text-xs text-navy/30 mt-1">{relativeTime(n.createdAt)}</div>
                  </div>
                  {!isRead && (
                    <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Preferences */}
      <Card>
        <CardTitle>Notification Preferences</CardTitle>
        <div className="space-y-4">
          {Object.entries(PREF_LABELS).map(([key, { label, desc }]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-navy">{label}</div>
                <div className="text-xs text-navy/45">{desc}</div>
              </div>
              <Toggle on={d.prefs[key]} onToggle={() => togglePref(key)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
