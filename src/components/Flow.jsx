import Icons from './icons';

const StopCard = ({ step, Icon, label, detail, delay }) => (
  <div
    className="stop-card relative rounded-xl sm:rounded-2xl bg-white border-2 border-navy/8 px-3 sm:px-5 py-4 sm:py-5 transition-colors text-center sm:text-left"
    style={{ animationDelay: delay }}
  >
    <span
      className="stop-ring absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gold pointer-events-none"
      style={{ animationDelay: delay }}
    />
    <div className="flex items-start gap-2 sm:gap-4">
      <span
        className="stop-icon shrink-0 grid place-items-center w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-navy text-gold transition"
        style={{ animationDelay: delay }}
      >
        <Icon size={16} stroke={2} className="sm:w-[22px]" />
      </span>
      <div className="min-w-0">
        <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-navy/45 font-bold tabular-nums">{step}</div>
        <div className="font-display font-bold text-navy text-sm sm:text-lg leading-tight">{label}</div>
        <p className="hidden sm:block mt-1 text-[13px] text-navy/60 leading-relaxed">{detail}</p>
      </div>
    </div>
  </div>
);

const BeeMark = () => (
  <g transform="translate(-22 -16)">
    <ellipse cx="22" cy="30" rx="14" ry="3" fill="#1c2a43" opacity="0.15" />
    <ellipse cx="14" cy="10" rx="9" ry="6" fill="#1c2a43" opacity="0.85" />
    <ellipse cx="14" cy="9" rx="7" ry="4.5" fill="#fdbd2a" opacity="0.85" />
    <ellipse cx="22" cy="16" rx="14" ry="10" fill="#fdbd2a" stroke="#1c2a43" strokeWidth="1.5" />
    <path d="M 18 7.5 Q 22 5 27 7 L 26 24.5 Q 22 26.5 17.5 24.5 Z" fill="#1c2a43" opacity="0.95" />
    <path d="M 28 8.5 Q 32 11 33.5 16 Q 32 21 28 24.5 L 28 8.5 Z" fill="#1c2a43" opacity="0.95" />
    <circle cx="32" cy="14" r="1.6" fill="#fff" />
    <circle cx="32.5" cy="14" r="0.8" fill="#1c2a43" />
    <path d="M 30 6 Q 33 2 36 3" stroke="#1c2a43" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <circle cx="36" cy="3" r="1.2" fill="#fdbd2a" stroke="#1c2a43" strokeWidth="1" />
  </g>
);

const FlowSVG = () => (
  <svg
    viewBox="0 0 1100 220"
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-[100px] sm:h-[140px] md:h-[180px] lg:h-[220px]"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="routeGrad" x1="0" x2="1">
        <stop offset="0" stopColor="#fdbd2a" stopOpacity="0.4" />
        <stop offset="0.5" stopColor="#fdbd2a" stopOpacity="1" />
        <stop offset="1" stopColor="#fdbd2a" stopOpacity="0.4" />
      </linearGradient>
      <path
        id="emaxRoute"
        fill="none"
        d="M 90 150 C 200 60, 320 60, 430 130 C 500 175, 620 175, 690 110 C 760 50, 880 60, 1010 140"
      />
    </defs>

    <line x1="40" y1="200" x2="1060" y2="200" stroke="#1c2a43" strokeOpacity="0.06" strokeWidth="2" />
    <use href="#emaxRoute" fill="none" stroke="#1c2a43" strokeOpacity="0.08" strokeWidth="10" strokeLinecap="round" />
    <use href="#emaxRoute" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeLinecap="round" className="road-dash" />

    <g>
      <circle cx="90"   cy="150" r="12" fill="#fff" stroke="#fdbd2a" strokeWidth="3" />
      <circle cx="90"   cy="150" r="5"  fill="#1c2a43" />
      <circle cx="560"  cy="158" r="12" fill="#fff" stroke="#fdbd2a" strokeWidth="3" />
      <circle cx="560"  cy="158" r="5"  fill="#1c2a43" />
      <circle cx="1010" cy="140" r="12" fill="#fff" stroke="#fdbd2a" strokeWidth="3" />
      <circle cx="1010" cy="140" r="5"  fill="#1c2a43" />
    </g>

    <g opacity="0.4">
      <rect x="220" y="180" width="8"  height="20" fill="#1c2a43" opacity="0.15" />
      <rect x="232" y="172" width="10" height="28" fill="#1c2a43" opacity="0.2"  />
      <rect x="246" y="184" width="8"  height="16" fill="#1c2a43" opacity="0.15" />
      <rect x="760" y="178" width="10" height="22" fill="#1c2a43" opacity="0.18" />
      <rect x="774" y="170" width="12" height="30" fill="#1c2a43" opacity="0.22" />
      <rect x="790" y="184" width="8"  height="16" fill="#1c2a43" opacity="0.15" />
    </g>

    <g className="bee-bob">
      <BeeMark />
      {/* pause ~0.54s at each node so card pulses (0s/4s/8s delays) overlap the bee's stop */}
      <animateMotion dur="9s" repeatCount="indefinite" rotate="auto"
        keyTimes="0;0.06;0.44;0.50;0.88;1"
        keyPoints="0;0;0.5;0.5;1;1"
        calcMode="linear">
        <mpath href="#emaxRoute" />
      </animateMotion>
    </g>
  </svg>
);

export default function FlowSection() {
  return (
    <section className="relative bg-cream py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 hex-pattern opacity-50 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="reveal text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.22em] text-navy/55 font-semibold mb-4">The Flow</div>
          <h2 className="font-display font-black text-[32px] sm:text-[40px] md:text-[56px] leading-[1.05] text-navy">
            From your call <span className="text-gold">to your doorstep.</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-navy/65 text-base sm:text-lg leading-relaxed">
            One call, one runner, one less thing on your plate. Here&rsquo;s what happens after you tap dial.
          </p>
        </div>

        <div className="reveal delay-1 mt-12 sm:mt-16">
          <div className="relative mx-auto max-w-[1100px]">
            <div className="relative rounded-xl sm:rounded-[2rem] bg-white border border-navy/8 shadow-card px-4 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-8 sm:pb-10 overflow-hidden">
              <FlowSVG />
              <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <StopCard step="01" Icon={Icons.Phone} label="Receive Call"  detail="You call or text. A real person picks up — confirms in minutes."                   delay="0s" />
                <StopCard step="02" Icon={Icons.Bag}   label="Pickup"        detail="We grab it — pharmacy, store, post office. Wherever it lives."                    delay="4s" />
                <StopCard step="03" Icon={Icons.Home}  label="Delivery"      detail="Hand-delivered to your door. We text when it&rsquo;s dropped."                   delay="8s" />
              </div>
            </div>
          </div>
        </div>

        <div className="reveal delay-2 mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-x-7 sm:gap-y-3 text-xs sm:text-sm text-navy/60">
          <span className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            Live, local, on-the-go
          </span>
          <span className="hidden sm:inline text-navy/20">&middot;</span>
          <span className="inline-flex items-center gap-2">
            <Icons.Clock size={16} stroke={2} className="text-gold" />
            Most errands done same-day
          </span>
          <span className="hidden sm:inline text-navy/20">&middot;</span>
          <span className="inline-flex items-center gap-2">
            <Icons.Check size={16} stroke={2.5} className="text-gold" />
            We text when it&rsquo;s done
          </span>
        </div>
      </div>
    </section>
  );
}
