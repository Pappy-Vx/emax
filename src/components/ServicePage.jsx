'use client';
import Link from 'next/link';
import { useReveal, GoldButton, PHONE, TEL, SMS } from './shared';
import Icons from './icons';

export default function ServicePage({ service }) {
  useReveal();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-navy hex-pattern pt-36 pb-20 text-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-gold transition">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-gold transition">Services</Link>
            <span>/</span>
            <span className="text-gold">{service.name}</span>
          </nav>

          <div className="rise rise-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Columbus, Indiana · No App Required
          </div>

          <h1 className="rise rise-2 font-display font-black text-[36px] sm:text-[52px] leading-[1.06] tracking-tight max-w-3xl">
            {service.headline}
          </h1>
          <p className="rise rise-3 mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">
            {service.heroDesc}
          </p>

          <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call or Text Now
            </GoldButton>
            <a
              href={SMS}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white/85 text-[15px] font-semibold hover:border-gold/50 hover:text-gold transition duration-200"
            >
              Text: {PHONE}
              <Icons.Arrow size={16} stroke={2.2} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Facts strip ── */}
      <section className="bg-gold text-navy py-4 overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-x-8 gap-y-2 items-center">
            {service.facts.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Icons.Check size={15} stroke={2.5} />
                <span className="font-semibold">{f.label}:</span>
                <span>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is this service ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">The Service</div>
            <h2 className="font-display font-black text-[32px] sm:text-[40px] leading-[1.1] text-navy mb-5">
              What is {service.name} with eMax?
            </h2>
            <p className="text-navy/70 leading-relaxed text-[16px]">{service.whatIs}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton href={TEL}>
                <Icons.Phone size={16} stroke={2.2} />
                Book Now
              </GoldButton>
            </div>
          </div>
          <div className="reveal delay-2">
            <div className="bg-navy rounded-3xl p-8 text-white">
              <div className="text-xs uppercase tracking-[0.22em] text-gold font-semibold mb-5">Quick details</div>
              <div className="space-y-4">
                {service.facts.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <span className="mt-0.5 grid place-items-center w-7 h-7 rounded-lg bg-gold/15 text-gold shrink-0">
                      <Icons.Check size={14} stroke={2.5} />
                    </span>
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">{f.label}</div>
                      <div className="font-semibold text-white">{f.value}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <a href={TEL} className="text-gold font-bold text-lg hover:text-gold/80 transition">{PHONE}</a>
                  <div className="text-white/50 text-xs mt-1">Call or text anytime during business hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center mb-14">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">How It Works</div>
            <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.1] text-navy">
              As easy as <span className="text-gold">1, 2, 3.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {service.howItWorks.map((step, i) => (
              <div key={i} className={`reveal delay-${i + 1} bg-white rounded-2xl p-7 border border-navy/8 shadow-card relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
                <span className="font-display font-black text-[64px] leading-none text-navy/8 select-none block -mb-3">
                  {step.n}
                </span>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{step.title}</h3>
                <p className="text-navy/65 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="reveal text-center mb-12">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">FAQ</div>
            <h2 className="font-display font-black text-[32px] sm:text-[40px] leading-[1.1] text-navy">
              Common questions <span className="text-gold">answered.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <details
                key={i}
                className="reveal group bg-stone rounded-2xl border border-navy/8 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 font-display font-bold text-navy text-[1rem] leading-snug [list-style:none] hover:text-gold-deep transition-colors duration-200">
                  <span>{faq.q}</span>
                  <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-navy/8 text-navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-navy/70 leading-relaxed text-[15px]">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy-deep text-white py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-40" />
        <div className="relative max-w-xl mx-auto px-5 text-center">
          <span className="inline-block w-12 h-1 bg-gold rounded-full mb-6" />
          <h2 className="font-display font-black text-[32px] sm:text-[44px] text-white mb-4 leading-tight">
            Ready to book {service.name.toLowerCase()}?
          </h2>
          <p className="text-white/60 text-[15px] leading-relaxed mb-8">
            No app, no account. Call or text {PHONE} and we&rsquo;ll confirm your booking in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call or Text Now
            </GoldButton>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white/80 text-[15px] font-semibold hover:border-gold/50 hover:text-gold transition duration-200"
            >
              All Services
              <Icons.Arrow size={16} stroke={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
