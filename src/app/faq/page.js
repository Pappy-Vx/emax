import FaqPage from '@/components/FaqPage';

export const metadata = {
  title: 'FAQ, Policies & Terms | eMax Errands & More',
  description:
    'Frequently asked questions about eMax Errands & More — pricing, service area, same-day delivery, response times, and how our Columbus, Indiana errand service works. No app required.',
  keywords: [
    'eMax Errands FAQ',
    'errand service Columbus Indiana FAQ',
    'delivery service FAQ Columbus Indiana',
    'how does eMax Errands work',
    'errand service pricing Columbus Indiana',
    'same-day delivery FAQ Columbus Indiana',
    'delivery service no app FAQ',
    'local errand service policies Columbus Indiana',
  ],
  alternates: { canonical: 'https://emaxerrands.com/faq' },
  openGraph: {
    title: 'FAQ, Policies & Terms | eMax Errands & More',
    description:
      'Everything you need to know about eMax Errands & More — pricing starting at $9.99, 7 counties served, 5–20 minute response time, no app required.',
    url: 'https://emaxerrands.com/faq',
    type: 'website',
  },
};

export default function FaqRoute() {
  return <FaqPage />;
}
