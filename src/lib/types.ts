export type ServiceTypeId = 'cleaning' | 'ironing' | 'cooking' | 'shopping' | 'errands' | 'babysitting';

export type BookingStatus = 'pending_hold' | 'captured' | 'declined' | 'cancelled';

export type Language = 'fr' | 'en';

export interface ServiceDefinition {
  id: ServiceTypeId;
  hourlyRate: number; // in EUR
  minHours: number; // minimum 2 hours
  image: string;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  highlights: {
    fr: string[];
    en: string[];
  };
}

export interface BookingSlotItem {
  id: string;
  serviceTypeId: ServiceTypeId;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  jobDetails: string; // Mandatory job instructions / notes
}

export interface BookingRecord {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_address: string;
  city: string;
  job_details: string;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  stripe_payment_intent_id?: string;
  stripe_client_secret?: string;
  slots?: BookingSlotRecord[];
}

export interface BookingSlotRecord {
  id: string;
  booking_id: string;
  service_type: string;
  service_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  hourly_rate: number;
  subtotal: number;
  created_at?: string;
}
