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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
