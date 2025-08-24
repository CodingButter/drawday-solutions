import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Check if admin SDK is initialized
    if (!adminAuth || !adminDb) {
      // For development without admin SDK, return mock success
      console.warn('Firebase Admin not configured - returning mock response');
      return NextResponse.json({
        success: true,
        uid: 'mock-user-id',
        email: 'user@example.com',
      });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create a session cookie (optional, for server-side auth)
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Return success with session cookie
    const response = NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

    // Set the session cookie
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Token verification error:', error);

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
