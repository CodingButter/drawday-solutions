/**
 * DrawDay Solutions Homepage - Server Component
 * Fetches content from Directus CMS
 */

import {
  getHomePage,
  getCalculatedStatistics,
  getServices,
  getClientCompanies,
} from '@/lib/directus-content';
import DrawDayHomePageClient from './DrawDayHomePageClient';

export default async function DrawDayHomePageServer() {
  // Fetch all content in parallel
  const [homePage, statistics, services, clients] = await Promise.all([
    getHomePage(),
    getCalculatedStatistics(),
    getServices('active'),
    getClientCompanies(),
  ]);

  // Fallback content if Directus is not configured
  const defaultContent = {
    hero_badge_text: "Trusted by UK's Leading Raffle Companies",
    hero_title: 'DrawDay Solutions',
    hero_subtitle:
      'The complete technology partner for UK raffle companies. From live draw software to streaming production, custom websites, and professional OBS tools.',
    hero_cta_primary_text: 'Explore Our Solutions',
    hero_cta_primary_link: '#services',
    hero_cta_secondary_text: 'Try Demo',
    hero_cta_secondary_link: '/demo',
    services_title: 'Complete Solutions for Modern Raffles',
    services_subtitle:
      'Everything you need to run professional, compliant, and engaging prize draws',
    why_choose_title: 'Why UK Raffle Companies Choose DrawDay',
    why_choose_items: [
      {
        icon: 'Shield',
        title: 'UK Compliant',
        description:
          'Built for Gambling Commission requirements. Transparent, fair, and auditable.',
      },
      {
        icon: 'Zap',
        title: 'Lightning Fast',
        description:
          '60fps animations, instant winner selection, zero lag even with thousands of entries.',
      },
      {
        icon: 'Users',
        title: 'Viewer Engagement',
        description: 'Keep audiences glued with professional graphics and exciting animations.',
      },
      {
        icon: 'Trophy',
        title: 'Industry Leaders',
        description: 'Trusted by companies giving away millions in prizes annually.',
      },
    ],
    clients_title: 'Trusted by leading UK competition platforms',
    show_client_logos: true,
    cta_title: 'Ready to Transform Your Live Draws?',
    cta_subtitle: "Join the UK's leading raffle companies using DrawDay Solutions",
    cta_button_primary_text: 'Get Started Today',
    cta_button_secondary_text: 'Schedule Demo',
  };

  // Default services if not in CMS
  const defaultServices = [
    {
      id: '1',
      name: 'Live Draw Extension',
      slug: 'features',
      short_description:
        'Professional Chrome extension for conducting fair, transparent live draws with stunning animations.',
      features: [
        'Slot machine-style spinner',
        'CSV import with 5000+ entries',
        'Custom branding & logos',
        'Winner history tracking',
      ],
      icon: 'Monitor',
      color_scheme: 'purple' as const,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Live Streaming Production',
      slug: 'streaming',
      short_description:
        'Professional multi-camera streaming services with real-time engagement and 4K quality.',
      features: [
        'Multi-camera production',
        '4K Ultra HD streaming',
        'Real-time engagement',
        'Custom graphics & overlays',
      ],
      icon: 'Tv',
      color_scheme: 'blue' as const,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'OBS Tools & Templates',
      slug: 'obs-tools',
      short_description:
        'Professional OBS scene collections, stinger transitions, and overlays for broadcast-quality streams.',
      features: [
        'Complete scene collections',
        'Stinger transitions',
        'Animated overlays',
        'Custom branding included',
      ],
      icon: 'Code',
      color_scheme: 'purple' as const,
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'Website Development',
      slug: 'websites',
      short_description:
        'Custom competition websites with payment processing, user management, and full CMS integration.',
      features: [
        'Mobile-first design',
        'Payment integration',
        'SEO optimized',
        'Competition management',
      ],
      icon: 'Code',
      color_scheme: 'green' as const,
      status: 'active' as const,
    },
  ];

  const content = homePage || defaultContent;

  // Format statistics for display
  const formattedStats = {
    companiesServed: statistics?.companiesServed || 0,
    prizesDrawn: statistics?.prizesDrawn || 0,
  };

  return (
    <DrawDayHomePageClient
      content={content}
      statistics={formattedStats}
      services={services.length > 0 ? services : defaultServices}
      clients={clients || []}
    />
  );
}
