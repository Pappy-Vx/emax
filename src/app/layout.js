import { Outfit, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  title: 'eMax Errands & More — Local Errand Service in Columbus, Indiana',
  description:
    'eMax Errands & More is a local errand service in Columbus, Indiana. Pharmacy pickup, store returns, document delivery, post office runs, and more. Call or text (812) 565-9585 — no app required.',
  keywords:
    'local errand service in Columbus Indiana, pickup and drop-off support, pharmacy pickup, store returns, store pickups, document delivery, post office runs, library returns, custom errands, local courier, same-day errands, recurring errands',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
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
