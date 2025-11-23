/**
 * UK Complete Raffle Template
 * Professional multi-page UK competition website
 */

"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Home,
  Grid3x3,
  Users,
  HelpCircle,
  Info,
  User,
  Menu,
  X,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Heart,
  Ticket,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Lock,
  Zap,
} from "lucide-react";
import { CompetitionCard } from "./components/CompetitionCard";

export interface UKCompleteTemplateProps {
  companyName?: string;
  tagline?: string;
  licenseNumber?: string;
}

type PageType =
  | "home"
  | "competitions"
  | "winners"
  | "how-it-works"
  | "about"
  | "account"
  | "faqs"
  | "terms"
  | "contact";

// Sample competition data
const competitions = [
  {
    id: "1",
    title: "Win a Mercedes-AMG C63",
    subtitle: "2024 Model • Premium Plus Package",
    image: "🚗",
    value: "£85,000",
    ticketPrice: "£2.99",
    maxTickets: 9999,
    soldTickets: 7854,
    drawDate: "30th December 2024",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    charity: "Great Ormond Street Hospital",
    maxPerPerson: 150,
    isFeatured: true,
    cashAlternative: "£65,000",
  },
  {
    id: "2",
    title: "£100,000 Tax Free Cash",
    subtitle: "Instant Bank Transfer",
    image: "💰",
    value: "£100,000",
    ticketPrice: "£4.99",
    maxTickets: 29999,
    soldTickets: 18543,
    drawDate: "28th December 2024",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    maxPerPerson: 500,
    isFlash: true,
  },
  {
    id: "3",
    title: "Rolex Submariner",
    subtitle: "Date • 41mm • Black Dial",
    image: "⌚",
    value: "£15,000",
    ticketPrice: "£0.99",
    maxTickets: 4999,
    soldTickets: 2341,
    drawDate: "31st December 2024",
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    charity: "Cancer Research UK",
    maxPerPerson: 100,
  },
  {
    id: "4",
    title: "PS5 Pro Bundle",
    subtitle: "Console + 5 Games + Extra Controller",
    image: "🎮",
    value: "£1,200",
    ticketPrice: "£0.49",
    maxTickets: 1999,
    soldTickets: 876,
    drawDate: "26th December 2024",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    maxPerPerson: 50,
  },
  {
    id: "5",
    title: "Dubai Holiday Package",
    subtitle: "7 Nights • 5 Star • All Inclusive",
    image: "✈️",
    value: "£8,000",
    ticketPrice: "£1.99",
    maxTickets: 2999,
    soldTickets: 1876,
    drawDate: "2nd January 2025",
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    maxPerPerson: 100,
    cashAlternative: "£6,000",
  },
  {
    id: "6",
    title: "iPhone 15 Pro Max",
    subtitle: "512GB • Natural Titanium",
    image: "📱",
    value: "£1,599",
    ticketPrice: "£0.29",
    maxTickets: 999,
    soldTickets: 445,
    drawDate: "24th December 2024",
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    maxPerPerson: 25,
  },
];

// Sample winner data
const recentWinners = [
  {
    name: "Sarah M.",
    location: "London",
    prize: "Range Rover Sport",
    value: "£95,000",
    date: "Nov 2024",
    image: "🚙",
    testimonial:
      "I never thought I would win! The whole process was so transparent and exciting.",
  },
  {
    name: "James D.",
    location: "Manchester",
    prize: "£50,000 Cash",
    value: "£50,000",
    date: "Nov 2024",
    image: "💷",
    testimonial:
      "Life-changing win! Used it for a house deposit. Thank you so much!",
  },
  {
    name: "Emma L.",
    location: "Birmingham",
    prize: "Maldives Holiday",
    value: "£12,000",
    date: "Oct 2024",
    image: "🏝️",
    testimonial: "Dream holiday of a lifetime. Everything was perfect!",
  },
  {
    name: "Michael R.",
    location: "Leeds",
    prize: "BMW M4",
    value: "£75,000",
    date: "Oct 2024",
    image: "🏎️",
    testimonial: "Always wanted this car. Still can't believe I won it!",
  },
  {
    name: "Sophie K.",
    location: "Glasgow",
    prize: "Rolex GMT-Master",
    value: "£18,000",
    date: "Sep 2024",
    image: "⌚",
    testimonial: "Amazing prize and super fast delivery. Highly recommend!",
  },
  {
    name: "Tom W.",
    location: "Cardiff",
    prize: "£25,000 Cash",
    value: "£25,000",
    date: "Sep 2024",
    image: "💰",
    testimonial:
      "Paid off my debts and took the family on holiday. Life changing!",
  },
];

export default function UKCompleteTemplate({
  companyName = "Elite Competitions UK",
  tagline = "Win Your Dream Prize Today",
  licenseNumber = "GC-123456",
}: UKCompleteTemplateProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navigation = [
    { id: "home", label: "Home", icon: Home },
    { id: "competitions", label: "Competitions", icon: Grid3x3 },
    { id: "winners", label: "Winners", icon: Trophy },
    { id: "how-it-works", label: "How It Works", icon: HelpCircle },
    { id: "about", label: "About", icon: Info },
    { id: "account", label: "My Account", icon: User },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "competitions":
        return <CompetitionsPage />;
      case "winners":
        return <WinnersPage />;
      case "how-it-works":
        return <HowItWorksPage />;
      case "about":
        return <AboutPage />;
      case "account":
        return <AccountPage />;
      case "faqs":
        return <FAQsPage />;
      case "terms":
        return <TermsPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  // Home Page Component
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">
                New Competition Every Week
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Win Life-Changing Prizes
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Enter our competitions for as little as £0.29. Better odds than
              the lottery, guaranteed winners every week!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setCurrentPage("competitions")}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                View All Competitions
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage("how-it-works")}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Competitions", value: "24", icon: Trophy },
              { label: "Winners This Year", value: "847", icon: Users },
              { label: "Total Prize Value", value: "£2.4M", icon: TrendingUp },
              { label: "Trust Score", value: "4.8/5", icon: Star },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <Icon className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Featured Competitions
            </h2>
            <p className="text-gray-600 text-lg">
              Don&apos;t miss out on these incredible prizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {competitions.slice(0, 3).map((comp) => (
              <CompetitionCard key={comp.id} {...comp} />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentPage("competitions")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Competitions
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose",
                desc: "Pick your dream prize",
                icon: "🎯",
              },
              {
                step: "2",
                title: "Enter",
                desc: "Buy your tickets securely",
                icon: "🎟️",
              },
              {
                step: "3",
                title: "Watch",
                desc: "Live draw on Facebook",
                icon: "📺",
              },
              {
                step: "4",
                title: "Win",
                desc: "Receive your prize!",
                icon: "🏆",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl mb-4 text-gray-900">{item.icon}</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Recent Winners
            </h2>
            <p className="text-gray-600">
              Real people, real prizes, real winners!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWinners.slice(0, 3).map((winner, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-gray-900">{winner.image}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">
                      {winner.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{winner.location}</p>
                    <p className="text-blue-600 font-semibold mt-1">
                      {winner.prize}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{winner.date}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    &quot;{winner.testimonial}&quot;
                  </p>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: Shield,
                title: "Licensed & Regulated",
                desc: "Gambling Commission",
              },
              {
                icon: Lock,
                title: "Secure Payments",
                desc: "256-bit SSL Encryption",
              },
              {
                icon: CheckCircle,
                title: "Guaranteed Winners",
                desc: "Every Competition",
              },
              {
                icon: Heart,
                title: "Charity Partner",
                desc: "10% to Good Causes",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx}>
                  <Icon className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
                  <h3 className="font-bold mb-1 text-white">{item.title}</h3>
                  <p className="text-sm text-blue-200">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  // Competitions Page
  const CompetitionsPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            All Competitions
          </h1>
          <div className="flex flex-wrap gap-2">
            {["All", "Cars", "Cash", "Tech", "Watches", "Holidays"].map(
              (category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-colors"
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <CompetitionCard key={comp.id} {...comp} />
          ))}
        </div>
      </div>
    </section>
  );

  // Winners Page
  const WinnersPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Our Winners
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentWinners.map((winner, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <div className="text-5xl mb-3 text-white">{winner.image}</div>
                <h3 className="text-xl font-bold text-white">{winner.prize}</h3>
                <p className="text-blue-100">{winner.value}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{winner.name}</h4>
                    <p className="text-sm text-gray-600">
                      {winner.location} • {winner.date}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &quot;{winner.testimonial}&quot;
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // How It Works Page
  const HowItWorksPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          How It Works
        </h1>

        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Choose Your Competition
                </h3>
                <p className="text-gray-600">
                  Browse our selection of amazing prizes. From luxury cars to
                  cash, tech gadgets to dream holidays - we have something for
                  everyone!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Answer the Question
                </h3>
                <p className="text-gray-600">
                  Answer our skill-based question correctly. Don&apos;t worry -
                  they&apos;re designed to be easy! This ensures we comply with
                  UK competition laws.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Buy Your Tickets
                </h3>
                <p className="text-gray-600">
                  Select how many entries you want and complete your purchase.
                  We accept all major cards and payment methods. SSL secured
                  checkout.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Watch the Live Draw
                </h3>
                <p className="text-gray-600">
                  All draws are streamed live on our Facebook page. Random
                  number generator selects the winner. Full transparency
                  guaranteed!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Free Postal Entry
          </h3>
          <p className="text-gray-700 mb-4">
            In accordance with UK law, free postal entry is available for all
            competitions. Send your entry to:
          </p>
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-sm text-gray-700">
              {companyName}
              <br />
              Competition Entry
              <br />
              PO Box 1234
              <br />
              London, W1A 1AA
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // About Page
  const AboutPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          About {companyName}
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Founded in 2019, {companyName} has become the UK&apos;s most trusted
            online competition platform. We&apos;ve given away over £2 million
            in prizes to hundreds of lucky winners across the country.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Our Mission
            </h2>
            <p className="text-gray-600">
              To provide fair, transparent, and exciting competitions that give
              everyone the chance to win life-changing prizes at affordable
              prices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <Trophy className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                850+ Winners
              </h3>
              <p className="text-gray-600 text-sm">
                Real people winning real prizes every week
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <Heart className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                £250k to Charity
              </h3>
              <p className="text-gray-600 text-sm">
                Supporting causes that matter
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Fully Licensed & Regulated
            </h3>
            <p className="mb-4 text-white">
              Operating under Gambling Commission License {licenseNumber}
            </p>
            <p className="text-blue-100">
              We take responsible gambling seriously and are committed to
              providing a safe, fair, and transparent service to all our
              customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Account Page
  const AccountPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          My Account
        </h1>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">John Smith</h2>
              <p className="text-gray-600">john.smith@email.com</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Active Tickets</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Competitions Won</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">£247</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Active Entries
          </h3>
          <div className="space-y-3">
            {competitions.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-900">{comp.image}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{comp.title}</p>
                    <p className="text-sm text-gray-600">
                      5 entries • Draw: {comp.drawDate}
                    </p>
                  </div>
                </div>
                <Ticket className="w-5 h-5 text-blue-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // FAQs Page
  const FAQsPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {[
            {
              q: "Is this legal?",
              a: "Yes! We operate under a Gambling Commission license and comply with all UK laws.",
            },
            {
              q: "When are the draws?",
              a: "Live draws happen every Sunday at 8PM on our Facebook page.",
            },
            {
              q: "How do I claim my prize?",
              a: "Winners are contacted within 24 hours. Prizes are delivered or transferred within 7 days.",
            },
            {
              q: "Can I enter for free?",
              a: "Yes, free postal entry is available for all competitions as required by UK law.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit/debit cards, PayPal, and Apple Pay.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Terms Page
  const TermsPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Terms & Conditions
        </h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 mb-4">Last updated: December 2024</p>
          <div className="space-y-4 text-gray-700">
            <p>By entering our competitions, you agree to these terms...</p>
            <h3 className="font-bold text-gray-900">1. Eligibility</h3>
            <p>Must be 18+ and a UK resident...</p>
            <h3 className="font-bold text-gray-900">2. Entry Methods</h3>
            <p>Online purchase or free postal entry...</p>
            <h3 className="font-bold text-gray-900">3. Prize Draw</h3>
            <p>Random selection via certified RNG...</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Contact Page
  const ContactPage = () => (
    <section className="py-8 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <Mail className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold mb-2 text-gray-900">Email</h3>
              <p className="text-gray-600">
                support@{companyName.toLowerCase().replace(/\s+/g, "")}.co.uk
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Phone className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold mb-2 text-gray-900">Phone</h3>
              <p className="text-gray-600">0800 123 4567</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Fri 9am-5pm</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold mb-4 text-gray-900">Send us a message</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Licensed & Regulated by the UK Gambling Commission • License{" "}
          {licenseNumber}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">
                  {companyName}
                </div>
                <div className="text-xs text-gray-600">{tagline}</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as PageType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as PageType);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-lg text-white">
                  {companyName}
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                The UK&apos;s most trusted competition platform. Win your dream
                prizes today!
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => setCurrentPage("competitions")}
                    className="hover:text-white transition-colors"
                  >
                    Competitions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("winners")}
                    className="hover:text-white transition-colors"
                  >
                    Winners
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("how-it-works")}
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("faqs")}
                    className="hover:text-white transition-colors"
                  >
                    FAQs
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => setCurrentPage("terms")}
                    className="hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Responsible Gambling
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Complaints Procedure
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Follow Us</h4>
              <div className="flex gap-3 mb-4">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white">
                  <Youtube className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setCurrentPage("contact")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                support@{companyName.toLowerCase().replace(/\s+/g, "")}.co.uk
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2024 {companyName}. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>License {licenseNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <span>18+</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
