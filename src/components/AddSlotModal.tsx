'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useItinerary } from '@/context/ItineraryContext';
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface AddSlotModalProps {
  service: ServiceDefinition | null;
  onClose: () => void;
}

export default function AddSlotModal({ service, onClose }: AddSlotModalProps) {
  const { lang, dict } = useLanguage();
  const { addSlot } = useItinerary();

  // Get tomorrow's date string (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(minDateStr);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [durationHours, setDurationHours] = useState<number>(2); // Minimum 2 hours enforced

  if (!service) return null;

  const hourlyRate = service.hourlyRate;
  const subtotal = durationHours * hourlyRate;

  // Calculate end time
  const [startH, startM] = startTime.split(':').map(Number);
  const endH = startH + durationHours;
  const endTime = `${endH < 10 ? '0' : ''}${endH}:${startM < 10 ? '0' : ''}${startM}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSlot({
      serviceTypeId: service.id,
      serviceName: service.name[lang],
      date,
      startTime,
      endTime,
      durationHours,
      hourlyRate,
      subtotal,
    });
    onClose();
  };

  const getHoursText = (h: number) => {
    if (lang === 'fr') {
      if (h === 2) return '2 heures (Min)';
      if (h === 8) return '8 heures (Journée)';
      return `${h} heures`;
    } else {
      if (h === 2) return '2 hours (Min)';
      if (h === 8) return '8 hours (Full day)';
      return `${h} hours`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 text-charcoal hover:bg-gray-200 flex items-center justify-center transition-colors"
          title={dict.servicesSection.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-accent-light text-primary text-xs font-semibold rounded-full mb-2">
            {service.name[lang]} • {hourlyRate}€{dict.servicesSection.ratePerHour}
          </span>
          <h3 className="font-heading text-2xl font-bold text-primary">
            {dict.servicesSection.addSlotModalTitle}
          </h3>
          <p className="text-xs text-charcoal-muted mt-1">
            {dict.servicesSection.minDuration}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Service Date */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              {dict.servicesSection.dateLabel}
            </label>
            <input
              type="date"
              min={minDateStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
            />
          </div>

          {/* Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {dict.servicesSection.startTimeLabel}
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
              >
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>

            {/* Duration (Minimum 2 Hours Enforced) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {dict.servicesSection.durationLabel}
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
              >
                <option value={2}>{getHoursText(2)}</option>
                <option value={3}>{getHoursText(3)}</option>
                <option value={4}>{getHoursText(4)}</option>
                <option value={5}>{getHoursText(5)}</option>
                <option value={6}>{getHoursText(6)}</option>
                <option value={8}>{getHoursText(8)}</option>
              </select>
            </div>
          </div>

          {/* Time Slot Summary Box */}
          <div className="p-4 rounded-2xl bg-bgWarm border border-gray-200/80 flex items-center justify-between text-sm">
            <div>
              <span className="text-xs text-charcoal-muted block">
                {lang === 'fr' ? 'Créneau calculé :' : 'Calculated slot:'}
              </span>
              <span className="font-semibold text-primary">
                {startTime} - {endTime} ({durationHours}h)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-charcoal-muted block">{dict.servicesSection.subtotalLabel} :</span>
              <span className="font-heading font-bold text-lg text-primary">
                {subtotal} €
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-accent-light" />
            <span>{dict.servicesSection.confirmAddSlot}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
