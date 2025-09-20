/**
 * Terms of Service Page - Legal content from Directus
 *
 * Displays terms of service with content managed through Directus CMS
 */

import { Calendar, Scale, FileText, ArrowLeft, Shield } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@raffle-spinner/ui';
import Link from 'next/link';
import { getLegalPage } from '@/lib/directus-content';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Terms of Service - DrawDay Solutions',
  description:
    'Read our terms of service to understand the legal terms and conditions for using DrawDay Solutions services.',
  keywords:
    'terms of service, terms and conditions, legal terms, service agreement, DrawDay Solutions terms',
};

export const revalidate = 3600; // 1 hour

// Fallback content if Directus isn't configured
const fallbackContent = {
  title: 'Terms of Service',
  content: `
# Terms of Service

**Last updated: December 2024**

## 1. Introduction

Welcome to DrawDay Solutions. These Terms of Service ("Terms") govern your use of our website, Chrome extension, and services (collectively, the "Services") operated by DrawDay Solutions Limited ("we," "our," or "us").

By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access our Services.

## 2. Acceptance of Terms

By creating an account or using our Services, you confirm that you:
- Are at least 18 years old
- Have the authority to enter into this agreement
- Will comply with all applicable laws and regulations
- Accept these Terms in their entirety

## 3. Description of Services

DrawDay Solutions provides:
- Chrome extension for live draw management
- Live streaming production services
- Website development and hosting
- Competition management tools
- Related technology services

## 4. User Accounts

### Account Creation
To access certain features, you must create an account providing accurate, current, and complete information.

### Account Security
You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized use

### Account Termination
We reserve the right to terminate accounts that violate these Terms or for any other reason at our discretion.

## 5. Acceptable Use

You agree NOT to:
- Use our Services for illegal purposes
- Violate any applicable laws or regulations
- Infringe on intellectual property rights
- Transmit harmful or malicious code
- Attempt to gain unauthorized access to our systems
- Use automated systems to access our Services without permission

## 6. Content and Intellectual Property

### Our Content
All content, features, and functionality of our Services are owned by DrawDay Solutions and protected by copyright, trademark, and other intellectual property laws.

### User Content
You retain ownership of content you submit but grant us a license to use, modify, and distribute it as necessary to provide our Services.

### Copyright Claims
We respect intellectual property rights and will respond to valid copyright infringement claims in accordance with applicable law.

## 7. Payment Terms

### Fees
Current pricing is available on our website. All fees are non-refundable unless otherwise stated.

### Payment Processing
Payments are processed through secure third-party providers. We do not store credit card information.

### Late Payments
Accounts with outstanding balances may be suspended until payment is received.

## 8. Service Level and Support

### Availability
We strive for 99.9% uptime but do not guarantee uninterrupted service.

### Support
Support is provided during business hours (Monday-Friday, 9 AM-6 PM GMT) via email and phone.

### Maintenance
We may perform scheduled maintenance with advance notice when possible.

## 9. Privacy and Data Protection

Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.

### GDPR Compliance
We comply with the General Data Protection Regulation (GDPR) and UK data protection laws.

### Data Security
We implement industry-standard security measures to protect your data.

## 10. Limitation of Liability

To the maximum extent permitted by law:
- We provide Services "as is" without warranties
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to the amount paid for Services in the 12 months preceding the claim

## 11. Indemnification

You agree to indemnify and hold harmless DrawDay Solutions from any claims, damages, or expenses arising from your use of our Services or violation of these Terms.

## 12. Termination

### By You
You may terminate your account at any time by contacting us.

### By Us
We may terminate or suspend your access immediately for violations of these Terms or other reasons at our discretion.

### Effect of Termination
Upon termination, your right to use our Services ceases immediately, but certain provisions of these Terms survive.

## 13. Governing Law

These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.

## 14. Changes to Terms

We reserve the right to modify these Terms at any time. We will notify users of material changes by:
- Posting updated Terms on our website
- Sending email notifications to registered users
- Displaying notices in our Services

Continued use of our Services after changes constitutes acceptance of the new Terms.

## 15. Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

## 16. Entire Agreement

These Terms, together with our Privacy Policy and any other legal notices published by us, constitute the entire agreement between you and DrawDay Solutions.

## 17. Contact Information

For questions about these Terms, please contact us:

**Email:** legal@drawday.app
**Address:** DrawDay Solutions Limited, London, United Kingdom
**Phone:** +44 123 456 7890

## 18. Dispute Resolution

### Informal Resolution
Before filing any formal claim, you agree to first contact us to attempt to resolve the dispute informally.

### Arbitration
Any disputes that cannot be resolved informally will be settled through binding arbitration in accordance with the rules of the London Court of International Arbitration.

### Class Action Waiver
You agree not to participate in class action lawsuits against DrawDay Solutions.

---

**DrawDay Solutions Limited**
Company Registration Number: 12345678
Registered Office: London, United Kingdom
`,
  last_updated: new Date().toISOString(),
  version: '3.2',
  status: 'published' as const,
};

export default async function TermsPage() {
  // Fetch terms of service from Directus
  const termsPage = await getLegalPage('terms-of-service');

  // Use fallback if no content is available
  const content = termsPage || fallbackContent;

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
                Terms
              </span>{' '}
              of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Legal terms and conditions for using our services
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
                  <Scale className="w-4 h-4" />
                  <span>Governed by UK Law</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Notice */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-drawday-gold/20 bg-drawday-gold/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Scale className="w-6 h-6 text-drawday-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-drawday-gold mb-2">Important Legal Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    By using our services, you agree to these terms. Please read them carefully. If
                    you don't agree with any part of these terms, you cannot use our services.
                  </p>
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
                  <Link href="/privacy">
                    <div className="text-left">
                      <div className="font-semibold">Privacy Policy</div>
                      <div className="text-sm text-muted-foreground">How we protect your data</div>
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

      {/* Key Points Summary */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Key Points Summary</CardTitle>
              <p className="text-muted-foreground">
                Important highlights from our Terms of Service
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Your Responsibilities</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use services legally and ethically</li>
                    <li>• Keep account information secure</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Pay fees on time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Our Commitments</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide reliable services</li>
                    <li>• Protect your data and privacy</li>
                    <li>• Offer customer support</li>
                    <li>• Comply with UK laws</li>
                  </ul>
                </div>
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
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="mb-6 text-white/80">
                If you have any questions about these Terms of Service or need clarification on any
                points, our legal team is here to help.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" asChild>
                  <a href="mailto:legal@drawday.app">Contact Legal Team</a>
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
