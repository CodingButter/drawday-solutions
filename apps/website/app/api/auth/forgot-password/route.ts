import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generatePasswordResetToken, emailTemplates } from '@/lib/email';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists (optional - you might want to always return success for security)
    let userId = 'temp-user-id'; // In production, look up the user ID from your database

    if (adminAuth) {
      try {
        const user = await adminAuth.getUserByEmail(email);
        userId = user.uid;
      } catch (error) {
        // User doesn't exist, but we'll still return success for security
        console.log('User not found for password reset:', email);
      }
    }

    // Generate password reset token
    const token = generatePasswordResetToken(email, userId);

    // Create password reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Send email with reset link
    const emailTemplate = emailTemplates.passwordReset(email, resetLink);
    const result = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      // Still return success for security (don't reveal if email exists)
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
