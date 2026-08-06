import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for Supabase auth cookie or auth token in cookies
    const allCookies = req.cookies.getAll();
    const hasAuthCookie = allCookies.some(
      (c) => c.name.includes('auth-token') || c.name.includes('sb-') || c.name === 'handy_admin_session'
    );

    if (!hasAuthCookie) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
