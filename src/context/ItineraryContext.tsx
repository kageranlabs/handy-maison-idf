'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingSlotItem } from '@/lib/types';

interface ItineraryContextType {
  slots: BookingSlotItem[];
  addSlot: (slot: Omit<BookingSlotItem, 'id'>) => void;
  removeSlot: (id: string) => void;
  clearSlots: () => void;
  totalHoldAmount: number;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider = ({ children }: { children: React.ReactNode }) => {
  const [slots, setSlots] = useState<BookingSlotItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('handy_maison_itinerary');
      if (saved) {
        setSlots(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load itinerary from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('handy_maison_itinerary', JSON.stringify(slots));
    } catch (e) {
      console.error('Failed to save itinerary to localStorage', e);
    }
  }, [slots]);

  const addSlot = (newSlotData: Omit<BookingSlotItem, 'id'>) => {
    const id = 'slot_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const newSlot: BookingSlotItem = {
      ...newSlotData,
      id,
    };
    setSlots((prev) => [...prev, newSlot]);
  };

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const clearSlots = () => {
    setSlots([]);
  };

  const totalHoldAmount = slots.reduce((acc, slot) => acc + slot.subtotal, 0);

  return (
    <ItineraryContext.Provider value={{ slots, addSlot, removeSlot, clearSlots, totalHoldAmount }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};
