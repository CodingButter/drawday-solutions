import Image from 'next/image';
import {
  Chrome,
  Trophy,
  Shield,
  Zap,
  Upload,
  BarChart3,
  Settings,
  Lock,
  Sparkles,
  ArrowRight,
  Play,
  FileSpreadsheet,
  MousePointerClick,
  PartyPopper,
  Menu,
  X,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/olijkjickkfgmmpckjddgndoembhehgi';
const YOUTUBE_URL = 'https://www.youtube.com/embed/Z91-bg1dbz0';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-drawday-navy/40 via-night to-night" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-drawday-gold/5 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-8">
                <Chrome className="w-4 h-4" />
                Free Chrome Extension
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Professional Live Draws,{' '}
                <span className="bg-gradient-to-r from-drawday-gold to-amber bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                The free Chrome extension that turns your competition draws into unforgettable
                experiences. No account needed. No setup fees. Just install and spin.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-drawday-gold text-rich-black font-semibold rounded-xl hover:bg-drawday-gold/90 transition-all hover:scale-105 shadow-lg shadow-drawday-gold/20"
                >
                  <Chrome className="w-5 h-5" />
                  Add to Chrome — It&apos;s Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-4 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  100% Private — Data stays on your device
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  No account required
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Free forever
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need for{' '}
                <span className="text-drawday-gold">professional draws</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Built specifically for UK raffle companies and competition operators who need
                reliable, fair, and visually stunning winner selection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Trophy className="w-6 h-6" />}
                title="Slot-Machine Animation"
                description="Dramatic, configurable winner reveal with smooth 60fps animation. Adjustable speed, duration, and deceleration curve."
                color="gold"
              />
              <FeatureCard
                icon={<Upload className="w-6 h-6" />}
                title="CSV Import"
                description="Drag-and-drop CSV upload with intelligent column auto-detection. Handles 100K+ entries without breaking a sweat."
                color="azure"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Stream-Safe Display"
                description="Winner cards show only name and ticket number. Contact details stay hidden from your audience."
                color="emerald"
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Full Audit Trail"
                description="Every draw is timestamped and recorded. Complete winner history with position tracking for compliance."
                color="amber"
              />
              <FeatureCard
                icon={<Settings className="w-6 h-6" />}
                title="Customisable Branding"
                description="Add your company name and logo. The spinner panel displays your brand front and centre during draws."
                color="vermilion"
              />
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="100% Private"
                description="All data stays in your browser's local storage. Zero network requests. Zero tracking. Zero data sharing."
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Up and running in <span className="text-drawday-gold">under a minute</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No sign-ups, no configuration wizards. Just three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number={1}
                icon={<FileSpreadsheet className="w-8 h-8" />}
                title="Upload your entries"
                description="Create a competition and import your CSV of participants. Columns are auto-mapped — ticket number, name, email, phone."
              />
              <StepCard
                number={2}
                icon={<MousePointerClick className="w-8 h-8" />}
                title="Enter the winning ticket"
                description="Open the side panel alongside your browser. Type in the drawn ticket number and hit enter."
              />
              <StepCard
                number={3}
                icon={<PartyPopper className="w-8 h-8" />}
                title="Watch the magic"
                description="The spinner plays a dramatic slot-machine animation, then reveals your winner with a celebration card. Stream-ready."
              />
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="demo" className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See it in action</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Watch a full walkthrough of DrawDay Spinner — from CSV import to winner reveal.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-drawday-gold/5 aspect-video">
                <iframe
                  src={YOUTUBE_URL}
                  title="DrawDay Spinner Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Side Panel Preview */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Lives in your <span className="text-drawday-gold">browser sidebar</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  DrawDay Spinner opens as a Chrome side panel — right alongside whatever tab
                  you&apos;re on. Perfect for live streams where you need the spinner visible while
                  sharing your screen.
                </p>
                <ul className="space-y-4">
                  <CheckItem text="Opens alongside any tab — no window switching" />
                  <CheckItem text="Manage competitions in a separate options page" />
                  <CheckItem text="Settings sync between panel and options" />
                  <CheckItem text="Lightweight popup launcher from the toolbar" />
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-gray-800 bg-raisin-black p-8">
                  <div className="space-y-4">
                    {/* Mock side panel UI */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-white">DrawDay Spinner</span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">Competition</div>
                      <div className="px-3 py-2 rounded-lg bg-rich-black border border-gray-700 text-sm text-white">
                        Summer Raffle 2025
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">Enter ticket number</div>
                      <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-rich-black border border-gray-700 text-sm text-drawday-gold font-mono">
                          #04521
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-drawday-gold text-rich-black text-sm font-semibold">
                          Draw
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-center">
                      <Trophy className="w-8 h-8 text-emerald mx-auto mb-2" />
                      <div className="text-emerald font-semibold text-lg">1st Prize Winner</div>
                      <div className="text-white font-bold text-xl mt-1">Sarah Johnson</div>
                      <div className="text-gray-400 text-sm mt-1">Ticket #04521</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <StatBox label="Entries" value="2,847" />
                      <StatBox label="Winners" value="1" />
                      <StatBox label="Status" value="Active" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-drawday-navy/30 via-night to-night" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-drawday-gold/5 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to level up your live draws?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              Install DrawDay Spinner from the Chrome Web Store. Free, private, and ready to go in
              seconds.
            </p>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-drawday-gold text-rich-black font-semibold rounded-xl hover:bg-drawday-gold/90 transition-all hover:scale-105 shadow-lg shadow-drawday-gold/20 text-lg"
            >
              <Chrome className="w-6 h-6" />
              Install Free from Chrome Web Store
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    gold: 'bg-drawday-gold/10 text-drawday-gold border-drawday-gold/20',
    azure: 'bg-azure/10 text-azure border-azure/20',
    emerald: 'bg-emerald/10 text-emerald border-emerald/20',
    amber: 'bg-amber/10 text-amber border-amber/20',
    vermilion: 'bg-vermilion/10 text-vermilion border-vermilion/20',
  };

  return (
    <div className="group p-6 rounded-2xl bg-raisin-black/50 border border-gray-800 hover:border-gray-700 transition-all">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color] || colorMap.gold}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold mb-6">
        {icon}
        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-drawday-gold text-rich-black text-sm font-bold flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-gray-300">
      <div className="w-5 h-5 rounded-full bg-emerald/20 text-emerald flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      {text}
    </li>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-rich-black/50 border border-gray-800">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
