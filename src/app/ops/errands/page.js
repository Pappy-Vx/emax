import OpsShell from '@/components/ops/OpsShell';
import OpsErrands from '@/components/ops/OpsErrands';

export const metadata = { title: 'Errands | Ops', robots: { index: false } };

export default function OpsErrandsPage() {
  return (
    <OpsShell active="errands">
      <OpsErrands />
    </OpsShell>
  );
}
