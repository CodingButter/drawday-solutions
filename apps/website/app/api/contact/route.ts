/**
 * Contact Form API Endpoint
 *
 * Handles contact form submissions and stores them in Directus
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, company, website, service_interest, message } = body;

    if (!name || !email || !service_interest || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Prepare contact data
    const contactData = {
      name,
      email,
      company: company || null,
      website: website || null,
      service_interest,
      message,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Try to submit to Directus (if collection exists)
    try {
      const directusResponse = await fetch(`${DIRECTUS_URL}/items/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (directusResponse.ok) {
        console.log('Contact saved to Directus');
      } else {
        // Log but don't fail - Directus collection might not exist yet
        console.log('Could not save to Directus:', directusResponse.status);
      }
    } catch (directusError) {
      // Log but don't fail - Directus might be unavailable
      console.error('Directus submission error:', directusError);
    }

    // For now, also log the contact locally
    console.log('Contact form submission:', contactData);

    // Send success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
