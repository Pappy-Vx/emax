'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RunnerRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/runner/errands'); }, [router]);
  return null;
}
