import Header from '@/components/Header';
import ServicesSection from '@/components/ServicesSection';
import BookingItinerary from '@/components/BookingItinerary';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export default function BookPage() {
  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      
      {/* Booking Page Banner */}
      <div className="bg-primary text-white pt-12 pb-10 border-b border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-light bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Réservation & Itinéraire sur Mesure
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            Composez votre journée de services à domicile
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Ajoutez un ou plusieurs créneaux horaires (ménage, repassage, cuisine, courses, babysitting) et autorisez votre pré-autorisation bancaire Stripe (Manual Hold).
          </p>
        </div>
      </div>

      <BookingItinerary />
      <ServicesSection />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
