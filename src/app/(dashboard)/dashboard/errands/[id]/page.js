import DashTrack from '@/components/dashboard/DashTrack';

export const metadata = { title: 'Track Errand | eMax Dashboard', robots: { index: false } };

export default async function Page({ params }) {
  const { id } = await params;
  return <DashTrack errandId={id} />;
}
