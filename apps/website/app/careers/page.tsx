/**
 * Careers Page
 *
 * Simple careers page without false job listings
 */

import { ArrowRight } from 'lucide-react';
import { Button } from '@raffle-spinner/ui';
import Link from 'next/link';

export const metadata = {
  title: 'Careers - DrawDay Solutions',
  description: 'Career opportunities at DrawDay Solutions.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Careers at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
                DrawDay Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Join our team</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">No Open Positions</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We don't currently have any open positions, but we're always interested in hearing from
            talented individuals.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            If you're interested in working with us, please send your CV and a cover letter to our
            team.
          </p>
          <Button size="lg" variant="default" className="gap-2" asChild>
            <Link href="/contact">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
