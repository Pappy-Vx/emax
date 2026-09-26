'use client';
import Icons from '@/components/icons';

// ── Card primitives ──────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-navy/8 shadow-card p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-bold text-navy text-base">{children}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────
export function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`toggle${on ? ' on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Turn off' : 'Turn on'}
      type="button"
    />
  );
}

// ── Pill (status badge) ──────────────────────────────────────────
const PILL_STYLES = {
  scheduled:  'bg-navy/8 text-navy',
  confirmed:  'bg-blue-50 text-blue-700',
  'on-the-way': 'bg-gold/15 text-amber-700',
  completed:  'bg-green-50 text-green-700',
  cancelled:  'bg-red-50 text-red-600',
  active:     'bg-green-50 text-green-700',
  paused:     'bg-navy/8 text-navy/60',
  default:    'bg-navy/8 text-navy',
};
const PILL_LABELS = {
  scheduled:    'Scheduled',
  confirmed:    'Confirmed',
  'on-the-way': 'On the way',
  completed:    'Completed',
  cancelled:    'Cancelled',
  active:       'Active',
  paused:       'Paused',
};

export function Pill({ status }) {
  const cls = PILL_STYLES[status] || PILL_STYLES.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {PILL_LABELS[status] || status}
    </span>
  );
}

// ── Service icon ─────────────────────────────────────────────────
export const SERVICE_ICON = {
  'Pharmacy Pickup':              'Pharmacy',
  'Store Returns':                'Return',
  'Store Pickups':                'Bag',
  'Document Delivery':            'Doc',
  'Post Office Runs':             'Mail',
  'Library Returns':              'Book',
  'Forgotten Item Delivery':      'Box',
  'Event Errand Support (Full Day)': 'Calendar',
  'Custom Errands':               'Sparkle',
};

export function SvcIcon({ type, size = 20 }) {
  const key = SERVICE_ICON[type] || 'Sparkle';
  const I = Icons[key] || Icons.Sparkle;
  return (
    <div className="grid place-items-center w-9 h-9 rounded-xl bg-navy/5 text-navy flex-shrink-0">
      <I size={size} stroke={1.8} />
    </div>
  );
}

// ── Field ────────────────────────────────────────────────────────
export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-navy/55 uppercase tracking-[0.14em] mb-1.5">{label}</div>
      {children}
      {hint && <div className="mt-1 text-xs text-navy/45">{hint}</div>}
    </label>
  );
}

// ── Card brand helpers ───────────────────────────────────────────
export const cardBrand = (n) => {
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6/.test(n)) return 'Discover';
  return '';
};
export const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
export const fmtExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
};

// ── ApplePayButton ───────────────────────────────────────────────
export function ApplePayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-black text-white font-semibold text-sm hover:bg-neutral-900 transition"
    >
      <svg viewBox="0 0 32 14" width="32" height="14" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.98 1.92c-.5.59-1.3 1.05-2.08 1a2.1 2.1 0 01-.52-1.55C3.38.8 4.2.27 4.97.07c.5-.12.98.04 1.33.41.38.38.53.92.43 1.44zm.63.32c-1.15-.06-2.13.65-2.67.65-.54 0-1.38-.62-2.28-.6C.57 2.31-.3 3.26-.3 4.58c-.01 2.49 2.04 5.88 2.1 5.94.28.44.62.66 1 .64.37-.02.72-.24 1.32-.27.58-.03 1.03.25 1.4.25.37 0 .83-.28 1.37-.25.4.02.77.26 1.04.66.25-.25.48-.6.67-.97-1.16-.65-1.3-2.15-1.16-2.86.14-.7.63-1.22 1.22-1.44a2.37 2.37 0 00-1.91-1.04zM13.4 0h-1.93v10.12h1.15V6.7h1.8c1.62 0 2.6-1 2.6-2.36S15.03 0 13.4 0zm-.78.96h1.55c1.1 0 1.7.6 1.7 1.38 0 .8-.6 1.38-1.7 1.38h-1.55V.96zm7.25 2.22c-.93 0-1.65.42-2.03 1.12l.99.62c.23-.37.6-.56 1.04-.56.72 0 1.14.47 1.14 1.18v.28h-1.26c-1.2 0-1.88.57-1.88 1.5 0 .88.66 1.45 1.63 1.45.67 0 1.22-.3 1.54-.8v.72h1.1V5.56c0-1.44-.81-2.38-2.27-2.38zm-.1 4.72c-.57 0-.92-.27-.92-.7 0-.44.35-.7 1.04-.7h1.08v.22c0 .72-.47 1.18-1.2 1.18zm6.12-4.7c-.8 0-1.43.43-1.76 1.11V3.28h-1.12v6.84h1.12V6.5c0-1.17.52-1.83 1.44-1.83.86 0 1.27.54 1.27 1.57v3.88h1.12V5.97c0-1.68-.72-2.77-2.07-2.77zm5.28 0c-1.7 0-2.8 1.23-2.8 3.2 0 1.98 1.1 3.19 2.8 3.19 1.7 0 2.8-1.21 2.8-3.2 0-1.96-1.1-3.19-2.8-3.19zm0 1c1.03 0 1.65.8 1.65 2.2 0 1.4-.62 2.2-1.65 2.2s-1.65-.8-1.65-2.2c0-1.4.62-2.2 1.65-2.2z"/>
      </svg>
      Pay
    </button>
  );
}

// ── Request Errand Modal ──────────────────────────────────────────
const SERVICE_TYPES = Object.keys(SERVICE_ICON);
const FREQ_OPTIONS = ['One time', 'Every week', 'Every 2 weeks', 'Every month'];

export function RequestModal({ open, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full bg-navy/5 hover:bg-navy/10 text-navy transition"
          type="button"
        >
          <Icons.X size={16} />
        </button>
        <h2 className="font-display font-bold text-navy text-xl mb-1">Request an Errand</h2>
        <p className="text-navy/55 text-sm mb-6">Fill in the details and we'll confirm shortly.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onSubmit?.(Object.fromEntries(fd));
            onClose();
          }}
          className="space-y-4"
        >
          <Field label="Service type">
            <select name="type" defaultValue="Pharmacy Pickup" className="field">
              {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Pick up from">
            <input name="from" placeholder="Address or place name" className="field" required />
          </Field>
          <Field label="Deliver to">
            <input name="to" placeholder="Address or place name" className="field" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input name="date" type="date" className="field" required />
            </Field>
            <Field label="Time">
              <input name="time" type="time" className="field" required />
            </Field>
          </div>
          <Field label="Frequency">
            <select name="freq" className="field">
              {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Notes (optional)">
            <textarea name="notes" rows={3} className="field resize-none" placeholder="Any special instructions?" />
          </Field>
          <button
            type="submit"
            className="mt-2 w-full rounded-full py-3.5 bg-gold text-navy font-semibold hover:bg-gold-deep transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
export function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-navy text-white text-sm font-medium shadow-xl animate-[pageIn_0.3s_ease_both]">
      {msg}
    </div>
  );
}

// ── Notification Dropdown ─────────────────────────────────────────
export function NotifDropdown({ notifications, open, onClose, onMarkAll }) {
  if (!open) return null;
  const unread = notifications.filter((n) => !n.read);
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-navy/8 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy/8">
        <div className="font-display font-bold text-navy text-sm">Notifications</div>
        {unread.length > 0 && (
          <button onClick={onMarkAll} className="text-xs text-gold font-semibold" type="button">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-navy/40 text-sm">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-navy/5 last:border-0 ${n.read ? '' : 'bg-gold/5'}`}>
              <div className={`text-sm font-semibold text-navy ${n.read ? 'font-medium' : ''}`}>{n.title}</div>
              <div className="text-xs text-navy/55 mt-0.5">{n.body}</div>
              <div className="text-xs text-navy/35 mt-1">{n.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
