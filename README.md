# nightshiftrevenue.com

A one-page marketing site for Night Shift Revenue, plus Privacy and Terms placeholder pages. It's plain HTML, CSS and vanilla JS with no framework and no dependencies, following the pattern of the Monarca firms site in `Spanish PPL/funnel/monarca-firms-site`.

**Visual direction:** "Lit Windows". Your old leads are a street of dark houses at night. Overnight the crew's conversations light a few windows green, and a porch light turns moonlight yellow for each booking. The page ends at dawn with a booked calendar. Tokens and rules are in `DESIGN.md`; product facts are in `PRODUCT.md`. This replaced the neon "Night Shift" robot-crew direction on 2026-10-12.

## Files
| Path | What it is |
|---|---|
| `index.html` | The site: hero street of old leads plus quick audit form, Dana's text thread, how a night runs, pricing, fit, consent rules, founder block (placeholders), FAQ, dawn calendar plus full audit form |
| `privacy.html`, `terms.html` | **Placeholders.** An attorney must complete them before launch |
| `assets/styles.css`, `assets/app.js` | Styles; windows lighting up, conversation playback, mobile menu, config, form handling |
| `assets/fonts/` | Self-hosted Josefin Sans (display) and Schibsted Grotesk (body), both SIL Open Font License |
| `assets/brand/` | `favicon.svg` is the new crescent. The lockup, icon and PNG favicons are the old robot-crew art; the page now uses a text wordmark. Replace the PNGs when a new logo exists |
| `site.config.json` | Booking URL, contact email, operator legal name and address |
| `check.mjs` | Launch gate: placeholders, banned claims, required consent copy, Netlify form wiring, broken links |
| `scripts/` | `build.mjs` (copies to `dist/`), `serve.mjs` (local server), `shoot.mjs` (screenshots), `form-test.mjs` |
| `netlify.toml` | Publishes `dist/`; the production build runs `check.mjs` |

## Run locally
```powershell
cd "C:\Users\conno\Downloads\Instant Ai Agency\nightshift-site"
node scripts/serve.mjs --mock-forms     # http://127.0.0.1:4180/
node check.mjs --allow-verify           # all checks, placeholders only warned
node scripts/form-test.mjs http://127.0.0.1:4180/ ok
```
With `--mock-forms`, the local server accepts form posts and prints them; it never stores or sends anything. Without the flag, posts return 501, so you can see the error state. On Netlify, Netlify Forms handles the `demo` form; both the hero form and the full form post to it, and a `source` field says which one was used.

## Before launch (each needs your OK)
1. **Founder block:** replace `[FOUNDER NAME]`, `[CITY]`, `[PHOTO]` and `[WHY I DO THIS…]` in `index.html` with real details and a photo. `node check.mjs` fails until they're gone.
2. **Fill in `[VERIFY]` items:** in `site.config.json` the operator legal name and address, plus a contact email; in `privacy.html` and `terms.html` the attorney review, providers, retention period and governing law. `node check.mjs` fails until every `[VERIFY]` is gone, and the Netlify build runs it.
3. **Calendar (optional):** put a GoHighLevel or Calendly link in `booking.url` and an "Open the calendar" link appears beside the form.
4. **Texting compliance:** the demo form's SMS consent box and the Privacy and Terms wording are written to match what A2P 10DLC registration expects (program description, frequency, rates, STOP and HELP, no sharing of opt-in data). Have an attorney confirm them, and register the brand and campaign with your SMS provider. **Main line:** the site lists 404-276-6462 (a personal number for now). When the A2P number is issued, replace every `tel:+14042766462` and `404-276-6462` in the HTML and `app.js`, and update `contact` in `site.config.json`.
5. **Domain:** register `nightshiftrevenue.com`, create the Netlify site from this folder, and point DNS at it.
6. **Netlify Forms:** after the first deploy, confirm the `demo` form appears in the dashboard and set up email notifications.

## What's illustrative
All names, businesses (Ridgeline Roofing), times and conversations are made up and labeled that way on the page. The site makes no claims about results, has no testimonials and quotes no statistics. `check.mjs` blocks common claim patterns (testimonial, guarantee, %, ROI, "proven", and so on).
