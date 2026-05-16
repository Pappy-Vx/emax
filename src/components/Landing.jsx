'use client';
import { useRouter } from 'next/navigation';
import { useReveal, GoldButton, OutlineButton, PHONE, TEL, SMS } from './shared';
import Icons from './icons';
import FlowSection from './Flow';

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
    quote: 'eMax has been a lifesaver. Between three kids and work, I never have time for the pharmacy. They\'re reliable, quick, and feel like family.',
    name: 'Sarah M.',
    where: 'Tipton Lakes, Columbus',
    stars: 5,
  },
  {
    quote: 'I called once for a forgotten laptop charger before a big meeting. They had it to my office in 25 minutes. I use them every week now.',
    name: 'David R.',
    where: 'Downtown Columbus',
    stars: 5,
  },
  {
    quote: 'They pick up my mom\'s prescriptions and run her library books back every week. Knowing someone friendly is checking in means the world.',
    name: 'Linda K.',
    where: 'Fair Oaks, Columbus',
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

  return (
    <main className="page-in">
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
              Columbus, Indiana
            </div>
            <h1 className="rise rise-2 mt-6 font-display font-black text-[44px] sm:text-[64px] lg:text-[80px] leading-[1.02] tracking-tight">
              Less running.<br />
              <span className="text-gold">More living.</span>
            </h1>
            <p className="rise rise-3 mt-7 text-lg sm:text-xl text-white/75 max-w-xl leading-relaxed">
              eMax handles your everyday errands across Columbus, so you can focus on the people, work, and rest that matter most.
            </p>
            <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
              <GoldButton href={TEL} size="lg">
                <Icons.Phone size={18} stroke={2.2} />
                Call or Text {PHONE}
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

            <div className="rise rise-5 mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-white/65 text-sm">
              <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> Same-day errands</div>
              <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> No app required</div>
              <div className="flex items-center gap-2"><Icons.Check size={16} stroke={2.5} className="text-gold" /> Locally owned</div>
            </div>
          </div>

          {/* Right: floating route card */}
          <div className="md:col-span-5 relative hidden md:block">
            <div className="rise rise-3 relative">
              <div className="absolute -inset-6 bg-gold/10 blur-2xl rounded-[2rem]" />
              <div className="relative bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">Today&rsquo;s Route</div>
                  <div className="text-xs text-white/60">Live</div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { time: '9:14 AM',  label: 'Pharmacy pickup', sub: 'CVS → Hawcreek Dr',       state: 'Delivered'   },
                    { time: '11:02 AM', label: 'Library returns',  sub: 'Bartholomew Co. Library', state: 'In progress' },
                    { time: '1:30 PM',  label: 'Post office run',  sub: 'Certified mail — USPS',   state: 'Scheduled'   },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3">
                      <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold/15 text-gold">
                        <Icons.Pin size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-white/60">{r.time}</div>
                        <div className="text-[15px] font-semibold text-white truncate">{r.label}</div>
                        <div className="text-[12px] text-white/50 truncate">{r.sub}</div>
                      </div>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        r.state === 'Delivered'   ? 'bg-gold text-navy' :
                        r.state === 'In progress' ? 'bg-white/10 text-white border border-white/20' :
                                                    'bg-white/5 text-white/60 border border-white/10'
                      }`}>{r.state}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gold text-navy">
                  <Icons.Phone size={18} stroke={2.2} />
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold">Need something?</div>
                    <div className="text-sm font-semibold">Call or text, we&rsquo;ll add it.</div>
                  </div>
                </div>
              </div>
            </div>
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
              Nine ways we save you time across Columbus, and one more for whatever isn&rsquo;t on the list.
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
              Whatever the season of life, eMax fits into it. Here&rsquo;s who calls us most.
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
              <div className="text-xs uppercase tracking-[0.22em] text-gold font-semibold mb-4">Why eMax</div>
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

      {/* ===== 5. SOCIAL PROOF ===== */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">Trusted Locally</div>
            <h2 className="font-display font-black text-[40px] sm:text-[56px] leading-[1.05] text-navy">
              Why Columbus chooses <span className="text-gold">eMax.</span>
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
    </main>
  );
}
