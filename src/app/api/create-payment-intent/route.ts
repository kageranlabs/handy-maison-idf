import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Defaulting to 100 EUR hold (10000 cents) if not provided by the frontend
    const amount = body.amount || 10000;
    const currency = body.currency || 'eur';

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is not configured in the environment.");
    }

    // Form-encode the payload for the Stripe REST API
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    params.append('currency', currency);
    params.append('capture_method', 'manual');

    // Make a pure, Edge-native fetch request directly to Stripe
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const paymentIntent = await stripeResponse.json();

    if (!stripeResponse.ok) {
       throw new Error(paymentIntent.error?.message || "Failed to create Stripe payment intent");
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });

  } catch (error: any) {
    console.error("Edge Checkout Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
