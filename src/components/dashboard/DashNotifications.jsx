'use client';
import Icons from '@/components/icons';
import { useDash } from '@/lib/dash-store';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle, Toggle } from './DashUI';

const PREF_LABELS = {
  sms:       { label: 'Text messages', desc: 'Status updates via SMS' },
  email:     { label: 'Email',         desc: 'Confirmations & receipts' },
  push:      { label: 'Push notifications', desc: 'Browser or app push' },
  reminders: { label: 'Reminders',     desc: '30 min before errand' },
  receipts:  { label: 'Receipts',      desc: 'After each completed errand' },
  promos:    { label: 'Promotions',    desc: 'Deals & seasonal offers' },
};

const KIND_ICON = { errand: 'List', billing: 'Briefcase', reward: 'Sparkle' };

export default function DashNotifications() {
  const { notify } = useDashCtx();
  const [d, up] = useDash();

  const markRead = (id) => {
    up((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) }));
  };

  const markAll = () => {
    up((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    notify('All notifications marked as read.');
  };

  const togglePref = (key) => {
    up((s) => ({ ...s, prefs: { ...s.prefs, [key]: !s.prefs[key] } }));
  };

  const unreadCount = d.notifications.filter((n) => !n.read).length;

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

        {d.notifications.length === 0 ? (
          <div className="py-10 text-center">
            <Icons.Bell size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No notifications</div>
          </div>
        ) : (
          <div className="divide-y divide-navy/6">
            {d.notifications.map((n) => {
              const iconKey = KIND_ICON[n.kind] || 'Bell';
              const I = Icons[iconKey] || Icons.Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`py-4 first:pt-0 last:pb-0 flex items-start gap-3 cursor-pointer transition hover:bg-navy/2 rounded-xl px-1 ${n.read ? '' : 'bg-gold/3'}`}
                >
                  <div className={`grid place-items-center w-9 h-9 rounded-xl flex-shrink-0 ${n.read ? 'bg-navy/5 text-navy/40' : 'bg-gold/15 text-amber-700'}`}>
                    <I size={16} stroke={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${n.read ? 'text-navy/70' : 'font-semibold text-navy'}`}>{n.title}</div>
                    <div className="text-xs text-navy/50 mt-0.5">{n.body}</div>
                    <div className="text-xs text-navy/30 mt-1">{n.time}</div>
                  </div>
                  {!n.read && (
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
