import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Contact - DrawDay Spinner',
  description: 'Get in touch with the DrawDay team for questions, support, or feedback.',
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Have a question about DrawDay Spinner, need help getting set up, or want to share
            feedback? We&apos;d love to hear from you.
          </p>

          <a
            href="mailto:admin@drawday.app"
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-raisin-black border border-gray-800 hover:border-drawday-gold/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500">Email us at</div>
              <div className="text-lg font-semibold text-white group-hover:text-drawday-gold transition-colors">
                admin@drawday.app
              </div>
            </div>
          </a>

          <p className="text-gray-600 text-sm mt-12">We typically respond within 24 hours.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
