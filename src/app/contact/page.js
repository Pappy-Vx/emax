import Contact from '@/components/Contact';

export const metadata = {
  title: 'Contact & Booking — eMax Errands & More',
  description: 'Contact eMax Errands & More to book an errand in Columbus, Indiana. Call or text (812) 565-9585, or send us a message.',
  alternates: {
    canonical: 'https://emaxerrands.com/contact',
  },
};

export default function ContactPage() {
  return <Contact />;
}
