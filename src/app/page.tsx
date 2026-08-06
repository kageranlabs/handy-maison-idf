import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      <Hero />
      <ServicesSection />
      <Gallery />
      <Testimonials />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
