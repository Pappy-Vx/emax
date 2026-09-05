import ServicesPage from '@/components/ServicesPage';

export const metadata = {
  title: 'Delivery & Errand Services in Columbus Indiana | eMax Errands & More',
  description:
    'Same-day delivery and errand services in Columbus, Indiana — package delivery, pharmacy pickup, grocery runs, store returns, document delivery, business errands, and event support. Call or text (812) 565-9585, no app required.',
  keywords: [
    'delivery services Columbus Indiana',
    'package delivery Columbus Indiana',
    'same day delivery Columbus Indiana',
    'grocery delivery Columbus Indiana',
    'pharmacy pickup Columbus Indiana',
    'store returns Columbus Indiana',
    'document delivery Columbus Indiana',
    'errand services Columbus Indiana',
    'local courier Columbus Indiana',
    'business delivery Columbus Indiana',
    'delivery around Columbus Indiana',
  ],
  alternates: { canonical: 'https://emaxerrands.com/services' },
  openGraph: {
    title: 'Delivery & Errand Services in Columbus Indiana | eMax Errands & More',
    description: 'Same-day delivery and errand services across Columbus and surrounding Indiana cities. Call or text (812) 565-9585.',
    url: 'https://emaxerrands.com/services',
    type: 'website',
  },
};

export default function Page() {
  return <ServicesPage />;
}
