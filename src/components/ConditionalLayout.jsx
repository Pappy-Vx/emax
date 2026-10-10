'use client';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsapp from './FloatingWhatsapp';
import HalloweenPromo from './HalloweenPromo';

const NO_CHROME = ['/login', '/checkout', '/auth/google'];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const hide = NO_CHROME.includes(pathname) || pathname.startsWith('/dashboard');
  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
      {!hide && <FloatingWhatsapp />}
      <Toaster position="bottom-right" richColors closeButton />
      <HalloweenPromo />
    </>
  );
}
