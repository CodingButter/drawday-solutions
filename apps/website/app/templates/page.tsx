/**
 * Templates Showcase Page
 * Displays various raffle website templates available for preview
 */

import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  Sparkles,
  Trophy,
  Palette,
  Zap,
  Crown,
  Gem,
  Star,
  Laptop,
  CheckCircle,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@raffle-spinner/ui';

export const metadata = {
  title: 'Raffle Website Templates - DrawDay Solutions',
  description:
    'Professional raffle website templates ready to customize. Modern, responsive designs built specifically for UK competition companies.',
  keywords:
    'raffle website templates, competition website designs, raffle site themes, UK raffle templates',
};

const templates = [
  {
    id: 'uk-complete',
    name: 'UK Professional',
    tagline: 'Complete multi-page UK raffle website',
    description:
      'The most comprehensive template with full multi-page navigation, advanced competition cards, and everything needed for a professional UK raffle company.',
    features: [
      'Full multi-page navigation system',
      'Advanced competition cards with timers',
      'Winner galleries & testimonials',
      'Account dashboard & tracking',
      'How it works & FAQ pages',
      'Gambling Commission compliance ready',
    ],
    color: 'from-blue-600 to-indigo-600',
    icon: Trophy,
    theme: 'light',
    popular: true,
    bestFor: 'Professional UK competition sites',
  },
  {
    id: 'modern-luxury',
    name: 'Modern Luxury',
    tagline: 'Premium elegance meets modern design',
    description:
      'A sophisticated template featuring gradient overlays, smooth animations, and a premium feel perfect for high-value prize draws.',
    features: [
      'Animated gradient backgrounds',
      'Prize showcase carousels',
      'Live countdown timers',
      'Winner gallery',
      'Integrated payment processing',
      'Mobile-first responsive design',
    ],
    color: 'from-purple-600 to-pink-600',
    icon: Crown,
    theme: 'dark',
    popular: false,
    bestFor: 'Luxury car raffles, high-value prizes',
  },
  {
    id: 'classic-draw',
    name: 'Classic Draw',
    tagline: 'Timeless design, proven results',
    description:
      'A clean, professional template focusing on trust and transparency. Perfect for traditional raffle companies.',
    features: [
      'Clean, professional layout',
      'Trust badges and certifications',
      'Transparent draw process display',
      'Past winner testimonials',
      'FAQ section',
      'Contact forms',
    ],
    color: 'from-blue-600 to-cyan-600',
    icon: Trophy,
    theme: 'light',
    popular: false,
    bestFor: 'Traditional raffles, charity draws',
  },
  {
    id: 'vibrant-energy',
    name: 'Vibrant Energy',
    tagline: 'Bold colors, exciting experience',
    description:
      'An energetic template with bold colors and dynamic animations to create excitement and urgency.',
    features: [
      'Bold color schemes',
      'Dynamic entry counters',
      'Animated prize reveals',
      'Social proof displays',
      'Urgency timers',
      'Interactive elements',
    ],
    color: 'from-orange-600 to-red-600',
    icon: Zap,
    theme: 'dark',
    popular: true,
    bestFor: 'High-energy competitions, limited-time draws',
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    tagline: 'Less is more, elegance is everything',
    description:
      'A minimalist approach with focus on content and user experience. Clean lines and subtle animations.',
    features: [
      'Minimalist design',
      'Focus on content',
      'Subtle micro-interactions',
      'Fast loading times',
      'Accessibility focused',
      'SEO optimized',
    ],
    color: 'from-slate-600 to-zinc-600',
    icon: Gem,
    theme: 'light',
    popular: false,
    bestFor: 'Premium brands, sophisticated audiences',
  },
  {
    id: 'sports-fanatic',
    name: 'Sports Fanatic',
    tagline: 'For the ultimate sports fan',
    description:
      'A template designed specifically for sports-related raffles with team colors and energetic design.',
    features: [
      'Team color customization',
      'Sports-themed graphics',
      'Match day countdowns',
      'Player/team showcases',
      'Ticket tiers',
      'Fan engagement features',
    ],
    color: 'from-green-600 to-emerald-600',
    icon: Star,
    theme: 'dark',
    popular: false,
    bestFor: 'Sports memorabilia, match experiences',
  },
  {
    id: 'tech-forward',
    name: 'Tech Forward',
    tagline: 'Cutting-edge design for tech prizes',
    description:
      'A futuristic template perfect for tech-related prizes with modern UI patterns and animations.',
    features: [
      'Glassmorphism effects',
      'Smooth page transitions',
      'Product 3D previews',
      'Spec comparison tables',
      'Tech-focused aesthetics',
      'Dark mode optimized',
    ],
    color: 'from-indigo-600 to-purple-600',
    icon: Laptop,
    theme: 'dark',
    popular: true,
    bestFor: 'Tech gadgets, gaming setups, electronics',
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
            <Sparkles className="w-4 h-4" />
            Professional Website Templates
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
              Raffle Template
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Pre-built, professionally designed raffle website templates ready to customize for your
            brand. Click any template to preview it in action.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`group hover:shadow-2xl transition-all duration-300 ${
                    template.popular ? 'ring-2 ring-drawday-gold' : ''
                  }`}
                >
                  {template.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-drawday-gold text-drawday-navy px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    {/* Preview Banner */}
                    <div
                      className={`relative -mx-6 -mt-6 mb-4 h-40 bg-gradient-to-r ${template.color} rounded-t-xl flex items-center justify-center overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <Icon className="w-20 h-20 text-white/90 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-2xl mb-1">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground italic">{template.tagline}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {template.theme}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4">{template.description}</p>

                    <div className="mb-4">
                      <div className="text-sm font-semibold mb-2 text-drawday-gold">
                        Best for: {template.bestFor}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {template.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                        {template.features.length > 4 && (
                          <li className="text-sm text-muted-foreground ml-6">
                            +{template.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/preview/${template.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/contact">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Template?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            All templates are fully customizable. We can adapt any design to match your brand or
            create a completely bespoke template just for you.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/websites">
                View Pricing
                <Palette className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
