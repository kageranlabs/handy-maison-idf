export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BookingSlotItem, CustomerDetails } from '@/lib/types';

export async function POST(req: Request) {
  try {
    // Lazy instantiate Supabase client inside POST to guarantee process.env context is active
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdzzqywftsirghlpzsc.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nbPnc2oCUc6yqWAdfsiEqA_lwZwL1H5';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { slots, customer }: { slots: BookingSlotItem[]; customer: CustomerDetails } = body;

    if (!slots || slots.length === 0) {
      return NextResponse.json({ error: 'No slots in itinerary' }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.email || !customer.jobDetails) {
      return NextResponse.json({ error: 'Missing mandatory customer or job details' }, { status: 400 });
    }

    // Calculate aggregated total amount in cents for Stripe (e.g. 70€ = 7000 cents)
    const totalAmountEur = slots.reduce((acc, slot) => acc + slot.subtotal, 0);
    const amountInCents = Math.round(totalAmountEur * 100);

    // Call Stripe PaymentIntent API via native fetch to prevent Edge polyfill crash
    const stripeParams = new URLSearchParams();
    stripeParams.append('amount', String(amountInCents));
    stripeParams.append('currency', 'eur');
    stripeParams.append('capture_method', 'manual');
    stripeParams.append('description', `Handy Maison itinerary (${slots.length} slots) for ${customer.name}`);
    stripeParams.append('metadata[customer_name]', customer.name);
    stripeParams.append('metadata[customer_email]', customer.email);
    if (customer.phone) {
      stripeParams.append('metadata[customer_phone]', customer.phone);
    }
    stripeParams.append('metadata[service_address]', customer.address);
    stripeParams.append('metadata[job_details]', customer.jobDetails.substring(0, 500));

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY || ''}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: stripeParams.toString(),
    });

    if (!stripeRes.ok) {
      const stripeErr = await stripeRes.json();
      console.error('Stripe API HTTP error response:', stripeErr);
      throw new Error(stripeErr.error?.message || 'Failed to create payment intent via Stripe API fetch');
    }

    const paymentIntent = await stripeRes.json();

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
      bookingId: booking.id,
    });

  } catch (error: any) {
    console.error('Create PaymentIntent API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment intent failed" }, { status: 500 });
  }
}
