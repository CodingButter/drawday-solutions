import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add protected routes here
const protectedRoutes = ['/dashboard', '/configuration', '/live-spinner'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute) {
    // Firebase Auth handles authentication client-side
    // For server-side protection, you would need to implement Firebase Admin SDK
    // and verify the ID token sent from the client
    // For now, we'll let the client-side handle authentication
    // The dashboard page itself will check auth state and redirect if needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
  ],
};
