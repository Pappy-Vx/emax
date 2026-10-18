import RiderShell from '@/components/rider/RiderShell';
import RiderErrands from '@/components/rider/RiderErrands';

export const metadata = { title: 'My Errands | Rider', robots: { index: false } };

export default function RiderErrandsPage() {
  return (
    <RiderShell>
      <RiderErrands />
    </RiderShell>
  );
}
