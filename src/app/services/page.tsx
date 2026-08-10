import type { Metadata } from 'next';
import Header from '@/components/Header';
import ServicesSection from '@/components/ServicesSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Prestations & Tarifs',
  description:
    'Découvrez nos prestations à domicile sur mesure en Île-de-France: ménage, repassage, cuisine, courses et babysitting.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      
      {/* Services Exploratory Catalog Header Banner */}
      <div className="bg-primary text-white pt-14 pb-12 border-b border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-light bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Catalogue Sur Mesure • Île-de-France
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            Nos Prestations & Tarifs à Domicile
          </h1>
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl mx-auto">
            Découvrez nos services haut de gamme (ménage, repassage, cuisine, courses, garde d'enfants). Choisissez vos créneaux et composez un itinéraire personnalisé.
          </p>
        </div>
      </div>

      <ServicesSection />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
