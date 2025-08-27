import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateMagicLinkToken, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check environment variables
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error. JWT_SECRET missing.' },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing:', {
        host: !!process.env.EMAIL_HOST,
        user: !!process.env.EMAIL_USER,
        pass: !!process.env.EMAIL_PASS,
      });
      return NextResponse.json(
        { error: 'Server configuration error. Email settings missing.' },
        { status: 500 }
      );
    }

    // Generate magic link token
    const token = generateMagicLinkToken(email);

    // Create magic link URL - ensure proper URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.drawday.app';
    const magicLink = `${baseUrl}/api/auth/magic-link/verify?token=${token}`;

    console.log('Sending magic link to:', email);
    console.log('Magic link URL:', magicLink);

    // Send email with magic link
    const emailTemplate = emailTemplates.magicLink(email, magicLink);
    const result = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!result.success) {
      console.error('Failed to send magic link email:', result.error);
      // Provide more specific error message
      const errorMessage = result.error?.message || 'Email service unavailable';
      return NextResponse.json(
        { error: `Failed to send email: ${errorMessage}` },
        { status: 500 }
      );
    }

    console.log('Magic link sent successfully to:', email);
    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email',
    });
  } catch (error: any) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
