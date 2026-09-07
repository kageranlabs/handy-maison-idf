'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bgWarm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 sm:p-16 shadow-card border border-gray-200/80 max-w-lg w-full text-center space-y-6 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

        {/* 404 Number */}
        <div className="font-heading text-8xl sm:text-9xl font-bold text-primary/10 leading-none select-none">
          404
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
            Page Non Trouvée
          </h1>
          <p className="text-sm text-charcoal-muted font-medium">Page Not Found</p>
        </div>

        {/* Body copy */}
        <p className="text-sm text-charcoal-muted leading-relaxed max-w-sm mx-auto">
          La page que vous recherchez n&rsquo;existe pas ou a été déplacée.
          <br />
          <span className="text-xs">The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</span>
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 w-full justify-center py-3.5 px-6 bg-primary text-white font-heading font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&rsquo;accueil / Back to Home
        </Link>
      </div>
    </div>
  );
}
