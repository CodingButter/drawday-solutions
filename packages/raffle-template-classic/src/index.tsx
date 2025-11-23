/**
 * Classic Raffle Template
 * Clean, traditional template for professional raffles
 */

"use client";

import {
  Trophy,
  Shield,
  Users,
  CheckCircle,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";

export interface ClassicTemplateProps {
  companyName?: string;
  prizeName?: string;
  prizeValue?: string;
  prizeImage?: string;
  drawDate?: string;
  entriesSold?: number;
  maxEntries?: number;
  ticketPrice?: string;
}

export default function ClassicTemplate({
  companyName = "Classic Raffles",
  prizeName = "Mercedes-Benz C-Class",
  prizeValue = "£42,000",
  prizeImage = "🚗",
  drawDate = "30th December 2024",
  entriesSold = 1247,
  maxEntries = 5000,
  ticketPrice = "£2.99",
}: ClassicTemplateProps) {
  const entryPercentage = (entriesSold / maxEntries) * 100;
  const remaining = maxEntries - entriesSold;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-blue-600 text-white py-3 sm:py-4 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0 text-white" />
              <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold truncate text-white">
                {companyName}
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-3 xl:gap-6 flex-shrink-0">
              <a
                href="#home"
                className="hover:text-blue-200 transition-colors text-sm whitespace-nowrap"
              >
                Home
              </a>
              <a
                href="#draws"
                className="hover:text-blue-200 transition-colors text-sm whitespace-nowrap"
              >
                Current Draws
              </a>
              <a
                href="#winners"
                className="hover:text-blue-200 transition-colors text-sm whitespace-nowrap"
              >
                Winners
              </a>
              <a
                href="#about"
                className="hover:text-blue-200 transition-colors text-sm whitespace-nowrap"
              >
                About
              </a>
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-3 xl:px-4 py-2 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap">
                My Account
              </button>
            </nav>
            <button className="lg:hidden bg-white text-blue-600 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs flex-shrink-0 whitespace-nowrap">
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="bg-blue-50 border-y border-blue-200 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-gray-700">
                Gambling Commission Licensed
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">100% Transparent Draws</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
              <span className="text-gray-700">Supporting Local Charities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                Draw Date: {drawDate}
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Win a Brand New {prizeName}
              </h1>
              <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-6">
                Enter our Christmas draw for your chance to win a luxury{" "}
                {prizeName} worth {prizeValue}, plus £5,000 cash alternative.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center gap-2">
                  Enter Now - {ticketPrice}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors">
                  How It Works
                </button>
              </div>

              {/* Entry Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <span className="text-gray-600 text-sm sm:text-base">
                    Entries Sold:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    {entriesSold.toLocaleString()} /{" "}
                    {maxEntries.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all"
                    style={{ width: `${entryPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {remaining.toLocaleString()} entries remaining
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="text-center">
                  <div className="text-6xl sm:text-8xl mb-3 sm:mb-4">
                    {prizeImage}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {prizeName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    2024 Model • Premium Plus Package
                  </p>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {prizeValue}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Estimated Value
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Why Choose {companyName}?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Fully Licensed",
                desc: "Gambling Commission approved and regulated",
              },
              {
                icon: Trophy,
                title: "Fair Draws",
                desc: "Live streamed draws with independent verification",
              },
              {
                icon: Users,
                title: "Real Winners",
                desc: "Over 500 prizes awarded to real people",
              },
              {
                icon: Heart,
                title: "Charity Support",
                desc: "10% of profits go to local charities",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 px-2">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Winners */}
      <div className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Recent Winners
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah M.",
                prize: "BMW 3 Series",
                date: "November 2024",
                emoji: "🎉",
              },
              {
                name: "John D.",
                prize: "£15,000 Cash",
                date: "October 2024",
                emoji: "💰",
              },
              {
                name: "Emma L.",
                prize: "Holiday Package",
                date: "September 2024",
                emoji: "✈️",
              },
            ].map((winner, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 sm:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {winner.emoji}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {winner.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-1 text-sm sm:text-base">
                  {winner.prize}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {winner.date}
                </p>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-10 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {[
              { step: "1", title: "Buy Entries", icon: "🎟️" },
              { step: "2", title: "Get Confirmation", icon: "✉️" },
              { step: "3", title: "Watch Live Draw", icon: "📺" },
              { step: "4", title: "Collect Prize", icon: "🏆" },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                  {item.icon}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 px-2">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center gap-2 mx-auto">
            Enter Competition Now
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                {companyName}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Licensed and regulated raffle company supporting local
                charities.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Current Draws
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Past Winners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Legal
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Responsible Gambling
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Contact
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Email: info@classicraffles.co.uk
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Phone: 0800 123 4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            © 2024 {companyName}. All rights reserved. | Gambling Commission
            License #12345
          </div>
        </div>
      </footer>
    </div>
  );
}
