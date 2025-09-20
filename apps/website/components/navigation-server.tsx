import { getGlobalSettings, getServices } from '@/lib/directus-content';
import { NavigationClient } from './navigation-client';

export async function NavigationServer() {
  const [globalSettings, services] = await Promise.all([
    getGlobalSettings(),
    getServices('active'),
  ]);

  // Fallback values if Directus is not configured
  const settings = globalSettings || {
    site_name: 'DrawDay',
    site_tagline: 'Solutions',
    site_description: 'Competition Spinner Solutions',
    contact_email: 'hello@drawday.app',
    contact_phone: '',
    office_address: '',
    office_city: '',
    office_country: '',
    copyright_text: `© ${new Date().getFullYear()} DrawDay Solutions. All rights reserved.`,
  };

  return <NavigationClient settings={settings} services={services} />;
}
