import { Suspense } from 'react';
import OpsLogin from '@/components/ops/OpsLogin';

export const metadata = {
  title: 'Operations Login | eMax Errands',
  robots: { index: false, follow: false },
};

export default function OpsLoginPage() {
  return (
    <Suspense>
      <OpsLogin />
    </Suspense>
  );
}
