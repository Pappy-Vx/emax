'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsapp from './FloatingWhatsapp';

const NO_CHROME = ['/login', '/checkout'];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const hide = NO_CHROME.includes(pathname) || pathname.startsWith('/dashboard');
  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
      {!hide && <FloatingWhatsapp />}
    </>
  );
}
