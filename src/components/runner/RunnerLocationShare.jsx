'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';

const MIN_INTERVAL_MS = 10_000; // never send more often than this
const HEARTBEAT_MS = 30_000;    // resend while stationary so the customer sees it's still live
const MIN_MOVE_M = 25;

function distanceM(a, b) {
  const R = 6_371_000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function readFlag(key) {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function writeFlag(key, on) {
  try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key); } catch { /* storage unavailable */ }
}

export default function RunnerLocationShare({ errandId, active }) {
  const storageKey = `emax_runner_share_${errandId}`;
  const [sharing, setSharing] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());

  const watchRef = useRef(null);
  const lastFixRef = useRef(null);
  const lastSentRef = useRef(null);
  const sendingRef = useRef(false);
  const wakeRef = useRef(null);

  const releaseWakeLock = useCallback(() => {
    wakeRef.current?.release().catch(() => {});
    wakeRef.current = null;
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && !wakeRef.current) wakeRef.current = await navigator.wakeLock.request('screen');
    } catch { /* not supported or denied — sharing still works while the screen is on */ }
  }, []);

  const stop = useCallback((remember = false) => {
    if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    releaseWakeLock();
    setSharing(false);
    if (!remember) writeFlag(storageKey, false);
  }, [releaseWakeLock, storageKey]);

  const send = useCallback(async (fix, force = false) => {
    if (sendingRef.current) return;
    const last = lastSentRef.current;
    const t = Date.now();
    if (!force && last) {
      const elapsed = t - last.at;
      if (elapsed < MIN_INTERVAL_MS) return;
      if (distanceM(last, fix) < MIN_MOVE_M && elapsed < HEARTBEAT_MS) return;
    }
    sendingRef.current = true;
    try {
      await api.runner.shareLocation(errandId, { lat: fix.lat, lng: fix.lng, accuracy: Math.round(fix.accuracy) });
      lastSentRef.current = { ...fix, at: t };
      setLastSentAt(t);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not send your location.');
    } finally {
      sendingRef.current = false;
    }
  }, [errandId]);

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('This browser cannot share location.');
      return;
    }
    if (watchRef.current != null) return;
    setError('');
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        const first = !lastFixRef.current;
        lastFixRef.current = fix;
        send(fix, first);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission is blocked. Allow location for this site in your browser settings, then tap Start again.');
          stop();
        } else {
          setError('Having trouble getting your GPS position. Keep this page open — it will retry automatically.');
        }
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 },
    );
    setSharing(true);
    writeFlag(storageKey, true);
    requestWakeLock();
  }, [send, stop, storageKey, requestWakeLock]);

  // Resume automatically if the runner was sharing before leaving or reloading the page.
  useEffect(() => {
    if (active && readFlag(storageKey)) start();
  }, [active, storageKey, start]);

  // Errand finished or no longer in progress — stop and forget.
  useEffect(() => {
    if (!active) stop();
  }, [active, stop]);

  // Leaving the page pauses the GPS watch but remembers the choice.
  useEffect(() => () => stop(true), [stop]);

  useEffect(() => {
    if (!sharing) return;
    const heartbeat = setInterval(() => { if (lastFixRef.current) send(lastFixRef.current); }, HEARTBEAT_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [sharing, send, requestWakeLock]);

  useEffect(() => {
    if (!sharing) return;
    const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, [sharing]);

  const sinceSent = lastSentAt ? Math.max(0, Math.round((now - lastSentAt) / 1000)) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-semibold text-navy">Live location</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {active
              ? 'The customer can follow you on a map while this errand is in progress.'
              : 'Mark the errand as Confirmed to start sharing your location.'}
          </p>
        </div>
        {sharing && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {sharing && (
        <p className="text-xs text-gray-500 mb-3">
          {sinceSent == null ? 'Getting your GPS position…' : `Last sent ${sinceSent < 10 ? 'just now' : `${sinceSent}s ago`}.`}{' '}
          Keep this page open — sharing pauses if you lock the screen or switch apps.
        </p>
      )}

      {error && <p className="text-red-600 text-xs bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

      <button
        type="button"
        disabled={!active}
        onClick={() => (sharing ? stop() : start())}
        className={`w-full rounded-full py-3 font-semibold text-sm transition disabled:opacity-40 ${
          sharing ? 'border border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-gold text-navy hover:bg-gold-deep'
        }`}
      >
        {sharing ? 'Stop sharing location' : 'Start sharing location'}
      </button>
    </div>
  );
}
