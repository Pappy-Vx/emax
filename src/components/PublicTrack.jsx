'use client';
import { useCallback } from 'react';
import { api } from '@/lib/api';
import { TrackView } from '@/components/dashboard/DashTrack';

export default function PublicTrack({ token }) {
  const fetchTracking = useCallback(() => api.track(token), [token]);
  return (
    <main className="min-h-screen bg-cream pt-28 pb-16 px-4 sm:px-6">
      <TrackView fetchTracking={fetchTracking} />
      <p className="max-w-3xl mx-auto mt-6 text-center text-xs text-navy/40">
        Questions about your errand? Call or text (812) 565-9585.
      </p>
    </main>
  );
}
