/**
 * Portfolio Page - Showcase of completed projects
 *
 * Displays client work across live streaming, raffle software, and web development
 */

import {
  ExternalLink,
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  Globe,
  Video,
  Zap,
  Shield,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@raffle-spinner/ui';
import Link from 'next/link';
import { getPortfolioItems } from '@/lib/directus-content';

export const metadata = {
  title: 'Portfolio - DrawDay Solutions',
  description:
    'Discover how DrawDay Solutions has transformed live draws and digital experiences for leading UK competition companies. View our portfolio of successful projects.',
  keywords:
    'portfolio, case studies, raffle software projects, live streaming, web development, UK competitions',
};

export const revalidate = 300; // 5 minutes

// Fallback portfolio data if Directus isn't configured
const fallbackProjects = [
  {
    id: '1',
    company_name: 'PrizeDraw UK',
    project_title: 'Complete Digital Transformation',
    description:
      'End-to-end solution including live streaming setup, custom website, and DrawDay Spinner integration for seamless prize draws.',
    services_provided: [
      { name: 'Live Streaming', color_scheme: 'purple' },
      { name: 'Website Development', color_scheme: 'blue' },
      { name: 'Raffle Software', color_scheme: 'green' },
    ],
    results_metrics: [
      { label: 'Viewer Engagement', value: '+340%' },
      { label: 'Draw Efficiency', value: '+85%' },
      { label: 'Customer Satisfaction', value: '98%' },
    ],
    testimonial_text:
      'DrawDay Solutions transformed our entire operation. The professional setup and seamless technology has elevated our brand tremendously.',
    testimonial_author: 'Sarah Johnson',
    testimonial_role: 'Operations Director',
    project_date: '2024',
    is_featured: true,
  },
  {
    id: '2',
    company_name: 'Competition Central',
    project_title: 'Live Streaming Production',
    description:
      'Professional live streaming setup with multi-camera production and real-time engagement features for weekly prize draws.',
    services_provided: [
      { name: 'Live Streaming', color_scheme: 'purple' },
      { name: 'Production Support', color_scheme: 'blue' },
    ],
    results_metrics: [
      { label: 'Live Viewers', value: '50K+' },
      { label: 'Stream Quality', value: '4K HD' },
      { label: 'Uptime', value: '99.9%' },
    ],
    project_date: '2024',
    is_featured: true,
  },
  {
    id: '3',
    company_name: 'Raffle Masters',
    project_title: 'Custom Website & Integration',
    description:
      'Modern, responsive website with integrated competition management and seamless DrawDay Spinner connectivity.',
    services_provided: [
      { name: 'Website Development', color_scheme: 'blue' },
      { name: 'System Integration', color_scheme: 'green' },
    ],
    results_metrics: [
      { label: 'Page Speed', value: '95/100' },
      { label: 'Mobile Users', value: '+67%' },
      { label: 'Conversion Rate', value: '+45%' },
    ],
    project_date: '2023',
    is_featured: false,
  },
];

const serviceColors = {
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default async function PortfolioPage() {
  // Fetch portfolio items from Directus
  const portfolioItems = await getPortfolioItems();

  // Use fallback data if no items are available
  const projects = portfolioItems && portfolioItems.length > 0 ? portfolioItems : fallbackProjects;
  const featuredProjects = projects.filter((project) => project.is_featured);
  const otherProjects = projects.filter((project) => !project.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how we've transformed live draws and digital experiences for leading UK
            competition companies. Every project tells a story of innovation and success.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/demo">
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Templates CTA Banner */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Browse Our Website Templates</h3>
                  <p className="text-muted-foreground mb-4">
                    Preview professional raffle website templates ready to customize for your brand.
                    See them in action with our interactive preview feature.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/templates">
                      <Globe className="w-5 h-5" />
                      View Templates
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-xl text-muted-foreground">
                Our most impactful client transformations
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{project.project_title}</CardTitle>
                        <p className="text-drawday-gold font-semibold">{project.company_name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {project.project_date}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.services_provided || []).map((service, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={
                            serviceColors[service.color_scheme as keyof typeof serviceColors] ||
                            serviceColors.blue
                          }
                        >
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{project.description}</p>

                    {/* Results Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {(project.results_metrics || []).map((metric, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-drawday-gold mb-1">
                            {metric.value}
                          </div>
                          <div className="text-sm text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    {project.testimonial_text && (
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <p className="text-sm italic mb-3">"{project.testimonial_text}"</p>
                        <div className="text-sm">
                          <span className="font-semibold">{project.testimonial_author}</span>
                          {project.testimonial_role && (
                            <span className="text-muted-foreground">
                              , {project.testimonial_role}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" className="gap-2 w-full">
                      View Case Study
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Projects</h2>
            <p className="text-xl text-muted-foreground">
              A comprehensive look at our client success stories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{project.project_title}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {project.project_date}
                    </div>
                  </div>
                  <p className="text-drawday-gold font-semibold text-sm mb-3">
                    {project.company_name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(project.services_provided || []).map((service, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${serviceColors[service.color_scheme as keyof typeof serviceColors] || serviceColors.blue}`}
                      >
                        {service.name}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(project.results_metrics || []).slice(0, 2).map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold text-drawday-gold">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio Impact</h2>
            <p className="text-xl text-muted-foreground">The numbers speak for themselves</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-drawday-gold" />
              </div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-drawday-gold" />
              </div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-drawday-gold" />
              </div>
              <div className="text-3xl font-bold mb-2">300%</div>
              <div className="text-muted-foreground">Avg. ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-drawday-gold/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-drawday-gold" />
              </div>
              <div className="text-3xl font-bold mb-2">48hrs</div>
              <div className="text-muted-foreground">Avg. Delivery Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-drawday-navy to-rich-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Let's discuss how we can transform your competition business with professional
            technology solutions.
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
              <Link href="/about">
                Learn About Us
                <Users className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
