'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, ChevronDown, ShieldCheck, CreditCard } from 'lucide-react';

export default function FaqSection() {
  const { lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        fr: 'Comment fonctionne la pré-autorisation bancaire Stripe ?',
        en: 'How does the Stripe Pre-Authorization Hold work?',
      },
      a: {
        fr: 'Lors de votre réservation, votre carte bancaire est simplement vérifiée et le montant total est temporairement retenu. Aucun débit immédiat n\'est effectué tant que votre demande n\'a pas été confirmée.',
        en: 'Upon booking, your payment card is authorized and funds are temporarily held. No immediate charge takes place until your request has been confirmed.',
      },
    },
    {
      q: {
        fr: 'Puis-je combiner plusieurs prestations dans un seul itinéraire ?',
        en: 'Can I add multiple distinct services into a single itinerary?',
      },
      a: {
        fr: 'Oui, tout à fait. Vous pouvez composer votre journée sur mesure (par exemple : ménage le matin, puis courses ou repassage l\'après-midi). Chaque créneau respecte la durée minimale de 2h.',
        en: 'Absolutely. You can tailor your daily schedule (e.g. cleaning in the morning, then grocery shopping or ironing in the afternoon). Each slot enforces a minimum duration of 2 hours.',
      },
    },
    {
      q: {
        fr: 'Quelle est la zone desservie par Handy Maison ?',
        en: 'Which areas are covered by Handy Maison?',
      },
      a: {
        fr: 'Nous intervenons sur l\'ensemble de la région Île-de-France (Paris et l\'ensemble des départements franciliens).',
        en: 'We operate across the entire Île-de-France region (Paris and surrounding capital area).',
      },
    },
    {
      q: {
        fr: 'Que se passe-t-il si la réservation est refusée ?',
        en: 'What happens if my booking request is declined?',
      },
      a: {
        fr: 'Si le créneau demandé ne peut pas être honoré, la pré-autorisation bancaire est immédiatement annulée et les fonds retenus sur votre carte sont libérés sans aucun frais.',
        en: 'If the requested schedule cannot be accommodated, the authorization hold is instantly canceled and all reserved funds on your card are released with zero fees.',
      },
    },
    {
      q: {
        fr: 'Les produits de ménage sont-ils inclus ?',
        en: 'Are cleaning supplies included?',
      },
      a: {
        fr: 'Les produits de ménage sont habituellement fournis par le client. Toutefois, sur demande, des produits spécifiques peuvent être achetés par l\'intervenant et le montant engagé sera remboursé par le client.',
        en: 'Cleaning supplies are normally provided by the client. However, upon request, specific products can be purchased by the service provider and the amount spent will be refunded.',
      },
    },
  ];

  return (
    <section className="py-20 bg-bgWarm border-t border-gray-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: General Île-de-France Coverage Area Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-card border border-gray-200/80 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>{lang === 'fr' ? 'Zone d\'Intervention' : 'Coverage Area'}</span>
            </div>

            <h3 className="font-heading text-2xl font-bold text-primary">
              {lang === 'fr' ? 'Région Île-de-France' : 'Île-de-France Region'}
            </h3>

            <p className="text-sm text-charcoal-muted leading-relaxed">
              {lang === 'fr'
                ? 'Handy Maison propose des prestations de services à domicile sur mesure 7j/7 sur l\'ensemble de la région Île-de-France.'
                : 'Handy Maison operates tailored home services 7 days a week across the entire Île-de-France region.'}
            </p>

            {/* General Regional Feature Cards */}
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div className="p-3.5 rounded-2xl bg-bgWarm flex items-center justify-between font-semibold">
                <span className="text-primary">{lang === 'fr' ? 'Paris & Région Île-de-France' : 'Paris & Île-de-France Region'}</span>
                <span className="text-accent">{lang === 'fr' ? 'Couverture Régionale' : 'Regional Coverage'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-bgWarm flex items-center justify-between font-semibold">
                <span className="text-primary">{lang === 'fr' ? 'Interventions à Domicile' : 'Home Interventions'}</span>
                <span className="text-accent">{lang === 'fr' ? '7j/7 Sur Mesure' : '7 Days a Week'}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-[11px] font-semibold text-charcoal">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                <span>Stripe Manual Hold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>{lang === 'fr' ? 'Service Certifié' : 'Vetted Service'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block mb-1">
                {lang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
              </span>
              <h3 className="font-heading text-3xl font-bold text-primary">
                {lang === 'fr' ? 'Tout savoir sur nos services' : 'Everything About Our Services'}
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-sm text-primary hover:bg-gray-50 transition-colors"
                    >
                      <span>{faq.q[lang]}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-accent shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-charcoal-muted leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a[lang]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
