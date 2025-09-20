import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.parse(body);
    
    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #4a5568;">From:</strong>
              <p style="margin: 5px 0; color: #2d3748;">${validatedData.name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #4a5568;">Email:</strong>
              <p style="margin: 5px 0;"><a href="mailto:${validatedData.email}" style="color: #667eea;">${validatedData.email}</a></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #4a5568;">Subject:</strong>
              <p style="margin: 5px 0; color: #2d3748;">${validatedData.subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #4a5568;">Message:</strong>
              <div style="margin-top: 10px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #667eea; color: #2d3748; white-space: pre-wrap;">${validatedData.message}</div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #718096; font-size: 14px;">
              This message was sent from the DrawDay Spinner contact form.<br>
              You can reply directly to this email to respond to ${validatedData.name}.
            </p>
          </div>
        </body>
      </html>
    `;
    
    const emailText = `
New Contact Form Submission

From: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}

Message:
${validatedData.message}

---
This message was sent from the DrawDay Spinner contact form.
You can reply directly to this email to respond to ${validatedData.name}.
    `;
    
    // Send email to admin (include sender's email in the subject for reply purposes)
    const result = await sendEmail({
      to: 'admin@drawday.app',
      subject: `[Contact Form] ${validatedData.subject} - from ${validatedData.email}`,
      html: emailHtml,
      text: emailText,
    });
    
    if (result.success) {
      // Also send confirmation to the user
      const userEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Thank you for contacting DrawDay</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #667eea; margin-bottom: 20px;">Thank You for Contacting Us!</h2>
              
              <p style="color: #2d3748; line-height: 1.6;">
                Hi ${validatedData.name},
              </p>
              
              <p style="color: #2d3748; line-height: 1.6;">
                We've received your message and will get back to you as soon as possible. 
                Our team typically responds within 24-48 hours during business days.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f7fafc; border-radius: 5px;">
                <h3 style="color: #4a5568; margin-top: 0;">Your Message:</h3>
                <p style="color: #2d3748; margin: 10px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
                <p style="color: #2d3748; white-space: pre-wrap;">${validatedData.message}</p>
              </div>
              
              <p style="color: #2d3748; line-height: 1.6;">
                In the meantime, feel free to explore our 
                <a href="https://drawday.app" style="color: #667eea;">website</a> 
                or check out our features.
              </p>
              
              <p style="color: #2d3748; line-height: 1.6;">
                Best regards,<br>
                The DrawDay Team
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #718096; font-size: 12px; text-align: center;">
                DrawDay Spinner - Making raffles fair and fun<br>
                © 2024 DrawDay. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `;
      
      await sendEmail({
        to: validatedData.email,
        subject: 'Thank you for contacting DrawDay',
        html: userEmailHtml,
        text: `Thank you for contacting us! We've received your message and will get back to you soon.`,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully!',
      });
    } else {
      throw new Error(result.error || 'Failed to send email');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid form data',
          errors: error.issues,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}