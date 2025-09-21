/**
 * DrawDay Solutions Homepage - Client Component
 * Renders content fetched from Directus CMS
 */

'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Monitor,
  Tv,
  Code,
  Trophy,
  Users,
  Zap,
  Shield,
  ChevronRight,
  Play,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@raffle-spinner/ui';
import { cn } from '@/lib/utils';
import type { HomePage, Service, Company } from '@/types/directus';
import { getDirectusImageUrl } from '@/lib/directus-content';

// Map icon names to Lucide components
const iconMap: { [key: string]: any } = {
  Shield,
  Zap,
  Users,
  Trophy,
  Monitor,
  Tv,
  Code,
};

interface Props {
  content: HomePage;
  statistics: {
    companiesServed: number;
    prizesDrawn: number;
  };
  services: Service[];
  clients: Company[];
}

export default function DrawDayHomePageClient({ content, statistics, services, clients }: Props) {
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {content.hero_badge_text && (
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
              <Sparkles className="w-4 h-4" />
              {content.hero_badge_text}
            </div>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            {content.hero_title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {content.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={content.hero_cta_primary_link}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-purple-500/25"
              >
                {content.hero_cta_primary_text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href={content.hero_cta_secondary_link}>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                {content.hero_cta_secondary_text}
              </Button>
            </Link>
          </div>

          {/* Real Statistics - No Live Viewers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {formatNumber(statistics.companiesServed)}
              </div>
              <div className="text-gray-400 mt-2">Raffle Companies Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {formatNumber(statistics.prizesDrawn)}
              </div>
              <div className="text-gray-400 mt-2">Prizes Drawn</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-24 relative" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {content.services_title.split(' ').map((word, i) =>
                  word.toLowerCase() === 'raffles' ? (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                    >
                      {' '}
                      {word}
                    </span>
                  ) : (
                    <span key={i}>
                      {i > 0 ? ' ' : ''}
                      {word}
                    </span>
                  )
                )}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">{content.services_subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => {
                const colorClasses = {
                  purple:
                    'from-purple-900/10 to-purple-900/5 border-purple-500/20 hover:border-purple-500/40',
                  blue: 'from-blue-900/10 to-blue-900/5 border-blue-500/20 hover:border-blue-500/40',
                  green:
                    'from-green-900/10 to-green-900/5 border-green-500/20 hover:border-green-500/40',
                };

                const iconColorClasses = {
                  purple: 'bg-purple-500/20 text-purple-400',
                  blue: 'bg-blue-500/20 text-blue-400',
                  green: 'bg-green-500/20 text-green-400',
                };

                const IconComponent = iconMap[service.icon] || Monitor;

                return (
                  <Link href={`/${service.slug}`} key={service.id} className="group">
                    <div
                      className={cn(
                        'relative bg-gradient-to-br rounded-2xl p-8 transition-all duration-300 h-full border',
                        colorClasses[service.color_scheme]
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                      <div className="relative z-10">
                        <div
                          className={cn(
                            'w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform',
                            iconColorClasses[service.color_scheme]
                          )}
                        >
                          <IconComponent className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                        <p className="text-gray-400 mb-6">{service.short_description}</p>

                        {(service.features || []).length > 0 && (
                          <ul className="space-y-2 mb-6">
                            {(service.features || []).slice(0, 3).map((feature, i) => (
                              <li key={i} className="flex items-center text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div
                          className={cn(
                            'flex items-center transition-colors',
                            service.color_scheme === 'purple'
                              ? 'text-purple-400 group-hover:text-purple-300'
                              : service.color_scheme === 'blue'
                                ? 'text-blue-400 group-hover:text-blue-300'
                                : 'text-green-400 group-hover:text-green-300'
                          )}
                        >
                          {service.status === 'coming_soon'
                            ? 'Coming Soon'
                            : service.status === 'beta'
                              ? 'Beta Available'
                              : 'Learn More'}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose DrawDay */}
      <section className="py-24 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.why_choose_title.split('DrawDay').map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i}>
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      DrawDay
                    </span>
                  </span>
                )
              )}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.why_choose_items.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Shield;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      {content.show_client_logos && clients.length > 0 && (
        <section className="py-16 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 mb-8">{content.clients_title}</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="text-xl font-bold text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {client.logo ? (
                    <img
                      src={getDirectusImageUrl(client.logo.id, { height: 60, quality: 80 })}
                      alt={client.name}
                      className="h-12 opacity-50 hover:opacity-70 transition-opacity"
                    />
                  ) : (
                    client.name
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {content.cta_title.split('Live Draws').map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Live Draws
                  </span>
                  {part}
                </span>
              )
            )}
          </h2>
          <p className="text-xl text-gray-300 mb-8">{content.cta_subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              {content.cta_button_primary_text}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
            >
              {content.cta_button_secondary_text}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
