import { Suspense } from 'react';
import CheckoutPage from '@/components/auth/CheckoutPage';

export const metadata = {
  title: 'Complete Your Order | eMax Errands & More',
  description: 'Subscribe to an eMax Errands monthly plan. Secure checkout with Stripe — card or Apple Pay.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
