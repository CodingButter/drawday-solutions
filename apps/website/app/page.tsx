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
  ExternalLink,
  Users,
  Monitor,
  Clock,
  Heart,
  Star,
  CheckCircle2,
  XCircle,
  Tv,
  FolderOpen,
  Eye,
  Palette,
  HelpCircle,
  ChevronDown,
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
                Free Chrome Extension — No Account Required
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Stop Scrolling Spreadsheets.{' '}
                <span className="bg-gradient-to-r from-drawday-gold to-amber bg-clip-text text-transparent">
                  Start Spinning Winners.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                DrawDay Spinner is the Chrome extension that transforms your competition draws from
                tedious spreadsheet scrolling into thrilling, TV-worthy winner reveals. Built
                specifically for UK raffle companies and competition operators who want to give
                their audience an experience they&apos;ll never forget.
              </p>

              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Manage multiple competitions, import thousands of entries in seconds, and reveal
                winners with a dramatic slot-machine animation — all from your browser sidebar.
                Install it once, and you&apos;re ready to go. No subscriptions. No setup fees. Ever.
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
                  Watch It In Action
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  100% Private — All data stays on your device
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Works right out of the box
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Completely free, forever
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Why DrawDay Section */}
        <section id="why-drawday" className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your winners deserve better than{' '}
                <span className="text-drawday-gold">a spreadsheet</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                If you&apos;re running competitions or raffles, you know the drill. You&apos;ve got
                a CSV full of entries, a winning ticket number, and your audience watching live. So
                how do you reveal the winner? By scrolling through a spreadsheet? By reading a name
                off a screen? That&apos;s not a moment — that&apos;s a letdown.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* The Old Way */}
              <div className="p-8 rounded-2xl bg-vermilion/5 border border-vermilion/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-vermilion/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-vermilion" />
                  </div>
                  <h3 className="text-xl font-bold text-vermilion">The Old Way</h3>
                </div>
                <ul className="space-y-4">
                  <PainPoint text="Scrolling through endless spreadsheet rows on a live stream trying to find a ticket number" />
                  <PainPoint text="Accidentally showing personal details like email addresses and phone numbers to your entire audience" />
                  <PainPoint text="Flat, boring reveal that kills the excitement your audience was feeling" />
                  <PainPoint text="No record of when draws happened or which winners were selected, making compliance a headache" />
                  <PainPoint text="Juggling multiple competition files across different folders with no central organisation" />
                  <PainPoint text="Spending time and money on custom software or clunky third-party tools that require accounts and subscriptions" />
                </ul>
              </div>

              {/* The DrawDay Way */}
              <div className="p-8 rounded-2xl bg-emerald/5 border border-emerald/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald">The DrawDay Way</h3>
                </div>
                <ul className="space-y-4">
                  <GainPoint text="Type the winning ticket number and watch a thrilling slot-machine animation build the suspense" />
                  <GainPoint text="Stream-safe winner cards show only the winner's name and ticket — personal details stay hidden" />
                  <GainPoint text="Dramatic, configurable animations that make every reveal a moment your audience remembers" />
                  <GainPoint text="Every draw is automatically timestamped and logged for full audit trail compliance" />
                  <GainPoint text="Manage all your competitions in one place with dedicated entries, winners, and settings per draw" />
                  <GainPoint text="Completely free Chrome extension that installs in seconds — no subscriptions, no hidden costs" />
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                DrawDay Spinner was built by competition operators, for competition operators. We
                know what it&apos;s like to run live draws week after week, and we built the tool we
                wished we&apos;d had from day one. It sits right in your browser sidebar, ready
                whenever you are — no extra windows, no complicated setup, no learning curve.
              </p>
            </div>
          </div>
        </section>

        {/* The Excitement Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  The Main Event
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Winner reveals that give your audience{' '}
                  <span className="text-drawday-gold">goosebumps</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  The heart of DrawDay is the spinner — a smooth, 60fps slot-machine animation that
                  cycles through names before dramatically slowing down and landing on your winner.
                  It&apos;s the same kind of suspense you see on TV game shows, and it turns every
                  draw into a genuine event.
                </p>
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  Your audience leans in as the names fly past. The spinner decelerates. The
                  anticipation builds. And then — the winner is revealed with a beautiful
                  celebration card, complete with confetti-worthy presentation. It&apos;s the
                  difference between &quot;and the winner is...&quot; read off a list, and a reveal
                  that has your chat exploding.
                </p>
                <div className="space-y-3">
                  <CheckItem text="Configurable spin duration — from quick 1-second spins to dramatic 10-second builds" />
                  <CheckItem text="Adjustable deceleration curve — choose from subtle to dramatic slow-downs" />
                  <CheckItem text="Customisable flip count — control how many names flash before the winner lands" />
                  <CheckItem text="GPU-accelerated animations — buttery smooth 60fps even with thousands of entries" />
                </div>
              </div>

              {/* Animation mock */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-gray-800 bg-raisin-black p-8">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-400 mb-2">Summer Raffle 2025</div>
                    <div className="text-xs text-gray-600">2,847 entries</div>
                  </div>
                  {/* Simulated spinner slots */}
                  <div className="space-y-1 mb-6">
                    <div className="px-4 py-2.5 rounded-lg bg-rich-black/70 border border-gray-800 text-gray-600 text-sm text-center">
                      Mike Thompson — #02841
                    </div>
                    <div className="px-4 py-2.5 rounded-lg bg-rich-black/70 border border-gray-800 text-gray-600 text-sm text-center">
                      Rachel Green — #01567
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-drawday-gold/10 border-2 border-drawday-gold/40 text-white font-semibold text-center">
                      Sarah Johnson — #04521
                    </div>
                    <div className="px-4 py-2.5 rounded-lg bg-rich-black/70 border border-gray-800 text-gray-600 text-sm text-center">
                      James Wilson — #03290
                    </div>
                    <div className="px-4 py-2.5 rounded-lg bg-rich-black/70 border border-gray-800 text-gray-600 text-sm text-center">
                      Emma Davis — #00834
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-center">
                    <Trophy className="w-8 h-8 text-emerald mx-auto mb-2" />
                    <div className="text-emerald font-semibold text-lg">1st Prize Winner!</div>
                    <div className="text-white font-bold text-2xl mt-1">Sarah Johnson</div>
                    <div className="text-gray-400 text-sm mt-1">Ticket #04521</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Competition Management */}
        <section className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Mock competitions UI */}
              <div className="order-2 lg:order-1 relative">
                <div className="rounded-2xl overflow-hidden border border-gray-800 bg-raisin-black p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white">Your Competitions</h3>
                    <div className="px-3 py-1 rounded-lg bg-drawday-gold/10 text-drawday-gold text-xs font-medium">
                      3 Active
                    </div>
                  </div>
                  <div className="space-y-3">
                    <CompetitionMock
                      name="Summer Raffle 2025"
                      entries={2847}
                      winners={0}
                      status="active"
                    />
                    <CompetitionMock
                      name="Monthly Prize Draw — June"
                      entries={1203}
                      winners={3}
                      status="active"
                    />
                    <CompetitionMock
                      name="Charity Gala Raffle"
                      entries={5612}
                      winners={0}
                      status="active"
                    />
                    <CompetitionMock
                      name="Spring Giveaway 2025"
                      entries={892}
                      winners={5}
                      status="completed"
                    />
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-azure/10 border border-azure/20 text-azure text-sm font-medium mb-6">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Multi-Competition
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Run as many competitions as you need,{' '}
                  <span className="text-drawday-gold">all in one place</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Whether you run one raffle a month or five draws a week, DrawDay keeps everything
                  organised. Each competition has its own set of entries, its own winner history,
                  and its own settings — all managed from a single, clean interface.
                </p>
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  No more juggling spreadsheets across different folders. No more wondering which
                  file has the latest entries. Create a new competition, import your CSV, and
                  you&apos;re ready to draw. When the competition is over, all your winners and draw
                  history are right there, ready for compliance reporting or your own records.
                </p>
                <div className="space-y-3">
                  <CheckItem text="Create unlimited competitions with descriptive names and dates" />
                  <CheckItem text="Each competition maintains its own separate entry list and winner history" />
                  <CheckItem text="Switch between competitions instantly from the side panel dropdown" />
                  <CheckItem text="Completed competitions are archived but always accessible for records" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                <Star className="w-3.5 h-3.5" />
                Feature Packed
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Everything you need for{' '}
                <span className="text-drawday-gold">professional draws</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                DrawDay isn&apos;t just a pretty spinner. It&apos;s a complete winner selection
                system built from the ground up for competition operators who take their draws
                seriously. Every feature was designed to make your life easier and your
                audience&apos;s experience unforgettable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
              <FeatureCard
                icon={<Trophy className="w-6 h-6" />}
                title="Slot-Machine Animation"
                description="Names fly past in a dramatic slot-machine reel before decelerating to land on your winner. Smooth 60fps animation with configurable speed, duration, and deceleration curve. It's the suspense your audience craves."
                color="gold"
              />
              <FeatureCard
                icon={<Upload className="w-6 h-6" />}
                title="One-Click CSV Import"
                description="Drag and drop your CSV file and DrawDay does the rest. It auto-detects your columns — ticket number, name, email, phone — no manual mapping needed. Handles 100,000+ entries without breaking a sweat."
                color="azure"
              />
              <FeatureCard
                icon={<Eye className="w-6 h-6" />}
                title="Stream-Safe Display"
                description="Winner reveal cards show only the winner's name and ticket number. Email addresses, phone numbers, and other personal details are kept completely hidden — protecting your participants' privacy on stream."
                color="emerald"
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Full Audit Trail"
                description="Every draw is automatically timestamped and recorded with the winner's details, draw position, and exact time. Maintain a complete, verifiable history for Gambling Commission compliance or your own records."
                color="amber"
              />
              <FeatureCard
                icon={<Palette className="w-6 h-6" />}
                title="Your Branding, Front & Centre"
                description="Upload your company logo and set your company name so every draw carries your brand. The spinner panel proudly displays your identity — making your draws look professional and on-brand for your audience."
                color="vermilion"
              />
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="100% Private & Local"
                description="Every piece of data — entries, winners, settings — stays in your browser's local storage. DrawDay makes zero network requests. There are no analytics, no tracking pixels, no data sharing. Your data is yours alone."
                color="emerald"
              />
              <FeatureCard
                icon={<FolderOpen className="w-6 h-6" />}
                title="Multi-Competition Management"
                description="Run multiple competitions simultaneously, each with their own entries and winner history. Switch between them instantly from the side panel. No more juggling spreadsheet files or losing track of which draw is which."
                color="azure"
              />
              <FeatureCard
                icon={<Monitor className="w-6 h-6" />}
                title="Browser Sidebar Integration"
                description="DrawDay lives in Chrome's side panel — right alongside whatever tab you're on. No extra windows cluttering your screen. Perfect for live streams where you need the spinner visible while sharing your screen."
                color="gold"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Zero Setup, Instant Start"
                description="Install from the Chrome Web Store and you're ready to draw in minutes. No configuration wizards, no subscription plans. Click install, import your entries, and start spinning. It's that simple."
                color="amber"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                <Clock className="w-3.5 h-3.5" />
                Quick Start
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Up and running in <span className="text-drawday-gold">under a minute</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                We&apos;ve stripped away everything that slows you down. No configuration wizards,
                no onboarding tutorials. DrawDay is designed to get out of your way and let you do
                what you do best — run brilliant draws.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number={1}
                icon={<FileSpreadsheet className="w-8 h-8" />}
                title="Import your entries"
                description="Create a new competition and drag-and-drop your CSV file. DrawDay automatically detects your columns — ticket numbers, names, contact details — and imports everything in seconds, even files with 100,000+ rows."
              />
              <StepCard
                number={2}
                icon={<MousePointerClick className="w-8 h-8" />}
                title="Enter the winning ticket"
                description="When it's time to draw, open the DrawDay side panel right alongside your browser tab. Type in the winning ticket number, hit enter, and the magic begins. Your audience sees the spinner start to whirl."
              />
              <StepCard
                number={3}
                icon={<PartyPopper className="w-8 h-8" />}
                title="Reveal the winner"
                description="The slot-machine animation builds suspense as names fly past and gradually slow down. The winner is revealed with a beautiful celebration card showing their name and ticket number — stream-safe and audience-ready."
              />
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 text-base max-w-2xl mx-auto">
                That&apos;s it. Three steps. No training manual, no support tickets, no &quot;let me
                just figure this out&quot; during your live stream. DrawDay is ready when you are.
              </p>
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="demo" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                <Play className="w-3.5 h-3.5" />
                See It In Action
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Don&apos;t just take our word for it
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Watch a full walkthrough of DrawDay Spinner — from importing your CSV to revealing
                the winner with our signature slot-machine animation. See exactly how it works and
                how it&apos;ll look to your audience during a live draw.
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
        <section className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-azure/10 border border-azure/20 text-azure text-sm font-medium mb-6">
                  <Monitor className="w-3.5 h-3.5" />
                  Seamless Integration
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Lives right in your <span className="text-drawday-gold">browser sidebar</span>
                </h2>
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  DrawDay Spinner opens as a Chrome side panel — docked right alongside whatever tab
                  you&apos;re on. This is a game-changer for live streamers: you can share your
                  screen showing your stream, and the DrawDay spinner panel is right there beside
                  it, ready to go.
                </p>
                <p className="text-gray-400 text-base mb-8 leading-relaxed">
                  No need to switch windows. No need to alt-tab to a different application. No need
                  to resize your browser to fit multiple windows. DrawDay is built into Chrome
                  itself, so it&apos;s always exactly where you need it — immediately accessible
                  from the toolbar, and tucked away when you don&apos;t.
                </p>
                <ul className="space-y-4">
                  <CheckItem text="Opens alongside any tab — no window switching or resizing needed" />
                  <CheckItem text="Manage competitions in a dedicated options page with full-screen room" />
                  <CheckItem text="Settings and data sync instantly between the side panel and options page" />
                  <CheckItem text="Lightweight popup launcher in your toolbar to open the panel with one click" />
                  <CheckItem text="Stays out of the way when you don't need it — no floating windows or overlays" />
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
                      <div className="text-emerald font-semibold text-lg">1st Prize Winner!</div>
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

        {/* Who It's For Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                <Users className="w-3.5 h-3.5" />
                Built For You
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Who uses <span className="text-drawday-gold">DrawDay</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                DrawDay was designed for anyone who runs competitions and wants their winner reveals
                to be as exciting as the prizes themselves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <AudienceCard
                icon={<Trophy className="w-7 h-7" />}
                title="Raffle & Competition Companies"
                description="You run raffles and competitions as your business. You need draws to be professional, compliant, and visually impressive for your audience. DrawDay gives you all three, with a full audit trail for every draw."
                color="gold"
              />
              <AudienceCard
                icon={<Tv className="w-7 h-7" />}
                title="Live Streamers & Content Creators"
                description="You run giveaways and competitions for your community on Facebook, YouTube, or TikTok. You need a winner reveal that looks incredible on camera and keeps your viewers engaged. DrawDay's slot-machine animation is made for live content."
                color="azure"
              />
              <AudienceCard
                icon={<Heart className="w-7 h-7" />}
                title="Charities & Fundraisers"
                description="You run prize draws to raise money for your cause. You want a professional, trustworthy draw experience that donors can watch and believe in. DrawDay's transparent, auditable draws build the trust your supporters expect."
                color="emerald"
              />
              <AudienceCard
                icon={<Users className="w-7 h-7" />}
                title="Community Groups & Clubs"
                description="You run regular raffles for your social club, sports team, or community group. You want something simple that anyone on the committee can use, without technical knowledge or expensive software. DrawDay is free and takes seconds to learn."
                color="amber"
              />
              <AudienceCard
                icon={<BarChart3 className="w-7 h-7" />}
                title="Event Organisers"
                description="You run prize draws at events, conferences, or trade shows. You need a polished winner selection tool that works on the big screen and impresses your attendees. DrawDay's dramatic animations turn a simple draw into a highlight of the event."
                color="vermilion"
              />
              <AudienceCard
                icon={<Shield className="w-7 h-7" />}
                title="Anyone Who Values Privacy"
                description="You handle participant data and take privacy seriously. DrawDay stores everything locally in your browser — no cloud uploads, no third-party access, no data sharing. Your participants' information never leaves your machine."
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-28 bg-rich-black/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-drawday-gold/10 border border-drawday-gold/20 text-drawday-gold text-sm font-medium mb-6">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Common questions</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <FAQItem
                question="Is DrawDay really free?"
                answer="Yes, completely. DrawDay Spinner is a free Chrome extension with no premium tiers, no trial periods, no feature gates, and no hidden costs. Every feature is available to everyone, forever. We built this tool because we needed it ourselves and wanted to share it with the community."
              />
              <FAQItem
                question="How do I get started?"
                answer="It's quick and easy. Install DrawDay from the Chrome Web Store, create your account, and you're ready to go. Import your first CSV, and you can run your first draw within minutes of installing."
              />
              <FAQItem
                question="Is my data safe?"
                answer="Absolutely. DrawDay stores all data locally in your browser's storage. It makes zero network requests — your competition entries, winner history, and settings never leave your computer. There are no analytics, no tracking, and no data sharing of any kind."
              />
              <FAQItem
                question="How many entries can it handle?"
                answer="DrawDay has been tested with CSV files containing over 100,000 entries and handles them without any performance issues. The import is fast, the search is instant (thanks to indexed lookups), and the spinner animation stays smooth at 60fps regardless of how many entries you have."
              />
              <FAQItem
                question="Can I use it for live streams?"
                answer="DrawDay was designed with live streaming in mind. It opens in Chrome's side panel alongside your stream tab, the winner cards are stream-safe (no personal details shown), and the slot-machine animation creates genuine suspense and entertainment for your viewers."
              />
              <FAQItem
                question="Does it work for compliance?"
                answer="Yes. Every draw is automatically timestamped and recorded with full details — winner name, ticket number, draw position, and exact time. This audit trail is designed to meet the record-keeping requirements that UK raffle and competition operators need for Gambling Commission compliance."
              />
              <FAQItem
                question="What file format do I need for entries?"
                answer="DrawDay accepts standard CSV files — the kind you can export from Excel, Google Sheets, or any spreadsheet application. It auto-detects your column headers (ticket number, name, email, phone) so you don't need to format your file in any special way."
              />
              <FAQItem
                question="Can I run multiple competitions at once?"
                answer="Absolutely. Create as many competitions as you need, each with their own entries and winner history. Switch between them instantly from the side panel dropdown. Completed competitions stay accessible for your records."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-drawday-navy/30 via-night to-night" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-drawday-gold/5 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to transform your live draws?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
              Join competition operators across the UK who&apos;ve ditched the spreadsheets and
              upgraded to DrawDay. Your audience will notice the difference from the very first
              spin.
            </p>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10">
              Install in seconds. No credit card. No catch.
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
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
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

function PainPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-gray-400">
      <XCircle className="w-5 h-5 text-vermilion flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

function GainPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-gray-300">
      <CheckCircle2 className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
      <span>{text}</span>
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

function CompetitionMock({
  name,
  entries,
  winners,
  status,
}: {
  name: string;
  entries: number;
  winners: number;
  status: 'active' | 'completed';
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-rich-black/50 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {entries.toLocaleString()} entries · {winners} winner{winners !== 1 ? 's' : ''}
        </div>
      </div>
      <div
        className={`px-2 py-0.5 rounded-md text-xs font-medium ${
          status === 'active' ? 'bg-emerald/10 text-emerald' : 'bg-gray-800 text-gray-400'
        }`}
      >
        {status === 'active' ? 'Active' : 'Done'}
      </div>
    </div>
  );
}

function AudienceCard({
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
    <div className="p-6 rounded-2xl bg-raisin-black/50 border border-gray-800 hover:border-gray-700 transition-all">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border ${colorMap[color] || colorMap.gold}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl bg-raisin-black/50 border border-gray-800 hover:border-gray-700 transition-all">
      <summary className="flex items-center justify-between cursor-pointer p-6 text-white font-medium list-none">
        <span>{question}</span>
        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed">{answer}</div>
    </details>
  );
}
