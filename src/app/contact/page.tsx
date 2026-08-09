'use client';

import React from 'react';
import Header from '@/components/Header';
import FaqSection from '@/components/FaqSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      
      {/* Contact Page Header */}
      <div className="bg-primary text-white pt-12 pb-10 border-b border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light block">
            {lang === 'fr' ? 'Assistance & Contact' : 'Support & Contact'}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            {lang === 'fr'
              ? 'À votre écoute 7j/7 en Île-de-France'
              : 'At Your Service 7 Days a Week in Île-de-France'}
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            {lang === 'fr'
              ? 'Une question sur votre pré-autorisation Stripe, vos créneaux d\'intervention ou nos prestations ? Nous sommes à votre entière disposition.'
              : 'Have a question about your Stripe pre-authorization hold, intervention slots, or services? We are here to assist you.'}
          </p>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <section className="py-12 bg-white border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Téléphone' : 'Phone'}
                </h3>
                <a href="tel:+33753829438" className="text-sm font-semibold text-charcoal hover:text-primary transition-colors">
                  +33 7 53 82 94 38
                </a>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr' ? 'Du lundi au dimanche (8h-20h)' : 'Monday to Sunday (8am - 8pm)'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Email Direct' : 'Direct Email'}
                </h3>
                <a href="mailto:handymaison.idf@gmail.com" className="text-sm font-semibold text-charcoal hover:underline block">
                  handymaison.idf@gmail.com
                </a>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr' ? 'Réponse sous 2 heures ouvrées' : 'Response within 2 business hours'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Zone d\'Intervention' : 'Coverage Area'}
                </h3>
                <p className="text-sm font-semibold text-charcoal">Région Île-de-France</p>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr'
                    ? 'Interventions à domicile dans toute la région Île-de-France'
                    : 'Operating across the Île-de-France region'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ & Île-de-France Coverage Area Section */}
      <FaqSection />

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
