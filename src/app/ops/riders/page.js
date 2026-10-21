import OpsShell from '@/components/ops/OpsShell';
import OpsRiders from '@/components/ops/OpsRiders';

export const metadata = { title: 'Runners | Ops', robots: { index: false } };

export default function OpsRidersPage() {
  return (
    <OpsShell active="riders">
      <OpsRiders />
    </OpsShell>
  );
}
