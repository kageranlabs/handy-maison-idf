export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  req: Request,
  { params }: { params: any }
) {
  try {
    // Lazy instantiate Supabase admin client inside POST
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtdzzqywftsirghlpzsc.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Safety check before parsing JSON if body is present
    let body = {};
    const contentLength = req.headers.get('content-length');
    if (contentLength && contentLength !== '0') {
      try {
        body = await req.json();
      } catch (e) {
        console.warn('Empty or invalid body in accept booking POST request');
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

    if (booking.status === 'captured') {
      return NextResponse.json({ error: 'Booking hold is already captured' }, { status: 400 });
    }

    // Capture the Stripe PaymentIntent hold if available
    if (booking.stripe_payment_intent_id && booking.stripe_payment_intent_id.trim() !== '') {
      const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${booking.stripe_payment_intent_id}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        console.error("Stripe Capture Error:", errorData);
        throw new Error("Failed to capture payment in Stripe.");
      }
    }

    // Update status in Supabase
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'captured' })
      .eq('id', bookingId)
      .select('*, slots:booking_slots(*)')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }

    // Send confirmation email via Resend
    if (updated.customer_email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h2 style="color: #0d5c3a;">Votre réservation est confirmée !</h2>
          <p>Bonjour ${updated.customer_name},</p>
          <p>Nous avons le plaisir de vous informer que votre demande de réservation a été acceptée et confirmée.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Détails de la réservation :</h3>
            <p><strong>Adresse d'intervention :</strong> ${updated.service_address}, ${updated.city}</p>
            <p><strong>Montant capturé :</strong> ${updated.total_amount} €</p>
            <p><strong>Instructions spéciales :</strong> ${updated.job_details}</p>
          </div>
          <p>Notre équipe interviendra conformément aux créneaux planifiés.</p>
          <p>Si vous avez des questions, contactez-nous directement sur WhatsApp au <strong>+33 7 53 82 94 38</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Handy Maison Île-de-France</p>
        </div>
      `;
      
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: 'Handy Maison <noreply@handymaison.fr>',
              to: [updated.customer_email],
              subject: 'Confirmation de votre réservation - Handy Maison',
              html: emailHtml,
            }),
          });
        } catch (mailErr) {
          console.error('Failed to send Resend email:', mailErr);
        }
      }
    }

    return NextResponse.json({ success: true, booking: updated });

  } catch (err: any) {
    console.error('Accept booking API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
