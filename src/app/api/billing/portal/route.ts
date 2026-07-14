import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Opens the Stripe customer portal (plan changes, payment method, cancel).
 * In production the customer id comes from the authenticated user's
 * `users.stripe_customer_id`; demo mode returns { url: null }.
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const customerId = req.headers.get("x-stripe-customer"); // set by auth middleware in production

  if (!key || !customerId) {
    return NextResponse.json({ url: null, demo: true });
  }

  const stripe = new Stripe(key);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${req.nextUrl.origin}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
