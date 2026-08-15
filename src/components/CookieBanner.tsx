'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DICTIONARY } from '@/lib/i18n/dict';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { lang } = useLanguage();
  const dict = DICTIONARY[lang]?.cookieBanner || DICTIONARY['fr'].cookieBanner;

  useEffect(() => {
    // Check localStorage after mount to avoid hydration mismatch
    const consent = localStorage.getItem('handymaison_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('handymaison_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('handymaison_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white rounded-2xl p-5 shadow-lg shadow-black/10 border border-gray-100 flex flex-col gap-4">
        <p className="text-sm text-charcoal/90 leading-relaxed font-medium">
          <span className="mr-2">🍪</span>
          {dict.message}
        </p>
        <div className="flex items-center gap-3 w-full sm:justify-end">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-charcoal bg-transparent border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {dict.decline}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm transition-colors"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
