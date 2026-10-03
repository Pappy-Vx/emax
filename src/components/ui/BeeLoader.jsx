'use client';

import { useId } from 'react';

/**
 * BeeLoader — full-screen overlay (default) or inline spinner.
 *
 * Props:
 *   show        boolean   — mount/unmount the loader           (default true)
 *   fullScreen  boolean   — fixed overlay vs inline block      (default true)
 *   message     string    — caption below the bee              (default 'Just a moment…')
 */
export default function BeeLoader({
  show = true,
  fullScreen = true,
  message = 'Just a moment…',
}) {
  // Unique suffix so multiple instances don't share class names or clipPath ids
  const uid = useId().replace(/[^a-zA-Z0-9]/g, 'x');

  if (!show) return null;

  const css = `
    .bee-wrap-${uid} {
      --bee: 88px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: var(--bee);
      height: var(--bee);
      animation: beeZz-${uid} 3.4s ease-in-out infinite;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.20));
    }

    /* Wings flap fast — bees beat ~200 Hz, visually ~0.18 s looks right */
    .bee-wl-${uid} {
      position: relative;
      height: 100%;
      left: 3%;
      transform-origin: center right;
      animation: beeFlap-${uid} 0.18s ease-in-out infinite;
    }
    .bee-wr-${uid} {
      position: relative;
      height: 100%;
      left: -3%;
      transform-origin: center left;
      animation: beeFlap-${uid} 0.18s ease-in-out infinite;
    }
    .bee-bd-${uid} {
      height: 55%;
      flex-shrink: 0;
    }

    @keyframes beeFlap-${uid} {
      0%   { transform: rotateY(0deg); }
      50%  { transform: rotateY(62deg); }
      100% { transform: rotateY(0deg); }
    }

    /* Zigzag: bee darts diagonally up-right, then down-right, etc.
       Small tilt follows direction of travel (rotate). */
    @keyframes beeZz-${uid} {
      0%   { transform: translate(-38px,  10px) rotate(-14deg); }
      14%  { transform: translate(-14px, -22px) rotate(11deg); }
      28%  { transform: translate( 14px,  12px) rotate(-14deg); }
      42%  { transform: translate( 36px, -20px) rotate(11deg); }
      57%  { transform: translate( 18px,  14px) rotate(-14deg); }
      71%  { transform: translate( -6px, -24px) rotate(11deg); }
      85%  { transform: translate(-26px,   8px) rotate(-14deg); }
      100% { transform: translate(-38px,  10px) rotate(-14deg); }
    }

    /* Loading dots */
    .bee-dots-${uid} {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
    }
    .bee-dots-${uid} span {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #c9a227;
      animation: beePulse-${uid} 1.3s ease-in-out infinite;
    }
    .bee-dots-${uid} span:nth-child(2) { animation-delay: 0.22s; }
    .bee-dots-${uid} span:nth-child(3) { animation-delay: 0.44s; }

    @keyframes beePulse-${uid} {
      0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
      40%            { transform: scale(1);   opacity: 1; }
    }
  `;

  const loader = (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className={`bee-wrap-${uid}`}>

        {/* ── Left wings ─────────────────────────────────────────────── */}
        <svg className={`bee-wl-${uid}`} viewBox="0 0 38 66" fill="none" aria-hidden="true">
          {/* Upper wing — larger, rounder */}
          <ellipse cx="21" cy="21" rx="16" ry="19"
            fill="rgba(255,224,80,0.60)" stroke="rgba(180,138,0,0.65)" strokeWidth="1.2"/>
          {/* Lower wing — smaller */}
          <ellipse cx="23" cy="46" rx="12" ry="14"
            fill="rgba(255,224,80,0.40)" stroke="rgba(180,138,0,0.50)" strokeWidth="1.0"/>
          {/* Wing veins — upper */}
          <line x1="21" y1="4"  x2="21" y2="38" stroke="rgba(155,115,0,0.35)" strokeWidth="0.9"/>
          <line x1="21" y1="21" x2="36" y2="27" stroke="rgba(155,115,0,0.25)" strokeWidth="0.7"/>
          <line x1="21" y1="14" x2="34" y2="10" stroke="rgba(155,115,0,0.20)" strokeWidth="0.6"/>
          {/* Wing veins — lower */}
          <line x1="23" y1="33" x2="23" y2="59" stroke="rgba(155,115,0,0.25)" strokeWidth="0.7"/>
        </svg>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <svg className={`bee-bd-${uid}`} viewBox="0 0 32 80" fill="none" aria-hidden="true">
          {/* Left antenna */}
          <line x1="11" y1="9" x2="5" y2="1"
            stroke="#2a1500" strokeWidth="1.9" strokeLinecap="round"/>
          <circle cx="5" cy="1" r="2.3" fill="#ffd000"/>
          {/* Right antenna */}
          <line x1="21" y1="9" x2="27" y2="1"
            stroke="#2a1500" strokeWidth="1.9" strokeLinecap="round"/>
          <circle cx="27" cy="1" r="2.3" fill="#ffd000"/>

          {/* Head */}
          <circle cx="16" cy="14" r="10" fill="#1a0f00"/>
          {/* Eye whites */}
          <circle cx="12"  cy="13" r="3"   fill="white"/>
          <circle cx="20"  cy="13" r="3"   fill="white"/>
          {/* Pupils */}
          <circle cx="12.5" cy="13" r="1.5" fill="#080808"/>
          <circle cx="20.5" cy="13" r="1.5" fill="#080808"/>
          {/* Eye shine */}
          <circle cx="11.6" cy="11.8" r="0.8" fill="white"/>
          <circle cx="19.6" cy="11.8" r="0.8" fill="white"/>

          {/* Thorax */}
          <ellipse cx="16" cy="29" rx="9.5" ry="8" fill="#2d1800"/>
          {/* Wing knobs (pterostigma) */}
          <circle cx="7"  cy="28" r="3.2" fill="#3d2200"/>
          <circle cx="25" cy="28" r="3.2" fill="#3d2200"/>

          {/* Abdomen — yellow base */}
          <ellipse cx="16" cy="55" rx="11.5" ry="18" fill="#ffc800"/>

          {/* Black stripes clipped to abdomen silhouette */}
          <clipPath id={`abd-${uid}`}>
            <ellipse cx="16" cy="55" rx="11.5" ry="18"/>
          </clipPath>
          <g clipPath={`url(#abd-${uid})`}>
            <rect x="4.5" y="39"  width="23" height="6" fill="#1a1a1a"/>
            <rect x="4.5" y="50"  width="23" height="6" fill="#1a1a1a"/>
            <rect x="4.5" y="61"  width="23" height="6" fill="#1a1a1a"/>
          </g>

          {/* Stinger */}
          <polygon points="16,73 12.5,79 19.5,79" fill="#4a2f00"/>
          <polygon points="16,76 14,80  18,80"   fill="#2a1800"/>
        </svg>

        {/* ── Right wings (mirror of left) ───────────────────────────── */}
        <svg className={`bee-wr-${uid}`} viewBox="0 0 38 66" fill="none" aria-hidden="true">
          {/* Upper wing */}
          <ellipse cx="17" cy="21" rx="16" ry="19"
            fill="rgba(255,224,80,0.60)" stroke="rgba(180,138,0,0.65)" strokeWidth="1.2"/>
          {/* Lower wing */}
          <ellipse cx="15" cy="46" rx="12" ry="14"
            fill="rgba(255,224,80,0.40)" stroke="rgba(180,138,0,0.50)" strokeWidth="1.0"/>
          {/* Wing veins — upper */}
          <line x1="17" y1="4"  x2="17" y2="38" stroke="rgba(155,115,0,0.35)" strokeWidth="0.9"/>
          <line x1="17" y1="21" x2="2"  y2="27" stroke="rgba(155,115,0,0.25)" strokeWidth="0.7"/>
          <line x1="17" y1="14" x2="4"  y2="10" stroke="rgba(155,115,0,0.20)" strokeWidth="0.6"/>
          {/* Wing veins — lower */}
          <line x1="15" y1="33" x2="15" y2="59" stroke="rgba(155,115,0,0.25)" strokeWidth="0.7"/>
        </svg>

      </div>
    </>
  );

  // ── Inline mode ──────────────────────────────────────────────────────────
  if (!fullScreen) return loader;

  // ── Full-screen overlay mode ─────────────────────────────────────────────
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      {loader}

      {message && (
        <p style={{
          marginTop: 20,
          fontSize: 15,
          fontWeight: 600,
          color: '#1e3a5f',
          letterSpacing: '0.015em',
        }}>
          {message}
        </p>
      )}

      <div className={`bee-dots-${uid}`} aria-hidden="true">
        <span /><span /><span />
      </div>
    </div>
  );
}
