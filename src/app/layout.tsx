import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ItineraryProvider } from '@/context/ItineraryContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://handymaison.fr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Handy Maison',
    default: 'Handy Maison | Premium Home Services in Île-de-France',
  },
  description:
    'Tailored home services across Paris & Île-de-France. Book professional cleaning, ironing, home cooking, errand running, and babysitting with secure Stripe pre-authorization.',
  keywords: [
    'Handy Maison',
    'Home services Paris',
    'Services à domicile Île-de-France',
    'Ménage Paris',
    'Babysitting Paris',
    'Repassage à domicile',
    'Courses à domicile Paris',
    'Cleaning services Île-de-France',
  ],
  authors: [{ name: 'Handy Maison' }],
  creator: 'Handy Maison',
  publisher: 'Handy Maison',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Handy Maison | Premium Home Services in Île-de-France',
    description:
      'Tailored home services across Paris & Île-de-France. Book professional cleaning, ironing, home cooking, errand running, and babysitting with secure Stripe pre-authorization.',
    url: siteUrl,
    siteName: 'Handy Maison',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 800,
        height: 800,
        alt: 'Handy Maison Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handy Maison | Premium Home Services in Île-de-France',
    description:
      'Tailored home services across Paris & Île-de-France. Book professional cleaning, ironing, home cooking, errand running, and babysitting.',
    images: ['/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-bgWarm text-charcoal antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <ItineraryProvider>
            {children}
          </ItineraryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
