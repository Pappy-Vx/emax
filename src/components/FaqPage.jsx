'use client';
import Link from 'next/link';
import { useReveal, GoldButton, PHONE, TEL } from './shared';
import Icons from './icons';

/* ─── FAQ data ─── */
const FAQ_COMMON = [
  {
    q: 'How much does eMax Errands cost?',
    a: 'Pricing depends on the distance and wait time. Local errands start from $9.99. Call or text (812) 565-9585 for a quick, no-obligation quote — no commitment required.',
  },
  {
    q: 'What areas in Columbus, Indiana do you serve?',
    a: 'We serve all of Columbus, Indiana and surrounding Bartholomew, Johnson, Jackson, Jennings, Decatur, Shelby and Brown Counties. We also extensively cover Greenwood, Edinburgh, Nashville, Bloomington, and Seymour, Indiana.',
  },
  {
    q: 'Can you do same-day delivery in Columbus, Indiana?',
    a: 'Yes. Same-day delivery is one of our most popular services in Columbus, Indiana. Call or text (812) 565-9585 and we will confirm same-day pickup and drop-off. We also do schedule recurring errands at very affordable prices.',
  },
  {
    q: 'How quickly can you complete a delivery or errand?',
    a: 'Most errands are completed same day. For urgent requests, we often respond within 5–20 minutes of your call or text. Reach us at (812) 565-9585 to confirm availability.',
  },
  {
    q: 'Do I need to download an app?',
    a: 'No app required. Just call or text (812) 565-9585 and a real person will handle everything. No accounts, no downloads — just dependable local service.',
  },
  {
    q: 'What delivery and errand services do you offer?',
    a: 'Pharmacy pickups, package delivery, grocery delivery, store returns, post office/shipping runs, document delivery, library returns, forgotten item delivery, event errand support, DIY gift creation plus delivery, and your custom errands across Columbus, Indiana and environs.',
  },
  {
    q: 'Are your delivery services available on weekends?',
    a: 'Yes. We are available Monday–Friday 8 AM–5 PM and Saturday 10 AM–2 PM. Contact us for special availability outside those hours.',
  },
];

const FAQ_ABOUT = [
  {
    q: 'What is a local errand service in Columbus, Indiana?',
    a: 'A local errand service is a service that completes everyday tasks like pickups, drop-offs, and returns so you do not have to leave your home, office, or routine.',
  },
  {
    q: 'How does eMax Errands & More work?',
    a: 'You send a simple request, confirm the details, and eMax completes the errand for you. You receive updates and confirmation when the task is finished.',
  },
  {
    q: 'Is it safe to use an errand service in Columbus?',
    a: 'Yes. Safety comes from clear communication, step-by-step confirmation, and completion updates so you always know what is happening.',
  },
  {
    q: 'How do I know my items are handled properly?',
    a: 'Each errand is handled with direct instructions and confirmation updates with pictures on handling and delivery, ensuring transparency from start to finish.',
  },
  {
    q: 'Is an errand service cheaper than doing errands myself?',
    a: 'Often yes when you factor in fuel, time, and interruption of work or personal time. The value comes from time saved, not just distance traveled.',
  },
  {
    q: 'Can I use an errand service for small tasks?',
    a: 'Yes. Most customers start with small, everyday errands that do not justify leaving work or interrupting their schedule.',
  },
  {
    q: 'Why do quick errands take so long?',
    a: 'Because they include driving, parking, waiting, and returning — turning a "quick stop" into 30–90 minutes of interrupted time.',
  },
  {
    q: 'Why do people in Columbus use errand services?',
    a: 'Because small errands repeatedly interrupt evenings, weekends, and focus time, even when they seem "quick."',
  },
  {
    q: 'When should I consider using eMax Errands & More?',
    a: 'When small errands start breaking your focus, delaying your evenings, or stacking up during the week.',
  },
];

/* ─── Reusable accordion ─── */
function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={i}
          className="reveal group bg-stone rounded-2xl border border-navy/8 overflow-hidden"
        >
          <summary className="flex items-start justify-between gap-4 cursor-pointer px-6 py-5 font-display font-bold text-navy text-[1rem] leading-snug [list-style:none] hover:text-gold-deep transition-colors duration-200">
            <span>{item.q}</span>
            <span className="mt-0.5 shrink-0 w-7 h-7 grid place-items-center rounded-full bg-navy/8 text-navy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="px-6 pb-5 text-navy/70 leading-relaxed text-[15px]">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

/* ─── Placeholder for upcoming sections ─── */
function ComingSoon({ title }) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        Coming Soon
      </div>
      <h2 className="font-display font-black text-[32px] sm:text-[40px] text-navy mb-5 leading-tight">
        {title}
      </h2>
      <p className="text-navy/60 text-[15px] leading-relaxed max-w-md mx-auto mb-8">
        This section is being finalised. If you have any immediate questions about our policies or terms, please reach out directly.
      </p>
      <GoldButton href={TEL}>
        <Icons.Phone size={16} stroke={2.2} />
        Call or Text {PHONE}
      </GoldButton>
    </div>
  );
}

/* ─── Main page component ─── */
export default function FaqPage() {
  useReveal();

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-navy hex-pattern pt-36 pb-20 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] bg-gold/15 text-gold rounded-full mb-6 rise rise-1">
            Help Centre
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-5 rise rise-2">
            FAQ, Policies &amp;<br />Terms
          </h1>
          <p className="text-white/65 text-lg leading-relaxed rise rise-3">
            Everything you need to know about e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup> Errands &amp; More — our services, how we work, and what to expect.
          </p>
        </div>
      </section>

      {/* ── Sticky section nav ── */}
      <div className="sticky top-[91px] z-30 bg-stone/95 backdrop-blur-sm border-b border-navy/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-1 overflow-x-auto py-3">
          {[
            { label: 'FAQ',              href: '#faq'      },
            { label: 'Policies',         href: '#policies' },
            { label: 'Terms & Conditions', href: '#terms'  },
          ].map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold text-navy/65 hover:bg-navy/8 hover:text-navy transition-all duration-200"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-[140px]">

        {/* Group 1 – Common Questions */}
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="reveal mb-10">
              <div className="text-xs uppercase tracking-[0.22em] text-navy/50 font-semibold mb-3">Common Questions</div>
              <h2 className="font-display font-black text-[28px] sm:text-[36px] text-navy leading-tight">
                Pricing, availability &amp; how it works
              </h2>
            </div>
            <Accordion items={FAQ_COMMON} />
          </div>
        </div>

        {/* Divider */}
        <div className="bg-navy/4 h-px max-w-3xl mx-auto" />

        {/* Group 2 – About Errand Services */}
        <div className="bg-cream py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="reveal mb-10">
              <div className="text-xs uppercase tracking-[0.22em] text-navy/50 font-semibold mb-3">About Errand Services</div>
              <h2 className="font-display font-black text-[28px] sm:text-[36px] text-navy leading-tight">
                Understanding what we do &amp; why it helps
              </h2>
            </div>
            <Accordion items={FAQ_ABOUT} />

            <div className="reveal mt-14 bg-navy rounded-3xl p-8 text-white text-center">
              <p className="text-white/70 text-[15px] mb-5 leading-relaxed">
                Still have a question? We&rsquo;re one call or text away.
              </p>
              <GoldButton href={TEL}>
                <Icons.Phone size={16} stroke={2.2} />
                Call or Text {PHONE}
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Policies ── */}
      <section id="policies" className="scroll-mt-[140px] bg-white border-t border-navy/8">
        <ComingSoon title="Our Policies" />
      </section>

      {/* ── Terms & Conditions ── */}
      <section id="terms" className="scroll-mt-[140px] bg-cream border-t border-navy/8">
        <ComingSoon title="Terms &amp; Conditions" />
      </section>

    </main>
  );
}
