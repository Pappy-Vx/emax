'use client';
import { useState } from 'react';
import Icons from '@/components/icons';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle } from './DashUI';

const TEL = 'tel:+18125659585';
const SMS = 'sms:+18125659585';
const WHATSAPP = 'https://wa.me/18125659585';
const EMAIL = 'mailto:hello@emaxerrands.com';
const PHONE = '(812) 565-9585';

const FAQ = [
  { q: 'How quickly can you run an errand?', a: 'Most errands are completed the same day, often within 2–4 hours. Scheduling ahead (morning for afternoon) ensures the best availability.' },
  { q: 'What if the item I need isn\'t available?', a: 'We\'ll text you right away and ask how you\'d like to proceed — hold for restock, pick an alternative, or skip it entirely.' },
  { q: 'Do I need to be home when my errand is delivered?', a: 'No! Just leave delivery instructions in your address settings (e.g. "leave at side door") and we\'ll follow them.' },
];

export default function DashSupport() {
  const { notify } = useDashCtx();
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [sent, setSent] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    notify('Message sent! We will reply within 1 business day.');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Help & Support</h1>

      {/* Contact cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Text',      icon: 'Msg',   href: SMS,      color: 'bg-gold/10 text-amber-700' },
          { label: 'Call',      icon: 'Phone', href: TEL,      color: 'bg-blue-50 text-blue-700' },
          { label: 'WhatsApp',  icon: 'Msg',   href: WHATSAPP, color: 'bg-green-50 text-green-700' },
          { label: 'Email',     icon: 'Mail',  href: EMAIL,    color: 'bg-navy/5 text-navy' },
        ].map(({ label, icon, href, color }) => {
          const I = Icons[icon] || Icons.Msg;
          return (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-navy/8 hover:shadow-card transition text-center"
            >
              <div className={`grid place-items-center w-10 h-10 rounded-xl ${color}`}>
                <I size={20} stroke={1.8} />
              </div>
              <span className="text-xs font-semibold text-navy">{label}</span>
            </a>
          );
        })}
      </div>

      {/* Hours */}
      <Card>
        <div className="flex items-center gap-3">
          <Icons.Clock size={20} stroke={1.8} className="text-gold" />
          <div>
            <div className="text-sm font-semibold text-navy">Business Hours</div>
            <div className="text-xs text-navy/55">Mon–Fri 8am–5pm · Sat 10am–2pm · Closed Sunday</div>
          </div>
        </div>
      </Card>

      {/* Send a message */}
      <Card>
        <CardTitle>Send a Message</CardTitle>
        <form onSubmit={sendMessage}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your question or issue and we will get back to you within 1 business day…"
            className="field resize-none w-full mb-3"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-full py-3 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition disabled:opacity-50"
          >
            {sent ? '✓ Sent!' : 'Send message'}
          </button>
        </form>
      </Card>

      {/* FAQ */}
      <Card>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-navy/8 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-navy hover:bg-navy/3 transition"
              >
                {item.q}
                <Icons.Arrow
                  size={16}
                  stroke={2}
                  className={`flex-shrink-0 ml-3 text-navy/40 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-navy/60 border-t border-navy/6">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
