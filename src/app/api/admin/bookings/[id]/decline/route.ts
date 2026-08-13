import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  try {
    // Safety check before parsing JSON if body is present
    let body = {};
    const contentLength = req.headers.get('content-length');
    if (contentLength && contentLength !== '0') {
      try {
        body = await req.json();
      } catch (e) {
        console.warn('Empty or invalid body in decline booking POST request');
      }
    }

    const resolvedParams = await params;
    const bookingId = resolvedParams?.id || params?.id;

    // Fetch booking record
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Cancel the Stripe PaymentIntent hold if available
    if (booking.stripe_payment_intent_id) {
      try {
        await stripe.paymentIntents.cancel(booking.stripe_payment_intent_id);
      } catch (stripeErr: any) {
        console.warn('Stripe cancel warning (might already be canceled or in test mode):', stripeErr.message);
      }
    }

    // Update status in Supabase
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'declined' })
      .eq('id', bookingId)
      .select('*, slots:booking_slots(*)')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: updated });

  } catch (err: any) {
    console.error('Decline booking API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
