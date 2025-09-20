'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@raffle-spinner/ui';
import { Menu, X, ChevronDown, Monitor, Tv, Code, ArrowRight, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { GlobalSettings, Service } from '@/types/directus';

const iconMap: { [key: string]: any } = {
  Monitor,
  Tv,
  Code,
};

interface NavigationClientProps {
  settings: GlobalSettings;
  services: Service[];
}

export function NavigationClient({ settings, services }: NavigationClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt={settings.site_name}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <span className="font-bold text-xl text-white">
                {settings.site_name.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {settings.site_tagline || 'Solutions'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            {services.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2">
                  Services
                  <ChevronDown
                    className={cn('w-4 h-4 transition-transform', servicesOpen && 'rotate-180')}
                  />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 pt-1">
                    <div className="w-72 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                      {services.map((service) => {
                        const IconComponent = iconMap[service.icon] || Monitor;
                        return (
                          <Link
                            key={service.id}
                            href={`/${service.slug}`}
                            className="flex items-start gap-4 p-4 hover:bg-gray-800/50 transition-colors group/item"
                          >
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                colorClasses[service.color_scheme]
                              )}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white mb-1">{service.name}</div>
                              <div className="text-sm text-gray-400">
                                {service.short_description.substring(0, 50)}...
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover/item:text-white mt-3" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-1.5"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white transition-colors px-3 py-1.5"
                  >
                    Sign In
                  </Link>

                  <Button
                    className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 text-white"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mounted && (mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />)}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              {services.length > 0 && (
                <>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">
                    Services
                  </div>
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/${service.slug}`}
                      className="text-gray-300 hover:text-white transition-colors px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </>
              )}

              <div className="border-t border-gray-800 pt-4 mt-2">
                <Link
                  href="/portfolio"
                  className="block text-gray-300 hover:text-white transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-300 hover:text-white transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-300 hover:text-white transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-2 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-center text-gray-300 hover:text-white transition-colors px-2 py-2 border border-gray-700 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center text-gray-300 hover:text-white transition-colors px-2 py-2 border border-gray-700 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-center text-gray-300 hover:text-white transition-colors px-2 py-2 border border-gray-700 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>

                    <Button
                      className="w-full bg-gradient-to-r from-neon-purple to-neon-pink"
                      asChild
                    >
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
