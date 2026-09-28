'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icons from '@/components/icons';

/**
 * Reusable full-screen success / failure modal shown after a payment event.
 *
 * Props:
 *   type         'success' | 'failure'
 *   title        heading text
 *   message      body text
 *   redirectTo   path to navigate to after countdown (default '/dashboard')
 *   redirectMs   countdown in ms (default 3000); set to 0 to disable auto-redirect
 *   onClose      optional — called when the user dismisses or countdown fires
 *   action       optional { label, href } — an explicit CTA button (skips auto-redirect)
 */
export default function PaymentResultModal({
  type = 'success',
  title,
  message,
  redirectTo = '/dashboard',
  redirectMs = 3000,
  onClose,
  action,
}) {
  const router  = useRouter();
  const [secs, setSecs] = useState(redirectMs > 0 ? Math.ceil(redirectMs / 1000) : null);

  const isSuccess = type === 'success';

  useEffect(() => {
    if (redirectMs <= 0 || action) return;

    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(id);
          router.push(redirectTo);
          onClose?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [redirectMs, redirectTo, router, onClose, action]);

  const handleAction = () => {
    if (action?.href) router.push(action.href);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-[pageIn_0.3s_ease_both]">
        {/* Icon */}
        <div className={`grid place-items-center w-16 h-16 rounded-full mx-auto mb-5 ${
          isSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
        }`}>
          {isSuccess
            ? <Icons.Check size={32} stroke={2.5} />
            : <Icons.X size={30} stroke={2.5} />
          }
        </div>

        {/* Text */}
        <h2 className="font-display font-bold text-navy text-2xl mb-2">
          {title ?? (isSuccess ? 'Payment successful!' : 'Payment failed')}
        </h2>
        <p className="text-navy/60 text-[15px] leading-relaxed">
          {message ?? (isSuccess
            ? 'Your plan is now active. Taking you to your dashboard…'
            : 'Something went wrong. Please try again or use a different payment method.'
          )}
        </p>

        {/* CTA */}
        <div className="mt-6 space-y-2">
          {action ? (
            <button
              type="button"
              onClick={handleAction}
              className={`w-full py-3 rounded-full font-semibold text-sm transition ${
                isSuccess
                  ? 'bg-gold text-navy hover:bg-gold-deep'
                  : 'bg-navy text-white hover:bg-navy/90'
              }`}
            >
              {action.label}
            </button>
          ) : isSuccess ? (
            <div className="text-xs text-navy/40">
              Redirecting in {secs}s…
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { router.back(); onClose?.(); }}
              className="w-full py-3 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy/90 transition"
            >
              Try again
            </button>
          )}

          {!action && isSuccess && (
            <button
              type="button"
              onClick={() => { router.push(redirectTo); onClose?.(); }}
              className="w-full py-2.5 rounded-full border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition"
            >
              Go to dashboard now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
