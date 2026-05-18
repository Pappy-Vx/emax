'use client';
import { useEffect } from 'react';
import Image from 'next/image';

export const PHONE = '(812) 565-9585';
export const TEL = 'tel:+18125659585';
export const SMS = 'sms:+18125659585';

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export const LogoMark = ({ size = 44, tone = 'light' }) => {
  if (tone === 'dark') {
    return (
      <div className="flex items-center gap-3">
        <div className="relative grid place-items-center w-12 h-12 rounded-xl bg-gold shadow-gold">
          <span className="font-display font-black text-navy text-2xl leading-none">e</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-navy" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-black text-white text-2xl tracking-tight">
            e<sup className="text-sm font-black" style={{ verticalAlign: 'super', fontSize: '0.58em' }}>max</sup>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gold/90 font-semibold">Errands &amp; More</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/emax-logo.jpeg"
        alt="eMax Errands & More logo"
        width={size}
        height={size}
        className="rounded-lg object-cover"
      />
      <div className="leading-tight hidden sm:block">
        <div className="font-display font-black text-navy text-[1.6rem] tracking-tight">
          e<sup className="font-black" style={{ verticalAlign: 'super', fontSize: '0.55em' }}>max</sup>
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-navy/70 font-semibold">Errands &amp; More</div>
      </div>
    </div>
  );
};

export const GoldButton = ({ as, href, onClick, children, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-[15px]',
    lg: 'px-7 py-4 text-base',
  };
  const cls = `inline-flex items-center justify-center gap-2 ${sizes[size]} rounded-full bg-gold text-navy font-semibold tracking-tight shadow-gold hover:bg-gold-deep hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ${className}`;
  if (as === 'button') {
    return <button onClick={onClick} className={cls}>{children}</button>;
  }
  return <a href={href} onClick={onClick} className={cls}>{children}</a>;
};

export const OutlineButton = ({ as, href, onClick, children, className = '', tone = 'navy', size = 'md' }) => {
  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-[15px]',
    lg: 'px-7 py-4 text-base',
  };
  const tones = {
    navy:  'border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white',
    light: 'border-white/40 text-white hover:bg-white hover:text-navy',
    gold:  'border-gold/50 text-gold hover:bg-gold hover:text-navy',
  };
  const cls = `inline-flex items-center justify-center gap-2 ${sizes[size]} rounded-full border-2 font-semibold tracking-tight transition-all duration-200 ${tones[tone]} ${className}`;
  if (as === 'button') {
    return <button onClick={onClick} className={cls}>{children}</button>;
  }
  return <a href={href} onClick={onClick} className={cls}>{children}</a>;
};
