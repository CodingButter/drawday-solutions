/**
 * Streaming Services Page - Live streaming production services
 *
 * Showcases live streaming capabilities, packages, and success stories
 */

import {
  Video,
  Users,
  Monitor,
  Mic,
  Camera,
  Settings,
  Play,
  ArrowRight,
  CheckCircle,
  Trophy,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Clock,
  Globe,
  Heart,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@raffle-spinner/ui';
import Link from 'next/link';

export const metadata = {
  title: 'Live Streaming Production - DrawDay Solutions',
  description:
    'Professional live streaming production services for UK competition companies. Multi-camera setups, real-time engagement, and 4K streaming for unforgettable live draws.',
  keywords:
    'live streaming, production services, raffle streaming, competition broadcasting, UK streaming company',
};

const streamingFeatures = [
  {
    icon: Camera,
    title: 'Multi-Camera Production',
    description: 'Professional camera setups with multiple angles and smooth transitions',
    highlights: [
      'Up to 6 camera angles',
      'Professional lighting',
      'Smooth switching',
      'Close-up detail shots',
    ],
  },
  {
    icon: Monitor,
    title: '4K Ultra HD Streaming',
    description: 'Crystal clear video quality that showcases every detail of your draws',
    highlights: [
      '4K resolution capability',
      '60fps smooth motion',
      'HDR color accuracy',
      'Adaptive bitrate',
    ],
  },
  {
    icon: Users,
    title: 'Real-Time Engagement',
    description: 'Interactive features that keep viewers engaged throughout your stream',
    highlights: [
      'Live chat moderation',
      'Viewer polls',
      'Real-time reactions',
      'Social media integration',
    ],
  },
  {
    icon: Mic,
    title: 'Professional Audio',
    description: 'Studio-quality sound that ensures every word is heard clearly',
    highlights: [
      'Multi-microphone setup',
      'Noise cancellation',
      'Audio mixing',
      'Background music',
    ],
  },
  {
    icon: Settings,
    title: 'Custom Graphics',
    description: 'Branded overlays and graphics that match your company identity',
    highlights: ['Custom overlays', 'Lower thirds', 'Branded backgrounds', 'Winner announcements'],
  },
  {
    icon: Globe,
    title: 'Multi-Platform Streaming',
    description: 'Simultaneously stream to multiple platforms for maximum reach',
    highlights: ['YouTube Live', 'Facebook Live', 'TikTok Live', 'Custom platforms'],
  },
];

const packages = [
  {
    name: 'Essential',
    price: '£999',
    period: 'per event',
    description: 'Perfect for smaller competitions getting started with professional streaming',
    features: [
      '2-camera setup',
      '1080p HD streaming',
      'Basic audio package',
      'Simple graphics package',
      'Single platform streaming',
      '2 hours of coverage',
      'Basic chat moderation',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '£1,999',
    period: 'per event',
    description: 'Our most popular package for established competition companies',
    features: [
      '4-camera setup',
      '4K Ultra HD streaming',
      'Professional audio suite',
      'Custom graphics package',
      'Multi-platform streaming',
      '4 hours of coverage',
      'Advanced engagement features',
      'Live chat moderation',
      'Replay generation',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Fully customized solutions for large-scale events and ongoing partnerships',
    features: [
      '6+ camera setup',
      '4K+ streaming capability',
      'Full production crew',
      'Complete branding suite',
      'Global distribution',
      'Unlimited coverage time',
      'Advanced analytics',
      'Dedicated support team',
      'Post-production services',
    ],
    popular: false,
  },
];

const successStories = [
  {
    company: 'Competition Central',
    event: 'Weekly Prize Draw',
    viewers: '50,000+',
    engagement: '+340%',
    testimonial: 'The professional streaming setup transformed our audience engagement completely.',
    author: 'Sarah Johnson',
    role: 'Marketing Director',
  },
  {
    company: 'Raffle Masters',
    event: 'Monthly Mega Draw',
    viewers: '25,000+',
    engagement: '+280%',
    testimonial: 'Viewers now look forward to our streams as entertainment events.',
    author: 'Mike Thompson',
    role: 'CEO',
  },
];

export default function StreamingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
              Live Streaming
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your live draws into captivating entertainment experiences with professional
            production quality that keeps viewers engaged and builds trust in your brand.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Get Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/portfolio">
                <Play className="w-5 h-5" />
                View Examples
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Production Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for professional live streaming
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {streamingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-drawday-gold" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald mt-0.5" />
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Package Pricing */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Streaming Packages</h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect package for your event size and requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative ${pkg.popular ? 'ring-2 ring-drawday-gold' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-drawday-gold text-drawday-navy px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-drawday-gold">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2">{pkg.period}</span>
                  </div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.popular ? '' : 'variant-outline'}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/contact">
                      {pkg.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See how our streaming services have transformed client events
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-lg text-drawday-gold">{story.company}</CardTitle>
                      <p className="text-muted-foreground">{story.event}</p>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-drawday-gold text-drawday-gold" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-drawday-gold">{story.viewers}</div>
                      <div className="text-sm text-muted-foreground">Live Viewers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-drawday-gold">{story.engagement}</div>
                      <div className="text-sm text-muted-foreground">Engagement Increase</div>
                    </div>
                  </div>

                  <blockquote className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm italic mb-3">"{story.testimonial}"</p>
                    <footer className="text-sm">
                      <span className="font-semibold">{story.author}</span>
                      <span className="text-muted-foreground">, {story.role}</span>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Professional Streaming?
            </h2>
            <p className="text-xl text-muted-foreground">
              The advantages of professional live streaming for your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-drawday-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Increased Engagement</h3>
              <p className="text-muted-foreground text-sm">
                Professional streams keep viewers watching longer and coming back for more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-drawday-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enhanced Trust</h3>
              <p className="text-muted-foreground text-sm">
                Professional presentation builds confidence in your draw process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-drawday-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Brand Elevation</h3>
              <p className="text-muted-foreground text-sm">
                Stand out from competitors with premium production quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-drawday-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Audience Growth</h3>
              <p className="text-muted-foreground text-sm">
                Quality streams attract larger audiences and improve retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-xl text-muted-foreground">
              How we deliver professional streaming from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Consultation</h3>
              <p className="text-muted-foreground text-sm">
                We discuss your requirements, audience, and goals to design the perfect streaming
                solution.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Setup</h3>
              <p className="text-muted-foreground text-sm">
                Our team arrives early to set up all equipment, test connections, and prepare
                graphics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Production</h3>
              <p className="text-muted-foreground text-sm">
                Professional crew manages all technical aspects while you focus on your draw.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Delivery</h3>
              <p className="text-muted-foreground text-sm">
                Receive edited highlights, analytics report, and full recording for future use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-drawday-navy to-rich-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Elevate Your Live Draws?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Transform your events into professional entertainment experiences that audiences love to
            watch.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href="/contact">
                Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <Link href="/portfolio">
                <Play className="w-5 h-5" />
                View Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
