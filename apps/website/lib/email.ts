import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('Email transporter verification failed:', error);
      console.error('Email config:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
        pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      });
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.error('Email configuration incomplete:', {
    host: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
    user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
    port: process.env.EMAIL_PORT || '587',
    secure: process.env.EMAIL_SECURE || 'false',
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // Check if email config is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Cannot send email - configuration missing');
    return { 
      success: false, 
      error: { 
        message: 'Email service not configured',
        details: 'Missing EMAIL_HOST, EMAIL_USER, or EMAIL_PASS'
      } 
    };
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || '"DrawDay Solutions" <admin@drawday.app>';
    
    console.log('Attempting to send email:', {
      from: fromAddress,
      to,
      subject,
      host: process.env.EMAIL_HOST,
    });

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || '',
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Email error details:', {
      code: error.code,
      message: error.message,
      response: error.response,
    });
    return { success: false, error };
  }
}

// Generate magic link token
export function generateMagicLinkToken(email: string): string {
  return jwt.sign(
    {
      email,
      type: 'magic-link',
      timestamp: Date.now(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

// Generate password reset token
export function generatePasswordResetToken(email: string, userId: string): string {
  return jwt.sign(
    {
      email,
      userId,
      type: 'password-reset',
      timestamp: Date.now(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

// Verify token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Email templates
export const emailTemplates = {
  magicLink: (email: string, link: string) => ({
    subject: '✨ Your Magic Link to Sign In',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Magic Link - DrawDay Solutions</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              display: inline-block;
              margin-bottom: 20px;
            }
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin: 0 0 10px 0;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              border-radius: 6px;
              padding: 12px;
              margin: 20px 0;
              color: #856404;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1>Sign in to DrawDay</h1>
            </div>
            
            <p>Hi there!</p>
            
            <p>You requested a magic link to sign in to your DrawDay account for <strong>${email}</strong>.</p>
            
            <p>Click the button below to sign in instantly:</p>
            
            <div style="text-align: center;">
              <a href="${link}" class="button">🔮 Sign In with Magic Link</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
              ${link}
            </p>
            
            <div class="warning">
              ⚠️ This link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.
            </div>
            
            <div class="footer">
              <p>© 2024 DrawDay Solutions. All rights reserved.</p>
              <p>DrawDay Solutions Ltd, United Kingdom</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Sign in to DrawDay
      
      Hi there!
      
      You requested a magic link to sign in to your DrawDay account for ${email}.
      
      Click this link to sign in instantly:
      ${link}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this, you can safely ignore this email.
      
      © 2024 DrawDay Solutions. All rights reserved.
    `,
  }),

  passwordReset: (email: string, link: string) => ({
    subject: '🔐 Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - DrawDay Solutions</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              display: inline-block;
              margin-bottom: 20px;
            }
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin: 0 0 10px 0;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              border-radius: 6px;
              padding: 12px;
              margin: 20px 0;
              color: #856404;
              font-size: 14px;
            }
            .security-tips {
              background: #e8f4fd;
              border: 1px solid #b8daff;
              border-radius: 6px;
              padding: 12px;
              margin: 20px 0;
              color: #004085;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1>Reset Your Password</h1>
            </div>
            
            <p>Hi there!</p>
            
            <p>We received a request to reset the password for your DrawDay account associated with <strong>${email}</strong>.</p>
            
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${link}" class="button">🔐 Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
              ${link}
            </p>
            
            <div class="warning">
              ⚠️ This link will expire in 1 hour for security reasons. After that, you'll need to request a new password reset.
            </div>
            
            <div class="security-tips">
              <strong>🔒 Security Tips:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Create a strong password with at least 8 characters</li>
                <li>Use a mix of letters, numbers, and symbols</li>
                <li>Don't reuse passwords from other sites</li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
            
            <div class="footer">
              <p>© 2024 DrawDay Solutions. All rights reserved.</p>
              <p>DrawDay Solutions Ltd, United Kingdom</p>
              <p style="font-size: 12px; color: #999;">
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password
      
      Hi there!
      
      We received a request to reset the password for your DrawDay account associated with ${email}.
      
      Click this link to create a new password:
      ${link}
      
      This link will expire in 1 hour for security reasons.
      
      Security Tips:
      - Create a strong password with at least 8 characters
      - Use a mix of letters, numbers, and symbols
      - Don't reuse passwords from other sites
      - Consider using a password manager
      
      If you didn't request this password reset, please ignore this email and your password will remain unchanged.
      
      © 2024 DrawDay Solutions. All rights reserved.
    `,
  }),

  welcomeEmail: (email: string, firstName: string) => ({
    subject: '🎉 Welcome to DrawDay Solutions!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome - DrawDay Solutions</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              display: inline-block;
              margin-bottom: 20px;
            }
            h1 {
              color: #1a1a1a;
              font-size: 28px;
              margin: 0 0 10px 0;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .feature {
              display: flex;
              align-items: start;
              margin: 15px 0;
            }
            .feature-icon {
              width: 24px;
              height: 24px;
              margin-right: 15px;
              flex-shrink: 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1>Welcome to DrawDay! 🎉</h1>
            </div>
            
            <p>Hi ${firstName}!</p>
            
            <p>Thank you for joining DrawDay Solutions! We're thrilled to have you as part of our community of competition hosts.</p>
            
            <p><strong>Here's what you can do now:</strong></p>
            
            <div class="feature">
              <span class="feature-icon">✨</span>
              <div>
                <strong>Download the Chrome Extension</strong><br>
                <span style="color: #666; font-size: 14px;">Get our powerful DrawDay Spinner extension from your dashboard</span>
              </div>
            </div>
            
            <div class="feature">
              <span class="feature-icon">📊</span>
              <div>
                <strong>Upload Your Participants</strong><br>
                <span style="color: #666; font-size: 14px;">Import CSV files with your competition entries</span>
              </div>
            </div>
            
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <div>
                <strong>Run Professional Draws</strong><br>
                <span style="color: #666; font-size: 14px;">Create fair, transparent draws that build trust</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard →</a>
            </div>
            
            <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Need Help?</strong><br>
              Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a> or 
              reply to this email if you have any questions. We're here to help!
            </p>
            
            <div class="footer">
              <p>© 2024 DrawDay Solutions. All rights reserved.</p>
              <p>DrawDay Solutions Ltd, United Kingdom</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to DrawDay! 🎉
      
      Hi ${firstName}!
      
      Thank you for joining DrawDay Solutions! We're thrilled to have you as part of our community of competition hosts.
      
      Here's what you can do now:
      
      ✨ Download the Chrome Extension
      Get our powerful DrawDay Spinner extension from your dashboard
      
      📊 Upload Your Participants
      Import CSV files with your competition entries
      
      🎯 Run Professional Draws
      Create fair, transparent draws that build trust
      
      Go to Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      
      Need Help?
      Check out our documentation at ${process.env.NEXT_PUBLIC_APP_URL}/docs or reply to this email if you have any questions.
      
      © 2024 DrawDay Solutions. All rights reserved.
    `,
  }),
};
