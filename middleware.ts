import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Routes from './constants/routes';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  const protectedRoutes = [
    Routes.DASHBOARD,
    Routes.TENANTS,
    Routes.HANDYMAN,
    Routes.MANAGEMENT,
    Routes.ISSUES,
    Routes.ADD_NEW_ISSUE,
  ];

  const pathname = req.nextUrl.pathname;

  // Redirect old /dashboard/fixes URLs to /dashboard/issues
  if (pathname.startsWith('/dashboard/fixes')) {
    const newPath = pathname.replace('/dashboard/fixes', '/dashboard/issues');
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login if no token is found
      const loginUrl = new URL(Routes.LOGIN, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}