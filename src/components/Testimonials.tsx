'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Star, Quote, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const { lang } = useLanguage();

  return (
    <section className="py-20 bg-white border-t border-gray-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
            {lang === 'fr' ? 'Avis Clients & Preuves WhatsApp' : 'Verified Client Reviews & Feedback'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
            {lang === 'fr' ? 'La Confiance de nos Résidents' : 'Trusted by Paris & IDF Residents'}
          </h2>
          <p className="text-base text-charcoal-muted">
            {lang === 'fr'
              ? 'Découvrez les retours en direct et témoignages de nos clients réguliers.'
              : 'Read real stories and direct feedback from our recurring clients.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Prominent Visual WhatsApp Feedback Screenshot Showcase */}
          <div className="lg:col-span-5 bg-bgWarm rounded-3xl p-6 sm:p-8 shadow-card border border-gray-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'fr' ? 'Retour Client Direct WhatsApp' : 'Direct WhatsApp Client Proof'}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Parent Container with Relative, Overflow-Hidden, and Predefined Height */}
            <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-900">
              <Image
                src="/testimonial.jpeg"
                alt="Client WhatsApp Feedback Proof - Handy Maison"
                fill
                priority
                className="object-contain object-center p-1"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>

            <div className="pt-2 text-xs text-charcoal-muted flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                {lang === 'fr' ? 'Retour Authentique Vérifié' : 'Authentic Verified Feedback'}
              </span>
              <span>Île-de-France</span>
            </div>
          </div>

          {/* Right Column: 3 Editorial Review Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-bgWarm rounded-3xl p-6 sm:p-8 shadow-card border border-gray-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-accent/40" />
              </div>

              <p className="text-sm text-charcoal leading-relaxed italic">
                "{lang === 'fr' ? (
                  <><span translate="no" className="notranslate">Handy Maison</span>{' '}a complètement transformé notre quotidien à Paris. Pouvoir réserver le ménage et la garde d'enfants en un seul itinéraire avec autorisation Stripe suspendue est d'un confort absolu.</>
                ) : (
                  <><span translate="no" className="notranslate">Handy Maison</span>{' '}has completely transformed our daily life in Paris. Being able to book housekeeping and childcare in a single process with Stripe authorization suspended is incredibly convenient.</>
                )}"
              </p>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-heading font-bold text-primary">Élodie de Saint-Germain</h4>
                  <span className="text-charcoal-muted font-medium">Paris • Champs-Élysées</span>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                  {lang === 'fr' ? 'Réservations Régulières' : 'Recurring Client'}
                </span>
              </div>
            </div>

            <div className="bg-bgWarm rounded-3xl p-6 sm:p-8 shadow-card border border-gray-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-accent/40" />
              </div>

              <p className="text-sm text-charcoal leading-relaxed italic">
                "{lang === 'fr' ? (
                  <>Le repassage et la cuisine à domicile sont exceptionnels. Les intervenants sont polis, ponctuels et extrêmement professionnels. Le système de hold Stripe évite tout débit prématuré.</>
                ) : (
                  <>The ironing and home cooking services are exceptional. The providers are polite, punctual, and highly professional. The Stripe hold system prevents early charges.</>
                )}"
              </p>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-heading font-bold text-primary">Marc-Antoine V.</h4>
                  <span className="text-charcoal-muted font-medium">Neuilly-sur-Seine</span>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                  {lang === 'fr' ? 'Client Vérifié' : 'Verified Client'}
                </span>
              </div>
            </div>

            <div className="bg-bgWarm rounded-3xl p-6 sm:p-8 shadow-card border border-gray-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-accent/40" />
              </div>

              <p className="text-sm text-charcoal leading-relaxed italic">
                "{lang === 'fr' ? (
                  <>Service haut de gamme inégalé en Île-de-France. Les consignes particulières sur mon appartement ont été respectées à la lettre par la personne intervenante.</>
                ) : (
                  <>Unmatched high-end home services in Île-de-France. My specific instructions for my apartment were executed to perfection.</>
                )}"
              </p>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-heading font-bold text-primary">Sophie & Alexandre</h4>
                  <span className="text-charcoal-muted font-medium">Boulogne-Billancourt</span>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                  {lang === 'fr' ? 'Client Vérifié' : 'Verified Client'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
