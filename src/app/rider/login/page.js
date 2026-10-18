import { Suspense } from 'react';
import RiderLogin from '@/components/rider/RiderLogin';

export const metadata = {
  title: 'Rider Login | eMax Errands',
  robots: { index: false, follow: false },
};

export default function RiderLoginPage() {
  return (
    <Suspense>
      <RiderLogin />
    </Suspense>
  );
}
