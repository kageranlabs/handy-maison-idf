import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Stripe webhook signature error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle specific Stripe events
  switch (event.type) {
    case 'payment_intent.requires_capture': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} authorized and requires capture (manual hold active).`);
      
      // Sync Supabase status if needed
      await supabase
        .from('bookings')
        .update({ status: 'pending_hold' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} captured successfully.`);
      
      // Update Supabase status to captured
      await supabase
        .from('bookings')
        .update({ status: 'captured' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} canceled.`);

      await supabase
        .from('bookings')
        .update({ status: 'declined' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled Stripe event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
