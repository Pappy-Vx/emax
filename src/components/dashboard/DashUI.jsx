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
  scheduled:    'bg-navy/8 text-navy',
  confirmed:    'bg-blue-50 text-blue-700',
  'picked-up':  'bg-purple-50 text-purple-700',
  'on-the-way': 'bg-gold/15 text-amber-700',
  completed:    'bg-green-50 text-green-700',
  cancelled:    'bg-red-50 text-red-600',
  active:       'bg-green-50 text-green-700',
  paused:       'bg-navy/8 text-navy/60',
  default:      'bg-navy/8 text-navy',
};
const PILL_LABELS = {
  scheduled:    'Scheduled',
  confirmed:    'Confirmed',
  'picked-up':  'Picked up',
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
export function ApplePayButton({ onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-black text-white font-semibold text-[15px] hover:bg-neutral-900 transition disabled:opacity-60"
      style={{ letterSpacing: '-0.01em' }}
    >
      {/* Apple logo */}
      <svg width="15" height="18" viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 420.2 0 298.6 0 234c0-198.4 130.3-303.3 258.6-303.3 66.9 0 122.7 44.2 164 44.2 39.5 0 101.7-47.8 177.8-47.8 29.9 0 122.1 3.2 183.8 96.9zm-246-66.5c-14.1-46.8-4.5-100.5 26.9-140.4 22.4-28.2 59-48.7 91-48.7 4.5 0 9 .6 13.5 1.3-2.6 49.3-25 95.5-55.2 127.5-21.7 23.1-57.2 44.2-76.2 60.3z"/>
      </svg>
      Pay
    </button>
  );
}

// ── GooglePayButton ──────────────────────────────────────────────
export function GooglePayButton({ onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white border-2 border-neutral-200 text-neutral-800 font-semibold text-[15px] hover:bg-neutral-50 transition disabled:opacity-60"
    >
      {/* Google G mark */}
      <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
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
        <p className="text-navy/55 text-sm mb-6">Fill in the details and we will confirm shortly.</p>
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
              {(() => {
                const today = new Date();
                const min = today.toISOString().slice(0, 10);
                const max = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
                return (
                  <input
                    name="date"
                    type="date"
                    className="field"
                    required
                    min={min}
                    max={max}
                  />
                );
              })()}
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
