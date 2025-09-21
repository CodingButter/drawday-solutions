/**
 * Cookie Policy Page - Legal content from Directus
 *
 * Displays cookie policy with content managed through Directus CMS
 */

import { Calendar, Cookie, FileText, ArrowLeft, Shield, Settings } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@raffle-spinner/ui';
import Link from 'next/link';
import { getLegalPage } from '@/lib/directus-content';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Cookie Policy - DrawDay Solutions',
  description:
    'Learn about how DrawDay Solutions uses cookies and similar technologies to improve your experience on our website.',
  keywords:
    'cookie policy, cookies, tracking, web analytics, GDPR, consent, DrawDay Solutions cookies',
};

export const revalidate = 3600; // 1 hour

// Fallback content if Directus isn't configured
const fallbackContent = {
  title: 'Cookie Policy',
  content: `
# Cookie Policy

**Last updated: December 2024**

## What Are Cookies?

Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and providing personalized content.

## How We Use Cookies

DrawDay Solutions uses cookies for the following purposes:

### Essential Cookies
These cookies are necessary for our website to function properly and cannot be disabled in our systems.

**Purpose:** Enable core functionality such as security, network management, and accessibility
**Examples:**
- Authentication cookies to keep you logged in
- Security cookies to prevent fraud
- Load balancing cookies for performance

**Retention:** Session or up to 1 year

### Analytics Cookies
These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.

**Purpose:** Website analytics and performance monitoring
**Examples:**
- Google Analytics to track visitor behavior
- Performance monitoring cookies
- User journey tracking

**Retention:** Up to 2 years

### Functional Cookies
These cookies enable enhanced functionality and personalization.

**Purpose:** Remember your preferences and settings
**Examples:**
- Language preference cookies
- Theme selection cookies
- Form data temporary storage

**Retention:** Up to 1 year

### Marketing Cookies
These cookies track your activity across websites to provide relevant advertising.

**Purpose:** Deliver targeted advertising and measure campaign effectiveness
**Examples:**
- Social media tracking pixels
- Advertising platform cookies
- Remarketing cookies

**Retention:** Up to 2 years

## Third-Party Cookies

We may use third-party services that set their own cookies:

### Google Analytics
We use Google Analytics to analyze website usage and improve our services.
- **Privacy Policy:** https://policies.google.com/privacy
- **Opt-out:** https://tools.google.com/dlpage/gaoptout

### Social Media Platforms
Our website may include social media buttons and widgets that set cookies.
- **Facebook:** https://www.facebook.com/privacy/explanation
- **Twitter:** https://twitter.com/privacy
- **LinkedIn:** https://www.linkedin.com/legal/privacy-policy

### Payment Processors
When processing payments, our payment partners may set cookies.
- **Stripe:** https://stripe.com/privacy

## Cookie Categories

| Cookie Type | Purpose | Examples | Consent Required |
|-------------|---------|-----------|------------------|
| Strictly Necessary | Essential site functionality | Authentication, security | No |
| Performance | Analytics and monitoring | Google Analytics | Yes |
| Functional | Enhanced features | Preferences, settings | Yes |
| Targeting | Advertising and marketing | Social media, ads | Yes |

## Managing Your Cookie Preferences

You have several options for managing cookies:

### Browser Settings
You can control cookies through your browser settings:

**Chrome:**
1. Go to Settings > Privacy and security > Cookies and other site data
2. Choose your preferred cookie settings

**Firefox:**
1. Go to Options > Privacy & Security
2. Under Cookies and Site Data, choose your settings

**Safari:**
1. Go to Preferences > Privacy
2. Manage cookies and website data

**Edge:**
1. Go to Settings > Cookies and site permissions
2. Manage cookies and site data

### Our Cookie Preference Center
You can manage your cookie preferences using our cookie banner when you first visit our site, or by accessing our preference center.

### Opt-Out Tools
- **Google Analytics Opt-out:** https://tools.google.com/dlpage/gaoptout
- **Network Advertising Initiative:** https://www.networkadvertising.org/choices/
- **Digital Advertising Alliance:** https://www.aboutads.info/choices/

## Impact of Disabling Cookies

If you disable cookies, some features of our website may not function properly:

- You may need to re-enter information repeatedly
- Personalized content and recommendations won't work
- We won't be able to remember your preferences
- Some forms may not work correctly

## GDPR and Cookie Consent

Under the General Data Protection Regulation (GDPR) and UK data protection laws:

- We only use non-essential cookies with your consent
- You can withdraw consent at any time
- We provide clear information about cookie purposes
- You have control over your cookie preferences

## Cookie Updates

We may update this Cookie Policy to reflect changes in:
- Technology and cookie practices
- Legal requirements
- Our business practices

When we make significant changes, we will:
- Update the "Last updated" date
- Notify you through our website or email
- Request new consent if required

## Contact Information

If you have questions about our use of cookies, please contact us:

**Email:** privacy@drawday.app
**Address:** DrawDay Solutions Limited, London, United Kingdom
**Phone:** +44 123 456 7890

For data protection concerns, you can also contact the Information Commissioner's Office (ICO).

## Technical Details

### Cookie Lifespan
- **Session cookies:** Deleted when you close your browser
- **Persistent cookies:** Remain until expiry date or manual deletion

### Cookie Storage
Cookies are stored locally on your device and contain:
- Cookie name and value
- Domain and path information
- Expiry date (for persistent cookies)
- Security flags

### Data Processing
Cookie data may be processed:
- Locally on your device
- On our servers in the UK
- By third-party service providers (with appropriate safeguards)

## Legal Basis

Our legal basis for using cookies:
- **Strictly necessary cookies:** Legitimate interest in providing our services
- **Analytics cookies:** Your consent
- **Functional cookies:** Your consent
- **Marketing cookies:** Your consent

## Your Rights

Under GDPR, you have the right to:
- Access information about cookies we use
- Withdraw consent for non-essential cookies
- Object to processing for marketing purposes
- Request deletion of personal data collected via cookies
- Data portability for cookie-related personal data

To exercise these rights, please contact our privacy team at privacy@drawday.app.
`,
  last_updated: new Date().toISOString(),
  version: '2.0',
  status: 'published' as const,
};

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    description: 'Essential for website functionality',
    examples: ['Authentication', 'Security', 'Load balancing'],
    consent: false,
    retention: 'Session to 1 year',
  },
  {
    name: 'Performance',
    description: 'Help us analyze website usage',
    examples: ['Google Analytics', 'Performance monitoring'],
    consent: true,
    retention: 'Up to 2 years',
  },
  {
    name: 'Functional',
    description: 'Remember your preferences',
    examples: ['Language settings', 'Theme preferences'],
    consent: true,
    retention: 'Up to 1 year',
  },
  {
    name: 'Marketing',
    description: 'Provide relevant advertising',
    examples: ['Social media pixels', 'Ad targeting'],
    consent: true,
    retention: 'Up to 2 years',
  },
];

export default async function CookiesPage() {
  // Fetch cookie policy from Directus
  const cookiePage = await getLegalPage('cookie-policy');

  // Use fallback if no content is available
  const content = cookiePage || fallbackContent;

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
                Cookie
              </span>{' '}
              Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we use cookies and similar technologies
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

      {/* Cookie Types Overview */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-drawday-gold" />
                Cookie Types We Use
              </CardTitle>
              <p className="text-muted-foreground">
                Quick overview of the different types of cookies we use
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cookieTypes.map((type) => (
                  <div key={type.name} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{type.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          type.consent
                            ? 'bg-orange-500/10 text-orange-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}
                      >
                        {type.consent ? 'Consent Required' : 'Always Active'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <div>Examples: {type.examples.join(', ')}</div>
                      <div>Retention: {type.retention}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Settings className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-500 mb-2">
                    Manage Your Cookie Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can change your cookie preferences at any time through your browser settings
                    or by using our cookie preference center.
                  </p>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline">
                      Cookie Preferences
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Opt-out Google Analytics
                      </a>
                    </Button>
                  </div>
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
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground"
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
                  <Link href="/terms">
                    <div className="text-left">
                      <div className="font-semibold">Terms of Service</div>
                      <div className="text-sm text-muted-foreground">Our terms and conditions</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Browser Instructions */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>How to Manage Cookies in Your Browser</CardTitle>
              <p className="text-muted-foreground">
                Step-by-step instructions for popular browsers
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Chrome</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Click the three dots menu</li>
                    <li>Go to Settings → Privacy and security</li>
                    <li>Click "Cookies and other site data"</li>
                    <li>Choose your preferred settings</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Firefox</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Click the menu button</li>
                    <li>Go to Options → Privacy & Security</li>
                    <li>Under "Cookies and Site Data"</li>
                    <li>Manage your cookie preferences</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Safari</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open Safari Preferences</li>
                    <li>Click the Privacy tab</li>
                    <li>Manage cookies and website data</li>
                    <li>Choose your privacy settings</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Edge</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Click the three dots menu</li>
                    <li>Go to Settings → Site permissions</li>
                    <li>Click "Cookies and site data"</li>
                    <li>Adjust your preferences</li>
                  </ol>
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
              <h2 className="text-2xl font-bold mb-4">Questions About Our Cookie Use?</h2>
              <p className="mb-6 text-white/80">
                If you have any questions about how we use cookies or need help managing your
                preferences, we're here to help.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" asChild>
                  <a href="mailto:privacy@drawday.app">Contact Privacy Team</a>
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
