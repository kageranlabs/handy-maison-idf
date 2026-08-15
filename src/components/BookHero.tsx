'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DICTIONARY } from '@/lib/i18n/dict';

export default function BookHero() {
  const { lang } = useLanguage();
  const dict = DICTIONARY[lang];

  return (
    <div className="bg-primary text-white pt-12 pb-10 border-b border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-light bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
          {dict.bookHero.eyebrow}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold">
          {dict.bookHero.title}
        </h1>
        <p className="text-sm text-white/80 leading-relaxed">
          {dict.bookHero.description}
        </p>
      </div>
    </div>
  );
}
