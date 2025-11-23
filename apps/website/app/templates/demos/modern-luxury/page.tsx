/**
 * Modern Luxury Template Demo
 * A sophisticated raffle website template
 */

'use client';

import { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from '@raffle-spinner/ui';

export default function ModernLuxuryDemo() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 22,
  });

  useEffect(() => {
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

  const prizes = [
    {
      title: 'Grand Prize',
      name: '2024 Porsche 911 GT3',
      value: '£145,000',
      image: '🏎️',
    },
    {
      title: 'Second Prize',
      name: '£25,000 Cash',
      value: '£25,000',
      image: '💰',
    },
    {
      title: 'Third Prize',
      name: 'Luxury Watch Collection',
      value: '£15,000',
      image: '⌚',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-20 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Luxury Raffles</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                How it Works
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">Winners</button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                My Account
              </Button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-4 h-4" />
              Draw closes in 5 days
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Win a Porsche 911 GT3
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Enter our exclusive luxury raffle for a chance to win a brand new 2024 Porsche 911
              GT3, plus £40,000 in additional prizes.
            </p>

            <div className="flex justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                Enter Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View Details
              </Button>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">2,847</div>
              <div className="text-gray-400">Entries Sold</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <Trophy className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">£185,000</div>
              <div className="text-gray-400">Total Prize Value</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">5 Days</div>
              <div className="text-gray-400">Until Draw</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      <div className="bg-black/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Prize Breakdown</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:scale-105 transition-transform"
              >
                <div className="text-6xl mb-4 text-center">{prize.image}</div>
                <div className="text-purple-400 font-semibold mb-2 text-center">{prize.title}</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{prize.name}</h3>
                <div className="text-pink-400 text-xl font-semibold text-center">{prize.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Enter */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">How to Enter</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { step: '1', title: 'Choose Entries', desc: 'Select your entry package' },
              { step: '2', title: 'Complete Payment', desc: 'Secure checkout process' },
              { step: '3', title: 'Win Big', desc: 'Wait for the live draw' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-6 text-lg"
          >
            Enter Competition
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Luxury Raffles. All rights reserved. | Gambling Commission Licensed</p>
        </div>
      </div>
    </div>
  );
}
