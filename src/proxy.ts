import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/accept-invite',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /admin routes (exclude APIs which handle their own auth responses)
  if (pathname.startsWith('/admin')) {
    // If root /admin, redirect to /admin/contacts
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/contacts', request.url));
    }

    const isPublicAuthPath = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));
    const sessionCookie = request.cookies.get('gkb_admin_session')?.value;

    // If attempting to visit a public auth page while already logged in, redirect to dashboard
    if (isPublicAuthPath && sessionCookie) {
      return NextResponse.redirect(new URL('/admin/contacts', request.url));
    }

    // If attempting to visit a protected admin page without session cookie, redirect to login
    if (!isPublicAuthPath && !sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

