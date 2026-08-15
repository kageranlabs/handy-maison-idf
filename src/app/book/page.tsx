import type { Metadata } from 'next';
import Header from '@/components/Header';
import ServicesSection from '@/components/ServicesSection';
import BookingItinerary from '@/components/BookingItinerary';
import BookHero from '@/components/BookHero';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Réserver un Itinéraire',
  description:
    'Composez votre itinéraire de services à domicile en Île-de-France et autorisez votre pré-autorisation bancaire Stripe sécurisée.',
};

export default function BookPage() {
  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      
      {/* Booking Page Banner */}
      <BookHero />

      <BookingItinerary />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
