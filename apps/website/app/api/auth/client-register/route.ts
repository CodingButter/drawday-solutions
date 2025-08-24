import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password should be at least 6 characters' },
        { status: 400 }
      );
    }

    try {
      // Create user with Firebase Client SDK
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
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
        userId: user.uid,
      });
    } catch (authError: any) {
      console.error('Registration error:', authError);

      // Handle specific Firebase errors
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      if (authError.code === 'auth/invalid-email') {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }
      if (authError.code === 'auth/operation-not-allowed') {
        return NextResponse.json({ error: 'Email/password accounts are not enabled' }, { status: 400 });
      }
      if (authError.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'Password should be at least 6 characters' },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}