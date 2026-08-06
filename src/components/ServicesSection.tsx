'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SERVICES } from '@/lib/constants';
import { ServiceDefinition } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import AddSlotModal from './AddSlotModal';
import { PlusCircle, Clock, Check } from 'lucide-react';

export default function ServicesSection() {
  const { lang, dict } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);

  return (
    <section id="services" className="py-20 bg-bgWarm border-t border-gray-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
            Sur Mesure • Île-de-France
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
            {dict.servicesSection.title}
          </h2>
          <p className="text-base text-charcoal-muted font-normal">
            {dict.servicesSection.subtitle}
          </p>
        </div>

        {/* Services Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Card Image Header */}
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={service.image}
                    alt={service.name[lang]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Price Tag Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-primary font-heading font-bold text-sm shadow-md">
                    {service.hourlyRate} €<span className="text-xs font-normal text-charcoal-muted">{dict.servicesSection.ratePerHour}</span>
                  </div>

                  {/* Service Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-heading font-bold text-xl leading-tight">
                      {service.name[lang]}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {service.description[lang]}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {service.highlights[lang].map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-charcoal font-medium">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-6 pt-0">
                <div className="text-[11px] text-charcoal-muted font-medium mb-3 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{dict.servicesSection.minDuration}</span>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full py-3 px-4 bg-accent-light text-primary hover:bg-primary hover:text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{dict.servicesSection.addToItinerary}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Add Slot Modal */}
      {selectedService && (
        <AddSlotModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
