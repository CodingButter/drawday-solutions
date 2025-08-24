import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Send a test email
    const result = await sendEmail({
      to: 'admin@drawday.app', // Sending to yourself for testing
      subject: '🧪 Test Email from DrawDay',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #667eea;">Test Email Successful! 🎉</h1>
            <p>This is a test email from your DrawDay application.</p>
            <p>If you're receiving this, your email configuration is working correctly!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Email Server: ${process.env.EMAIL_HOST}<br>
              Port: ${process.env.EMAIL_PORT}<br>
              From: ${process.env.EMAIL_FROM}<br>
              Timestamp: ${new Date().toISOString()}
            </p>
          </body>
        </html>
      `,
      text: `Test Email Successful! This is a test email from DrawDay. Timestamp: ${new Date().toISOString()}`,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send test email',
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
