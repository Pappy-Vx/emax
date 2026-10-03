'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Icons from '@/components/icons';
import { getUser, logout } from '@/lib/auth';
import { DashProvider, useDashCtx } from '@/lib/dash-context';
import { useDash } from '@/lib/dash-store';
import { RequestModal, NotifDropdown, Toast } from './DashUI';
import BeeLoader from '@/components/ui/BeeLoader';

const NAV = [
  { id: 'overview',      label: 'Overview',       href: '/dashboard',               icon: 'Home' },
  { id: 'errands',       label: 'My Errands',      href: '/dashboard/errands',       icon: 'List' },
  { id: 'recurring',     label: 'Recurring',       href: '/dashboard/recurring',     icon: 'Repeat' },
  { id: 'addresses',     label: 'Addresses',       href: '/dashboard/addresses',     icon: 'Pin' },
  { id: 'subscription',  label: 'Subscription',    href: '/dashboard/subscription',  icon: 'Repeat' },
  { id: 'billing',       label: 'Billing',         href: '/dashboard/billing',       icon: 'Briefcase' },
  { id: 'cards',         label: 'Payment Methods', href: '/dashboard/cards',         icon: 'CreditCard' },
  { id: 'notifications', label: 'Notifications',   href: '/dashboard/notifications', icon: 'Bell' },
  { id: 'refer',         label: 'Refer a Friend',  href: '/dashboard/refer',         icon: 'Gift' },
  { id: 'support',       label: 'Help & Support',  href: '/dashboard/support',       icon: 'Msg' },
  { id: 'settings',      label: 'Settings',        href: '/dashboard/settings',      icon: 'User' },
];

function DashShellInner({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast, requestOpen, setRequestOpen, openRequest } = useDashCtx();
  const [d, up] = useDash();
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/login'); return; }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const unreadCount = d.notifications.filter((n) => !n.read).length;
  const markAllRead = () => up((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));

  const handleRequest = (data) => {
    const newErrand = {
      id: Date.now(),
      type: data.type,
      from: data.from,
      to: data.to,
      when: data.date + ' · ' + data.time,
      status: 'scheduled',
    };
    up((s) => ({ ...s, errands: [newErrand, ...s.errands] }));
  };

  if (!user) return <BeeLoader message="Loading your dashboard…" />;

  const firstName = user.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-stone flex">
      {/* Sidebar */}
      <aside className="dash-sidebar bg-white border-r border-navy/8 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 pb-4 border-b border-navy/8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-gold text-navy">
              <span className="font-display font-black text-lg leading-none">e</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-black text-navy text-base tracking-tight">eMax</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-navy/55 font-semibold">Errands &amp; More</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ id, label, href, icon }) => {
            const I = Icons[icon] || Icons.List;
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={id}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold/10 text-navy font-semibold'
                    : 'text-navy/60 hover:bg-navy/5 hover:text-navy'
                }`}
              >
                <I size={18} stroke={isActive ? 2.2 : 1.8} className={isActive ? 'text-gold' : ''} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy/8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex-shrink-0">
              {firstName[0]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-navy truncate">{user.name}</div>
              <div className="text-xs text-navy/45 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-navy/50 hover:text-navy transition w-full"
          >
            <Icons.LogOut size={14} stroke={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-navy/8 px-5 sm:px-6 h-[64px] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <div className="grid place-items-center w-8 h-8 rounded-lg bg-gold text-navy">
                <span className="font-display font-black text-base leading-none">e</span>
              </div>
              <span className="font-display font-bold text-navy text-base">eMax</span>
            </Link>
            <span className="hidden md:block text-sm text-navy/55">
              Hi, <strong className="text-navy">{firstName}</strong> 👋
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openRequest}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
              type="button"
            >
              <Icons.Plus size={15} stroke={2.5} />
              Request errand
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative grid place-items-center w-9 h-9 rounded-full hover:bg-navy/5 text-navy transition"
                type="button"
              >
                <Icons.Bell size={18} stroke={1.8} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-navy text-[9px] font-bold grid place-items-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotifDropdown
                notifications={d.notifications}
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                onMarkAll={markAllRead}
              />
              {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
            </div>

            <div className="grid place-items-center w-9 h-9 rounded-full bg-navy text-white text-xs font-bold flex-shrink-0">
              {firstName[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 page-in">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-navy/8 z-30 flex safe-bottom">
          {[...NAV.slice(0, 4), { id: 'more', label: 'More', href: null, icon: 'List' }].map(({ id, label, href, icon }) => {
            const I = Icons[icon] || Icons.List;
            const isActive = href && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)));
            const isMore = id === 'more';
            return isMore ? (
              <button
                key="more"
                type="button"
                onClick={() => setMoreOpen(true)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition ${moreOpen ? 'text-gold' : 'text-navy/40'}`}
              >
                <Icons.List size={20} stroke={moreOpen ? 2.2 : 1.8} />
                <span>More</span>
              </button>
            ) : (
              <Link key={id} href={href} className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition ${isActive ? 'text-gold' : 'text-navy/40'}`}>
                <I size={20} stroke={isActive ? 2.2 : 1.8} />
                <span>{label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile "More" drawer */}
      {moreOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-navy/40 backdrop-blur-sm z-40" onClick={() => setMoreOpen(false)} />
          <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl pb-safe">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-navy/8">
              <div className="text-sm font-semibold text-navy">Menu</div>
              <button type="button" onClick={() => setMoreOpen(false)} className="grid place-items-center w-8 h-8 rounded-full bg-navy/5">
                <Icons.X size={16} stroke={2} className="text-navy" />
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-1 max-h-[60vh] overflow-y-auto">
              {NAV.map(({ id, label, href, icon }) => {
                const I = Icons[icon] || Icons.List;
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-gold/10 text-navy font-semibold' : 'text-navy/60 hover:bg-navy/5 hover:text-navy'
                    }`}
                  >
                    <I size={18} stroke={isActive ? 2.2 : 1.8} className={isActive ? 'text-gold' : ''} />
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-navy/8">
              <button
                onClick={() => { setMoreOpen(false); handleLogout(); }}
                className="flex items-center gap-2 text-sm text-navy/50 hover:text-navy transition w-full py-2"
              >
                <Icons.LogOut size={16} stroke={1.8} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAB on mobile */}
      <button
        onClick={openRequest}
        className="md:hidden fixed bottom-20 right-4 w-12 h-12 rounded-full bg-gold text-navy shadow-gold flex items-center justify-center z-40"
        type="button"
      >
        <Icons.Plus size={22} stroke={2.5} />
      </button>

      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSubmit={handleRequest}
      />
      <Toast msg={toast} />
    </div>
  );
}

export default function DashShell({ children }) {
  return (
    <DashProvider>
      <DashShellInner>{children}</DashShellInner>
    </DashProvider>
  );
}
