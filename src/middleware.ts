import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/admin/login';

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Redirect to login if accessing admin path without auth
  if (!isPublicPath && !token && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to dashboard if accessing login while authenticated
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    '/admin/:path*'
  ]
}; 