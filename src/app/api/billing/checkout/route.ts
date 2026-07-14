import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Creates a Stripe Checkout session for a subscription with a 7-day trial.
 * Requires env vars:
 *   STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM
 * Without them the endpoint returns { url: null } and the client completes
 * the trial in demo mode.
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const body = (await req.json().catch(() => ({}))) as { plan?: string; email?: string };

  const priceId =
    body.plan === "team" ? process.env.STRIPE_PRICE_TEAM : process.env.STRIPE_PRICE_PRO;

  if (!key || !priceId) {
    return NextResponse.json({ url: null, demo: true });
  }

  const stripe = new Stripe(key);
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: body.email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?trial=started`,
    cancel_url: `${origin}/signup?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
