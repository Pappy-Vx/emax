import { NextResponse } from 'next/server';

// Read at build/edge time — matches the bool() logic in src/lib/features.js
const DASHBOARD_ON =
  process.env.NEXT_PUBLIC_FF_DASHBOARD === 'true' ||
  process.env.NEXT_PUBLIC_FF_DASHBOARD === '1';

export function proxy(request) {
  // When the dashboard feature is live, let everything through
  if (DASHBOARD_ON) return NextResponse.next();

  // Block all login / checkout / dashboard / OAuth paths → coming soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  // Runs only on the routes that need guarding — no overhead on public pages
  matcher: [
    '/login',
    '/checkout',
    '/dashboard/:path*',
    '/auth/google',
  ],
};
