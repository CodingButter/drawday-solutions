import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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

    try {
      // Use Firebase Client SDK to authenticate
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get ID token
      const idToken = await user.getIdToken();

      // Get user data from Firestore if admin SDK is available
      let userData = {};
      if (adminDb) {
        try {
          const userDoc = await adminDb.collection('users').doc(user.uid).get();
          userData = userDoc.exists ? userDoc.data() : {};
        } catch (firestoreError) {
          console.error('Failed to fetch user data from Firestore:', firestoreError);
        }
      }

      // Return token and user info
      return NextResponse.json({
        success: true,
        token: idToken,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData,
        },
      });
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      
      // Handle specific Firebase Auth errors
      if (authError.code === 'auth/invalid-email') {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }
      if (authError.code === 'auth/user-disabled') {
        return NextResponse.json({ error: 'This account has been disabled' }, { status: 403 });
      }
      if (authError.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      if (authError.code === 'auth/wrong-password') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      if (authError.code === 'auth/invalid-credential') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      if (authError.code === 'auth/too-many-requests') {
        return NextResponse.json({ error: 'Too many failed login attempts. Please try again later.' }, { status: 429 });
      }

      return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}