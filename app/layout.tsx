import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Import providers (they will be created as client components)
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'RedCap RRM Educational | 5G NR Reduced Capability Radio Resource Management',
  description: 'Interactive educational resource for understanding 5G NR RedCap (Reduced Capability) Radio Resource Management based on 3GPP TS 38.133. Learn about RLM, measurement procedures, idle mobility, and performance requirements.',
  keywords: [
    '5G',
    'NR',
    'RedCap',
    'RRM',
    'Radio Resource Management',
    '3GPP',
    'TS 38.133',
    'IoT',
    'Reduced Capability',
    'Educational',
    'RLM',
    'Radio Link Monitoring',
  ],
  authors: [{ name: 'RedCap RRM Educational Team' }],
  creator: 'RedCap RRM Educational',
  publisher: 'RedCap RRM Educational',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://redcap-rrm.edu',
    siteName: 'RedCap RRM Educational',
    title: 'RedCap RRM Educational - Master 5G Reduced Capability',
    description: 'Interactive educational resource for 5G NR RedCap Radio Resource Management based on 3GPP TS 38.133',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RedCap RRM Educational',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedCap RRM Educational',
    description: 'Interactive educational resource for 5G NR RedCap Radio Resource Management',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',
  themeColor: '#005AFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
