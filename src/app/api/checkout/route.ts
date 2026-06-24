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

    const isUnlimited = plan === "unlimited";

    if (!isUnlimited && !fontId) {
      return NextResponse.json({ error: "Missing fontId" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const resolvedFontId = fontId || "unlimited-plan";
    const resolvedFontName = fontName || "All Fonts";

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
                : `${resolvedFontName}`,
              description: isUnlimited
                ? "Unlimited Chinese font downloads forever"
                : `Chinese font: ${resolvedFontName}`,
            },
            unit_amount: isUnlimited ? 299 : 99,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        fontId: resolvedFontId,
        fontName: resolvedFontName,
        plan: isUnlimited ? "unlimited" : "single",
      },
      success_url: isUnlimited
        ? `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=unlimited`
        : `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&font=${encodeURIComponent(resolvedFontId)}`,
      cancel_url: isUnlimited
        ? SITE_URL
        : `${SITE_URL}/fonts/${encodeURIComponent(resolvedFontId)}`,
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
