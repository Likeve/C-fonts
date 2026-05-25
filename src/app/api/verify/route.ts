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

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment is not configured" },
        { status: 503 }
      );
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // If unlimited plan, update user_plans in Supabase
      if (session.metadata?.plan === "unlimited" && session.metadata?.userId) {
        const supabase = await createClient();
        await supabase
          .from("user_plans")
          .upsert(
            {
              user_id: session.metadata.userId,
              plan: "unlimited",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
      }

      return NextResponse.json({ status: "paid", plan: session.metadata?.plan || "single" });
    }

    return NextResponse.json({ status: "unpaid" }, { status: 402 });
  } catch {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
