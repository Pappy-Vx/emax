'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReveal, GoldButton, OutlineButton, PHONE, TEL, SMS, whatsappLink } from './shared';
import Icons from './icons';
import FlowSection from './Flow';
import Partners from './Partners';

/* ─── Live route card data ─── */
const ERRAND_POOL = [
  { label: 'Grocery pickup',     sub: 'Kroger → Mapleton St'        },
  { label: 'Document delivery',  sub: 'Signed lease → law office'   },
  { label: 'Package drop-off',   sub: 'FedEx — 3 boxes'             },
  { label: 'Prescription run',   sub: 'Walgreens → Main St'         },
  { label: 'Event supplies',     sub: 'Party City → venue'          },
  { label: 'Forgotten item',     sub: 'Home → Cummins HQ'           },
  { label: 'Birthday flowers',   sub: "Florist → recipient's home"  },
  { label: 'UPS drop-off',       sub: 'Prepaid boxes — 2 stops'     },
  { label: 'Bank deposit',       sub: 'Docs → Fifth Third Bank'     },
  { label: 'Dry cleaning',       sub: 'Clean Slate → pickup'        },
  { label: 'Medical records',    sub: 'Columbus Reg. → clinic'      },
  { label: 'Store exchange',     sub: 'Best Buy → Columbus Mall'    },
  { label: 'Library run',        sub: 'Bartholomew Co. Library'     },
  { label: 'Office supply run',  sub: 'Staples → downtown office'   },
];

const fmtTime = (offsetMins = 0) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMins);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const services = [
  { icon: 'Pharmacy', title: 'Pharmacy Pickup',         desc: 'Prescriptions picked up and delivered right to your door, quickly and discreetly.' },
  { icon: 'Return',   title: 'Store Returns',           desc: 'We handle the lines, the receipts, and the back-and-forth so you don\'t have to.' },
  { icon: 'Bag',      title: 'Store Pickups',           desc: 'Curbside, in-store, or special orders, we\'ll grab it and bring it home.' },
  { icon: 'Doc',      title: 'Document Delivery',       desc: 'Time-sensitive paperwork hand-delivered across Columbus the same day.' },
  { icon: 'Mail',     title: 'Post Office Runs',        desc: 'Drop-offs, certified mail, packages, we\'ll stand in line so you can keep moving.' },
  { icon: 'Book',     title: 'Library Returns',         desc: 'Avoid late fees. We\'ll return your books and pick up your holds.' },
  { icon: 'Box',      title: 'Forgotten Item Delivery', desc: 'Left it at home? At the office? We\'ll grab it and bring it where you are.' },
  { icon: 'Calendar', title: 'Event Errand Support',    desc: 'Full-day support for weddings, parties, and gatherings, your behind-the-scenes runner.' },
  { icon: 'Sparkle',  title: 'Custom Errands',          desc: 'If it needs doing and it\'s legal, just ask. We\'re here to help.' },
];

const personas = [
  { Icon: Icons.Family,    title: 'Busy Families',        desc: 'Reclaim weeknights and weekends from the never-ending errand list.' },
  { Icon: Icons.Briefcase, title: 'Professionals',        desc: 'Stay focused at work. We handle the run-around during your day.' },
  { Icon: Icons.Heart,     title: 'Seniors & Caregivers', desc: 'Friendly, dependable help for the things that have gotten harder.' },
  { Icon: Icons.Building,  title: 'Small Businesses',     desc: 'Deliveries, supply runs, and document drops, without the overhead.' },
  { Icon: Icons.Home,      title: 'Households',           desc: 'Single, retired, or just plain busy, we make daily life lighter.' },
];

const testimonials = [
  {
    quote: 'Elizabeth with EMax was amazing to work with! I needed a package picked up and dropped off at a local UPS Store and she got right on it. Very friendly, trustworthy, and reliable. Would absolutely work with them again! Thank you!!',
    name: 'Brad D.',
    where: 'Seattle, WA',
    stars: 5,
  },
  {
    quote: 'Outstanding service! I couldn\'t be happier with my experience. This company is incredibly efficient, reliable, and delivers on time. The communication throughout was excellent — she kept me informed every step of the way. I highly recommend them and will definitely continue using their services in the future!',
    name: 'Adeola A.',
    where: 'Columbus, IN',
    stars: 5,
  },
  {
    quote: 'Excellent service by Elizabeth from eMax errands and more. Dealing with eMax was smooth and fast. I will definitely do it again.',
    name: 'Tee A.',
    where: 'Columbus, IN',
    stars: 5,
  },
];

const differentiators = [
  {
    Icon: Icons.Pin,
    kicker: '01',
    title: 'Local & Personal',
    desc: 'We know Columbus. We\'re your neighbors, not an algorithm. Every errand handled by a real person who lives here.',
  },
  {
    Icon: Icons.Msg,
    kicker: '02',
    title: 'No App Required',
    desc: 'Book by call or text. Simple, flexible, and human. No accounts, no downloads, no friction.',
  },
  {
    Icon: Icons.Clock,
    kicker: '03',
    title: 'Reliable & Responsive',
    desc: 'Same-day, one-time, or recurring, we show up when you need us. On time, every time.',
  },
];

const faqs = [
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
    a: 'Yes. Same-day delivery is one of our most popular services in Columbus, Indiana. Call or text (812) 565-9585 and we will confirm same-day pickup and drop-off. We also do scheduled recurring errands at very affordable prices.',
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

const steps = [
  { n: '1', title: 'Call or Text',          desc: 'Reach out to (812) 565-9585. A real person picks up.',               Icon: Icons.Phone },
  { n: '2', title: 'Tell Us What You Need', desc: 'Share the errand, where, and when. We\'ll confirm in minutes.',       Icon: Icons.Msg   },
  { n: '3', title: 'We Handle It',          desc: 'Sit back. We pick up, drop off, and report back when it\'s done.',    Icon: Icons.Check },
];

export default function Landing() {
  useReveal();
  const router = useRouter();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const WA_MOBILE = whatsappLink("Hi! I'd like to ask about eMax Errands & More services.");

  return (
    <main className="page-in pb-[72px] sm:pb-0">
      {/* ===== 1. HERO ===== */}
      <section className="relative overflow-hidden bg-navy text-white pt-[120px] pb-24 sm:pt-[140px] sm:pb-32">
        <div className="absolute inset-0 hex-pattern opacity-50" />
        <div className="absolute inset-0 diag-stripe" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-gold/5 blur-3xl" />

        <svg
          aria-hidden="true"
          viewBox="0 0 800 400"
          className="absolute right-[-60px] bottom-[-40px] w-[680px] max-w-[80%] opacity-90 route-glow hidden md:block"
        >
          <defs>
            <linearGradient id="route" x1="0" x2="1">
              <stop offset="0"   stopColor="#fdbd2a" stopOpacity="0" />
              <stop offset="0.4" stopColor="#fdbd2a" stopOpacity="0.9" />
              <stop offset="1"   stopColor="#fdbd2a" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d="M 20 320 Q 180 320 220 240 T 420 180 T 620 120 T 780 40" stroke="url(#route)" strokeWidth="2.5" strokeDasharray="6 8" fill="none" />
          <circle cx="20"  cy="320" r="8"  fill="#fdbd2a" />
          <circle cx="20"  cy="320" r="14" fill="#fdbd2a" fillOpacity="0.2" />
          <circle cx="780" cy="40"  r="10" fill="#fdbd2a" />
          <circle cx="780" cy="40"  r="18" fill="#fdbd2a" fillOpacity="0.2" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="rise rise-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Columbus, Indiana · No App Required
            </div>
            <h1 className="rise rise-2 mt-6 font-display font-black text-[44px] sm:text-[64px] lg:text-[80px] leading-[1.02] tracking-tight">
              Less running.<br />
              <span className="text-gold">More living.</span>
            </h1>
            <p className="rise rise-3 mt-7 text-lg sm:text-xl text-white/75 max-w-xl leading-relaxed">
              Columbus, Indiana&rsquo;s local delivery &amp; errand service — no app, no subscription.{' '}
              e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup> handles your everyday runs so you can focus on the people, work, and rest that matter most.
            </p>
            <div className="rise rise-4 mt-9 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <GoldButton href={TEL} size="lg">
                  <Icons.Phone size={18} stroke={2.2} />
                  Book Now
                </GoldButton>
                <OutlineButton
                  href="#services"
                  tone="light"
                  size="lg"
                  onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
                >
                  See Our Services
                  <Icons.Arrow size={16} stroke={2.2} />
                </OutlineButton>
              </div>
              <a href={TEL} className="inline-flex items-center gap-3 group">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-gold/20 border border-gold/40 text-gold shrink-0 group-hover:bg-gold group-hover:text-navy transition">
                  <Icons.Phone size={20} stroke={2.2} />
                </span>
                <span className="font-display font-black text-[34px] sm:text-[48px] text-white tracking-tight leading-none group-hover:text-gold transition">
                  {PHONE}
                </span>
              </a>
            </div>

            <div className="rise rise-5 mt-12 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#fdbd2a" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/85 text-sm font-bold">5.0</span>
                <span className="text-white/50 text-sm">· Trusted by Columbus families</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-white/65 text-sm">
                <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> Same-day available</div>
                <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> No app required</div>
                <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> Locally owned</div>
              </div>
            </div>
          </div>

          {/* Right: live route card */}
          <div className="md:col-span-5 relative hidden md:block">
            <LiveRouteCard />
          </div>
        </div>

        {/* Marquee */}
        <div className="relative mt-20 border-t border-white/10 pt-6">
          <div className="overflow-hidden">
            <div className="marquee-track flex items-center gap-12 whitespace-nowrap text-white/40 font-display font-semibold text-xl tracking-tight">
              {[0, 1].map((k) => (
                <span key={k} className="flex items-center gap-12">
                  {['Pharmacy Pickup', 'Store Returns', 'Document Delivery', 'Post Office Runs', 'Library Returns', 'Forgotten Items', 'Event Support', 'Custom Errands'].map((w, i) => (
                    <span key={i} className="flex items-center gap-12">
                      <span>{w}</span>
                      <span className="text-gold/70">✱</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. SERVICES ===== */}
      <section id="services" className="relative bg-cream py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div className="reveal max-w-2xl">
              <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">What We Do</div>
              <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
                We handle the errands<br />that eat your day.
              </h2>
            </div>
            <p className="reveal delay-1 md:max-w-sm text-navy/70 leading-relaxed text-lg">
              Some of the many ways we save you time across Columbus, and one more for whatever isn&rsquo;t on the list.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => {
              const IconC = Icons[s.icon];
              return (
                <article
                  key={s.title}
                  className={`svc-card reveal delay-${(i % 6) + 1} group relative bg-white rounded-2xl p-7 border border-navy/8 shadow-card overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
                  <div className="absolute top-7 right-7 svc-num text-4xl font-display font-black text-navy/10 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="svc-icon-bg inline-grid place-items-center w-14 h-14 rounded-2xl bg-navy/5 text-navy transition">
                    <IconC size={26} stroke={1.8} />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-xl text-navy tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-navy/65 text-[15px] leading-relaxed">{s.desc}</p>
                </article>
              );
            })}
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="text-navy/70">Don&rsquo;t see what you need?</span>
            <a href={SMS} className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep transition">
              Just ask, we probably do it.
            </a>
          </div>
        </div>
      </section>

      {/* ===== 3. WHO WE SERVE ===== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">Who We Serve</div>
            <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
              Built for busy people <span className="text-gold">like you.</span>
            </h2>
            <p className="mt-5 text-navy/65 text-lg leading-relaxed">
              Whatever the season of life, e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup> fits into it. Here&rsquo;s who calls us most.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {personas.map((p, i) => (
              <div
                key={p.title}
                className={`reveal delay-${(i % 5) + 1} group relative bg-stone rounded-3xl p-7 hover:bg-navy hover:text-white transition-all duration-300 border border-transparent hover:border-gold/30`}
              >
                <div className="w-14 h-14 grid place-items-center rounded-2xl bg-white text-navy group-hover:bg-gold group-hover:text-navy transition">
                  <p.Icon size={26} stroke={1.8} />
                </div>
                <h3 className="mt-5 font-display font-bold text-lg tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65 group-hover:text-white/75 transition">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. WHY EMAX ===== */}
      <section id="why" className="relative bg-navy text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-40" />
        <div className="absolute -top-24 right-0 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-16">
            <div className="md:col-span-7 reveal">
              <div className="text-xs uppercase tracking-[0.22em] text-gold font-semibold mb-4">Why e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup></div>
              <h2 className="font-display font-black text-[40px] sm:text-[60px] leading-[1.05]">
                Not an app.<br />
                A <span className="text-gold">real local</span> service.
              </h2>
            </div>
            <p className="md:col-span-5 reveal delay-1 text-white/70 text-lg leading-relaxed">
              You&rsquo;re not booking through a faceless platform. You&rsquo;re calling a neighbor who&rsquo;ll actually show up, and remember your name next time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {differentiators.map((d, i) => (
              <div
                key={d.title}
                className={`reveal delay-${i + 1} relative bg-navy-soft border border-white/10 rounded-3xl p-8 group hover:border-gold/40 transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gold text-navy">
                    <d.Icon size={26} stroke={2} />
                  </div>
                  <div className="font-display font-black text-5xl text-white/10 tabular-nums">{d.kicker}</div>
                </div>
                <h3 className="mt-6 font-display font-bold text-2xl tracking-tight">{d.title}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4.5 DELIVERY FLOW ===== */}
      <FlowSection />

      {/* ===== 4.7 MEMBERSHIP & PARTNERSHIPS ===== */}
      <Partners />

      {/* ===== 5. SOCIAL PROOF ===== */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">Trusted Locally</div>
            <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
              Why Columbus chooses <span className="text-gold">e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup>.</span>
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                className={`reveal delay-${i + 1} relative bg-white rounded-3xl p-8 border border-navy/8 shadow-card border-l-4 border-l-gold`}
              >
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: t.stars }).map((_, k) => (
                    <Icons.Star key={k} size={18} stroke={1.5} className="fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-navy/85 text-[17px] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-navy/10">
                  <div className="font-display font-bold text-navy">{t.name}</div>
                  <div className="text-sm text-navy/55">{t.where}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. HOW IT WORKS ===== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">How It Works</div>
            <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
              As easy as <span className="text-gold">1, 2, 3.</span>
            </h2>
          </div>

          <div className="relative mt-16 grid md:grid-cols-3 gap-10 md:gap-6">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
            {steps.map((s, i) => (
              <div key={s.n} className={`reveal delay-${i + 1} relative flex flex-col items-center text-center md:px-6`}>
                <div className="relative">
                  <span className="step-num block text-[120px] sm:text-[140px] text-gold/15 leading-none">{s.n}</span>
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid place-items-center w-20 h-20 rounded-full bg-navy text-gold ring-8 ring-white">
                      <s.Icon size={28} stroke={2} />
                    </span>
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold text-2xl text-navy tracking-tight">{s.title}</h3>
                <p className="mt-2 text-navy/65 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-16 text-center">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Start with a call — {PHONE}
            </GoldButton>
          </div>
        </div>
      </section>

      {/* ===== 6.5 FAQ ===== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center mb-14">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">FAQ</div>
            <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
              Common questions,<br /><span className="text-gold">answered.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="reveal group bg-stone rounded-2xl border border-navy/8 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-7 py-5 font-display font-bold text-navy text-[1.05rem] leading-snug [list-style:none] hover:text-gold-deep transition-colors duration-200">
                  <span>{faq.q}</span>
                  <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-navy/8 text-navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  </span>
                </summary>
                <div className="px-7 pb-6 text-navy/70 leading-relaxed text-[15px]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="reveal mt-12 text-center">
            <p className="text-navy/55 mb-5 text-[15px]">Still have questions? We&rsquo;re one text away.</p>
            <GoldButton href={TEL}>
              <Icons.Phone size={16} stroke={2.2} />
              Call or Text (812) 565-9585
            </GoldButton>
          </div>
        </div>
      </section>

      {/* ===== 7. CTA BANNER ===== */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-50" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-gold/10 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-28 text-center">
          <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em]">
            <Icons.Sparkle size={14} stroke={2} />
            Ready when you are
          </div>
          <h2 className="reveal delay-1 mt-6 font-display font-black text-[44px] sm:text-[72px] leading-[1.02] tracking-tight">
            Ready to get your<br /><span className="text-gold">time back?</span>
          </h2>
          <p className="reveal delay-2 mt-7 text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            Call or text {PHONE} to schedule your first errand today. No app, no hassle — just dependable local help.
          </p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call or Text Now
            </GoldButton>
            <OutlineButton
              tone="light"
              size="lg"
              href="/contact"
            >
              Send a Message
              <Icons.Arrow size={16} stroke={2.2} />
            </OutlineButton>
          </div>
        </div>
      </section>
      {/* ===== MOBILE STICKY CTA BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] flex sm:hidden items-center gap-3 bg-white/95 backdrop-blur-sm border-t border-navy/10 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]">
        <a
          href={TEL}
          className="flex-1 flex items-center justify-center gap-2 bg-navy text-white rounded-xl py-3.5 font-semibold text-[15px]"
        >
          <Icons.Phone size={16} stroke={2.2} />
          Call Now
        </a>
        <a
          href={WA_MOBILE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-[15px] text-white"
          style={{ background: '#25D366' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </main>
  );
}

/* ─── Live Route Card ─── */
function LiveRouteCard() {
  const [orders, setOrders] = useState([
    { id: 1, label: 'Pharmacy pickup', sub: 'CVS → Hawcreek Dr',      time: '9:14 AM',  state: 'Delivered',   isNew: false, isExit: false, delivAt: null },
    { id: 2, label: 'Post office run', sub: 'Certified mail — USPS',  time: '11:30 AM', state: 'In progress', isNew: false, isExit: false, delivAt: null },
    { id: 3, label: 'Store return',    sub: 'Target → Columbus Mall', time: '1:00 PM',  state: 'Scheduled',   isNew: false, isExit: false, delivAt: null },
  ]);

  const tickRef    = useRef(0);
  const poolRef    = useRef([...ERRAND_POOL]);
  const nextIdRef  = useRef(10);

  useEffect(() => {
    // Advance order states every 3.5 s
    const stateTick = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      setOrders(prev => {
        let next = prev.filter(o => !o.isExit);

        if (t % 2 === 0) {
          const idx = next.findIndex(o => o.state === 'In progress');
          if (idx !== -1) next[idx] = { ...next[idx], state: 'Delivered', delivAt: Date.now() };
        } else {
          const idx = next.findIndex(o => o.state === 'Scheduled');
          if (idx !== -1) next[idx] = { ...next[idx], state: 'In progress' };
        }

        // Mark delivered items older than 5 s for exit
        return next.map(o =>
          o.state === 'Delivered' && o.delivAt && Date.now() - o.delivAt > 5000
            ? { ...o, isExit: true }
            : o
        );
      });
    }, 3500);

    // Inject a new order every 7 s when space is available
    const newOrderTick = setInterval(() => {
      if (poolRef.current.length === 0) return;
      setOrders(prev => {
        if (prev.filter(o => !o.isExit).length >= 4) return prev;
        const randIdx = Math.floor(Math.random() * poolRef.current.length);
        const errand  = poolRef.current.splice(randIdx, 1)[0];
        const id      = nextIdRef.current++;
        const time    = fmtTime(30 + Math.floor(Math.random() * 80));
        return [...prev, { id, ...errand, time, state: 'Scheduled', isNew: true, isExit: false, delivAt: null }];
      });
      setTimeout(() => setOrders(p => p.map(o => ({ ...o, isNew: false }))), 450);
    }, 7000);

    return () => { clearInterval(stateTick); clearInterval(newOrderTick); };
  }, []);

  return (
    <div className="rise rise-3 relative">
      <div className="absolute -inset-6 bg-gold/10 blur-2xl rounded-[2rem]" />
      <div className="relative bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">Today&rsquo;s Route</div>
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
        <div className="space-y-3 min-h-[168px]">
          {orders.slice(0, 4).map(r => (
            <div
              key={r.id}
              className={`flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3${r.isNew ? ' order-new' : ''}${r.isExit ? ' order-exit' : ''}`}
            >
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold/15 text-gold shrink-0">
                <Icons.Pin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white/60">{r.time}</div>
                <div className="text-[15px] font-semibold text-white truncate">{r.label}</div>
                <div className="text-[12px] text-white/50 truncate">{r.sub}</div>
              </div>
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 transition-colors duration-700 ${
                r.state === 'Delivered'   ? 'bg-gold text-navy' :
                r.state === 'In progress' ? 'bg-white/10 text-white border border-white/20' :
                                            'bg-white/5 text-white/60 border border-white/10'
              }`}>{r.state}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gold text-navy">
          <Icons.Phone size={18} stroke={2.2} />
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wider font-bold">Need something?</div>
            <div className="text-sm font-semibold">Call or text, we&rsquo;ll add it.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
