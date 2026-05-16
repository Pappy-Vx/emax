import Link from 'next/link';
import { LogoMark, PHONE, TEL } from './shared';
import Icons from './icons';

export default function Footer() {
  return (
    <footer className="relative bg-navy-deep text-white/85 pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 hex-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <LogoMark tone="dark" />
          <p className="mt-5 text-white/70 max-w-sm leading-relaxed">
            Making life easier in Columbus, Indiana. Reliable, friendly errand service, no app required.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="w-10 h-10 grid place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-gold hover:text-navy hover:border-gold transition">
              <Icons.Fb size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 grid place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-gold hover:text-navy hover:border-gold transition">
              <Icons.Ig size={18} />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-4">Quick Links</div>
          <ul className="space-y-3 text-[15px]">
            <li><Link href="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link href="/#services" className="hover:text-gold transition">Services</Link></li>
            <li><Link href="/#why" className="hover:text-gold transition">Why eMax</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-4">Get in Touch</div>
          <a href={TEL} className="group flex items-center gap-3 text-white hover:text-gold transition">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-gold text-navy">
              <Icons.Phone size={18} stroke={2.2} />
            </span>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Call or Text</div>
              <div className="text-lg font-semibold tel-no-wrap">{PHONE}</div>
            </div>
          </a>
          <div className="mt-5 flex items-start gap-3 text-white/70 text-[14px]">
            <Icons.Pin size={18} stroke={2} className="text-gold mt-0.5 shrink-0" />
            <span>Serving Columbus, Indiana &amp; surrounding areas</span>
          </div>
          <div className="mt-3 flex items-start gap-3 text-white/70 text-[14px]">
            <Icons.Clock size={18} stroke={2} className="text-gold mt-0.5 shrink-0" />
            <span>Mon–Sat, 8am–7pm</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <div>© 2025 eMax Errands &amp; More. All rights reserved.</div>
        <div>Built with care</div>
      </div>
    </footer>
  );
}
