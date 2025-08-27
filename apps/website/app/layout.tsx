import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutContent } from '@/components/layout-content';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://drawday.app'),
  title: 'DrawDay Spinner - Professional Live Draw Management',
  description:
    'Turn your live draws into unforgettable experiences with DrawDay Spinner. The professional Chrome extension for fair, transparent, and exciting competition draws.',
  keywords:
    'drawday, raffle, lottery, spinner, chrome extension, live draw, competition, giveaway, UK competitions',
  authors: [{ name: 'DrawDay Team' }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'DrawDay Spinner',
    description: 'Professional live draw Chrome extension for UK competitions',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'DrawDay Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-night text-white`}>
        <LayoutContent>{children}</LayoutContent>
        <div id="portal-root" />
      </body>
    </html>
  );
}
