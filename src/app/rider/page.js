'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RiderRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/rider/errands'); }, [router]);
  return null;
}
