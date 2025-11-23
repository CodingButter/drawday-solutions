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

  // Default services if not in CMS
  const defaultServices = [
    {
      id: '1',
      name: 'Live Draw Extension',
      slug: 'features',
      short_description:
        'Professional Chrome extension for conducting fair, transparent live draws with stunning animations.',
      icon: 'Monitor',
      color_scheme: 'purple' as const,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Live Streaming',
      slug: 'streaming',
      short_description:
        'Professional multi-camera streaming services with real-time engagement and 4K quality.',
      icon: 'Tv',
      color_scheme: 'blue' as const,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'OBS Tools',
      slug: 'obs-tools',
      short_description:
        'Professional OBS templates, stinger transitions, and overlays for broadcast-quality streams.',
      icon: 'Code',
      color_scheme: 'purple' as const,
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'Website Development',
      slug: 'websites',
      short_description: 'Custom competition websites with payment processing and user management.',
      icon: 'Code',
      color_scheme: 'green' as const,
      status: 'active' as const,
    },
  ];

  return (
    <NavigationClient
      settings={settings}
      services={services.length > 0 ? services : defaultServices}
    />
  );
}
