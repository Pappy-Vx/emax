'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoMark, GoldButton, TEL } from './shared';
import Icons from './icons';
import { FLAGS } from '@/lib/features';

const SERVICES = [
  { label: 'Same-Day Delivery',  href: '/services/same-day-delivery' },
  { label: 'Pharmacy Pickup',    href: '/services/pharmacy-pickup' },
  { label: 'Store Returns',      href: '/services/store-returns' },
  { label: 'Document Delivery',  href: '/services/document-delivery' },
  { label: 'Post Office Runs',   href: '/services/post-office-runs' },
];

function ServicesDropdown({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-navy/8 overflow-hidden z-50 py-2">
      {SERVICES.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-[14px] font-medium text-navy/80 hover:bg-navy/4 hover:text-navy transition"
        >
          {s.label}
        </Link>
      ))}
      <div className="mx-4 my-1.5 h-px bg-navy/8" />
      <Link
        href="/services"
        onClick={onClose}
        className="flex items-center gap-1 px-4 py-2.5 text-[14px] font-semibold text-navy hover:bg-navy/4 transition"
      >
        All services
        <Icons.Arrow size={13} stroke={2.2} className="text-gold" />
      </Link>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [mobileSvcOpen, setMobileSvcOpen] = useState(false);
  const svcRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onPointerDown = (e) => {
      if (svcRef.current && !svcRef.current.contains(e.target)) setSvcOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
  }, [pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else router.push('/');
  };

  const handleSection = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') scrollToSection(id);
    else router.push(`/#${id}`);
  };

  const navLinkCls = 'px-3.5 py-2 text-[14px] font-medium text-navy/80 hover:text-navy rounded-full hover:bg-navy/5 transition whitespace-nowrap';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-white/90 backdrop-blur-md border-b border-navy/10'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" onClick={handleHome} className="flex items-center flex-shrink-0">
          <LogoMark size={52} tone="light" />
        </a>

        {/* Desktop nav — lg and up (1024px+) */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          <a href="#" onClick={handleHome} className={navLinkCls}>Home</a>

          {/* Services dropdown */}
          <div ref={svcRef} className="relative">
            <button
              type="button"
              onClick={() => setSvcOpen((v) => !v)}
              className={`${navLinkCls} inline-flex items-center gap-1`}
            >
              Services
              {svcOpen
                ? <Icons.ChevUp  size={14} stroke={2.2} className="text-navy/50" />
                : <Icons.ChevDown size={14} stroke={2.2} className="text-navy/50" />
              }
            </button>
            <ServicesDropdown open={svcOpen} onClose={() => setSvcOpen(false)} />
          </div>

          {FLAGS.pricing && (
            <Link href="/pricing" className={navLinkCls}>Pricing</Link>
          )}
          <a href="#" onClick={(e) => handleSection(e, 'why')} className={navLinkCls}>
            Why e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup>
          </a>
          <Link href="/blog" className={navLinkCls}>Blog</Link>
          <Link href="/contact" className={navLinkCls}>Contact</Link>
          {FLAGS.dashboard && (
            <Link href="/dashboard" className={`${navLinkCls} inline-flex items-center gap-1.5`}>
              <Icons.User size={14} stroke={2} />
              Sign in
            </Link>
          )}
        </nav>

        {/* Book Now — desktop only */}
        <GoldButton size="sm" href={TEL} className="hidden lg:inline-flex flex-shrink-0">
          <Icons.Phone size={15} stroke={2.2} />
          Book Now
        </GoldButton>

        {/* Hamburger — phones + tablets (below lg) */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid place-items-center w-11 h-11 rounded-full border border-navy/15 text-navy flex-shrink-0 transition hover:bg-navy/5"
        >
          {open ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile / tablet drawer ─────────────────────────────── */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 pt-1 flex flex-col gap-0.5 bg-white border-t border-navy/8">
          {/* Home */}
          <a
            href="#"
            onClick={handleHome}
            className="flex items-center px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition"
          >
            Home
          </a>

          {/* Services accordion */}
          <div>
            <button
              type="button"
              onClick={() => setMobileSvcOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition"
            >
              <span>Services</span>
              {mobileSvcOpen
                ? <Icons.ChevUp  size={16} stroke={2} className="text-navy/40" />
                : <Icons.ChevDown size={16} stroke={2} className="text-navy/40" />
              }
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-200 ${
                mobileSvcOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pl-5 pb-1 space-y-0.5">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-[14px] text-navy/70 hover:text-navy rounded-xl hover:bg-navy/4 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {s.label}
                  </Link>
                ))}
                <Link
                  href="/services"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-[14px] font-semibold text-navy rounded-xl hover:bg-navy/4 transition"
                >
                  <Icons.Arrow size={13} stroke={2.2} className="text-gold" />
                  All services
                </Link>
              </div>
            </div>
          </div>

          {/* Other links */}
          {FLAGS.pricing && (
            <Link href="/pricing" onClick={() => setOpen(false)} className="flex items-center px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition">
              Pricing
            </Link>
          )}
          <a href="#" onClick={(e) => handleSection(e, 'why')} className="flex items-center px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition">
            Why eMax
          </a>
          <Link href="/blog" onClick={() => setOpen(false)} className="flex items-center px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition">
            Blog
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="flex items-center px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition">
            Contact
          </Link>
          {FLAGS.dashboard && (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-3 text-[15px] font-medium text-navy rounded-xl hover:bg-navy/4 transition">
              <Icons.User size={16} stroke={2} />
              Sign in
            </Link>
          )}

          {/* CTA */}
          <div className="mt-3 pt-3 border-t border-navy/8">
            <GoldButton href={TEL} className="w-full" onClick={() => setOpen(false)}>
              <Icons.Phone size={16} stroke={2.2} />
              Call or Text Now
            </GoldButton>
          </div>
        </div>
      </div>
    </header>
  );
}
