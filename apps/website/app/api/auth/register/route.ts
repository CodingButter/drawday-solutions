import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { email, password, firstName, lastName } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if admin SDK is initialized
    if (!adminAuth || !adminDb) {
      // For development without admin SDK, return mock success
      console.warn('Firebase Admin not configured - returning mock response');

      // Still send welcome email in dev mode
      const emailTemplate = emailTemplates.welcomeEmail(email, firstName);
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      return NextResponse.json({
        success: true,
        message: 'User created successfully (dev mode)',
        userId: 'mock-user-id',
      });
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      role: 'user',
      extensionEnabled: true, // Enable extension access by default for registered users
      plan: 'free', // Default plan
    });

    // Send welcome email
    try {
      const emailTemplate = emailTemplates.welcomeEmail(email, firstName);
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: userRecord.uid,
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'Password should be at least 6 characters' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
