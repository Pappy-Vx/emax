import OpsShell from '@/components/ops/OpsShell';
import OpsCustomers from '@/components/ops/OpsCustomers';

export const metadata = { title: 'Customers | Ops', robots: { index: false } };

export default function OpsCustomersPage() {
  return (
    <OpsShell active="customers">
      <OpsCustomers />
    </OpsShell>
  );
}
