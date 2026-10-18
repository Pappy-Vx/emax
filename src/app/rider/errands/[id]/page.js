import { Suspense } from 'react';
import RiderShell from '@/components/rider/RiderShell';
import RiderErrandDetail from '@/components/rider/RiderErrandDetail';

export const metadata = { title: 'Errand Detail | Rider', robots: { index: false } };

export default async function RiderErrandDetailPage({ params }) {
  const { id } = await params;
  return (
    <RiderShell>
      <Suspense>
        <RiderErrandDetail errandId={id} />
      </Suspense>
    </RiderShell>
  );
}
