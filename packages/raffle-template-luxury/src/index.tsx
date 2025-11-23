/**
 * Luxury Raffle Template
 * Premium, elegant template for high-value prize raffles
 */

"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";

export interface LuxuryTemplateProps {
  companyName?: string;
  prizeName?: string;
  prizeValue?: string;
  prizeImage?: string;
  drawDate?: string;
  entriesSold?: number;
  maxEntries?: number;
  secondPrize?: { name: string; value: string };
  thirdPrize?: { name: string; value: string };
}

export default function LuxuryTemplate({
  companyName = "Luxury Raffles",
  prizeName = "2024 Porsche 911 GT3",
  prizeValue = "£145,000",
  prizeImage = "🏎️",
  drawDate = "30th December 2024",
  entriesSold = 2847,
  maxEntries = 5000,
  secondPrize = { name: "£25,000 Cash", value: "£25,000" },
  thirdPrize = { name: "Luxury Watch Collection", value: "£15,000" },
}: LuxuryTemplateProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 22,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const entryPercentage = (entriesSold / maxEntries) * 100;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500 rounded-full blur-[128px] opacity-20 animate-pulse" />
      </div>

      <div className="relative w-full">
        {/* Header */}
        <header className="py-4 sm:py-6 px-3 sm:px-4 border-b border-white/10 backdrop-blur-sm w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold truncate text-white">
                {companyName}
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
              <a
                href="#prizes"
                className="text-gray-300 hover:text-white transition-colors text-sm whitespace-nowrap"
              >
                Prizes
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-white transition-colors text-sm whitespace-nowrap"
              >
                How it Works
              </a>
              <a
                href="#winners"
                className="text-gray-300 hover:text-white transition-colors text-sm whitespace-nowrap"
              >
                Winners
              </a>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap">
                My Account
              </button>
            </nav>
            <button className="lg:hidden bg-gradient-to-r from-purple-600 to-pink-600 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs flex-shrink-0 whitespace-nowrap">
              Menu
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap text-purple-300">
                  Draw closes: {drawDate}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent px-2">
                Win {prizeName}
              </h1>

              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Enter our exclusive luxury raffle for a chance to win a brand
                new {prizeName}, plus additional prizes worth over £40,000.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-2xl shadow-purple-500/25 flex items-center justify-center gap-2">
                  Enter Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="border border-gray-700 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2">
                  View Details
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto mb-8 sm:mb-12 px-3 sm:px-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6"
                  >
                    <div className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-white">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-3 sm:px-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">
                  {entriesSold.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Entries Sold
                </div>
                <div className="mt-2 sm:mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${entryPercentage}%` }}
                  />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">
                  £185,000
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Total Prize Value
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">
                  {timeLeft.days} Days
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Until Draw
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prizes Section */}
        <section
          id="prizes"
          className="py-12 sm:py-20 px-3 sm:px-4 bg-black/30"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 px-2 text-white">
              Prize Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {[
                {
                  title: "Grand Prize",
                  name: prizeName,
                  value: prizeValue,
                  image: prizeImage,
                },
                {
                  title: "Second Prize",
                  name: secondPrize.name,
                  value: secondPrize.value,
                  image: "💰",
                },
                {
                  title: "Third Prize",
                  name: thirdPrize.name,
                  value: thirdPrize.value,
                  image: "⌚",
                },
              ].map((prize, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform"
                >
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 text-center">
                    {prize.image}
                  </div>
                  <div className="text-purple-400 font-semibold mb-2 text-center text-sm sm:text-base">
                    {prize.title}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center px-2">
                    {prize.name}
                  </h3>
                  <div className="text-pink-400 text-lg sm:text-xl font-semibold text-center">
                    {prize.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Enter */}
        <section id="how-it-works" className="py-12 sm:py-20 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 px-2 text-white">
              How to Enter
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {[
                {
                  step: "1",
                  title: "Choose Entries",
                  desc: "Select your entry package",
                  icon: Trophy,
                },
                {
                  step: "2",
                  title: "Complete Payment",
                  desc: "Secure checkout process",
                  icon: Shield,
                },
                {
                  step: "3",
                  title: "Win Big",
                  desc: "Wait for the live draw",
                  icon: Award,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                      {item.step}
                    </div>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base px-2">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-2xl shadow-purple-500/25 flex items-center justify-center gap-2 mx-auto">
              Enter Competition
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 border-t border-white/10 py-6 sm:py-8 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto text-center text-gray-400">
            <p className="text-xs sm:text-sm">
              © 2024 {companyName}. All rights reserved. | Gambling Commission
              Licensed
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
