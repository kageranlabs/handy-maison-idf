import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Verify Stripe webhook signature using the Web Crypto API (Edge-native).
 * Stripe signs webhooks with HMAC-SHA256: "t=<timestamp>,v1=<signature>"
 */
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<{ verified: boolean; event?: any }> {
  const parts = sigHeader.split(',');
  const timestamp = parts.find((p) => p.startsWith('t='))?.slice(2);
  const signature = parts.find((p) => p.startsWith('v1='))?.slice(3);

  if (!timestamp || !signature) {
    return { verified: false };
  }

  // Stripe signs: "<timestamp>.<payload>"
  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );

  // Convert to hex
  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Timing-safe comparison: compare all chars even on mismatch
  if (expectedSignature.length !== signature.length) {
    return { verified: false };
  }
  let mismatch = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    mismatch |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return { verified: false };
  }

  // Reject if timestamp is older than 5 minutes (tolerance window)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
    return { verified: false };
  }

  return { verified: true, event: JSON.parse(payload) };
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const result = await verifyStripeSignature(body, signature, webhookSecret);
      if (!result.verified) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
      event = result.event;
    } else {
      // Fallback for development without webhook secret
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Stripe webhook signature error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Lazy instantiate Supabase admin client inside POST
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdzzqywftsirghlpzsc.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Handle specific Stripe events
  switch (event.type) {
    case 'payment_intent.requires_capture': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} authorized and requires capture (manual hold active).`);
      
      // Sync Supabase status if needed
      await supabaseAdmin
        .from('bookings')
        .update({ status: 'pending_hold' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} captured successfully.`);
      
      // Update Supabase status to captured
      await supabaseAdmin
        .from('bookings')
        .update({ status: 'captured' })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      break;
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} canceled.`);

      await supabaseAdmin
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
