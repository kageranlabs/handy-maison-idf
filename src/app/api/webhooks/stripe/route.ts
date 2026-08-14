import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const runtime = 'edge';

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  try {
    const pairs = signatureHeader.split(',').map(s => s.split('='));
    const t = pairs.find(p => p[0] === 't')?.[1];
    const v1 = pairs.find(p => p[0] === 'v1')?.[1];
    if (!t || !v1) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signedPayload = encoder.encode(`${t}.${payload}`);
    const signatureBytes = new Uint8Array(v1.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    return await crypto.subtle.verify('HMAC', key, signatureBytes, signedPayload);
  } catch (e) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(body);

    switch (event.type) {
      case 'payment_intent.requires_capture':
        await supabase.from('bookings').update({ status: 'pending_hold' }).eq('stripe_payment_intent_id', event.data.object.id);
        break;
      case 'payment_intent.succeeded':
        await supabase.from('bookings').update({ status: 'captured' }).eq('stripe_payment_intent_id', event.data.object.id);
        break;
      case 'payment_intent.canceled':
        await supabase.from('bookings').update({ status: 'declined' }).eq('stripe_payment_intent_id', event.data.object.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
