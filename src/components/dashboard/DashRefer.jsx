'use client';
import { useState } from 'react';
import Icons from '@/components/icons';
import { useDashCtx } from '@/lib/dash-context';
import { getUser } from '@/lib/auth';
import { Card, CardTitle } from './DashUI';

const TEL = 'tel:+18125659585';

export default function DashRefer() {
  const { notify } = useDashCtx();
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Member';
  const code = 'EMAX-' + firstName.toUpperCase().slice(0, 6);
  const referralLink = `https://emaxerrands.com/pricing?ref=${code}`;

  const [copied, setCopied] = useState(false);

  const copy = () => {
    try { navigator.clipboard.writeText(referralLink); } catch {}
    setCopied(true);
    notify('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = () => {
    const msg = `Save on errands with eMax Errands & More! Use my code ${code} at emaxerrands.com`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = 'Try eMax Errands & More';
    const body = `Hey! I have been using eMax Errands & More to handle my errands and it has been a lifesaver. Use my referral code ${code} at ${referralLink} to get started.\n\nEach errand they run has been on time and hassle-free.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="font-display font-bold text-navy text-2xl">Refer a Friend</h1>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-15 pointer-events-none" />
        <div className="relative text-center py-6">
          <div className="text-5xl mb-4">🐝</div>
          <h2 className="font-display font-bold text-navy text-xl mb-1">Share the hive, earn points</h2>
          <p className="text-navy/60 text-sm max-w-sm mx-auto">
            Each friend who signs up with your code earns you <strong className="text-navy">100 Hive points</strong> — enough to unlock a free errand.
          </p>
        </div>
      </Card>

      {/* Referral code */}
      <Card>
        <CardTitle>Your Referral Code</CardTitle>
        <div className="flex items-center gap-3 p-4 bg-navy/3 rounded-xl mb-4">
          <span className="flex-1 font-display font-bold text-navy text-2xl tracking-wider">{code}</span>
          <button
            type="button"
            onClick={copy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${copied ? 'bg-green-100 text-green-700' : 'bg-gold text-navy hover:bg-gold-deep'}`}
          >
            <Icons.Check size={14} stroke={2.5} />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={shareText}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-navy/12 text-navy text-sm font-medium hover:bg-navy/5 transition"
          >
            <Icons.Msg size={16} stroke={1.8} />
            Share by text
          </button>
          <button
            type="button"
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-navy/12 text-navy text-sm font-medium hover:bg-navy/5 transition"
          >
            <Icons.Mail size={16} stroke={1.8} />
            Share by email
          </button>
        </div>
      </Card>

      {/* How it works */}
      <Card>
        <CardTitle>How It Works</CardTitle>
        <div className="space-y-4">
          {[
            ['Share your code', 'Send your unique link to friends, family, or colleagues.'],
            ['They sign up', 'They use your code when creating their eMax account.'],
            ['You earn 100 pts', 'Points hit your Hive Rewards balance immediately.'],
            ['Redeem for errands', 'Every 500 pts = one free errand. No expiry.'],
          ].map(([step, desc], i) => (
            <div key={step} className="flex items-start gap-3">
              <div className="grid place-items-center w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-navy">{step}</div>
                <div className="text-xs text-navy/55 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Referral history */}
      <Card>
        <CardTitle>Referral History</CardTitle>
        <div className="py-8 text-center">
          <Icons.User size={28} stroke={1.5} className="text-navy/20 mx-auto mb-2" />
          <div className="text-navy/45 text-sm">No referrals yet</div>
          <div className="text-navy/35 text-xs mt-1">Start sharing your code above!</div>
        </div>
      </Card>
    </div>
  );
}
