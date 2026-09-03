'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const partners = [
  { src: '/columbus-chamber-wide-logo.png', alt: 'Columbus Indiana Chamber of Commerce', label: 'Chamber Member', cardBg: '#ffffff' },
  { src: '/LeadHERshiplogo.avif',           alt: 'LeadHERship',                          label: 'LeadHERship',   cardBg: '#111111' },
  { src: '/FocalPointLogos.jpeg',           alt: 'Focal Point',                          label: 'Focal Point',   cardBg: '#ffffff' },
  { src: '/sanerlogo.jpg',                  alt: 'Saner',                                label: 'Saner',         cardBg: '#ffffff' },
  { src: '/turtleflowerlogo.jpg',           alt: 'Turtle Flower',                        label: 'Turtle Flower', cardBg: '#ffffff' },
  { src: '/zolalogo.jpg',                   alt: 'Zola',                                 label: 'Zola',          cardBg: '#ffffff' },
];

// Four repetitions gives enough width for the parallax travel range on any screen
const row1 = [...partners, ...partners, ...partners, ...partners];
const row2 = [...partners].reverse().concat(
  [...partners].reverse(),
  [...partners].reverse(),
  [...partners].reverse()
);

function LogoCard({ src, alt, cardBg }) {
  const isDark = cardBg && cardBg !== '#ffffff';
  return (
    <div
      className="relative flex-shrink-0 w-44 h-20 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden group"
      style={{ background: cardBg || '#ffffff', border: isDark ? 'none' : '1px solid rgba(0,32,63,0.08)' }}
    >
      {/* gold underline accent on hover */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="176px"
        className="object-contain p-3"
      />
    </div>
  );
}

export default function Partners() {
  const sectionRef = useRef(null);
  const track1Ref  = useRef(null);
  const track2Ref  = useRef(null);

  useEffect(() => {
    let rafId;

    const tick = () => {
      const section = sectionRef.current;
      if (!section || !track1Ref.current || !track2Ref.current) return;

      const rect    = section.getBoundingClientRect();
      const viewH   = window.innerHeight;
      // progress goes 0→1 as section travels from below-fold to above-fold
      const progress = (viewH - rect.top) / (viewH + rect.height);
      // offset in px — ±180 across the full scroll range
      const offset   = (progress - 0.5) * 360;

      track1Ref.current.style.transform = `translateX(${-offset}px)`;
      track2Ref.current.style.transform = `translateX(${offset}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tick(); // seed initial position
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-navy-deep py-24 sm:py-32 overflow-hidden">
      {/* faint hex pattern for texture */}
      <div className="absolute inset-0 hex-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* heading */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 mb-16 text-center">
        <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Membership &amp; Partnerships
        </div>
        <h2 className="reveal delay-1 mt-5 font-display font-black text-[38px] sm:text-[52px] leading-[1.08] text-white">
          Trusted by our <span className="text-gold">community.</span>
        </h2>
        <p className="reveal delay-2 mt-4 text-white/65 text-lg leading-relaxed max-w-xl mx-auto">
          Proud to be connected with organizations that support and serve Columbus, Indiana and the surrounding region.
        </p>
      </div>

      {/* parallax logo rows */}
      <div className="space-y-5">
        {/* Row 1 — drifts left as you scroll down */}
        <div className="overflow-hidden">
          <div
            ref={track1Ref}
            className="flex items-center gap-5 will-change-transform"
            style={{ width: 'max-content', transition: 'transform 0.05s linear' }}
          >
            {row1.map((p, i) => (
              <LogoCard key={i} {...p} />
            ))}
          </div>
        </div>

        {/* Row 2 — drifts right as you scroll down */}
        <div className="overflow-hidden">
          <div
            ref={track2Ref}
            className="flex items-center gap-5 will-change-transform"
            style={{ width: 'max-content', transition: 'transform 0.05s linear' }}
          >
            {row2.map((p, i) => (
              <LogoCard key={i} {...p} />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
