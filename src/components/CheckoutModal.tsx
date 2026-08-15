'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useItinerary } from '@/context/ItineraryContext';
import { X, Lock, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51TzxixCEcwNoKSpjn3EPNPWN8TFjpvLorqZdCX9EtO3GpXF94iIuPnm5jMnmAnbJ0LzNOCnxR4IteuEqGJJh6uyS008dFGgvBn'
);

interface CheckoutModalProps {
  onClose: () => void;
}

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { dict } = useLanguage();
  const { slots, totalHoldAmount, clearSlots } = useItinerary();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Paris (75)');
  const [jobDetails, setJobDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!jobDetails.trim()) {
      setErrorMsg(dict.checkout.jobDetailsNotice);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Call server API to create payment intent with manual hold
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slots,
          customer: {
            name,
            email,
            phone,
            address,
            city,
            jobDetails,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize payment intent');
      }

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not loaded');
      }

      // 2. Confirm card authorization hold on client
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            phone,
            address: {
              line1: address,
              city: city,
              country: 'FR',
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment authorization failed');
      }

      if (paymentIntent && (paymentIntent.status === 'requires_capture' || paymentIntent.status === 'succeeded')) {
        clearSlots();
        window.location.href = `/booking-success?amount=${totalHoldAmount}`;
      } else {
        clearSlots();
        window.location.href = `/booking-success?amount=${totalHoldAmount}`;
      }

    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during authorization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-charcoal mb-1">
            {dict.checkout.nameLabel} *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.checkout.namePlaceholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-charcoal mb-1">
            {dict.checkout.emailLabel} *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.checkout.emailPlaceholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-charcoal mb-1">
            {dict.checkout.phoneLabel} *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={dict.checkout.phonePlaceholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-charcoal mb-1">
            {dict.checkout.cityLabel}
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={dict.checkout.cityPlaceholder}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-charcoal mb-1">
          {dict.checkout.addressLabel} *
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={dict.checkout.addressPlaceholder}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium"
        />
      </div>

      {/* MANDATORY JOB DETAILS / SPECIAL INSTRUCTIONS TEXTAREA */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-semibold text-primary flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            {dict.checkout.jobDetailsLabel}
          </label>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
            Obligatoire
          </span>
        </div>
        <textarea
          required
          rows={2}
          value={jobDetails}
          onChange={(e) => setJobDetails(e.target.value)}
          placeholder={dict.checkout.jobDetailsPlaceholder}
          className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium bg-amber-50/20"
        />
      </div>

      {/* Stripe Payment Element */}
      <div className="pt-1">
        <label className="block text-[11px] font-semibold text-charcoal mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            {dict.checkout.paymentHeader}
          </span>
        </label>

        <div className="p-3 rounded-xl border border-gray-300 bg-white shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '13px',
                  color: '#1C1C1C',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': {
                    color: '#999999',
                  },
                },
                invalid: {
                  color: '#DC2626',
                },
              },
            }}
          />
        </div>

        <div className="mt-1.5 p-2 rounded-xl bg-accent-light/60 text-[10px] sm:text-[11px] text-primary font-medium flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-accent mt-0.5" />
          <span>
            {dict.checkout.paymentNotice} <strong>{totalHoldAmount} €</strong>.
            {dict.checkout.paymentNotice2}
          </span>
        </div>
      </div>

      {/* Submit & Cancel Buttons */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-1/3 py-3 px-3 bg-gray-100 text-charcoal font-semibold text-xs rounded-xl hover:bg-gray-200 transition-all text-center"
        >
          {dict.checkout.cancelButton}
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-2/3 py-3 px-5 bg-primary text-white font-heading font-bold text-xs sm:text-sm rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-accent-light" />
          <span>{loading ? dict.checkout.processing : `${dict.checkout.submitButton} (${totalHoldAmount} €)`}</span>
        </button>
      </div>

    </form>
  );
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { dict } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative border border-gray-100 my-4 max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-charcoal hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="Fermer"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4 pr-6">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">
            {dict.checkout.modalTitle}
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {dict.checkout.subtitle}
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm onClose={onClose} />
        </Elements>

      </div>
    </div>
  );
}
