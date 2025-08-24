import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if admin SDK is initialized
    if (!adminAuth || !adminDb) {
      // For development without admin SDK, return mock success
      console.warn('Firebase Admin not configured - returning mock response');
      return NextResponse.json({
        success: true,
        token: 'mock-token',
        user: {
          uid: 'mock-user-id',
          email: email,
          displayName: 'Mock User',
          firstName: 'Mock',
          lastName: 'User',
          extensionEnabled: true,
          plan: 'free',
        },
      });
    }

    // Note: Firebase Admin SDK doesn't directly validate passwords
    // We'll need to use Firebase Client SDK for this or implement a custom solution
    // For now, we'll create a custom token after verifying the user exists

    // Get user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    // Create custom token
    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    // Return token and user info
    return NextResponse.json({
      success: true,
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);

    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
