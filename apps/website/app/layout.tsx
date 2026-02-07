import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://drawday.app'),
  title: 'DrawDay Spinner - Professional Live Draw Chrome Extension',
  description:
    'The free Chrome extension for professional, fair, and exciting live draws. Perfect for UK raffle companies, competitions, and giveaways. No account needed.',
  keywords:
    'drawday, spinner, chrome extension, live draw, raffle, competition, giveaway, winner selection, UK competitions, free',
  authors: [{ name: 'DrawDay' }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'DrawDay Spinner - Professional Live Draw Chrome Extension',
    description:
      'Free Chrome extension for professional, fair, and exciting live draws. No account needed.',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'DrawDay Spinner Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DrawDay Spinner',
    description: 'Free Chrome extension for professional live draws',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-night text-white`}>
        {children}
      </body>
    </html>
  );
}
