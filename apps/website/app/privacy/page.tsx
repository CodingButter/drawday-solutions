import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Privacy Policy - DrawDay Spinner',
  description: 'Privacy policy for the DrawDay Spinner Chrome extension.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-12">Last updated: February 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <Section title="Overview">
              <p>
                DrawDay Spinner is a Chrome extension designed for professional live draw and raffle
                winner selection. We are committed to protecting your privacy. This policy explains
                how we handle your data.
              </p>
            </Section>

            <Section title="Data Collection">
              <p>
                <strong>We do not collect any personal data.</strong> DrawDay Spinner operates
                entirely within your browser. No data is transmitted to our servers or any third
                party.
              </p>
              <p>Specifically:</p>
              <ul>
                <li>We do not collect analytics or usage data</li>
                <li>We do not use cookies or tracking technologies</li>
                <li>We do not collect IP addresses, device information, or browsing history</li>
                <li>We do not require account creation or login</li>
              </ul>
            </Section>

            <Section title="Data Storage">
              <p>
                All data you enter into DrawDay Spinner — including competition names, participant
                entries, winner history, and settings — is stored locally on your device using your
                browser&apos;s built-in IndexedDB and Chrome Storage APIs.
              </p>
              <p>
                This data never leaves your browser. It is not backed up to any cloud service and is
                not accessible to DrawDay or any third party.
              </p>
            </Section>

            <Section title="Permissions">
              <p>DrawDay Spinner requests only two Chrome permissions:</p>
              <ul>
                <li>
                  <strong>storage</strong> — Used to persist your selected competition and UI
                  preferences across browser sessions.
                </li>
                <li>
                  <strong>sidePanel</strong> — Used to display the spinner interface in
                  Chrome&apos;s side panel alongside your active tab.
                </li>
              </ul>
              <p>
                We do not request access to your browsing history, tab content, cookies, network
                traffic, or any other sensitive browser data.
              </p>
            </Section>

            <Section title="CSV Data">
              <p>
                When you import a CSV file containing participant data (names, ticket numbers, email
                addresses, phone numbers), this data is parsed and stored entirely within your
                browser&apos;s local IndexedDB database. The CSV file is read client-side and is
                never uploaded to any server.
              </p>
            </Section>

            <Section title="Third-Party Services">
              <p>
                DrawDay Spinner does not integrate with, send data to, or receive data from any
                third-party services. The extension makes zero network requests during normal
                operation.
              </p>
            </Section>

            <Section title="Data Deletion">
              <p>
                You can delete all DrawDay Spinner data at any time by removing the extension from
                Chrome. You can also delete individual competitions and their associated entries
                from within the extension&apos;s options page.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                DrawDay Spinner is a professional tool intended for use by businesses operating
                raffles and competitions. It is not directed at children under the age of 13.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this privacy policy from time to time. Any changes will be reflected
                on this page with an updated &quot;Last updated&quot; date.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                If you have any questions about this privacy policy or how DrawDay Spinner handles
                your data, please contact us at{' '}
                <a href="mailto:admin@drawday.app" className="text-drawday-gold hover:underline">
                  admin@drawday.app
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="text-gray-400 space-y-3 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-gray-400">
        {children}
      </div>
    </section>
  );
}
