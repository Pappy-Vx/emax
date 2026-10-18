import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Ops and rider portals are always accessible regardless of feature flag
  if (pathname.startsWith('/ops') || pathname.startsWith('/rider')) {
    return NextResponse.next();
  }

  // Use FF_DASHBOARD (no NEXT_PUBLIC_ prefix) so Next.js never inlines the value
  // at compile time — it's always read from process.env at request time.
  // Default is OPEN (true). Only an explicit 'false' or '0' closes the gate.
  const ff = process.env.FF_DASHBOARD;
  const dashboardOn = ff === undefined || ff === '' || ff === 'true' || ff === '1';

  if (dashboardOn) return NextResponse.next();

  // Flag is explicitly off — redirect protected routes to coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  matcher: [
    '/login',
    '/checkout',
    '/dashboard/:path*',
    '/auth/google',
    '/ops/:path*',
    '/rider/:path*',
  ],
};
