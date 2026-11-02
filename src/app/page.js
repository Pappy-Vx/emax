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
    'delivery services in Columbus',
    'delivery services in Columbus Indiana',
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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ['Is there an errand service in Columbus, Indiana?', 'Yes. eMax Errands & More is a locally owned errand and delivery service based in Columbus, Indiana. We run pharmacy pickups, store returns, post office runs, grocery pickups, document delivery, mobile notary visits and custom errands. Call or text (812) 565-9585 — no app required.'],
    ['How much does eMax Errands cost?', 'Pricing depends on the distance and wait time. Local errands start from $9.99. Call or text (812) 565-9585 for a quick, no-obligation quote.'],
    ['What areas in Columbus, Indiana do you serve?', 'We serve all of Columbus, Indiana and surrounding Bartholomew, Johnson, Jackson, Jennings, Decatur, Shelby and Brown Counties, including Greenwood, Edinburgh, Nashville, Bloomington and Seymour, Indiana.'],
    ['Can you do same-day delivery in Columbus, Indiana?', 'Yes. Same-day delivery in Columbus, Indiana is one of our most popular services. Call or text (812) 565-9585 and we will confirm pickup and delivery for the same day. We also do scheduled recurring errands.'],
    ['How quickly can you complete a delivery or errand?', 'Most errands are completed same day. For urgent requests, we often respond within 5–20 minutes of your call or text.'],
    ['Do I need to download an app to book a delivery?', 'No app required. Just call or text (812) 565-9585 and a real person will handle everything.'],
    ['What delivery and errand services do you offer in Columbus, Indiana?', 'Pharmacy pickups, package delivery, grocery delivery, store returns, post office/shipping runs, document delivery, mobile notary, library returns, event errand support, DIY gift creation plus delivery, and custom errands across Columbus, Indiana.'],
    ['Are your delivery services available on weekends?', 'Yes. We are available Monday through Friday 8 AM to 5 PM and Saturday 10 AM to 2 PM. Contact us for special availability outside those hours.'],
  ].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Landing />
    </>
  );
}
