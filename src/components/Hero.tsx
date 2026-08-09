'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { dict } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 bg-gradient-to-b from-white via-bgWarm to-bgWarm">
      {/* Background Ambient Glow */}
      <div className="hero-glow -top-20 -left-20" />
      <div className="hero-glow top-40 -right-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Clean Editorial Eyebrow Tagline */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>{dict.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-[1.15]">
              {dict.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-charcoal-muted max-w-2xl font-normal leading-relaxed">
              {dict.hero.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2.5 bg-primary text-white font-semibold text-base px-7 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>{dict.hero.ctaBooking}</span>
                <ArrowRight className="w-4 h-4 text-accent-light" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white text-primary border border-gray-300 font-semibold text-base px-6 py-3.5 rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <span>{dict.hero.ctaServices}</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-8 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-charcoal-muted">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>{dict.hero.trustItem1}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span>{dict.hero.trustItem2}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{dict.hero.trustItem3}</span>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Image Card - Fast Local Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-card border border-white/60 bg-white p-3">
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/gallery/roomafter.jpg"
                  alt="Handy Maison Premium Home Services Paris"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 text-white bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading font-semibold text-sm">Service d'excellence</p>
                      <p className="text-xs text-white/80">Île-de-France (75, 92, 93, 94, 78)</p>
                    </div>
                    <span className="bg-amber-400 text-charcoal font-bold text-xs px-2.5 py-1 rounded-full">
                      4.9 ★★★★★
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
