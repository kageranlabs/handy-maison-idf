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
    if (booking.stripe_payment_intent_id && booking.stripe_payment_intent_id.trim() !== '') {
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

    // Send cancellation email via Resend
    if (updated.customer_email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h2 style="color: #c0392b;">Demande de réservation refusée</h2>
          <p>Bonjour ${updated.customer_name},</p>
          <p>Nous sommes au regret de vous informer que nous ne pouvons pas honorer votre demande de réservation aux créneaux sélectionnés.</p>
          <p>L'empreinte bancaire et l'autorisation de paiement de <strong>${updated.total_amount} €</strong> ont été annulées et libérées. Aucun montant n'a été prélevé.</p>
          <p>Nous vous invitons à planifier de nouveaux créneaux sur notre site ou à nous contacter sur WhatsApp au <strong>+33 7 53 82 94 38</strong> pour trouver une solution.</p>
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
              subject: 'Mise à jour concernant votre réservation - Handy Maison',
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
    console.error('Decline booking API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
