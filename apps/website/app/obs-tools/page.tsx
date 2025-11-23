/**
 * OBS Tools & Templates Page - Streaming production resources
 *
 * Showcases OBS templates, stinger transitions, overlays, and display tools
 */

import {
  Monitor,
  Layers,
  Video,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle,
  Palette,
  Zap,
  Trophy,
  Eye,
  Settings,
  TrendingUp,
  Users,
  Shield,
  Award,
  Star,
  Film,
  Image as ImageIcon,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@raffle-spinner/ui';
import Link from 'next/link';

export const metadata = {
  title: 'OBS Tools & Templates - DrawDay Solutions',
  description:
    'Professional OBS templates, stinger transitions, overlays, and display tools for UK raffle companies. Everything you need for stunning live streams.',
  keywords:
    'OBS templates, stinger transitions, stream overlays, broadcasting tools, raffle streaming, OBS scenes',
};

const obsTools = [
  {
    icon: Layers,
    title: 'Complete Scene Collections',
    description: 'Pre-built OBS scene collections ready to import and customize',
    highlights: [
      'Starting Soon scenes',
      'Live draw scenes',
      'Winner announcement layouts',
      'Intermission screens',
      'End screens with CTAs',
    ],
  },
  {
    icon: Sparkles,
    title: 'Stinger Transitions',
    description: 'Professional animated transitions between scenes',
    highlights: [
      'Smooth fade transitions',
      'Dynamic swipe effects',
      'Branded logo reveals',
      'Custom animation timing',
      '4K resolution support',
    ],
  },
  {
    icon: Video,
    title: 'Animated Overlays',
    description: 'Eye-catching graphics that enhance your stream production value',
    highlights: [
      'Lower third name plates',
      'Ticker tape displays',
      'Winner announcement overlays',
      'Countdown timers',
      'Sponsor banners',
    ],
  },
  {
    icon: Trophy,
    title: 'Winner Display Tools',
    description: 'Dramatic winner reveal graphics with celebration effects',
    highlights: [
      'Animated winner cards',
      'Confetti & particle effects',
      'Prize showcase displays',
      'Social media handles',
      'Photo integration',
    ],
  },
  {
    icon: Monitor,
    title: 'Browser Source Widgets',
    description: 'Interactive browser-based overlays and displays',
    highlights: [
      'Live viewer count',
      'Entry progress bars',
      'Social media feeds',
      'Chat integration',
      'Real-time statistics',
    ],
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Fully customizable templates that match your brand identity',
    highlights: [
      'Color scheme adaptation',
      'Logo integration',
      'Font customization',
      'Layout modifications',
      'Brand guideline adherence',
    ],
  },
];

const templatePackages = [
  {
    name: 'Starter Kit',
    price: '£299',
    description: 'Essential templates to get your streams looking professional quickly',
    includes: [
      '5 basic scene templates',
      '3 stinger transitions',
      '5 static overlays',
      'Lower third templates',
      'Basic winner display',
      'Installation guide',
      '30 days email support',
    ],
    popular: false,
  },
  {
    name: 'Professional Package',
    price: '£699',
    description: 'Complete streaming production toolkit with advanced features',
    includes: [
      '15+ scene templates',
      '10 stinger transitions',
      '20+ animated overlays',
      'Advanced winner displays',
      'Browser source widgets',
      'Countdown timers',
      'Custom branding service',
      'Video tutorials',
      '90 days priority support',
      'Free updates for 1 year',
    ],
    popular: true,
  },
  {
    name: 'Custom Production',
    price: 'Custom',
    description: 'Fully bespoke streaming package designed for your brand',
    includes: [
      'Unlimited custom scenes',
      'Bespoke stinger transitions',
      'Custom animated graphics',
      'Interactive widgets',
      'Full brand integration',
      'Advanced effects & animations',
      'Dedicated designer',
      'Installation & training',
      '12 months premium support',
      'Unlimited revisions',
    ],
    popular: false,
  },
];

const streamingFeatures = [
  {
    icon: Eye,
    title: 'Professional Appearance',
    description: 'Polished graphics that make your streams stand out from competitors',
    stat: '10x more professional',
  },
  {
    icon: TrendingUp,
    title: 'Increased Engagement',
    description: 'Dynamic visuals keep viewers watching longer',
    stat: '+67% watch time',
  },
  {
    icon: Users,
    title: 'Audience Growth',
    description: 'Professional production attracts and retains more viewers',
    stat: '+45% viewer retention',
  },
  {
    icon: Shield,
    title: 'Brand Consistency',
    description: 'Cohesive branding across all streaming elements',
    stat: '100% brand aligned',
  },
];

const templateCategories = [
  {
    name: 'Scene Templates',
    icon: Monitor,
    count: '15+',
    examples: ['Starting Soon', 'Live Draw', 'Winner Reveal', 'BRB Screen', 'End Screen'],
  },
  {
    name: 'Transitions',
    icon: Film,
    count: '10+',
    examples: ['Fade Stingers', 'Swipe Effects', 'Logo Reveals', 'Slide Transitions'],
  },
  {
    name: 'Overlays',
    icon: Layers,
    count: '20+',
    examples: ['Lower Thirds', 'Alert Boxes', 'Ticker Tapes', 'Countdown Timers'],
  },
  {
    name: 'Graphics',
    icon: ImageIcon,
    count: '30+',
    examples: ['Backgrounds', 'Borders', 'Badges', 'Icons', 'Banners'],
  },
];

export default function OBSToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
            <Sparkles className="w-4 h-4" />
            Complete OBS Production Toolkit
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
              OBS Tools & Templates
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your live streams with professional OBS templates, stunning stinger
            transitions, and dynamic overlays. Everything you need for broadcast-quality raffle
            streams.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Get Templates
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/portfolio">
                <Eye className="w-5 h-5" />
                View Examples
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for professional live stream production
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templateCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-drawday-gold" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant="secondary">{category.count}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{example}</span>
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

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Production Tools</h2>
            <p className="text-xl text-muted-foreground">
              Professional tools designed specifically for raffle companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {obsTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-drawday-gold" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <ul className="space-y-2">
                      {tool.highlights.map((highlight) => (
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

      {/* Template Packages */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Template Packages</h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect package for your streaming needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {templatePackages.map((pkg) => (
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
                  </div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.popular ? '' : 'variant-outline'}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/contact">
                      {pkg.name === 'Custom Production' ? 'Contact Sales' : 'Get Started'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Professional OBS Templates?</h2>
            <p className="text-xl text-muted-foreground">
              The impact of professional streaming production
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {streamingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-drawday-gold" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <div className="text-2xl font-bold text-drawday-gold">{feature.stat}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get professional streaming setup in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Package</h3>
              <p className="text-muted-foreground text-sm">
                Select the template package that fits your streaming needs and budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Customize Branding</h3>
              <p className="text-muted-foreground text-sm">
                We'll customize colors, logos, and fonts to match your brand identity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Import to OBS</h3>
              <p className="text-muted-foreground text-sm">
                Simple one-click import of all scenes, transitions, and overlays into OBS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Go Live</h3>
              <p className="text-muted-foreground text-sm">
                Start streaming with professional graphics immediately - no learning curve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-xl text-muted-foreground">Optimized for performance and quality</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Resolution', value: 'Up to 4K (3840×2160)', icon: Monitor },
              { label: 'Format', value: 'OBS Scene Collection', icon: Settings },
              { label: 'Compatibility', value: 'OBS Studio 28+', icon: Shield },
              { label: 'File Types', value: 'PNG, MP4, WebM, HTML', icon: Film },
              { label: 'Performance', value: 'Optimized for 60fps', icon: Zap },
              { label: 'Support', value: 'Windows & macOS', icon: Monitor },
            ].map((spec) => {
              const Icon = spec.icon;
              return (
                <Card key={spec.label}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-drawday-gold/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-drawday-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{spec.label}</h3>
                        <p className="text-sm text-muted-foreground">{spec.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-drawday-navy to-rich-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Upgrade Your Streams?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Get professional OBS templates and start streaming like the pros today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href="/contact">
                Get Template Package
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
                <Eye className="w-5 h-5" />
                View Examples
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
