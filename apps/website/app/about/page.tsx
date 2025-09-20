/**
 * About Page - Company information
 *
 * About page with engaging content while remaining truthful
 */

import {
  ArrowRight,
  Sparkles,
  Code,
  Palette,
  Zap,
  Users,
  Target,
  Lightbulb,
  Rocket,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@raffle-spinner/ui';
import Link from 'next/link';

export const metadata = {
  title: 'About - DrawDay Solutions',
  description: 'About DrawDay Solutions - Technology solutions for UK raffle companies.',
};

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10 px-4 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                About Our Company
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                We Build{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Technology
                </span>
                <br />
                for UK Raffles
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                DrawDay Solutions creates professional software that helps competition companies run
                transparent, exciting live draws that build trust with their audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What We{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Do
              </span>
            </h2>
            <p className="text-xl text-gray-400">Focused solutions for the competition industry</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white">Live Draw Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our DrawDay Spinner Chrome extension enables professional, transparent live draws
                  with smooth animations and fair winner selection.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Palette className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white">Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Custom websites and platforms built specifically for competition companies, with
                  integrated draw systems and participant management.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white">Technical Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Expert guidance on compliance, best practices, and technology implementation for
                  UK competition businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why DrawDay Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                DrawDay
              </span>
            </h2>
            <p className="text-xl text-gray-400">Built specifically for UK competition companies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Purpose-Built</h3>
              <p className="text-gray-400">
                Designed specifically for UK raffle and competition companies' unique needs
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">User-Focused</h3>
              <p className="text-gray-400">
                Intuitive interfaces that work for both operators and viewers
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Innovation</h3>
              <p className="text-gray-400">
                Modern technology solutions that keep you ahead of the competition
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Performance</h3>
              <p className="text-gray-400">
                Fast, reliable software that handles thousands of entries smoothly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlight */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            Featured Product
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            DrawDay Spinner{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chrome Extension
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional live draw software that integrates seamlessly with your existing workflow.
            Import participants, customize appearance, and conduct exciting live draws with
            confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-2xl shadow-purple-500/25 px-8 py-6"
              asChild
            >
              <Link href="/demo" className="inline-flex items-center">
                Try Demo
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-white hover:bg-white/10 hover:border-gray-600 px-8 py-6"
              asChild
            >
              <Link href="/features" className="inline-flex items-center">
                View Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Started?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how DrawDay Solutions can help transform your live draws
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-2xl shadow-purple-500/25 px-8 py-6"
              asChild
            >
              <Link href="/contact" className="inline-flex items-center">
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-white hover:bg-white/10 hover:border-gray-600 px-8 py-6"
              asChild
            >
              <Link href="/portfolio" className="inline-flex items-center">
                View Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
