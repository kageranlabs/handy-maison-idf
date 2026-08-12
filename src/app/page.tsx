'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    if (window.location.hash.includes('access_token=') && window.location.hash.includes('type=invite')) {
      window.location.href = '/admin/set-password' + window.location.hash;
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Script id="local-business-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Handy Maison",
          "url": "https://handymaison.fr",
          "description": "Premium domestic services in Paris and Île-de-France combining cleaning, ironing, cooking, shopping, and babysitting into customized itineraries.",
          "areaServed": {
            "@type": "State",
            "name": "Île-de-France"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "08:00",
            "closes": "23:00"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services à Domicile / Home Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Ménage / House Cleaning",
                  "description": "Professional home cleaning and tidying services."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Repassage / Ironing",
                  "description": "Expert clothing care and ironing services at home."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Garde d'enfants / Babysitting",
                  "description": "Trusted and flexible childcare and babysitting services."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Cuisine / In-Home Cooking",
                  "description": "Customized meal preparation and daily cooking services."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Courses / Shopping & Errands",
                  "description": "Grocery shopping and personal errand running."
                }
              }
            ]
          }
        })}
      </Script>
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
