import { Suspense } from 'react';
import RunnerLogin from '@/components/runner/RunnerLogin';

export const metadata = {
  title: 'Runner Login | eMax Errands',
  robots: { index: false, follow: false },
};

export default function RunnerLoginPage() {
  return (
    <Suspense>
      <RunnerLogin />
    </Suspense>
  );
}
