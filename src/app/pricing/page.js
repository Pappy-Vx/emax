import PricingPage from '@/components/PricingPage';

export const metadata = {
  title: 'Plans & Pricing | eMax Errands & More — Columbus, Indiana',
  description:
    'Simple, affordable errand service plans in Columbus, Indiana. Monthly subscriptions from $83.99/mo (5 errands) or pay per errand from $19.99. Same-day scheduling, pharmacy pickups, document delivery & more. No app required.',
  keywords: [
    'errand service pricing Columbus Indiana',
    'errand subscription plan Columbus Indiana',
    'monthly errand service Columbus Indiana',
    'same-day delivery pricing Columbus Indiana',
    'pharmacy pickup service cost Indiana',
    'pay per errand Columbus Indiana',
    'document delivery service Columbus Indiana',
    'errand service for seniors Columbus Indiana',
    'local delivery service rates Indiana',
    'how much does eMax Errands cost',
    'errand service individual plan',
    'family errand service Columbus Indiana',
    'business errand service Indiana',
  ],
  alternates: { canonical: 'https://emaxerrands.com/pricing' },
  openGraph: {
    title: 'Plans & Pricing | eMax Errands & More',
    description:
      'Subscription plans from $83.99/mo or pay per errand from $19.99. Same-day scheduling, pharmacy pickups & more — Columbus, Indiana.',
    url: 'https://emaxerrands.com/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plans & Pricing | eMax Errands & More',
    description:
      'Subscription plans from $83.99/mo or pay per errand from $19.99. Columbus, Indiana errand service.',
  },
};

export default function PricingRoute() {
  return <PricingPage />;
}
