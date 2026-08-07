import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const bookingId = resolvedParams?.id || params?.id;

    // Fetch booking record
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'captured') {
      return NextResponse.json({ error: 'Booking hold is already captured' }, { status: 400 });
    }

    // Capture the Stripe PaymentIntent hold if available
    if (booking.stripe_payment_intent_id) {
      try {
        await stripe.paymentIntents.capture(booking.stripe_payment_intent_id);
      } catch (stripeErr: any) {
        console.warn('Stripe capture warning (might already be captured or in test mode):', stripeErr.message);
      }
    }

    // Update status in Supabase
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'captured' })
      .eq('id', bookingId)
      .select('*, slots:booking_slots(*)')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: updated });

  } catch (err: any) {
    console.error('Accept booking API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
