import { Suspense } from 'react';
import LoginPage from '@/components/auth/LoginPage';

export const metadata = {
  title: 'Sign In | eMax Errands & More',
  description: 'Sign in to your eMax Errands customer dashboard.',
  robots: { index: false },
};

export default function LoginRoute() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
