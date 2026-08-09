'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface TransformationPair {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  beforeImage: string;
  afterImage: string;
}

const GALLERY_PAIRS: TransformationPair[] = [
  {
    id: 'bed',
    title: {
      fr: 'Rangement & Réfection du Lit',
      en: 'Bed Making & Bedroom Styling',
    },
    description: {
      fr: 'Drapé impeccable, lits tirés au cordeau et harmonie parfaite de la chambre.',
      en: 'Crisp bed linen styling, neat folding, and serene bedroom presentation.',
    },
    beforeImage: '/gallery/bedbefore.jpg',
    afterImage: '/gallery/bedafter.jpg',
  },
  {
    id: 'fridge',
    title: {
      fr: 'Nettoyage & Rangement du Réfrigérateur',
      en: 'Refrigerator Sanitization & Organization',
    },
    description: {
      fr: 'Désinfection intégrale des clayettes, élimination des odeurs et tri des aliments.',
      en: 'Complete shelf sanitization, odor removal, and fresh food organization.',
    },
    beforeImage: '/gallery/fridgebefore.jpg',
    afterImage: '/gallery/fridgeafter.jpg',
  },
  {
    id: 'room',
    title: {
      fr: 'Organisation Complète du Séjour',
      en: 'Living Room Deep Clean & Declutter',
    },
    description: {
      fr: 'Dépoussiérage méticuleux, rangement du mobilier et éclat des surfaces.',
      en: 'Meticulous dusting, furniture organizing, and surface polishing.',
    },
    beforeImage: '/gallery/roombefore.jpg',
    afterImage: '/gallery/roomafter.jpg',
  },
  {
    id: 'sinkarea',
    title: {
      fr: 'Détartrage & Brillance de l\'Évier',
      en: 'Kitchen Sink & Basin Descaling',
    },
    description: {
      fr: 'Suppression du calcaire, nettoyage de la robinetterie et brillance miroir.',
      en: 'Limescale removal, chrome fixture polishing, and mirror finish.',
    },
    beforeImage: '/gallery/sinkareabefore.jpg',
    afterImage: '/gallery/sinkareaafter.jpg',
  },
  {
    id: 'table',
    title: {
      fr: 'Nettoyage & Organisation de la Table',
      en: 'Dining Table & Countertop Care',
    },
    description: {
      fr: 'Élimination des taches, rangement des objets et présentation soignée.',
      en: 'Stain removal, surface clearing, and elegant presentation.',
    },
    beforeImage: '/gallery/tablebefore.jpg',
    afterImage: '/gallery/tableafter.jpg',
  },
];

export default function Gallery() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('bed');

  const activePair = GALLERY_PAIRS.find((pair) => pair.id === activeTab) || GALLERY_PAIRS[0];

  return (
    <section className="py-20 bg-bgWarm border-t border-gray-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
            {lang === 'fr' ? 'Galerie Avant & Après' : 'Before & After Transformations'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
            {lang === 'fr' ? (
              <>La Signature <span translate="no" className="notranslate">Handy Maison</span> en Images</>
            ) : (
              <><span translate="no" className="notranslate">Handy Maison</span>{' '}Excellence in Pictures</>
            )}
          </h2>
          <p className="text-base text-charcoal-muted">
            {lang === 'fr'
              ? 'Découvrez les résultats concrets de nos interventions sur mesure dans les résidences parisiennes.'
              : 'Explore the tangible results of our tailored home interventions across Paris residences.'}
          </p>
        </div>

        {/* Fully Swipable Category Strip on Mobile */}
        <div className="flex items-center md:justify-center gap-2.5 mb-10 overflow-x-auto pb-4 pt-1 px-1 touch-pan-x scroll-smooth no-scrollbar">
          {GALLERY_PAIRS.map((pair) => (
            <button
              key={pair.id}
              onClick={() => setActiveTab(pair.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === pair.id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-charcoal-muted hover:text-primary border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pair.title[lang]}
            </button>
          ))}
        </div>

        {/* Transformation Card Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-200/80 max-w-5xl mx-auto">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-primary">
                {activePair.title[lang]}
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                {activePair.description[lang]}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-accent-light px-3 py-1.5 rounded-full text-primary text-xs font-medium self-start sm:self-auto">
              <ArrowLeftRight className="w-3.5 h-3.5 text-accent" />
              <span>{lang === 'fr' ? 'Comparez côte à côte' : 'Compare side by side'}</span>
            </div>
          </div>

          {/* Side-by-side Before / After Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEFORE Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                <span>{lang === 'fr' ? 'AVANT' : 'BEFORE'}</span>
                <span className="text-[10px] font-medium text-rose-600">
                  {lang === 'fr' ? 'État Initial' : 'Initial State'}
                </span>
              </div>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100">
                <Image
                  src={activePair.beforeImage}
                  alt={`${activePair.title[lang]} ${lang === 'fr' ? 'Avant' : 'Before'}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>

            {/* AFTER Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'fr' ? (
                    <>APRÈS <span translate="no" className="notranslate">HANDY MAISON</span></>
                  ) : (
                    <>AFTER <span translate="no" className="notranslate">HANDY MAISON</span></>
                  )}
                </span>
                <span className="text-[10px] font-medium text-emerald-600">
                  {lang === 'fr' ? 'Résultat Garanti' : 'Guaranteed Result'}
                </span>
              </div>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-emerald-200 bg-gray-100">
                <Image
                  src={activePair.afterImage}
                  alt={`${activePair.title[lang]} ${lang === 'fr' ? 'Après' : 'After'}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
