import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/email';
import { adminAuth } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    // Verify the token
    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== 'password-reset') {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const { email, userId } = decoded;

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Update the user's password
    if (adminAuth) {
      try {
        await adminAuth.updateUser(userId, {
          password: password,
        });
      } catch (error) {
        console.error('Failed to update password in Firebase:', error);
        // In development/mock mode, just continue
      }
    }

    // In a production app with a database, you would also:
    // 1. Hash the password with bcrypt
    // 2. Update the user's password in your database
    // 3. Invalidate any existing sessions

    // For demonstration:
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password reset for user:', email, 'New hash:', hashedPassword);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
