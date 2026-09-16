import { SERVICES_DATA, ALL_SERVICE_SLUGS } from '@/data/services-data';
import ServicePage from '@/components/ServicePage';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return ALL_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDesc,
    keywords: service.keywords,
    alternates: { canonical: `https://emaxerrands.com/services/${slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
      url: `https://emaxerrands.com/services/${slug}`,
      type: 'website',
    },
  };
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) notFound();
  return <ServicePage service={service} />;
}
