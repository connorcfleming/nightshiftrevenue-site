# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners of established small businesses that already paid to generate leads: people who asked for a quote, consult or estimate and never booked. Industry is open; the offer is the same for every business with a list of past inquiries and someone to run appointments. Examples used on the site lean on home services (a roofing quote) because they are easy to picture, not because the service is limited to them.

The owner is busy, skeptical of marketing agencies and AI hype, and evaluating whether to hand over a contact list.

## Product Purpose

Night Shift Revenue is a done-for-you agency. It texts a business's old, dormant leads (with permission on record), holds each conversation until the lead is ready, qualifies them, and books appointments onto the business's own calendar with the conversation attached. Success for the owner is booked appointments from leads they had written off.

Tagline: "Turn missed opportunities into revenue."

## Positioning

Pay per booked appointment, defined in writing before launch. The pilot has no implementation fee unless the owner is happy with the results. No booking-count guarantee. No retainer. The work starts from the owner's existing list rather than new lead generation. The AI is a tool the agency runs inside agreed rules, with people watching and stepping in; it is not the product's identity.

## Operating Context

- First step is a free lead audit: the owner sends a CRM export (CSV); the agency reviews lead age, source, volume and opt-in records and says plainly whether the list is worth working.
- Messages are written in the business's voice and approved before launch.
- Texts go out in measured batches during reasonable hours in the lead's time zone; replies are answered whenever the lead writes in.
- Appointments land on the business's calendar with the full conversation attached.
- Add-ons after a reactivation campaign is live: speed-to-lead replies to new inquiries and after-hours follow-up. These are secondary to the main offer.

## Capabilities and Constraints

- Static site: plain HTML, CSS and vanilla JS, no framework, no third-party hosted fonts or scripts. Hosted on Netlify; `node scripts/build.mjs` copies to `dist/`; `check.mjs` is the launch gate.
- Both forms post to Netlify Forms under the name `demo`, with a hidden `source` field, honeypot `company_website`, and a phone fallback in the error state.
- Contact details come from `site.config.json`; the main line is a personal number for now (404-276-6462) until an A2P 10DLC number is issued.
- Primary call to action: "Get my free lead audit" (confirmed 2026-10-12).
- Pricing is stated as a model (pay per booked appointment, no implementation fee unless happy with the pilot, no booking-count guarantee, no retainer) with no number on the page (confirmed 2026-10-12). Revenue share exists as an alternative for some partners.
- Undecided: founder name, photo, city and story (owner will supply); contact email; operator legal name and address.

## Brand Commitments

- Name: Night Shift Revenue. The October 12 owner-supplied brand board defines the crescent growth logo and electric lime, off-white, charcoal, olive and gray palette. Assets live in `assets/brand/`.
- Voice: plain, specific, owner-to-owner. Concrete scenes over claims.
- Hero hook to keep: "Your old leads aren't dead. They're asleep."
- Tone direction from the owner (2026-10-12): premium and quiet. No cartoon robot crew, no neon glow; the AI stays in the background.

## Evidence on Hand

- No client results, testimonials, case studies, statistics or prices exist yet. Do not invent any. `check.mjs` blocks common claim patterns (testimonial, guarantee, %, ROI, "proven", the owner's name, and so on).
- All example names, businesses (Crown Hill Roofing), times and conversations are illustrative and must be labeled as such once, clearly.
- Founder block: every fact is a marked placeholder (`[FOUNDER NAME]`, `[PHOTO]`, `[CITY]`) until the owner supplies it.
- The consent and texting rules are real operating commitments and are the strongest trust content available.

## Product Principles

1. Show the mechanism instead of claiming results: one dormant lead becoming one booked appointment.
2. Honesty is the trust strategy: no invented proof, plain pricing, clear consent rules.
3. The owner's list and the owner's customers' trust are the asset; the page treats both with care.
4. The AI is background machinery; the visible outcome is an appointment on a calendar.

## Accessibility & Inclusion

WCAG AA contrast, visible focus ring, full keyboard access, and `prefers-reduced-motion` honored with all content visible without script or animation.
