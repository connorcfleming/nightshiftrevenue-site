# Night Shift Revenue — Redesign Handoff

Date: 2026-10-12. Written for a fresh Claude Code session working in a different folder.

## The project

- **Site source:** `C:\Users\conno\Downloads\Instant Ai Agency\nightshift-site`
  - `index.html` (landing page), `privacy.html`, `terms.html`
  - `assets/styles.css`, `assets/app.js`, `assets/fonts/` (Oxanium, Schibsted Grotesk)
  - `site.config.json` (phone, email, calendar link), `netlify.toml`, `DESIGN.md` (current design system), `dist/` (build output)
- **Local preview:** `node scripts/serve.mjs --mock-forms` serves it at http://127.0.0.1:4180/. Forms are mocked locally.
- **Product:** a done-for-you agency that re-contacts a business's old leads by text overnight and books appointments. Tagline: "Booked appointments from the leads you already paid for." Buyers are small-business owners (roofers, contractors, law offices and similar).
- **Git:** clean on its own repo. Last commit is `0d0eb6f Use Night Crew (direction D) logo`.

## What the owner decided (2026-10-12)

1. **Scope: full redesign.** Rework the visual identity and the trust/offer content together, in one pass. Treat the current look as evidence of what not to do. Keep the copy that works, the functions (both forms, Netlify form name `demo` plus a hidden `source` field, the honeypot, phone fallback), and the accessibility basics (reduced motion, focus ring, contrast).
2. **Tone: premium and quiet.** Drop the cartoon robot-crew motif and the neon glow. Aim for a restrained, editorial night palette that feels expensive and calm. The AI stays in the background; the page should not read as "a robot company texting your customers."
3. **Trust content:** build a **founder block** (name, photo, city, why they do this). The owner will supply the real details. Until then, use **clearly marked placeholders** (e.g. `[FOUNDER NAME]`, `[PHOTO]`) for every fact. Do not invent names, results, prices or testimonials.
4. `DESIGN.md` describes the old "Night Shift" neon system. Replace it once the new direction is set.

## Critique summary (impeccable critique, score 26/36, heuristic 7 n/a)

The concept is specific to the business; the visuals are a generic dark-neon AI template.

**Keep (these work):**
- Hero hook: "Your old leads aren't dead. They're asleep."
- Dana's roofing text thread. The copy is concrete and believable.
- The consent section (`index.html` ~276-289). It builds more trust than anything else on the page.
- The asleep/lit log *idea*: dim old leads, woken ones highlighted. Restyle it in the quiet direction.
- FAQ questions written in the owner's voice.

**Fix, in priority order:**
1. **[P0] No proof or trust.**
   - No founder, price or results on the page.
   - Disclaimers sit where proof should be: under the log (~line 98), under the thread (~162), and in the footer (~387, "We don't publish client results").
   - Fix: add the founder block, collapse the disclaimers into one quiet line, and take the footer line out.
   - If the owner later wants offer framing: a price anchor, a founding-partner offer, a "no bookings, no bill" line. Leave placeholders only.
2. **[P1] Generic visual system.**
   - A glow on every h1/h2 (`styles.css:118`), buttons, cards, checks and the timeline.
   - Glow green does every job, so nothing has priority.
   - Oxanium (a gaming/crypto-style display font) for headings.
   - The same two-column split and `.section-head` pattern repeat in every section, divided by hairlines.
   - Fix: remove the glow, use one restrained accent for the single thing that matters (a booked appointment), and pick a new type pairing.
   - Break the repeated layout with one or two full-width moments. Consider a "morning" ending: the owner wakes to a booked calendar. The story currently starts at night and never resolves.
3. **[P1] The thread animation erases content.**
   - `app.js` ~72-115: `showAll()` renders everything, then `play()` hides it all and replays over 10+ seconds.
   - Desktop shows an empty column. On mobile the thread collapses (`.thread{min-height:0}`) and the page jumps.
   - Fix: never hide content that was already on screen, reserve the height, keep playback around 4 seconds, and make BOOKED the emotional beat.
4. **[P2] CTA and pricing.**
   - Every button says "Book a demo", but the real first step is a free audit that only appears in fine print.
   - "Terms set per partner" / "revenue share for the right partner" reads as evasive.
   - Suggested button: "Get my free lead audit", with the line "15 min · we'll tell you if your list is worth working." Confirm with the owner first.
5. **[P2] Layout bugs.**
   - `.site-foot` sits inside `.frame` (max 1320px), so the footer band doesn't reach the screen edges.
   - Log cells end in "…" on desktop.
   - Below 640px the log hides its date columns.
   - The left columns of pricing and consent are mostly empty.
   - Below 900px the nav disappears with no menu.
   - The page is about 13 phone screens long (10,772px). Trim it.

**Minor:**
- The "fictional/illustrative" disclaimer appears 4 times.
- The phone number appears 4 times.
- Generic h2s: "How it works", "Who it's for", "Book a demo".
- A dashed connector between the steps (template cliché).
- A pulsing status dot.
- The After-hours section pitches two extra services before the main offer has landed. Cut or demote it.

**Automated scan notes:**
- `impeccable detect` found 190 issues, but 105 "low-contrast" ones are false alarms. The real contrast is fine.
- The 39 "dark-glow" findings are real and match issue 2.
- Values outside the design tokens: `#e6fff1`, `rgb(44,70,133)`, an 8px radius.
- The full critique snapshot is at `nightshift-site\.impeccable\critique\2026-10-12T21-19-21Z__index-html.md`.

## Suggested next steps

1. Use the `impeccable` skill. There is no PRODUCT.md, so it will route a redesign through `init` first. Use this file as the source for product facts.
2. Choose the new "premium and quiet" visual direction and write a new DESIGN.md.
3. Rebuild `index.html` and `styles.css`, and fix the `app.js` thread behavior. Keep the forms and the Netlify setup working.
4. Check desktop and mobile once, then fix everything in one batch.
5. Ask the owner for: founder name, photo and city; whether to show a price anchor; and the CTA wording.
