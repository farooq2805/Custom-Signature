# SigCraft — Interactive Email Signature Platform

Animated, interactive email signatures that are **hosted, verified, and measured**.
Every signature ships with a tracked CTA ("Book a Demo"), an interactive social nav,
a verification badge, and analytics that surface the loop:
**impressions → clicks → booked demos**.

## Stack

- **Next.js 15 (App Router) + TypeScript**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`) + **Framer Motion**
- **Supabase** (Postgres + Auth + Storage) — optional; full demo mode without it
- **Stripe** subscriptions with 7-day trial — optional; demo mode without it
- **Zustand** for editor state (persisted locally, cache in front of Supabase)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Everything works with zero configuration —
auth, editor, analytics, and tracking run in demo mode (localStorage +
in-memory events, seeded with 14 days of data).

To go live, copy `.env.example` to `.env.local`, fill in Supabase + Stripe
keys, and apply `supabase/schema.sql`.

## Map

| Surface | Where |
|---|---|
| Marketing site (12 sections) | `src/app/(marketing)/page.tsx`, sections in `src/components/marketing/` |
| Pricing / About / Legal / Auth | `src/app/(marketing)/…` |
| Signature Builder (editor) | `src/app/(app)/editor` |
| Dashboard + Analytics | `src/app/(app)/dashboard`, `src/app/(app)/analytics` |
| Install & Sync (Gmail/Outlook/Apple Mail) | `src/app/(app)/install` |
| Team / bulk management | `src/app/(app)/team` |
| Billing (trial, invoices, cancel) | `src/app/(app)/billing` |
| Hosted interactive card | `src/app/s/[slug]` |
| Click-tracking redirect | `src/app/api/t/[id]` |
| Signature HTML serving | `src/app/api/sig/[slug]` |
| Impression-counting logo asset | `src/app/api/logo/[id]` |
| Stripe checkout / portal / webhook | `src/app/api/billing/*` |
| DB schema + RLS | `supabase/schema.sql` |

## The interactive-signature tradeoff (the core engineering decision)

Email clients strip JS, `<style>` blocks, and most CSS animation. So:

1. **In the email**: table-based, inline-CSS HTML (`src/lib/emailHtml.ts`) —
   bulletproof in Gmail/Outlook/Apple Mail. The logo slot can carry an
   animated GIF/APNG (static first frame for Outlook). **No tracking pixels** —
   they hurt deliverability.
2. **Interactivity via links**: every element routes through
   `/api/t/:id?k=…&to=…`, which logs the click and 302s onward. Links are the
   one interactive primitive every client supports.
3. **The full experience** (hover-animated logo, badge tooltip, pulsing CTA)
   lives on the hosted card at `/s/:slug`, one click away and rendered by the
   same React component (`src/components/signature/SignatureCard.tsx`) used in
   the hero demo and the editor preview.
4. **Impressions** are counted when the visible brand-logo asset is served
   (`/api/logo/:id`) and on hosted-card visits — no invisible pixels.

## Success metrics designed in

- Landing → signup: every section funnels to `/signup`; plan preselect via `?plan=`
- Editor completion: autosave + instant preview keeps friction near zero
- CTA click-through rate: the headline stat on the dashboard (the bragging number)
- Trial → paid: 7-day trial with countdown on Billing; cancel flow keeps links
  alive 30 days so canceling is safe, not scary
