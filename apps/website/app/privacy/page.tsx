/**
 * Privacy Policy Page - Legal content from Directus
 *
 * Displays privacy policy with content managed through Directus CMS
 */

import { Calendar, Shield, FileText, ArrowLeft } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@raffle-spinner/ui';
import Link from 'next/link';
import { getLegalPage } from '@/lib/directus-content';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Privacy Policy - DrawDay Solutions',
  description:
    'Read our privacy policy to understand how DrawDay Solutions collects, uses, and protects your personal information.',
  keywords:
    'privacy policy, data protection, GDPR, personal information, DrawDay Solutions privacy',
};

export const revalidate = 3600; // 1 hour

// Fallback content if Directus isn't configured
const fallbackContent = {
  title: 'Privacy Policy',
  content: `
# Privacy Policy

**Last updated: December 2024**

## Introduction

DrawDay Solutions ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, and Chrome extension.

## Information We Collect

### Personal Information
We may collect the following personal information:
- Name and contact details (email, phone number)
- Company information
- Payment information (processed securely through third-party providers)
- Communication preferences

### Usage Information
- Website usage data and analytics
- Chrome extension usage statistics (anonymous)
- IP address and browser information
- Cookies and similar tracking technologies

### Competition Data
- Participant lists (when using our services)
- Competition results and history
- Winner information (as required for legitimate business purposes)

## How We Use Your Information

We use your information to:
- Provide and improve our services
- Process payments and fulfill orders
- Communicate with you about our services
- Provide customer support
- Comply with legal obligations
- Send marketing communications (with your consent)

## Data Sharing and Disclosure

We do not sell your personal information. We may share your information with:
- Service providers who assist in our operations
- Legal authorities when required by law
- Business partners (with your explicit consent)

## Data Security

We implement appropriate security measures to protect your information, including:
- Encryption of sensitive data
- Regular security assessments
- Access controls and authentication
- Secure data storage practices

## Your Rights

Under GDPR and UK data protection laws, you have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your information
- Object to processing
- Data portability
- Withdraw consent

## Cookies

We use cookies to:
- Provide essential website functionality
- Analyze website usage
- Remember your preferences
- Provide personalized content

You can manage cookie preferences through your browser settings.

## Data Retention

We retain your information only as long as necessary for the purposes outlined in this policy or as required by law.

## Children's Privacy

Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.

## International Transfers

If we transfer your data outside the UK/EU, we ensure appropriate safeguards are in place.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website.

## Contact Us

If you have questions about this Privacy Policy, please contact us:

**Email:** privacy@drawday.app
**Address:** DrawDay Solutions, London, United Kingdom
**Phone:** +44 123 456 7890

For data protection concerns, you can also contact the Information Commissioner's Office (ICO).
`,
  last_updated: new Date().toISOString(),
  version: '2.1',
  status: 'published' as const,
};

export default async function PrivacyPage() {
  // Fetch privacy policy from Directus
  const privacyPage = await getLegalPage('privacy-policy');

  // Use fallback if no content is available
  const content = privacyPage || fallbackContent;

  if (!content) {
    notFound();
  }

  // Format the last updated date
  const lastUpdated = new Date(content.last_updated).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" className="mb-6 gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-drawday-gold to-amber">
                Privacy
              </span>{' '}
              Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we protect and handle your personal information
            </p>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Version: {content.version}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div
                className="prose prose-slate dark:prose-invert max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground
                  prose-a:text-drawday-gold prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{
                  __html: content.content
                    .replace(/\n/g, '<br />')
                    .replace(/# /g, '<h1>')
                    .replace(/<h1>/g, '<h1>')
                    .replace(/<\/h1>/g, '</h1>'),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-drawday-gold" />
                Related Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <Link href="/terms">
                    <div className="text-left">
                      <div className="font-semibold">Terms of Service</div>
                      <div className="text-sm text-muted-foreground">Our terms and conditions</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <Link href="/cookies">
                    <div className="text-left">
                      <div className="font-semibold">Cookie Policy</div>
                      <div className="text-sm text-muted-foreground">How we use cookies</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-drawday-navy to-rich-black text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
              <p className="mb-6 text-white/80">
                If you have any questions about this Privacy Policy or how we handle your data,
                we're here to help.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" asChild>
                  <a href="mailto:privacy@drawday.app">Contact Our Privacy Team</a>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  asChild
                >
                  <Link href="/contact">General Contact</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
