import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = body.amount || 10000;
    const currency = body.currency || 'eur';
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({ error: "Stripe key not configured" }, { status: 500 });
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(amount),
        currency: currency,
        'payment_method_types[]': 'card',
      }).toString(),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: paymentIntent.error?.message }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
