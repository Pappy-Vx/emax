'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OpsRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/ops/errands'); }, [router]);
  return null;
}
