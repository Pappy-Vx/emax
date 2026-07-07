'use client';
import { useReveal, GoldButton, TEL, SMS } from './shared';
import Icons from './icons';

const CATEGORIES = [
  {
    icon: 'Bag',
    name: 'Shopping & Retail',
    desc: 'Store runs and returns without leaving your day.',
    services: ['Store Pickups', 'Store Returns', 'Online Order Pickup', 'Curbside Pickup Assistance'],
  },
  {
    icon: 'Box',
    name: 'Delivery & Drop-Off',
    desc: 'Get items where they need to go without the detour.',
    services: ['Forgotten Item Delivery', 'Document Pickup/Delivery', 'Activity Gear Delivery', 'Appointment Item Delivery', 'Donation Drop-off'],
  },
  {
    icon: 'Mail',
    name: 'Mail, Shipping & Courier',
    desc: 'Post office and courier stops handled for you.',
    services: ['Post Office Runs', 'Certified Mail Drop-Off', 'Parcel Drop-Off/Pickup'],
  },
  {
    icon: 'Pharmacy',
    name: 'Pharmacy & Care Support',
    desc: 'Prescription pickups and care-focused errands.',
    services: ['Pharmacy Pickup', 'Senior Support Errands', 'Caregiver Relief Errands'],
  },
  {
    icon: 'Home',
    name: 'Home & Personal Tasks',
    desc: 'Personal errands that keep life running smoothly.',
    services: ['Library Returns & Pickups', 'Library Hold Pickup', 'Dry Cleaning Pickup/Drop', 'Pet Supply Pickup'],
  },
  {
    icon: 'Briefcase',
    name: 'Business & Office Support',
    desc: 'Operational errands so your team stays focused.',
    services: ['Office Supply Pickup', 'Lawn Sign Distribution', 'Estate Distribution Support', 'Check or Payment Drop-Off', 'Custom Business Errands', 'Notary Public Pickup'],
  },
  {
    icon: 'Sparkle',
    name: 'Events & Flexible Help',
    desc: 'On-call errand support for events and anything custom.',
    services: ['Event Errand Support', 'Party Runner Service', 'Custom Personal Errands'],
  },
];

export default function ServicesPage() {
  useReveal();

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative bg-navy text-white pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <div className="reveal text-xs uppercase tracking-[0.22em] text-gold font-semibold mb-5">
            What We Do
          </div>
          <h1 className="reveal delay-1 font-display font-black text-[48px] sm:text-[68px] lg:text-[80px] leading-[1.02] max-w-4xl mx-auto">
            Every errand,<br />
            <span className="text-gold">covered.</span>
          </h1>
          <p className="reveal delay-2 mt-6 text-white/65 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Categories of local errands across Columbus, Greenwood, Bloomington, Edinburgh, Nashville, and Seymour, Indiana — and a custom option for whatever isn&rsquo;t on the list.
          </p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call or Text Now
            </GoldButton>
            <a
              href={SMS}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/25 text-white font-semibold tracking-tight hover:border-white/60 hover:bg-white/10 transition-all duration-200 text-base"
            >
              <Icons.Msg size={18} stroke={2} />
              Send a Text
            </a>
          </div>
        </div>

        {/* Bottom fade into cream */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream/20 to-transparent" />
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="reveal text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">
              Service Categories
            </div>
            <h2 className="font-display font-black text-[36px] sm:text-[48px] leading-[1.07] text-navy">
              We handle the errands<br className="hidden sm:block" /> that eat your day.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat, i) => {
              const IconC = Icons[cat.icon];
              return (
                <article
                  key={cat.name}
                  className={`reveal delay-${(i % 3) + 1} group relative bg-white rounded-3xl p-8 border border-navy/8 shadow-card overflow-hidden hover:border-gold/40 hover:shadow-lg transition-all duration-300 flex flex-col`}
                >
                  {/* Gold top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gold rounded-t-3xl" />

                  {/* Number badge */}
                  <div className="absolute top-7 right-7 text-4xl font-display font-black text-navy/[0.07] tabular-nums select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-navy/5 text-navy group-hover:bg-gold group-hover:text-navy transition duration-300">
                    <IconC size={26} stroke={1.8} />
                  </div>

                  {/* Heading + desc */}
                  <h2 className="mt-5 font-display font-bold text-[1.2rem] text-navy tracking-tight leading-snug pr-8">
                    {cat.name}
                  </h2>
                  <p className="mt-1.5 text-[14px] text-navy/55 leading-relaxed">{cat.desc}</p>

                  {/* Divider */}
                  <div className="my-5 h-px bg-navy/8" />

                  {/* Service list */}
                  <ul className="space-y-2.5 flex-1">
                    {cat.services.map((svc) => (
                      <li key={svc} className="flex items-center gap-3 text-[14.5px] text-navy/75">
                        <span className="shrink-0 w-5 h-5 grid place-items-center rounded-full bg-gold/15 text-gold-deep">
                          <Icons.Check size={11} stroke={2.8} />
                        </span>
                        {svc}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          {/* "Don't see it" nudge */}
          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="text-navy/65 text-[15px]">Don&rsquo;t see what you need?</span>
            <a
              href={SMS}
              className="text-[15px] font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep transition"
            >
              Just ask — we probably do it.
            </a>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative bg-navy text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="reveal text-xs uppercase tracking-[0.22em] text-gold font-semibold mb-5">
            Custom Errands
          </div>
          <h2 className="reveal delay-1 font-display font-black text-[40px] sm:text-[56px] leading-[1.05]">
            Need something<br />
            <span className="text-gold">not on the list?</span>
          </h2>
          <p className="reveal delay-2 mt-6 text-white/65 text-lg leading-relaxed">
            Describe what you need. If it&rsquo;s in Columbus or the surrounding area and we can help, we will. No app, no platform — just a quick call or text.
          </p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <GoldButton href={TEL} size="lg">
              <Icons.Phone size={18} stroke={2.2} />
              Call (812) 565-9585
            </GoldButton>
            <a
              href={SMS}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/25 text-white font-semibold tracking-tight hover:border-white/60 hover:bg-white/10 transition-all duration-200 text-base"
            >
              <Icons.Msg size={18} stroke={2} />
              Send a Text
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
