'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DICTIONARY } from '@/lib/i18n/dict';

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const { lang } = useLanguage();
  const dict = DICTIONARY[lang];

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-gray-200/80 max-w-lg w-full space-y-6 text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-[bounce_1s_ease-in-out_2.5]">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
          {dict.checkout.successTitle}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted max-w-md mx-auto leading-relaxed">
          {dict.checkout.successMessage}
          <strong className="text-primary font-bold"> {amount} € </strong>
          {dict.checkout.successMessage2}
        </p>
      </div>

      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 text-left space-y-4">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {dict.bookingSuccess.nextStepsTitle}
        </h4>
        <ul className="text-xs text-charcoal-muted space-y-3">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>{dict.bookingSuccess.step1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span>{dict.bookingSuccess.step2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
            <span><strong className="text-charcoal font-semibold">{dict.bookingSuccess.step3Prefix}</strong>{dict.bookingSuccess.step3Text}</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Link 
          href="/"
          className="w-full py-3.5 px-6 bg-primary text-white font-heading font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.bookingSuccess.backHome}</span>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-bgWarm flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-3xl p-10 shadow-card border border-gray-200/80 max-w-md w-full flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
