import PricingPage from '@/components/PricingPage';

export const metadata = {
  title: 'Pricing | eMax Errands & More',
  description:
    'Transparent pricing for local errand and delivery services in Columbus, Indiana. Errands start from $9.99 — distance and time based, confirmed before we start. No app required.',
  keywords: [
    'errand service pricing Columbus Indiana',
    'delivery service cost Columbus Indiana',
    'how much does eMax Errands cost',
    'same-day delivery price Columbus Indiana',
    'local errand service rates Indiana',
    'pharmacy pickup cost Columbus Indiana',
    'errand service no subscription Columbus Indiana',
  ],
  alternates: { canonical: 'https://emaxerrands.com/pricing' },
  openGraph: {
    title: 'Pricing | eMax Errands & More',
    description:
      'Local errand and delivery service pricing starting at $9.99. No app, no subscription — Columbus, Indiana.',
    url: 'https://emaxerrands.com/pricing',
    type: 'website',
  },
};

export default function PricingRoute() {
  return <PricingPage />;
}
