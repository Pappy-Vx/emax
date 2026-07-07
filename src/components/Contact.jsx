'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useReveal, GoldButton, OutlineButton, PHONE, TEL, SMS } from './shared';
import Icons from './icons';

const SERVICES = [
  'Pharmacy Pickup',
  'Store Returns',
  'Store Pickups',
  'Document Delivery',
  'Post Office Runs',
  'Library Returns',
  'Forgotten Item Delivery',
  'Event Errand Support (Full Day)',
  'Custom Errands',
  'Other',
];

const Field = ({ label, children, error, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="block text-xs uppercase tracking-wider text-navy/65 font-semibold mb-2">{label}</span>
    {children}
    {error && <span className="block mt-1.5 text-xs text-red-600 font-medium">{error}</span>}
  </label>
);

export default function Contact() {
  useReveal();

  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', when: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Please enter your name.';
    if (!form.phone.trim())   e.phone   = 'A phone number helps us reach you fast.';
    if (!form.service)        e.service = 'Pick what you need help with.';
    if (!form.message.trim()) e.message = 'Tell us a bit about the errand.';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError('Something went wrong. Please call us directly or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-in">
      {/* HERO */}
      <section className="relative bg-navy text-white pt-[120px] pb-20 sm:pt-[140px] sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-50" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gold/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em]">
            <Icons.Msg size={14} stroke={2} />
            Contact &amp; Booking
          </div>
          <h1 className="reveal delay-1 mt-6 font-display font-black text-[44px] sm:text-[72px] leading-[1.02] tracking-tight max-w-3xl">
            Let&rsquo;s make your <span className="text-gold gold-underline">day easier.</span>
          </h1>
          <p className="reveal delay-2 mt-7 text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed">
            Whether you have a question or you&rsquo;re ready to book, reach out, we&rsquo;re local, friendly, and ready to help.
          </p>
          <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-3">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call {PHONE}
            </GoldButton>
            <OutlineButton href={SMS} tone="light" size="lg">
              <Icons.Msg size={18} stroke={2.2} />
              Text Us
            </OutlineButton>
          </div>
        </div>
      </section>

      {/* TWO COLUMN */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
          {/* LEFT: contact info */}
          <aside className="lg:col-span-5 reveal">
            <div className="bg-white rounded-3xl border border-navy/8 shadow-card p-8">
              <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-3">Reach Out</div>
              <h2 className="font-display font-black text-3xl text-navy tracking-tight">A real person, every time.</h2>
              <p className="mt-3 text-navy/65 leading-relaxed">
                We&rsquo;re a local Columbus, Indiana business, not a call center. When you reach out, you&rsquo;re talking to a real person who genuinely wants to help.
              </p>

              <div className="mt-7 space-y-4">
                <a href={TEL} className="group flex items-center gap-4 p-4 rounded-2xl bg-cream border border-navy/8 hover:border-gold hover:bg-white transition">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gold text-navy">
                    <Icons.Phone size={22} stroke={2} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-navy/55 font-semibold">Call or Text</div>
                    <div className="font-display font-bold text-2xl text-navy tel-no-wrap">{PHONE}</div>
                    <div className="text-xs text-navy/55 mt-0.5">No app needed. Just reach out.</div>
                  </div>
                </a>

                <a href="mailto:hello@emaxerrands.com" className="group flex items-center gap-4 p-4 rounded-2xl bg-cream border border-navy/8 hover:border-gold hover:bg-white transition">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-navy/8 text-navy group-hover:bg-gold transition">
                    <Icons.Mail size={22} stroke={2} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-navy/55 font-semibold">Email</div>
                    <div className="font-semibold text-navy text-[15px]">hello@emaxerrands.com</div>
                    <div className="text-xs text-navy/55 mt-0.5">We reply within the hour during business hours.</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-navy/5 text-navy">
                    <Icons.Clock size={22} stroke={2} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-navy/55 font-semibold">Hours</div>
                    <div className="font-semibold text-navy">Mon–Sat, 8am–7pm</div>
                    <div className="text-xs text-navy/55 mt-0.5">After-hours? Send a text, we&rsquo;ll respond first thing.</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-navy/5 text-navy">
                    <Icons.Pin size={22} stroke={2} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-navy/55 font-semibold">Service Area</div>
                    <div className="font-semibold text-navy">Columbus, IN &amp; surrounding areas</div>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-navy/10">
                <div className="text-xs uppercase tracking-wider text-navy/55 font-semibold mb-3">Follow Along</div>
                <div className="flex items-center gap-3">
                  <a href="#" aria-label="Facebook" className="w-11 h-11 grid place-items-center rounded-full bg-navy text-white hover:bg-gold hover:text-navy transition">
                    <Icons.Fb size={18} />
                  </a>
                  <a href="#" aria-label="Instagram" className="w-11 h-11 grid place-items-center rounded-full bg-navy text-white hover:bg-gold hover:text-navy transition">
                    <Icons.Ig size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Trust card */}
            <div className="mt-6 reveal delay-2 bg-navy text-white rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute inset-0 hex-pattern opacity-40" />
              <div className="relative">
                <Icons.Check size={28} stroke={2.5} className="text-gold" />
                <p className="mt-3 font-display font-bold text-xl leading-snug">
                  Same-day. One-time. Recurring.
                </p>
                <p className="mt-2 text-white/70 text-sm leading-relaxed">
                  However you need us, we&rsquo;re flexible. Tell us what fits your life.
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT: form */}
          <div className="lg:col-span-7 reveal delay-1">
            <div className="bg-white rounded-3xl border border-navy/8 shadow-card p-7 sm:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gold grid place-items-center">
                    <Icons.Check size={32} stroke={3} className="text-navy" />
                  </div>
                  <h3 className="mt-6 font-display font-black text-3xl text-navy tracking-tight">Got it, talk soon!</h3>
                  <p className="mt-3 text-navy/70 max-w-md mx-auto leading-relaxed">
                    Thanks, {form.name.split(' ')[0]}. We&rsquo;ll be in touch shortly to confirm your errand. In a hurry?
                  </p>
                  <GoldButton href={TEL} className="mt-6">
                    <Icons.Phone size={18} stroke={2.2} />
                    Call {PHONE}
                  </GoldButton>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-2">Send a Message</div>
                  <h2 className="font-display font-black text-3xl text-navy tracking-tight">Tell us what you need.</h2>
                  <p className="mt-2 text-navy/65">We&rsquo;ll reply within the hour during business hours.</p>

                  <div className="mt-7 grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name *" error={errors.name}>
                      <input type="text"  className="field" placeholder="Jane Smith"            value={form.name}    onChange={update('name')}    />
                    </Field>
                    <Field label="Phone Number *" error={errors.phone}>
                      <input type="tel"   className="field" placeholder="(812) 555-0000"      value={form.phone}   onChange={update('phone')}   />
                    </Field>
                    <Field label="Email (optional)">
                      <input type="email" className="field" placeholder="you@email.com"       value={form.email}   onChange={update('email')}   />
                    </Field>
                    <Field label="Preferred Date / Time">
                      <input type="text"  className="field" placeholder="Tomorrow, around 10am" value={form.when}  onChange={update('when')}    />
                    </Field>
                    <Field label="Service Needed *" error={errors.service} className="sm:col-span-2">
                      <div className="relative">
                        <select className="field appearance-none pr-12" value={form.service} onChange={update('service')}>
                          <option value="">Select a service…</option>
                          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </div>
                    </Field>
                    <Field label="Message / Additional Details *" error={errors.message} className="sm:col-span-2">
                      <textarea rows={5} className="field resize-none" placeholder="Tell us where, when, and any details we should know…" value={form.message} onChange={update('message')} />
                    </Field>
                  </div>

                  {serverError && (
                    <p className="mt-5 text-sm text-red-600 font-medium">{serverError}</p>
                  )}
                  <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-navy/55 max-w-sm leading-relaxed">
                      By sending, you agree we may reply by call or text. We never share your info.
                    </p>
                    <GoldButton as="button" size="lg" className="self-start sm:self-auto" disabled={loading}>
                      {loading ? 'Sending…' : 'Send Message'}
                      {!loading && <Icons.Arrow size={16} stroke={2.2} />}
                    </GoldButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE OWNER */}
      <section className="bg-white py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Photo */}
            <div className="reveal relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm lg:max-w-none rounded-3xl overflow-hidden aspect-[4/5] shadow-card">
                <Image
                  src="/Elizabeth.png"
                  alt="Elizabeth Jikiemi, founder of eMax Errands & More"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wider shadow-gold">
                    <Icons.Check size={12} stroke={3} />
                    Founder &amp; Owner
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-navy/5 blur-3xl pointer-events-none" />
            </div>

            {/* Bio */}
            <div className="reveal delay-1">
              <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-3">The Person Behind eMax</div>
              <h2 className="font-display font-black text-4xl sm:text-[52px] text-navy tracking-tight leading-[1.05]">
                Meet Elizabeth<br /><span className="text-gold">Jikiemi.</span>
              </h2>

              <div className="mt-7 space-y-4 text-navy/70 leading-relaxed text-[17px]">
                <p>
                  Elizabeth didn&rsquo;t set out to build a business &mdash; she set out to be useful. One afternoon in Columbus, Indiana, she watched a neighbor juggle store packages, a parcel, and a toddler all at once, and it hit her: everyone could use a little more time. Inspired by the Midwest warmth that makes Columbus so special, she decided to do something about it.
                </p>
                <p>
                  From that spark, eMax Errands &amp; More was born. What started as Elizabeth personally handling errands has grown into a small, trusted team &mdash; each member sharing her values of reliability, care, and genuine dedication to the community.
                </p>
                <p>
                  Together, they help busy families, professionals, seniors, caregivers, and small business owners reclaim their day. From pharmacy runs and store returns to parcel pickups, document drop-offs, and custom errands, the eMax team believes every task matters.
                </p>
              </div>

              <div className="mt-8 flex items-start gap-4">
                <div className="w-1 self-stretch bg-gold rounded-full shrink-0" />
                <p className="font-display font-bold text-xl text-navy leading-snug italic">
                  &ldquo;If I can make your day a little easier, that&rsquo;s a great day for me.&rdquo;
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <GoldButton href={TEL} size="lg">
                  <Icons.Phone size={18} stroke={2.2} />
                  Reach Out to Elizabeth
                </GoldButton>
                <OutlineButton href={SMS} tone="navy" size="lg">
                  <Icons.Msg size={18} stroke={2.2} />
                  Send a Text
                </OutlineButton>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CALL STRIP */}
      <section className="bg-navy-deep text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
              Prefer to call? <span className="text-gold">{PHONE}</span>
            </h3>
            <p className="mt-2 text-white/70">We&rsquo;d love to hear from you.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} /> Call Now
            </GoldButton>
            <OutlineButton href={SMS} tone="light" size="lg">
              <Icons.Msg size={18} stroke={2.2} /> Send a Text
            </OutlineButton>
          </div>
        </div>
      </section>
    </main>
  );
}
