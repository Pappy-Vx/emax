import DashShell from '@/components/dashboard/DashShell';

export const metadata = {
  title: 'Dashboard | eMax Errands & More',
  robots: { index: false },
};

export default function DashboardLayout({ children }) {
  return <DashShell>{children}</DashShell>;
}
