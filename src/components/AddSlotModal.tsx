'use client';

import React, { useState, useEffect } from 'react';
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
  const [durationHours, setDurationHours] = useState<number>(2);
  const [isAdded, setIsAdded] = useState(false);

  // Compute start hour and max available hours so end time never exceeds 23:00 operating limit
  const [startH, startM] = (startTime || '09:00').split(':').map((v) => parseInt(v, 10) || 0);
  const maxAvailableHours = Math.min(8, Math.max(2, 23 - startH));

  // Auto-clamp durationHours if startTime is changed to a late hour that exceeds 23:00 operating time
  useEffect(() => {
    if (durationHours > maxAvailableHours) {
      setDurationHours(maxAvailableHours);
    }
  }, [startTime, maxAvailableHours, durationHours]);

  if (!service) return null;

  const hourlyRate = Number(service.hourlyRate) || 0;
  const numDuration = Number(durationHours) || 2;
  const subtotal = numDuration * hourlyRate;

  // Dynamically calculate end time from startTime + numDuration
  const endH = startH + numDuration;
  const formattedEndH = endH < 10 ? `0${endH}` : `${endH}`;
  const formattedStartM = startM < 10 ? `0${startM}` : `${startM}`;
  const endTime = `${formattedEndH}:${formattedStartM}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSlot({
      serviceTypeId: service.id,
      serviceName: service.name[lang],
      date,
      startTime,
      endTime,
      durationHours: numDuration,
      hourlyRate,
      subtotal,
    });
    setIsAdded(true);
    setTimeout(() => {
      onClose();
      setIsAdded(false);
    }, 1500);
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

  const startTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const durationOptions = [2, 3, 4, 5, 6, 8].filter((h) => h <= maxAvailableHours);

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

          {/* Start Time & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {dict.servicesSection.startTimeLabel}
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                translate="no"
                className="notranslate w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
              >
                {startTimes.map((t) => (
                  <option key={t} value={t} translate="no" className="notranslate">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {dict.servicesSection.durationLabel}
              </label>
              <select
                value={String(durationHours)}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
              >
                {durationOptions.map((h) => (
                  <option key={h} value={String(h)}>
                    {getHoursText(h)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Summary Box (Defensive DOM isolation for browser translation extensions) */}
          <div className="p-4 rounded-2xl bg-bgWarm border border-gray-200/80 flex items-center justify-between text-sm">
            <div>
              <span className="text-xs text-charcoal-muted block">
                {lang === 'fr' ? 'Créneau calculé :' : 'Calculated slot:'}
              </span>
              <span translate="no" className="notranslate font-semibold text-primary">
                <span>{startTime}</span> - <span>{endTime}</span> (<span>{numDuration}</span> <span translate="yes">{lang === 'fr' ? 'heures' : 'hours'}</span>)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-charcoal-muted block">{dict.servicesSection.subtotalLabel} :</span>
              <span translate="no" className="notranslate font-heading font-bold text-lg text-primary">
                <span>{subtotal}</span> €
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAdded}
            className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
              isAdded ? 'bg-emerald-500 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            <CheckCircle2 className={`w-5 h-5 ${isAdded ? 'text-white' : 'text-accent-light'}`} />
            <span>{isAdded ? dict.servicesSection.addedSlot : dict.servicesSection.confirmAddSlot}</span>
          </button>

        </form>
      </div>
    </div>
  );
}