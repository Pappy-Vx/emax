'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const STATUS_COLORS = {
  scheduled:    'bg-blue-50 text-blue-700',
  confirmed:    'bg-indigo-50 text-indigo-700',
  'picked-up':  'bg-yellow-50 text-yellow-700',
  'on-the-way': 'bg-amber-50 text-amber-700',
  completed:    'bg-green-50 text-green-700',
  cancelled:    'bg-red-50 text-red-700',
};

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function ErrandCard({ e, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl border border-gray-100 p-4 hover:border-navy/20 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="font-semibold text-navy text-base capitalize">{e.type} Errand</span>
        <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {e.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 truncate">{e.fromAddress} → {e.toAddress}</p>
      {e.notes && <p className="text-xs text-amber-600 mt-1 truncate italic">{e.notes}</p>}
      <p className="text-xs text-gray-400 mt-1">{fmt(e.scheduledAt)}</p>
    </button>
  );
}

function ActiveTab({ errands, router }) {
  const active = errands.filter((e) => !['completed', 'cancelled'].includes(e.status));

  if (!active.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-lg font-semibold text-navy mb-2">No active errands</p>
        <p className="text-sm">You don't have any errands assigned right now. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {active.map((e) => (
        <ErrandCard key={e.id} e={e} onClick={() => router.push(`/rider/errands/${e.id}`)} />
      ))}
    </div>
  );
}

function HistoryTab({ errands, router }) {
  const done = errands.filter((e) => ['completed', 'cancelled'].includes(e.status));

  if (!done.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-lg font-semibold text-navy mb-2">No history yet</p>
        <p className="text-sm">Completed and cancelled errands will appear here.</p>
      </div>
    );
  }

  const completed = done.filter((e) => e.status === 'completed');
  const cancelled = done.filter((e) => e.status === 'cancelled');

  return (
    <div>
      {completed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Completed · {completed.length}
          </h3>
          <div className="flex flex-col gap-3">
            {completed.map((e) => (
              <ErrandCard key={e.id} e={e} onClick={() => router.push(`/rider/errands/${e.id}`)} />
            ))}
          </div>
        </div>
      )}
      {cancelled.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Cancelled · {cancelled.length}
          </h3>
          <div className="flex flex-col gap-3">
            {cancelled.map((e) => (
              <ErrandCard key={e.id} e={e} onClick={() => router.push(`/rider/errands/${e.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HelpDeskTab() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What if the customer gives me the wrong code?',
      a: 'Ask the customer to check their confirmation email for the 4-digit code. If they can\'t find it, contact the ops team — an admin can manually override and complete the errand on your behalf.',
    },
    {
      q: 'What do I do if I can\'t reach the pickup location?',
      a: 'Call or message the customer using the contact info on the errand detail page. If you\'re unable to pick up, contact ops immediately so the errand can be reassigned. Do not cancel without talking to ops first.',
    },
    {
      q: 'My errand is still "scheduled" — when should I confirm it?',
      a: 'Mark it as "Confirmed" once you\'ve acknowledged the errand and are planning to fulfill it. Mark "Picked Up" once you\'ve retrieved the item/package. Then "On the Way" when you\'re heading to the delivery address.',
    },
    {
      q: 'What if the customer isn\'t at the delivery address?',
      a: 'Wait a reasonable time and attempt to call/message. If you\'re unable to complete the delivery, contact ops before leaving the address. Do not mark as complete if delivery wasn\'t made.',
    },
    {
      q: 'How are errands assigned to me?',
      a: 'Errands are automatically distributed based on your daily workload. You can be assigned up to 3 errands per day. Make sure your account status is active to continue receiving assignments.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contact card */}
      <div className="bg-navy rounded-2xl p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50 mb-3">Contact Ops Team</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="text-xs text-white/50">Email</p>
              <p className="text-sm font-medium select-all">ops@emaxerrands.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">💬</span>
            <div>
              <p className="text-xs text-white/50">WhatsApp / SMS</p>
              <p className="text-sm font-medium select-all">(812) 418-6224</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/40 mt-4">Available Mon–Sat · 8am – 7pm</p>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Delivery flow</p>
        <ol className="space-y-3">
          {[
            ['Confirm', 'Acknowledge you\'ve received the errand'],
            ['Pick Up', 'Arrive at the pickup address and collect the item'],
            ['On the Way', 'You\'re en route to the delivery address'],
            ['Complete', 'Ask the customer for their 4-digit code to confirm delivery'],
          ].map(([step, desc], i) => (
            <li key={step} className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{step}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 pt-5 pb-3">
          Frequently asked questions
        </p>
        {faqs.map((item, i) => (
          <div key={i} className="border-t border-gray-50">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
            >
              <span className="text-sm font-medium text-navy">{item.q}</span>
              <span className="shrink-0 text-gray-400 mt-0.5">{openFaq === i ? '▲' : '▼'}</span>
            </button>
            {openFaq === i && (
              <p className="text-sm text-gray-600 px-5 pb-4 -mt-1">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RiderErrands() {
  const router = useRouter();
  const [errands, setErrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');
  const [tab, setTab]         = useState('active');

  useEffect(() => {
    api.rider.errands()
      .then(setErrands)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const active  = errands.filter((e) => !['completed', 'cancelled'].includes(e.status));
  const history = errands.filter((e) => ['completed', 'cancelled'].includes(e.status));

  const tabs = [
    { key: 'active',   label: 'Active',    badge: active.length || null },
    { key: 'history',  label: 'History',   badge: history.length || null },
    { key: 'help',     label: 'Help Desk', badge: null },
  ];

  return (
    <div>
      <h2 className="font-display font-black text-navy text-2xl mb-5">My Dashboard</h2>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
        {tabs.map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
            }`}
          >
            {label}
            {badge !== null && badge > 0 && (
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                tab === key ? 'bg-navy text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>}
      {err     && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl">{err}</p>}

      {!loading && !err && tab === 'active'  && <ActiveTab   errands={errands} router={router} />}
      {!loading && !err && tab === 'history' && <HistoryTab  errands={errands} router={router} />}
      {!loading && !err && tab === 'help'    && <HelpDeskTab />}
    </div>
  );
}
