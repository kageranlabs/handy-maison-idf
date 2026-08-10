'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Phone, Mail, Lock } from 'lucide-react';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-primary-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Prominent Footer Branding */}
          <div className="space-y-4 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group py-1">
              <Image
                src="/favicon.png"
                alt="Handy Maison Logo"
                width={52}
                height={52}
                priority
                className="object-contain w-12 h-12 group-hover:scale-105 transition-transform"
              />
              <span translate="no" className="notranslate font-heading text-2xl font-bold tracking-tight text-white">
                Handy Maison
              </span>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed pt-1">
              {lang === 'fr'
                ? 'Services à domicile sur mesure à Paris et en Île-de-France.'
                : 'Tailored home services in Paris and Île-de-France.'}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-light">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {lang === 'fr' ? 'Accueil' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {lang === 'fr' ? 'Prestations & Tarifs' : 'Services & Rates'}
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  {lang === 'fr' ? 'Réserver un itinéraire' : 'Book an Itinerary'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {lang === 'fr' ? 'Contact & FAQ' : 'Contact & FAQ'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: General Île-de-France Coverage Area Statement */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-light">
              {lang === 'fr' ? 'Zone d\'intervention' : 'Coverage Area'}
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-light shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">
                    {lang === 'fr' ? 'Région Île-de-France' : 'Île-de-France Region'}
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    {lang === 'fr'
                      ? 'Interventions sur mesure à domicile dans l\'ensemble de la région Île-de-France.'
                      : 'Operating tailored home services across the Île-de-France region.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-light">
              Contact
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent-light shrink-0" />
                <a href="tel:+33753829438" className="hover:underline transition-all">
                  +33 7 53 82 94 38
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent-light shrink-0" />
                <a href="mailto:handymaison.idf@gmail.com" className="hover:underline transition-all">
                  handymaison.idf@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Portal Link */}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} <span translate="no" className="notranslate">Handy Maison</span>.{' '}{lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors hover:underline"
              title="Portail d'administration"
            >
              <Lock className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Espace Admin' : 'Admin Portal'}</span>
            </Link>
            <span className="text-white/20">•</span>
            <p className="text-[11px]">
              {lang === 'fr' ? 'Paiement sécurisé par pré-autorisation Stripe' : 'Secure payment with Stripe pre-authorization'}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
