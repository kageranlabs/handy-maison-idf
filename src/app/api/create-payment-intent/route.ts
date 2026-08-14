import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { BookingSlotItem, CustomerDetails } from '@/lib/types';

export async function POST(req: Request) {
  try {
    // 1. Lazy instantiate Stripe client inside POST to guarantee process.env context is active
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-01-27.acacia' as any,
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 2. Lazy instantiate Supabase client inside POST
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

    // Create Stripe PaymentIntent with capture_method: 'manual'
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      capture_method: 'manual', // Enforces pre-authorization hold
      description: `Handy Maison itinerary (${slots.length} slots) for ${customer.name}`,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        service_address: customer.address,
        job_details: customer.jobDetails.substring(0, 500),
      },
    });

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
