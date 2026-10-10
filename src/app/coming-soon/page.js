import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Coming Soon | eMax Errands & More',
  description: 'This feature is on its way. Stay tuned — eMax Errands & More is getting even better.',
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-5 py-20 text-center">
      {/* Logo */}
      <Link href="/" className="mb-10 inline-block">
        <Image
          src="/emax-logo.jpeg"
          alt="eMax Errands & More"
          width={64}
          height={64}
          className="rounded-2xl shadow-sm"
        />
      </Link>

      {/* Icon */}
      <div className="mb-6 grid place-items-center w-20 h-20 rounded-3xl bg-gold/15 text-gold">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M20 11v10l5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Heading */}
      <h1 className="font-display font-extrabold text-navy text-3xl sm:text-4xl leading-tight mb-3">
        This feature is<br className="hidden sm:block" /> coming soon
      </h1>

      <p className="text-navy/55 text-base max-w-xs leading-relaxed mb-8">
        We&apos;re putting the finishing touches on the customer portal.
        Check back soon — it&apos;ll be worth the wait.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-amber-400 transition-colors shadow-sm"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to home
      </Link>

      {/* Contact nudge */}
      <p className="mt-10 text-xs text-navy/35">
        Need errands now?{' '}
        <a href="tel:+18125659585" className="text-navy/55 hover:text-navy underline underline-offset-2 transition-colors">
          Call or text (812)&nbsp;565-9585
        </a>
      </p>
    </main>
  );
}
