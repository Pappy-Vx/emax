import { SERVICES_DATA, ALL_SERVICE_SLUGS } from '@/data/services-data';
import ServicePage from '@/components/ServicePage';
import { notFound } from 'next/navigation';

const SITE = 'https://emaxerrands.com';

export async function generateStaticParams() {
  return ALL_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) return {};
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDesc,
    keywords: service.keywords,
    alternates: { canonical: `${SITE}/services/${slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
      url: `${SITE}/services/${slug}`,
      type: 'website',
    },
  };
}

function buildJsonLd(service) {
  const url = `${SITE}/services/${service.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
      name: service.headline,
      serviceType: service.name,
      description: service.whatIs,
      url,
      provider: { '@id': `${SITE}/#business` },
      areaServed: ['Columbus', 'Greenwood', 'Edinburgh', 'Seymour', 'Nashville', 'Bloomington'].map((name) => ({
        '@type': 'City',
        name,
        containedInPlace: { '@type': 'State', name: 'Indiana' },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
        { '@type': 'ListItem', position: 3, name: service.name, item: url },
      ],
    },
  ];
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];
  if (!service) notFound();
  const related = ALL_SERVICE_SLUGS
    .filter((s) => s !== slug)
    .map((s) => ({ slug: s, name: SERVICES_DATA[s].name, tagline: SERVICES_DATA[s].tagline }));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(service)) }}
      />
      <ServicePage service={service} related={related} />
    </>
  );
}
