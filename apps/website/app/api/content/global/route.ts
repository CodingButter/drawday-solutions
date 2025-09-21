import { NextResponse } from 'next/server';
import { getGlobalSettings } from '@/lib/directus-content';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const settings = await getGlobalSettings();

    // Fallback content if Directus is not configured
    const defaultSettings = {
      site_name: 'DrawDay Solutions',
      site_tagline: 'Technology Partner for UK Raffle Companies',
      site_description:
        'Complete technology solutions for UK raffle companies. Live draw software, streaming production, and custom websites. Trusted by companies giving away £10M+ in prizes.',
      contact_email: 'hello@drawday.app',
      contact_phone: '+44 20 1234 5678',
      office_address: '123 Tech Street',
      office_city: 'London',
      office_country: 'United Kingdom',
      social_github: 'https://github.com/CodingButter/raffle-spinner',
      social_twitter: 'https://twitter.com/drawdaysolutions',
      social_linkedin: 'https://linkedin.com/company/drawday-solutions',
      copyright_text: `© ${new Date().getFullYear()} DrawDay Solutions. All rights reserved.`,
    };

    return NextResponse.json({
      data: settings || defaultSettings,
    });
  } catch (error) {
    console.error('Failed to fetch global settings:', error);
    return NextResponse.json({ error: 'Failed to fetch global settings' }, { status: 500 });
  }
}
