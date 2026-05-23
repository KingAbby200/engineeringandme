import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/ui/CookieBanner';
import ThemeProvider from '@/components/providers/ThemeProvider';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://engineeringtutorials.com'),
  title: { default: 'Engineering Tutorials – Learn Engineering Online', template: '%s | Engineering Tutorials' },
  description: 'Free, comprehensive engineering tutorials across Electrical, Civil, Mechanical, Computer, Chemical Engineering and more. Learn at your own pace with structured lessons.',
  keywords: ['engineering tutorials', 'electrical engineering', 'civil engineering', 'mechanical engineering', 'computer engineering', 'chemical engineering', 'engineering learning', 'free engineering courses'],
  authors: [{ name: 'Engineering Tutorials' }],
  creator: 'Engineering Tutorials',
  publisher: 'Engineering Tutorials',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Engineering Tutorials',
    title: 'Engineering Tutorials – Learn Engineering Online',
    description: 'Free, comprehensive engineering tutorials for all disciplines. Structured learning with quizzes and progress tracking.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Engineering Tutorials' }],
  },
  twitter: { card: 'summary_large_image', title: 'Engineering Tutorials', description: 'Free engineering tutorials for all disciplines.', images: ['/og-image.png'], creator: '@EngineeringTutorials' },
  verification: { google: 'your-google-verification-code' },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'Engineering Tutorials',
          url: process.env.NEXT_PUBLIC_SITE_URL,
          description: 'Free engineering tutorials across all engineering disciplines',
          educationalCredentialAwarded: 'Knowledge and Skills',
        }) }} />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <Analytics />
          <main style={{ minHeight: 'calc(100vh - 64px - 280px)' }}>
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '14px' }, success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } } }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
