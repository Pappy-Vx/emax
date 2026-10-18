'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRiderUser, riderLogout } from '@/lib/auth';

export default function RiderShell({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getRiderUser();
    if (!u || u.role !== 'runner') {
      router.replace('/rider/login');
    } else {
      setUser(u);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="bg-navy text-white px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-display font-black text-base">eMax Rider</p>
          <p className="text-xs text-white/50">{user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rider/errands" className="text-white/70 hover:text-white text-sm">My Errands</Link>
          <button
            onClick={() => { riderLogout(); router.replace('/rider/login'); }}
            className="text-white/50 hover:text-white text-sm"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 p-5 sm:p-8 max-w-2xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
