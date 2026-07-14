# Design Prompt — SigCraft (paste into Figma Make / Framer AI / v0 / Lovable / any design tool)

---

Design a premium SaaS marketing website + web app UI for **SigCraft** — a platform that creates **animated, interactive email signatures** with a trackable "Book a Demo" CTA. The product's entire pitch is polish and interactivity, so the site itself must feel alive: real micro-interactions, purposeful motion, nothing that looks like a default template.

## 1. Brand & Mood

- Personality: confident, precise, quietly premium. "Stripe-level polish meets a growth tool."
- Aesthetic: clean SaaS, generous whitespace, soft off-white surfaces, one blue→violet accent gradient used sparingly (icons, CTAs, one headline word — never full backgrounds except the final CTA banner).
- Trust is the product: verification badges, ratings, stats, and deliverability reassurance should appear throughout.

## 2. Design Tokens

**Color**
- Ink (text): `#0A0A0F`; soft ink `#1B1B24`; muted `#55556B`; faint `#8A8AA0`
- Surface: cream `#FAFAF8`; dim cream `#F2F2EE`; card white `#FFFFFF`; hairline `#E7E7E2`
- Accent: indigo `#4F46E5` → violet `#8B5CF6` gradient (100°); accent-soft bg `#EEF0FF`
- Semantic: success `#10B981`, warn `#F59E0B`, danger `#EF4444`
- Never pure black or pure white backgrounds.

**Type**
- Display/headings: Outfit (geometric sans), tight tracking, weights 600–700
- Body: Inter, 1.6 line-height, weight 400–500
- Scale: hero 56–60px, section titles 40px, card titles 20px, body 16–18px, labels 12px uppercase tracked
- Extreme size contrast between headline and supporting label text.

**Shape & depth**
- Radius: cards 24px, buttons pill (999px), inputs 12px
- Shadows: soft layered (`0 1px 2px rgba(10,10,15,.04), 0 8px 24px rgba(10,10,15,.06)`); glow on primary CTA (`0 8px 32px rgba(79,70,229,.25)`)
- Backdrop: subtle dot-grid pattern behind hero/demo areas; glassmorphism (blur 14px) sticky nav.

## 3. Page Structure — Marketing Site (in order)

1. **Nav** — glass sticky bar: logo, Features, Solutions (mega-menu: industries — Real Estate, Healthcare, Finance, Agencies, Sales Teams; roles — Founders, Realtors, Consultants, Freelancers, each with icon + one-line blurb), Pricing, About, Login, gradient "Get Started Free" pill.
2. **Hero** — left: eyebrow pill, headline "Turn Every Email Into a **Demo Booking Machine**" (bold phrase in gradient text), subline, two CTAs, trust microcopy ("Free 7-day trial · No credit card · Works with Gmail, Outlook & Apple Mail"). Right: a **live animated signature card demo** — a realistic email-signature card (avatar, name + verified check, title/company, phone/email row, social icon row, pulsing "Book a Demo →" pill button) that cycles brand colors/layouts on loop while a simulated cursor sweeps its hotspots; floating metric chips ("127 CTA clicks ↑43%", "9 demos booked") bobbing beside it.
3. **Social proof strip** — 4.9★ G2 rating, "12,000+ founders & teams", SOC 2 badge; infinite logo marquee with edge fade.
4. **Stats bar** — 4 animated counters that count up on scroll-into-view: 38% reply-rate lift, 5.2× more CTA clicks, 12,000+ signatures served daily, 14 email clients tested.
5. **How It Works** — 3 numbered cards (giant ghost numeral in corner): Select a template → Customize your brand → Sync across platforms. Gradient icon chips.
6. **Interactive demo section** — headline "Hover it. Click it. It's alive." A real hoverable signature card on a dot-grid panel with controls: 5 brand-color swatches and an animation toggle (subtle / bold / none). Hovering the card must light up social icons (scale + brand color), show a "Verified Sender" tooltip on the checkmark, shimmer the logo, and pulse the CTA.
7. **Deliverability section** — dark ink background, glass cards, 4 points: clean hand-tuned HTML, no tracking pixels, trusted CDN hosting, tested across Gmail/Outlook/Apple Mail/Yahoo.
8. **Platform tabs** — pill tab switcher (Signature Manager / Visual Editor / Analytics), each tab: browser-chrome mockup screenshot + heading + copy; animated tab underline/pill.
9. **Features grid** — 4×2 cards, lift on hover: AI Logo Animation, Interactive Design, Mobile Responsive, Verification Badge, Bulk Create, Server Hosting, Pro Templates, Click Analytics.
10. **Pricing teaser** — 3 cards: Starter $0, Pro $12/mo (highlighted, glow border, "Most popular" gradient tag), Team $9/seat; check-listed features; link to full pricing.
11. **FAQ accordion** — 6 items (why subscription, deliverability safety, trial terms, cancellation, client compatibility, what's tracked); chevron rotates, smooth height animation.
12. **Final CTA banner** — full gradient panel with grain texture, "Your next email could book a demo.", white pill CTA. Then footer: 5-column sitemap, socials, legal.

## 4. App Screens (authenticated)

- **Editor** — 3-pane: template gallery (6 templates: Aurora/SaaS, Ledger/Finance, Compass/Real-Estate, Monogram/Agency, Beacon/Healthcare, Slate/Sales) · live signature preview center with Interactive/Gmail/Outlook toggle (Gmail = light chrome mock, Outlook = blue chrome mock, squared corners) · right form panel (identity fields, logo/photo upload tiles, brand color picker, animation style segmented control, verified-badge toggle, CTA text+URL, social links, drag-to-reorder layout blocks).
- **Dashboard** — stat tiles (Impressions, CTA clicks, CTR headline metric, Live signatures), 14-day dual-line trend chart (indigo #4F46E5 impressions, teal #0D9488 clicks, crosshair tooltip), signature preview card.
- **Analytics** — same chart + horizontal-bar breakdowns (clicks by element, events by email client) + A/B variant table with "Top performer" badge.
- **Install** — client tab switcher (Gmail/Outlook/Apple Mail), numbered gradient step chips, dark code block with the HTML snippet, copy button.
- Sidebar app shell: white, icon+label nav, active item in accent-soft.

## 5. Motion Spec (purposeful, never decorative)

- Scroll reveals: fade-up 24px, 0.6s, ease `cubic-bezier(.21,.65,.32,.95)`, stagger 80–120ms within groups, trigger once.
- Counters: spring count-up ~1.8s on first view.
- Buttons: scale 0.97 on press; primary CTA subtle glow pulse (2.6s loop, soft box-shadow ring).
- Signature card: logo shimmer sweep (2.8s loop); social icons spring scale 1.18 + lift 2px on hover; tooltip pops 150ms; hero demo cycles state every 2.6s with crossfade + simulated cursor moving between hotspots (spring, stiffness 60).
- Tabs: shared-layout pill slides between options (spring, 0.5s).
- Accordion: height + opacity 0.3s ease-in-out; chevron rotates 180°.
- Marquee: 32s linear infinite, masked edges.
- Floating chips: 5–6s ease-in-out vertical bob, offset phases.
- Respect `prefers-reduced-motion`: disable loops, keep fades.

## 6. Layout Rules

- Max content width 1152px, 24px side padding; section rhythm 80–112px vertical.
- Grid: 12-col; features 4-up desktop → 2-up tablet → 1-up mobile; editor collapses to stacked panes on mobile.
- Wide tables/charts scroll horizontally inside their card, never the page.

## 7. Don'ts

- No stock photos, no generic 3D illustrations, no rainbow gradients, no full-gradient section backgrounds (except final CTA), no drop shadows darker than 15% opacity, no default component-library look, no motion without a job to do.

---

**Deliverables to generate:** desktop + mobile layouts for all 12 marketing sections, the 4 app screens, and an interaction/motion prototype of the signature card (hover states: logo shimmer, icon lift, badge tooltip, CTA pulse).
