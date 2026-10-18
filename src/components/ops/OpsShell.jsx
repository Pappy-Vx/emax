'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOpsUser, opsLogout } from '@/lib/auth';

const NAV = [
  { id: 'errands',   label: 'Errands',   href: '/ops/errands' },
  { id: 'customers', label: 'Customers', href: '/ops/customers' },
  { id: 'riders',    label: 'Riders',    href: '/ops/riders' },
];

export default function OpsShell({ children, active }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getOpsUser();
    if (!u || u.role !== 'admin') {
      router.replace('/ops/login');
    } else {
      setUser(u);
    }
  }, [router]);

  if (!user) return null;

  function handleLogout() {
    opsLogout();
    router.replace('/ops/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-navy text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display font-black text-lg leading-tight">eMax</p>
          <p className="text-xs text-white/50 mt-0.5">Operations</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active === n.id ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-white/10'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-3 truncate">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-white/65 hover:text-white text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
