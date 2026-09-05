import Contact from '@/components/Contact';

export const metadata = {
  title: 'Book a Delivery or Errand in Columbus Indiana | eMax Errands & More',
  description:
    'Book a local delivery or errand in Columbus, Indiana. Call or text (812) 565-9585 to schedule same-day package delivery, pharmacy pickup, grocery runs, and more. No app required.',
  keywords: [
    'book delivery Columbus Indiana',
    'schedule errand Columbus Indiana',
    'same day delivery booking Columbus Indiana',
    'contact eMax Errands Columbus Indiana',
    'local delivery booking Indiana',
  ],
  alternates: { canonical: 'https://emaxerrands.com/contact' },
  openGraph: {
    title: 'Book a Delivery or Errand in Columbus Indiana | eMax Errands & More',
    description: 'Call or text (812) 565-9585 to schedule same-day delivery or an errand in Columbus, Indiana.',
    url: 'https://emaxerrands.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <Contact />;
}
