import type { Metadata } from 'next';
import Header from '@/components/Header';
import ServicesSection from '@/components/ServicesSection';
import ServicesHero from '@/components/ServicesHero';
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
      <ServicesHero />

      <ServicesSection />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
