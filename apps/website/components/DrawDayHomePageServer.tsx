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
      'The complete technology partner for UK raffle companies. From live draw software to streaming production and custom websites.',
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
      services={services || []}
      clients={clients || []}
    />
  );
}
