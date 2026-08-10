'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import FaqSection from '@/components/FaqSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { lang } = useLanguage();

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('General Inquiry');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
    }, 800);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bgWarm">
      <Header />
      
      {/* Contact Page Header */}
      <div className="bg-primary text-white pt-12 pb-10 border-b border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light block">
            SUPPORT &amp; CONTACT
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            {lang === 'fr'
              ? 'À votre écoute 7j/7 en Île-de-France'
              : 'At Your Service 7 Days a Week in Île-de-France'}
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            {lang === 'fr'
              ? 'Une question sur votre pré-autorisation Stripe, vos créneaux d\'intervention ou nos prestations ? Nous sommes à votre entière disposition.'
              : 'Have a question about your Stripe pre-authorization hold, intervention slots, or services? We are here to assist you.'}
          </p>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <section className="py-12 bg-white border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Phone Option */}
            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Téléphone' : 'Phone'}
                </h3>
                <a href="tel:+33753829438" className="text-sm font-semibold text-charcoal hover:text-primary transition-colors block">
                  +33 7 53 82 94 38
                </a>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr' ? 'Du lundi au dimanche (8h-20h)' : 'Monday to Sunday (8am - 8pm)'}
                </p>
              </div>
            </div>

            {/* WhatsApp Option (Inserted directly between Phone and Email) */}
            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/33753829438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-charcoal hover:text-primary transition-colors block"
                >
                  +33 7 53 82 94 38
                </a>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr'
                    ? 'Écrivez-nous facilement sur WhatsApp'
                    : 'Reach out easily via WhatsApp'}
                </p>
              </div>
            </div>

            {/* Direct Email Option */}
            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Email Direct' : 'Direct Email'}
                </h3>
                <a href="mailto:handymaison.idf@gmail.com" className="text-sm font-semibold text-charcoal hover:underline block truncate max-w-[180px]">
                  handymaison.idf@gmail.com
                </a>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr' ? 'Réponse sous 2 heures ouvrées' : 'Response within 2 business hours'}
                </p>
              </div>
            </div>

            {/* Coverage Area Option */}
            <div className="p-6 rounded-3xl bg-bgWarm border border-gray-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-light text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-primary">
                  {lang === 'fr' ? 'Zone d\'Intervention' : 'Coverage Area'}
                </h3>
                <p className="text-sm font-semibold text-charcoal">
                  {lang === 'fr' ? 'Région Île-de-France' : 'Île-de-France Region'}
                </p>
                <p className="text-xs text-charcoal-muted">
                  {lang === 'fr'
                    ? 'Interventions à domicile dans toute la région Île-de-France'
                    : 'Operating across the Île-de-France region'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Feedback and Inquiries Contact Form Section (Immediately below FAQs) */}
      <section className="py-16 bg-white border-t border-gray-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bgWarm rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-card space-y-6">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
                {lang === 'fr' ? 'Formulaire de Contact' : 'Feedback & Inquiries'}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                {lang === 'fr' ? 'Une question ou une remarque ?' : 'Send Us a Message or Feedback'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
                {lang === 'fr'
                  ? 'Pour toute demande d\'information générale, suggestion ou retour d\'expérience, écrivez-nous ci-dessous. Notre équipe vous répondra dans les plus brefs délais.'
                  : 'For general inquiries, feedback, or suggestions, send us a message below. Our support team will get back to you promptly.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-heading font-bold text-base">
                  {lang === 'fr' ? 'Message envoyé avec succès !' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs text-emerald-700">
                  {lang === 'fr'
                    ? 'Merci pour votre message. Nous reviendrons vers vous rapidement.'
                    : 'Thank you for your feedback. We will get back to you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-primary underline hover:text-primary-dark"
                >
                  {lang === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      {lang === 'fr' ? 'Nom complet *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder={lang === 'fr' ? 'Ex: Marie Laurent' : 'E.g. Marie Laurent'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      {lang === 'fr' ? 'Adresse Email *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="marie.laurent@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    {lang === 'fr' ? 'Sujet / Motif de la demande *' : 'Subject / Topic *'}
                  </label>
                  <select
                    value={feedbackSubject}
                    onChange={(e) => setFeedbackSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                  >
                    <option value="General Inquiry">{lang === 'fr' ? 'Renseignement Général' : 'General Inquiry'}</option>
                    <option value="Service Feedback">{lang === 'fr' ? 'Retour d\'Expérience / Avis' : 'Service Feedback & Review'}</option>
                    <option value="Question about Rates">{lang === 'fr' ? 'Question sur les Tarifs' : 'Question About Rates'}</option>
                    <option value="Other">{lang === 'fr' ? 'Autre Demande' : 'Other Inquiries'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    {lang === 'fr' ? 'Votre Message *' : 'Your Message *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder={lang === 'fr' ? 'Rédigez votre message ou vos remarques ici...' : 'Type your message or feedback here...'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-primary text-white font-heading font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-accent-light" />
                  <span>{submitting ? (lang === 'fr' ? 'Envoi en cours...' : 'Sending...') : (lang === 'fr' ? 'Envoyer mon message' : 'Send Message')}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
