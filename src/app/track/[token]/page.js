import PublicTrack from '@/components/PublicTrack';

export const metadata = {
  title: 'Track Your Errand',
  robots: { index: false, follow: false },
};

export default async function Page({ params }) {
  const { token } = await params;
  return <PublicTrack token={token} />;
}
