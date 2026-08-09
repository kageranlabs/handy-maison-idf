'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useItinerary } from '@/context/ItineraryContext';
import CheckoutModal from './CheckoutModal';
import { CalendarDays, Clock, Trash2, ArrowRight, ShieldAlert, Calendar } from 'lucide-react';

export default function BookingItinerary() {
  const { lang, dict } = useLanguage();
  const { slots, removeSlot, totalHoldAmount } = useItinerary();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <section id="itinerary" className="py-16 bg-white border-t border-gray-200/60 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block mb-1">
              {lang === 'fr' ? 'Panier & Réservation' : 'Cart & Booking'}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
              {dict.itineraryCart.title}
            </h2>
          </div>

          {slots.length > 0 && (
            <div className="bg-bgWarm px-4 py-2 rounded-2xl border border-gray-200 text-right">
              <span className="text-xs text-charcoal-muted block">{dict.itineraryCart.totalLabel}</span>
              <span className="font-heading text-xl font-bold text-primary">
                {totalHoldAmount} €
              </span>
            </div>
          )}
        </div>

        {/* Empty State */}
        {slots.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-bgWarm border border-dashed border-gray-300 space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-light text-primary mx-auto flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <p className="text-base text-charcoal-muted max-w-md mx-auto">
              {dict.itineraryCart.emptyText}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-primary-dark transition-all"
            >
              <span>{dict.servicesSection.title}</span>
            </Link>
          </div>
        ) : (
          /* Multi-Slot List */
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl bg-bgWarm border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-lg text-primary">
                        {slot.serviceName}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-charcoal border border-gray-200">
                        {slot.durationHours}h × {slot.hourlyRate}€/h
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted font-medium pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{slot.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{slot.startTime} - {slot.endTime} ({slot.durationHours}h)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                    <div className="text-right">
                      <span className="text-xs text-charcoal-muted block">
                        {lang === 'fr' ? 'Sous-total :' : 'Subtotal:'}
                      </span>
                      <span className="font-heading font-bold text-lg text-primary">
                        {slot.subtotal} €
                      </span>
                    </div>

                    <button
                      onClick={() => removeSlot(slot.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={dict.itineraryCart.removeSlot}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Hold Banner & Checkout CTA */}
            <div className="p-6 rounded-3xl bg-primary text-white space-y-4 shadow-xl mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-accent-light uppercase font-semibold tracking-wider">
                    {lang === 'fr' ? 'Résumé de la réservation' : 'Booking Summary'}
                  </span>
                  <p className="font-heading text-2xl font-bold mt-0.5">
                    {totalHoldAmount} €{' '}
                    <span className="text-xs font-normal text-accent-light">
                      ({lang === 'fr' ? 'Autorisation de retenue' : 'Authorization Hold'})
                    </span>
                  </p>
                  <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>
                      {lang === 'fr'
                        ? 'Aucun débit immédiat. Pré-autorisation suspendue jusqu\'à validation.'
                        : 'No immediate charge. Pre-authorization hold suspended until confirmation.'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-heading font-bold text-base rounded-2xl hover:bg-accent-light transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>{dict.itineraryCart.proceedToCheckout}</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </section>
  );
}
