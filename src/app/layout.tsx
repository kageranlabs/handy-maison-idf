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
    template: "%s | Handy Maison",
    default: "Handy Maison | Premium Home Services in Île-de-France",
  },
  description:
    "Premium domestic services in Paris and Île-de-France. Combine cleaning (ménage), ironing (repassage), babysitting (garde d'enfants), cooking (cuisine), and shopping (courses) into a single tailored itinerary.",
  keywords: [
    "femme de ménage Paris",
    "aide à domicile Île-de-France",
    "service de repassage à domicile",
    "baby-sitter Paris",
    "garde d'enfants Île-de-France",
    "préparation de repas à domicile",
    "aide pour les courses",
    "english speaking cleaner Paris",
    "trusted babysitter Paris",
    "personal grocery shopper Paris",
    "in-home cook Paris",
    "home cleaning service near me",
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Handy Maison | Premium Home Services in Île-de-France",
    description: "Combine cleaning, ironing, babysitting, cooking, and shopping into a single tailored itinerary. Book securely today.",
    url: "https://handymaison.fr",
    siteName: "Handy Maison",
    locale: "fr_FR",
    alternateLocale: "en_US",
    type: "website",
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
