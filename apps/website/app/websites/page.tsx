/**
 * Website Development Page - Web development services
 *
 * Showcases website development capabilities, packages, and examples
 */

import {
  Globe,
  Smartphone,
  Zap,
  Shield,
  Search,
  CreditCard,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Code,
  Palette,
  Settings,
  Monitor,
  Database,
  Lock,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@raffle-spinner/ui';
import Link from 'next/link';

export const metadata = {
  title: 'Website Development - DrawDay Solutions',
  description:
    'Professional website development for UK competition companies. Modern, fast, and fully integrated with your competition management systems.',
  keywords:
    'website development, competition websites, UK web development, raffle website design, custom web solutions',
};

const webFeatures = [
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Websites that work perfectly on all devices with responsive design',
    highlights: [
      'Mobile-optimized layouts',
      'Touch-friendly interfaces',
      'Fast mobile loading',
      'Progressive web app features',
    ],
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Optimized for speed with modern web technologies and best practices',
    highlights: [
      'Sub-2 second load times',
      'Optimized images',
      'Efficient caching',
      '95+ PageSpeed scores',
    ],
  },
  {
    icon: Search,
    title: 'SEO Optimized',
    description: 'Built for search engines to help your audience find you easily',
    highlights: [
      'Technical SEO optimization',
      'Meta tag management',
      'Schema markup',
      'Search console integration',
    ],
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security to protect your business and customers',
    highlights: [
      'SSL certificates',
      'Regular security updates',
      'Data encryption',
      'GDPR compliance',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment Integration',
    description: 'Secure payment processing for ticket sales and entries',
    highlights: [
      'Stripe integration',
      'Multiple payment methods',
      'Subscription handling',
      'Secure checkout',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Comprehensive tracking to understand your audience and performance',
    highlights: [
      'Google Analytics 4',
      'Conversion tracking',
      'User behavior analysis',
      'Custom reporting',
    ],
  },
];

const websitePackages = [
  {
    name: 'Starter',
    price: '£2,999',
    description: 'Perfect for new competition companies getting started online',
    timeline: '2-3 weeks',
    features: [
      '5-page website',
      'Mobile responsive design',
      'Basic SEO optimization',
      'Contact form integration',
      'Social media links',
      'Google Analytics setup',
      '3 months support',
      'Basic training included',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '£5,999',
    description: 'Complete solution for established competition businesses',
    timeline: '4-6 weeks',
    features: [
      '10-page website',
      'Custom design & branding',
      'Advanced SEO optimization',
      'Competition entry forms',
      'Payment processing setup',
      'User account system',
      'Email marketing integration',
      'Advanced analytics',
      '6 months support',
      'Staff training included',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Fully customized solutions with advanced features and integrations',
    timeline: '8-12 weeks',
    features: [
      'Unlimited pages',
      'Custom functionality',
      'Full system integration',
      'Advanced user management',
      'Multi-payment gateways',
      'API development',
      'Custom admin panel',
      'Priority support',
      '12 months support',
      'Dedicated project manager',
    ],
    popular: false,
  },
];

const technologies = [
  { name: 'Next.js', icon: Code, description: 'Modern React framework for optimal performance' },
  { name: 'TypeScript', icon: Shield, description: 'Type-safe development for reliability' },
  { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first CSS for rapid styling' },
  { name: 'Stripe', icon: CreditCard, description: 'Secure payment processing' },
  { name: 'Directus', icon: Database, description: 'Headless CMS for content management' },
  { name: 'Vercel', icon: Zap, description: 'Fast deployment and hosting' },
];

const industryBenefits = [
  {
    icon: TrendingUp,
    title: 'Increased Conversions',
    description: 'Optimized user experience leads to more ticket sales and entries',
    stat: '45% average increase',
  },
  {
    icon: Users,
    title: 'Better User Experience',
    description: 'Intuitive design keeps visitors engaged and encourages return visits',
    stat: '67% less bounce rate',
  },
  {
    icon: Award,
    title: 'Professional Credibility',
    description: 'Modern website design builds trust and establishes authority',
    stat: '89% trust increase',
  },
  {
    icon: Clock,
    title: 'Time Savings',
    description: 'Automated processes reduce manual work and administrative overhead',
    stat: '75% time saved',
  },
];

export default function WebsitesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
              Website Development
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Modern, fast, and fully integrated websites designed specifically for UK competition
            companies. Convert more visitors into participants with professional web experiences.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/portfolio">
                <Globe className="w-5 h-5" />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Website Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything your competition business needs to succeed online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webFeatures.map((feature) => {
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Website Packages</h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect package for your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {websitePackages.map((pkg) => (
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
                    <div className="text-sm text-muted-foreground mt-1">
                      Timeline: {pkg.timeline}
                    </div>
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

      {/* Technologies */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern Technologies</h2>
            <p className="text-xl text-muted-foreground">
              We use cutting-edge technologies to build fast, secure, and scalable websites
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-drawday-gold/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-drawday-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Benefits */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Impact</h2>
            <p className="text-xl text-muted-foreground">
              How professional websites transform competition businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industryBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-drawday-gold" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{benefit.description}</p>
                    <div className="text-2xl font-bold text-drawday-gold">{benefit.stat}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Process</h2>
            <p className="text-xl text-muted-foreground">
              Our proven approach to delivering exceptional websites
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Discovery</h3>
              <p className="text-muted-foreground text-sm">
                We understand your business, audience, and goals to create the perfect strategy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Design</h3>
              <p className="text-muted-foreground text-sm">
                Custom designs that reflect your brand and optimize user experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Development</h3>
              <p className="text-muted-foreground text-sm">
                Modern, fast, and secure development using industry best practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-drawday-gold text-drawday-navy flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Launch</h3>
              <p className="text-muted-foreground text-sm">
                Careful testing, training, and launch with ongoing support and optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Integration</h2>
            <p className="text-xl text-muted-foreground">
              Your website seamlessly connects with all DrawDay Solutions services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-6 h-6 text-drawday-gold" />
                </div>
                <CardTitle>DrawDay Spinner Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Direct integration with our Chrome extension for seamless competition management
                  and data flow.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-drawday-gold" />
                </div>
                <CardTitle>Live Streaming Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Embed live streams directly into your website for a complete viewer experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-drawday-gold" />
                </div>
                <CardTitle>CMS Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easy-to-use content management system for updating competitions, winners, and
                  content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-drawday-navy to-rich-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Build Your Professional Website?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Let's create a website that converts visitors into participants and grows your
            competition business.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href="/contact">
                Start Your Project
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
                <Globe className="w-5 h-5" />
                View Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
