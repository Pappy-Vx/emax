import Landing from '@/components/Landing';

export const metadata = {
  title: 'Local Delivery & Errand Service in Columbus Indiana | eMax Errands & More',
  description:
    'eMax Errands & More is Columbus Indiana\'s trusted local delivery and errand service. Same-day package delivery, pharmacy pickup, grocery runs, store returns, and more. No app — call or text (812) 565-9585.',
  keywords: [
    'delivery in Columbus Indiana',
    'delivery service Columbus Indiana',
    'same day delivery Columbus Indiana',
    'package delivery Columbus Indiana',
    'local delivery Indiana',
    'errand service Columbus Indiana',
    'quick errands Columbus Indiana',
    'grocery delivery Columbus Indiana',
    'food delivery Columbus Indiana',
    'local courier Columbus Indiana',
    'Bartholomew County delivery',
  ],
  alternates: {
    canonical: 'https://emaxerrands.com',
  },
  openGraph: {
    title: 'Local Delivery & Errand Service in Columbus Indiana | eMax Errands & More',
    description:
      'Same-day package delivery, pharmacy pickup, grocery runs, and custom errands across Columbus, Indiana. Call or text (812) 565-9585 — no app required.',
    url: 'https://emaxerrands.com',
    type: 'website',
    images: [{ url: 'https://emaxerrands.com/emax-logo.jpeg', width: 800, height: 800, alt: 'eMax Errands & More — Local Delivery Service Columbus Indiana' }],
  },
};

export default function HomePage() {
  return <Landing />;
}
