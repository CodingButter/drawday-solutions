import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/email';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
    }

    // Verify the token
    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== 'magic-link') {
      return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
    }

    const { email } = decoded;

    // Create a session for the user
    // In production, you would:
    // 1. Look up or create the user in your database
    // 2. Create a proper session token
    // 3. Set secure HTTP-only cookies

    // For now, we'll create a simple session
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Set a session cookie (in production, use proper session management)
    response.cookies.set(
      'session',
      JSON.stringify({
        email,
        loginMethod: 'magic-link',
        timestamp: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      }
    );

    // Also set a client-side accessible token for the frontend
    response.cookies.set('token', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.redirect(new URL('/login?error=verification-failed', request.url));
  }
}
