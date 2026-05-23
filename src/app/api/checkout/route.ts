import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "");
  }
  return stripeInstance;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fontId, fontName } = body;

    if (!fontId) {
      return NextResponse.json({ error: "Missing fontId" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: fontName || fontId,
              description: `Chinese font: ${fontName || fontId}`,
            },
            unit_amount: 199,
          },
          quantity: 1,
        },
      ],
      metadata: {
        fontId,
        fontName: fontName || fontId,
      },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&font=${encodeURIComponent(fontId)}`,
      cancel_url: `${SITE_URL}/fonts/${encodeURIComponent(fontId)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
