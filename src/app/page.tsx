import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Handy Maison',
  image: 'https://handymaison.fr/favicon.png',
  '@id': 'https://handymaison.fr',
  url: 'https://handymaison.fr',
  telephone: '+33753829438',
  email: 'handymaison.idf@gmail.com',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Île-de-France, France',
    },
    {
      '@type': 'City',
      name: 'Paris',
    },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '08:00',
      closes: '23:00',
    },
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Home Cleaning & Ironing',
        description:
          'Professional house cleaning and clothes ironing services in Île-de-France.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Babysitting & Childcare',
        description: 'Vetted babysitting and childcare services for families in Paris.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Errands & Grocery Shopping',
        description: 'Personal errand running, grocery shopping, and household logistics.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Home Cooking & Meal Prep',
        description: 'Customized meal preparation and home cooking assistance.',
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
