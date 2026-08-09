'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useItinerary } from '@/context/ItineraryContext';
import { ShoppingBag, Globe, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, dict } = useLanguage();
  const { slots, totalHoldAmount } = useItinerary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  const slotsCount = slots.length;

  const isActiveRoute = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const getNavLinkClass = (path: string) => {
    const active = isActiveRoute(path);
    return active
      ? 'text-primary font-bold border-b-2 border-primary pb-0.5 transition-all'
      : 'text-charcoal font-semibold hover:text-primary transition-colors pb-0.5';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Prominent Logo on the Left Side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group py-1">
              <Image
                src="/logo2.png"
                alt="Handy Maison Logo"
                width={200}
                height={65}
                priority
                className="object-contain h-14 sm:h-16 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation Links with Active Underline Indicator */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className={getNavLinkClass('/')}>
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <Link href="/services" className={getNavLinkClass('/services')}>
                {dict.nav.services}
              </Link>
              <Link href="/contact" className={getNavLinkClass('/contact')}>
                Contact & FAQ
              </Link>
            </nav>
          </div>

          {/* Right: Language Switcher, Itinerary Cart & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            
            {/* Robust Language Switcher Button with translate="no" */}
            <button
              onClick={toggleLanguage}
              translate="no"
              className="notranslate flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bgWarm hover:bg-accent-light text-xs font-bold text-primary transition-colors border border-gray-200"
              title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
            >
              <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="notranslate uppercase tracking-wider">{lang === 'fr' ? 'FR' : 'EN'}</span>
            </button>

            {/* Itinerary Cart CTA Button with Floating Badge */}
            <Link
              href="/book"
              className="relative inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-primary-dark transition-all shadow-md active:scale-95"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-accent-light" />
                {slotsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white font-bold text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                    {slotsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">{dict.nav.itinerary}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-charcoal hover:bg-gray-100 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu with Active Indicator */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-4 pb-6 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-3 font-heading font-semibold text-base text-primary">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl transition-colors flex items-center justify-between ${
                isActiveRoute('/') ? 'bg-accent-light text-primary font-bold' : 'hover:bg-bgWarm'
              }`}
            >
              <span>{lang === 'fr' ? 'Accueil' : 'Home'}</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>

            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl transition-colors flex items-center justify-between ${
                isActiveRoute('/services') ? 'bg-accent-light text-primary font-bold' : 'hover:bg-bgWarm'
              }`}
            >
              <span>{dict.nav.services}</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl transition-colors flex items-center justify-between ${
                isActiveRoute('/contact') ? 'bg-accent-light text-primary font-bold' : 'hover:bg-bgWarm'
              }`}
            >
              <span>Contact & FAQ</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Link>
          </nav>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Stripe Manual Hold</span>
            </div>
            <button
              onClick={toggleLanguage}
              translate="no"
              className="notranslate flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-light text-primary font-bold text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span className="notranslate">{lang === 'fr' ? 'English (EN)' : 'Français (FR)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
