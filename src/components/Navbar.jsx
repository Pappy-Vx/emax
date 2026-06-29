'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoMark, GoldButton, TEL, PHONE } from './shared';
import Icons from './icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const handleSection = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      scrollToSection(id);
    } else {
      router.push(`/#${id}`);
    }
  };

  const links = [
    { label: 'Home',     onClick: handleHome },
    { label: 'Services', onClick: (e) => handleSection(e, 'services') },
    { label: 'Why eMax', onClick: (e) => handleSection(e, 'why') },
    { label: 'Blog',     href: '/blog' },
    { label: 'Contact',  href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-white/85 backdrop-blur-md border-b border-navy/10'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[92px] flex items-center justify-between">
        <a href="/" onClick={handleHome} className="flex items-center">
          <LogoMark size={64} tone="light" />
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) =>
            l.href ? (
              <Link
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-[15px] font-medium text-navy/80 hover:text-navy rounded-full hover:bg-navy/5 transition"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href="#"
                onClick={l.onClick}
                className="px-4 py-2 text-[15px] font-medium text-navy/80 hover:text-navy rounded-full hover:bg-navy/5 transition"
              >
                {l.label}
              </a>
            )
          )}
          <a
            href={TEL}
            className="ml-2 hidden lg:flex items-center gap-1.5 px-3 py-2 font-display font-bold text-base text-navy tracking-tight hover:text-gold transition"
          >
            <Icons.Phone size={15} stroke={2.5} className="text-gold shrink-0" />
            {PHONE}
          </a>
          <GoldButton size="sm" href={TEL} className="ml-2">
            <Icons.Phone size={16} stroke={2.2} />
            Book Now
          </GoldButton>
        </nav>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid place-items-center w-11 h-11 rounded-full border border-navy/15 text-navy"
        >
          {open ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-6 pt-2 flex flex-col gap-1 bg-white/95 border-t border-navy/10">
          {links.map((l) =>
            l.href ? (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-navy rounded-xl hover:bg-navy/5"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href="#"
                onClick={l.onClick}
                className="px-3 py-3 text-base font-medium text-navy rounded-xl hover:bg-navy/5"
              >
                {l.label}
              </a>
            )
          )}
          <GoldButton href={TEL} className="mt-3 w-full">
            <Icons.Phone size={16} stroke={2.2} />
            Call or Text Now
          </GoldButton>
        </div>
      </div>
    </header>
  );
}
