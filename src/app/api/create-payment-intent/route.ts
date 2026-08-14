import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { BookingSlotItem, CustomerDetails } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({ error: "Stripe key not configured" }, { status: 500 });
    }

    const { slots, customer }: { slots: BookingSlotItem[]; customer: CustomerDetails } = body;

    if (!slots || slots.length === 0) {
      return NextResponse.json({ error: 'No slots in itinerary' }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.email || !customer.jobDetails) {
      return NextResponse.json({ error: 'Missing mandatory customer or job details' }, { status: 400 });
    }

    const totalAmountEur = slots.reduce((acc, slot) => acc + slot.subtotal, 0);
    const amountInCents = Math.round(totalAmountEur * 100);

    const params = new URLSearchParams({
      amount: String(amountInCents),
      currency: 'eur',
      capture_method: 'manual',
      'payment_method_types[]': 'card',
      description: `Handy Maison itinerary (${slots.length} slots) for ${customer.name}`,
      'metadata[customer_name]': customer.name,
      'metadata[customer_email]': customer.email,
      'metadata[customer_phone]': customer.phone || '',
      'metadata[service_address]': customer.address,
      'metadata[job_details]': customer.jobDetails.substring(0, 500),
    });

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: paymentIntent.error?.message }, { status: 500 });
    }

    // Insert parent booking record into Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        service_address: customer.address,
        city: customer.city || 'Paris / Île-de-France',
        job_details: customer.jobDetails,
        total_amount: totalAmountEur,
        currency: 'EUR',
        status: 'pending_hold',
        stripe_payment_intent_id: paymentIntent.id,
        stripe_client_secret: paymentIntent.client_secret,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Supabase booking creation error:', bookingError);
      return NextResponse.json({ error: 'Failed to record booking in database' }, { status: 500 });
    }

    // Insert child booking slots into Supabase
    const slotRecords = slots.map((slot) => ({
      booking_id: booking.id,
      service_type: slot.serviceTypeId,
      service_name: slot.serviceName,
      date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
      duration_hours: slot.durationHours,
      hourly_rate: slot.hourlyRate,
      subtotal: slot.subtotal,
    }));

    const { error: slotsError } = await supabase
      .from('booking_slots')
      .insert(slotRecords);

    if (slotsError) {
      console.error('Supabase slots creation error:', slotsError);
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking.id
    });
  } catch (error: any) {
    console.error('Create PaymentIntent API Error:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
