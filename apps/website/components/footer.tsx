import Link from 'next/link';
import Image from 'next/image';
import { Chrome, Mail, ExternalLink } from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/olijkjickkfgmmpckjddgndoembhehgi';

export function Footer() {
  return (
    <footer className="bg-rich-black/50 border-t border-gray-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="DrawDay" width={32} height={32} className="w-8 h-8" />
              <div>
                <span className="font-bold text-white">DrawDay</span>
                <span className="text-xs text-gray-500 ml-1.5">Spinner</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              The free Chrome extension for professional, fair, and exciting live draws. Built for
              UK raffle companies and competition operators.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="text-gray-500 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Chrome Web Store
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:admin@drawday.app"
                  className="text-gray-500 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  admin@drawday.app
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-10 pt-6">
          <p className="text-gray-600 text-sm text-center">
            &copy; {new Date().getFullYear()} DrawDay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
