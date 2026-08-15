import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ItineraryProvider } from '@/context/ItineraryContext';

import CookieBanner from '@/components/CookieBanner';

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
    default: "Handy Maison | Ménage, Repassage & Garde d'enfants Paris & IDF",
  },
  description:
    "L'excellence des services à domicile sur-mesure à Paris (75) et en Île-de-France (IDF). Réservez votre femme de ménage, repassage, baby-sitter, chef à domicile et aide aux courses.",
  keywords: [
    "femme de ménage Paris",
    "ménage à domicile Paris",
    "service de repassage Île-de-France",
    "repassage à domicile IDF",
    "baby-sitter Paris",
    "garde d'enfants Paris",
    "nounou Île-de-France",
    "chef à domicile Paris",
    "cuisinier à domicile IDF",
    "préparation de repas Paris",
    "aide aux courses Paris",
    "personal shopper courses Paris",
    "services à domicile haut de gamme France",
    "domestic services Paris",
    "english speaking cleaner Paris",
    "trusted babysitter Paris",
    "in-home cook Paris"
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Handy Maison | Services à domicile d'excellence Paris & IDF",
    description: "Ménage, repassage, garde d'enfants, cuisine et courses. Créez un itinéraire sur-mesure pour votre domicile en Île-de-France.",
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
            <CookieBanner />
          </ItineraryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
