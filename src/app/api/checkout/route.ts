import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { fontId, fontName, plan } = body;

    if (!fontId) {
      return NextResponse.json({ error: "Missing fontId" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const isUnlimited = plan === "unlimited";

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: isUnlimited
                ? "全网永久无限制下载"
                : `${fontName || fontId}`,
              description: isUnlimited
                ? "Unlimited Chinese font downloads forever"
                : `Chinese font: ${fontName || fontId}`,
            },
            unit_amount: isUnlimited ? 799 : 199,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        fontId,
        fontName: fontName || fontId,
        plan: isUnlimited ? "unlimited" : "single",
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
