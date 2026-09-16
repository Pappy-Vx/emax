import { Outfit, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import './globals.css';

const GA_ID = 'G-2FSLJD8ZGK'; // Replace with your GA4 Measurement ID

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://emaxerrands.com'),
  title: {
    default: 'Local Delivery & Errand Service in Columbus Indiana | eMax Errands & More',
    template: '%s | eMax Errands & More',
  },
  description:
    'eMax Errands & More is the trusted local delivery and errand service in Columbus, Indiana. Same-day package delivery, pharmacy pickup, grocery runs, store returns, and document delivery. Call or text (812) 565-9585 — no app required.',
  keywords: [
    'delivery in Columbus Indiana',
    'delivery service Columbus Indiana',
    'package delivery Columbus Indiana',
    'same day delivery Columbus Indiana',
    'local delivery Columbus Indiana',
    'delivery around Columbus Indiana',
    'delivery in Indiana',
    'food delivery Columbus Indiana',
    'grocery delivery Columbus Indiana',
    'errand service Columbus Indiana',
    'quick errands Columbus Indiana',
    'local errand service Columbus Indiana',
    'package pickup and delivery Columbus Indiana',
    'same day errand service Columbus Indiana',
    'local courier Columbus Indiana',
    'pharmacy pickup Columbus Indiana',
    'prescription delivery Columbus Indiana',
    'store returns Columbus Indiana',
    'document delivery Columbus Indiana',
    'delivery service near Columbus Indiana',
    'Bartholomew County delivery service',
    'Columbus Indiana courier',
    'delivery services in Columbus',
    'delivery services in Columbus Indiana',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'FVqqyg583emRFIODFe8o-JNcTNQfAynzzLnnpvOke-M',
  },
  openGraph: {
    title: 'eMax Errands & More — Making life easier in Columbus, Indiana',
    description: 'Reliable local errands. Call or text (812) 565-9585 — no app required.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'eMax Errands & More',
  alternateName: 'eMax Errands',
  description:
    'Local delivery and errand service in Columbus, Indiana. Same-day package delivery, pharmacy pickup, grocery runs, store returns, document delivery, and custom errands across Columbus and surrounding Indiana cities.',
  url: 'https://emaxerrands.com',
  telephone: '+18125659585',
  email: 'hello@emaxerrands.com',
  image: 'https://emaxerrands.com/emax-logo.jpeg',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Columbus',
    addressRegion: 'IN',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.2014,
    longitude: -85.9214,
  },
  areaServed: [
    { '@type': 'City', name: 'Columbus', containedInPlace: { '@type': 'State', name: 'Indiana' } },
    { '@type': 'City', name: 'Greenwood', containedInPlace: { '@type': 'State', name: 'Indiana' } },
    { '@type': 'City', name: 'Bloomington', containedInPlace: { '@type': 'State', name: 'Indiana' } },
    { '@type': 'City', name: 'Edinburgh', containedInPlace: { '@type': 'State', name: 'Indiana' } },
    { '@type': 'City', name: 'Nashville', containedInPlace: { '@type': 'State', name: 'Indiana' } },
    { '@type': 'City', name: 'Seymour', containedInPlace: { '@type': 'State', name: 'Indiana' } },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Delivery & Errand Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Same-Day Package Delivery Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pharmacy Pickup & Delivery Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Grocery Delivery Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Store Returns & Pickups Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Document Delivery Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UPS FedEx USPS Drop-off Columbus Indiana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Local Errands Columbus Indiana' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '3',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Brad D.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Elizabeth with EMax was amazing to work with! I needed a package picked up and dropped off at a local UPS Store and she got right on it. Very friendly, trustworthy, and reliable. Would absolutely work with them again!',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Adeola A.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Outstanding service! This company is incredibly efficient, reliable, and delivers on time. The communication throughout was excellent — she kept me informed every step of the way. I highly recommend them.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Tee A.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Excellent service by Elizabeth from eMax errands and more. Dealing with eMax was smooth and fast. I will definitely do it again.',
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does eMax Errands cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pricing depends on the distance and wait time. Local errands start from $9.99. Call or text (812) 565-9585 for a quick, no-obligation quote — no commitment required.' },
    },
    {
      '@type': 'Question',
      name: 'What areas in Columbus, Indiana do you serve?',
      acceptedAnswer: { '@type': 'Answer', text: 'We serve all of Columbus, Indiana and surrounding Bartholomew, Johnson, Jackson, Jennings, Decatur, Shelby and Brown Counties. We also extensively cover Greenwood, Edinburgh, Nashville, Bloomington, and Seymour, Indiana.' },
    },
    {
      '@type': 'Question',
      name: 'Can you do same-day delivery in Columbus Indiana?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Same-day delivery in Columbus, Indiana is one of our most popular services. Call or text (812) 565-9585 and we will confirm pickup and delivery for the same day. We also do scheduled recurring errands at very affordable prices.' },
    },
    {
      '@type': 'Question',
      name: 'How quickly can you complete a delivery or errand?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most errands are completed same day. For urgent requests, we often respond within 5–20 minutes of your call or text. Reach us at (812) 565-9585 to confirm availability.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need to download an app to book a delivery?',
      acceptedAnswer: { '@type': 'Answer', text: 'No app required. Just call or text (812) 565-9585 and a real person will handle everything. No accounts, no downloads — just dependable local service.' },
    },
    {
      '@type': 'Question',
      name: 'What delivery and errand services do you offer in Columbus Indiana?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pharmacy pickups, package delivery, grocery delivery, store returns, post office/shipping runs, document delivery, library returns, forgotten item delivery, event errand support, DIY gift creation plus delivery, and custom errands across Columbus, Indiana and environs.' },
    },
    {
      '@type': 'Question',
      name: 'Are your delivery services available on weekends?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. We are available Monday through Friday 8 AM to 5 PM and Saturday 10 AM to 2 PM. Contact us for special availability outside those hours.' },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <FloatingWhatsapp />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
