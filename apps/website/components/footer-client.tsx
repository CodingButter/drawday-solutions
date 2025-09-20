import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail, Phone, MapPin, Monitor, Tv, Code } from 'lucide-react';
import type { GlobalSettings, Service } from '@/types/directus';

const iconMap: { [key: string]: any } = {
  Monitor,
  Tv,
  Code,
};

interface FooterClientProps {
  settings: GlobalSettings;
  services: Service[];
}

export function FooterClient({ settings, services }: FooterClientProps) {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
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
            <p className="text-gray-400 mb-4 max-w-sm">{settings.site_description}</p>
            <div className="flex gap-4">
              {settings.social_github && (
                <a
                  href={settings.social_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          {services.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                {services.map((service) => {
                  const IconComponent = iconMap[service.icon] || Monitor;
                  return (
                    <li key={service.id}>
                      <Link
                        href={`/${service.slug}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <IconComponent className="w-4 h-4" />
                        {service.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {settings.contact_email}
                </a>
              </li>
              {settings.contact_phone && (
                <li>
                  <a
                    href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              <li className="text-gray-400 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  {settings.office_address && `${settings.office_address}, `}
                  {settings.office_city}
                  <br />
                  {settings.office_country}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">{settings.copyright_text}</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
