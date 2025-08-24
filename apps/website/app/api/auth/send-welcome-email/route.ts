import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Email and firstName are required' }, { status: 400 });
    }

    const emailTemplate = emailTemplates.welcomeEmail(email, firstName);
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return NextResponse.json({ success: true, message: 'Welcome email sent' });
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);
    // Don't fail if email sending fails
    return NextResponse.json({ success: false, message: 'Email not sent but registration successful' });
  }
}