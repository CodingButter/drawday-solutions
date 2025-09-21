/**
 * DrawDay Solutions Homepage
 *
 * Main company website showcasing all services and products
 */

import DrawDayHomePageServer from '@/components/DrawDayHomePageServer';

export const metadata = {
  title: 'DrawDay Solutions - Technology Partner for UK Raffle Companies',
  description:
    'Complete technology solutions for UK raffle companies. Live draw software, streaming production, and custom websites. Trusted by leading UK competition platforms.',
  keywords:
    'UK raffle software, competition technology, live draw software, streaming production, raffle websites',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default function Home() {
  return <DrawDayHomePageServer />;
}
