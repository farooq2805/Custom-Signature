import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Stripe webhook: keeps `users.plan` in sync with subscription state.
 * Configure the endpoint in Stripe with STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ ok: true, demo: true });

  const stripe = new Stripe(key);
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const active = ["active", "trialing"].includes(sub.status);
      if (admin) {
        await admin
          .from("users")
          .update({ plan: active ? "pro" : "free" })
          .eq("stripe_customer_id", sub.customer as string);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (admin) {
        await admin
          .from("users")
          .update({ plan: "free" })
          .eq("stripe_customer_id", sub.customer as string);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
