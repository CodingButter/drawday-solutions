/**
 * Classic Draw Template Demo
 * A clean, traditional raffle website template
 */

'use client';

import { Trophy, Shield, Users, CheckCircle, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@raffle-spinner/ui';

export default function ClassicDrawDemo() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <span className="text-2xl font-bold">Classic Raffles</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-200 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Current Draws
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Winners
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                About
              </a>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">My Account</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="bg-blue-50 border-y border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Gambling Commission Licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>100% Transparent Draws</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              <span>Supporting Local Charities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Draw Date: 30th December 2024
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Win a Brand New Mercedes-Benz C-Class
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Enter our Christmas draw for your chance to win a luxury Mercedes-Benz C-Class worth
                £42,000, plus £5,000 cash alternative.
              </p>
              <div className="flex gap-4 mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Enter Now - £2.99
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                  How It Works
                </Button>
              </div>

              {/* Entry Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Entries Sold:</span>
                  <span className="text-2xl font-bold text-blue-600">1,247 / 5,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">3,753 entries remaining</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="text-8xl mb-4">🚗</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Mercedes-Benz C-Class</h3>
                  <p className="text-gray-600 mb-4">2024 Model • Premium Plus Package</p>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-3xl font-bold text-blue-600">£42,000</div>
                    <div className="text-sm text-gray-500">Estimated Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Classic Raffles?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fully Licensed',
                desc: 'Gambling Commission approved and regulated',
              },
              {
                icon: Trophy,
                title: 'Fair Draws',
                desc: 'Live streamed draws with independent verification',
              },
              {
                icon: Users,
                title: 'Real Winners',
                desc: 'Over 500 prizes awarded to real people',
              },
              {
                icon: Heart,
                title: 'Charity Support',
                desc: '10% of profits go to local charities',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Winners */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recent Winners</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', prize: 'BMW 3 Series', date: 'November 2024', emoji: '🎉' },
              { name: 'John D.', prize: '£15,000 Cash', date: 'October 2024', emoji: '💰' },
              { name: 'Emma L.', prize: 'Holiday Package', date: 'September 2024', emoji: '✈️' },
            ].map((winner, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-4xl mb-4">{winner.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{winner.name}</h3>
                <p className="text-blue-600 font-semibold mb-1">{winner.prize}</p>
                <p className="text-sm text-gray-500">{winner.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { step: '1', title: 'Buy Entries', icon: '🎟️' },
              { step: '2', title: 'Get Confirmation', icon: '✉️' },
              { step: '3', title: 'Watch Live Draw', icon: '📺' },
              { step: '4', title: 'Collect Prize', icon: '🏆' },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12">
            Enter Competition Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Classic Raffles</h3>
              <p className="text-gray-400 text-sm">
                Licensed and regulated raffle company supporting local charities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">Email: info@classicraffles.co.uk</p>
              <p className="text-gray-400 text-sm">Phone: 0800 123 4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 Classic Raffles. All rights reserved. | Gambling Commission License #12345
          </div>
        </div>
      </footer>
    </div>
  );
}
