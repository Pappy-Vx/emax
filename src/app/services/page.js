import ServicesPage from '@/components/ServicesPage';

export const metadata = {
  title: 'Our Services — eMax Errands & More | Columbus, Indiana',
  description:
    'Seven categories of local errand services across Columbus, Indiana — shopping & retail, delivery, mail, pharmacy, home tasks, business support, and event help. Call or text (812) 565-9585, no app required.',
  keywords:
    'errand services Columbus Indiana, local errand service, pharmacy pickup Columbus, store returns Columbus, delivery Columbus Indiana, mail courier Columbus, senior errand support Indiana',
  openGraph: {
    title: 'Our Services — eMax Errands & More | Columbus, Indiana',
    description: 'Seven categories of local errands across Columbus and surrounding Indiana cities. Call or text (812) 565-9585.',
    type: 'website',
  },
};

export default function Page() {
  return <ServicesPage />;
}
