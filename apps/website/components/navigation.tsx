'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Chrome, Menu, X } from 'lucide-react';
import { useState } from 'react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/olijkjickkfgmmpckjddgndoembhehgi';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-night/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="DrawDay" width={36} height={36} className="w-9 h-9" />
            <div>
              <span className="font-bold text-lg text-white">DrawDay</span>
              <span className="text-xs text-gray-500 ml-1.5">Spinner</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              How It Works
            </Link>
            <Link
              href="/#demo"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Demo
            </Link>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-drawday-gold text-rich-black text-sm font-semibold rounded-lg hover:bg-drawday-gold/90 transition-all"
            >
              <Chrome className="w-4 h-4" />
              Install Free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/50">
            <div className="flex flex-col gap-3">
              <Link
                href="/#features"
                className="text-gray-400 hover:text-white transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-400 hover:text-white transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#demo"
                className="text-gray-400 hover:text-white transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </Link>
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-drawday-gold text-rich-black font-semibold rounded-lg mt-2"
              >
                <Chrome className="w-4 h-4" />
                Install Free
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
