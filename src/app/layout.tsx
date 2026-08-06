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

export const metadata: Metadata = {
  title: 'Handy Maison | Services à domicile en Île-de-France',
  description: 'Réservez vos prestations sur mesure à Paris et Île-de-France: Ménage, Repassage, Cuisine, Courses et Babysitting. Pré-autorisation bancaire Stripe sécurisée.',
  keywords: ['Ménage Paris', 'Services à domicile Île-de-France', 'Babysitting Paris', 'Repassage à domicile', 'Handy Maison'],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
