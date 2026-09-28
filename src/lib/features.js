/**
 * Feature flags — read from NEXT_PUBLIC_FF_* env vars at build time.
 *
 * Shape is intentionally flat so a future NestJS endpoint can return
 * the same object and callers need zero changes:
 *
 *   GET /api/feature-flags → { pricing: true, dashboard: false, … }
 *
 * To add a flag:
 *   1. Add an entry here with its env var + default value.
 *   2. Set NEXT_PUBLIC_FF_<NAME>=true|false in .env.local (or Namecheap env).
 *   3. For the NestJS backend, add the same key to its FeatureFlagsService.
 */

function bool(envVar, defaultValue) {
  const v = process.env[envVar];
  if (v === undefined || v === '') return defaultValue;
  return v === 'true' || v === '1';
}

export const FLAGS = {
  /** Show /pricing in nav + footer */
  pricing:        bool('NEXT_PUBLIC_FF_PRICING',        true),
  /** Show /dashboard link (customer portal — future) */
  dashboard:      bool('NEXT_PUBLIC_FF_DASHBOARD',      true),
  /** Replace phone CTA with an inline booking form */

};

/**
 * Runtime fetch from NestJS (optional, future).
 * Call this once at app startup (e.g. in a root server component) and
 * merge the result over FLAGS so client components see the live values.
 *
 * Falls back to the build-time FLAGS if the request fails or times out.
 */
export async function fetchRemoteFlags(apiBase) {
  try {
    const res = await fetch(`${apiBase}/feature-flags`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FLAGS;
    const remote = await res.json();
    return { ...FLAGS, ...remote };
  } catch {
    return FLAGS;
  }
}
