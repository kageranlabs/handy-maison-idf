import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingStatus } from '@/lib/types';

export const runtime = 'edge';

function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdzzqywftsirghlpzsc.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function updateBookingByPaymentIntentId(
  supabaseAdmin: SupabaseClient,
  paymentIntentId: string,
  status: BookingStatus
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(`Failed to update booking for PI ${paymentIntentId}:`, error);
    return false;
  }

  if (!data) {
    console.warn(
      `No existing booking found for PI ${paymentIntentId}. ` +
      'Skipping insert to avoid duplicate rows — booking must be created by /api/create-payment-intent.'
    );
    return false;
  }

  return true;
}

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
    const supabaseAdmin = getSupabaseAdmin();
    const paymentIntentId = event.data?.object?.id as string | undefined;

    switch (event.type) {
      case 'payment_intent.amount_capturable_updated':
        if (paymentIntentId) {
          await updateBookingByPaymentIntentId(supabaseAdmin, paymentIntentId, 'pending_hold');
        }
        
        try {
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey) {
            const customerEmail = event.data.object.metadata?.customer_email;
            
            // 1. Email to Client
            if (customerEmail) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'Handy Maison <joy@handymaison.fr>',
                  to: customerEmail,
                  subject: 'Demande reçue / Request received',
                  html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                      <h2>Demande reçue !</h2>
                      <p>Merci d'avoir choisi Handy Maison. Nous traitons votre demande et vous contacterons très rapidement. Une réservation temporaire a été effectuée sur votre carte pour garantir votre créneau (aucun montant n'est débité pour le moment).</p>
                      <hr />
                      <h2>Request received!</h2>
                      <p>Thank you for choosing Handy Maison. Your request is being reviewed and we will be in touch shortly. A temporary pre-authorization has been placed on your card to hold your time slot (no funds have been debited).</p>
                    </div>
                  `
                }),
              });
            }

            // 2. Email to Admin
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Handy Maison <joy@handymaison.fr>',
                to: 'handymaison.idf@gmail.com',
                subject: '🚨 Booking request!',
                html: `
                  <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #047857;">New Booking Hold Requires Approval</h2>
                    <p>A client has requested a new itinerary and successfully authorized a Stripe hold.</p>
                    <p>Please review the request and either accept or decline the hold within the admin dashboard:</p>
                    <div style="margin-top: 24px;">
                      <a href="https://handymaison.fr/admin" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Open Admin Dashboard
                      </a>
                    </div>
                  </div>
                `
              }),
            });
          }
        } catch (mailErr) {
          console.error('Failed to send emails:', mailErr);
        }
        break;
      case 'payment_intent.succeeded':
        if (paymentIntentId) {
          await updateBookingByPaymentIntentId(supabaseAdmin, paymentIntentId, 'captured');
        }
        
        try {
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey) {
            const customerEmail = event.data.object.metadata?.customer_email;
            if (customerEmail) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'Handy Maison <joy@handymaison.fr>',
                  to: customerEmail,
                  subject: 'Réservation confirmée / Booking confirmed',
                  html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                      <h2>Réservation confirmée !</h2>
                      <p>Votre réservation a été acceptée et votre carte a été débitée avec succès. Nous avons hâte de vous servir !</p>
                      <hr />
                      <h2>Booking confirmed!</h2>
                      <p>Your booking has been accepted and your card was successfully charged. We look forward to serving you!</p>
                    </div>
                  `
                }),
              });
            }
          }
        } catch (mailErr) {
          console.error('Failed to send accepted email:', mailErr);
        }
        break;
      case 'payment_intent.canceled':
        if (paymentIntentId) {
          await updateBookingByPaymentIntentId(supabaseAdmin, paymentIntentId, 'declined');
        }
        
        try {
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey) {
            const customerEmail = event.data.object.metadata?.customer_email;
            if (customerEmail) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'Handy Maison <joy@handymaison.fr>',
                  to: customerEmail,
                  subject: 'Réservation annulée / Booking canceled',
                  html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                      <h2>Réservation annulée</h2>
                      <p>Votre demande de réservation n'a pas pu être satisfaite à cette date. La pré-autorisation sur votre carte a été intégralement libérée, aucun montant n'a été débité.</p>
                      <hr />
                      <h2>Booking canceled</h2>
                      <p>We could not accommodate your booking request at this time. The hold on your card has been fully released, and you have not been charged.</p>
                    </div>
                  `
                }),
              });
            }
          }
        } catch (mailErr) {
          console.error('Failed to send canceled email:', mailErr);
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
