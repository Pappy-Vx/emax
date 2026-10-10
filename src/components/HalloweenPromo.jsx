'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const SESSION_KEY = 'emax_halloween_promo_seen';

export default function HalloweenPromo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch { /* private-mode / blocked storage — skip */ return; }

    const timer = setTimeout(() => {
      setVisible(true);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
    }, 10_000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Halloween promotion"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setVisible(false)}
      />

      {/* Card */}
      <div className="relative max-w-sm w-full animate-in zoom-in-95 fade-in duration-300">
        {/* Close button — sits on the outer edge of the top-right corner */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close promotion"
          className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg text-navy hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Image fills the card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/emax-hallowen-promo.jpeg"
            alt="eMax Errands Halloween promotion"
            width={480}
            height={600}
            className="w-full h-auto object-cover block"
            priority
          />
        </div>
      </div>
    </div>
  );
}
