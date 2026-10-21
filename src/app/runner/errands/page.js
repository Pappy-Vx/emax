import RunnerShell from '@/components/runner/RunnerShell';
import RunnerErrands from '@/components/runner/RunnerErrands';

export const metadata = { title: 'My Errands | Runner', robots: { index: false } };

export default function RunnerErrandsPage() {
  return (
    <RunnerShell>
      <RunnerErrands />
    </RunnerShell>
  );
}
