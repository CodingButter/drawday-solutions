import { getGlobalSettings, getServices } from '@/lib/directus-content';
import { FooterClient } from './footer-client';

export async function FooterServer() {
  const [globalSettings, services] = await Promise.all([
    getGlobalSettings(),
    getServices('active'),
  ]);

  // Fallback values if Directus is not configured
  const settings = globalSettings || {
    site_name: 'DrawDay Solutions',
    site_tagline: 'Technology Partner for UK Raffle Companies',
    site_description:
      'Complete technology solutions for UK raffle companies. From live draws to streaming production and custom websites.',
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

  return <FooterClient settings={settings} services={services} />;
}
