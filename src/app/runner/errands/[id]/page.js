import { Suspense } from 'react';
import RunnerShell from '@/components/runner/RunnerShell';
import RunnerErrandDetail from '@/components/runner/RunnerErrandDetail';

export const metadata = { title: 'Errand Detail | Runner', robots: { index: false } };

export default async function RunnerErrandDetailPage({ params }) {
  const { id } = await params;
  return (
    <RunnerShell>
      <Suspense>
        <RunnerErrandDetail errandId={id} />
      </Suspense>
    </RunnerShell>
  );
}
