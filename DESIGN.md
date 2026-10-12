---
name: Night Shift Revenue
description: A robot crew works the night shift on your old leads while you sleep. Midnight blue, glowing green, and a yellow moon for accents.
colors:
  midnight-950: "#050B1A"
  midnight-900: "#0A1630"
  midnight-800: "#11214A"
  midnight-700: "#1B2F63"
  glow-green: "#4DFFA6"
  mint: "#C9F5DE"
  moon-yellow: "#FFD25A"
  mint-dim: "#8FB3A4"
  asleep: "#2B4579"
typography:
  display:
    fontFamily: "Oxanium, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.2vw, 4.6rem)"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Oxanium, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.4vw, 3.5rem)"
    fontWeight: 750
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Oxanium, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.4vw, 2rem)"
    fontWeight: 720
    lineHeight: 1.05
  body:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
  log:
    fontFamily: "ui-monospace, Cascadia Mono, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(0.78rem, 0.9vw, 0.86rem)"
    fontWeight: 400
rounded:
  tag: "6px"
  field: "10px"
  button: "10px"
  card: "14px"
  bubble: "16px"
spacing:
  gutter: "clamp(18px, 4.2vw, 64px)"
  section: "clamp(48px, 6.2vw, 88px)"
  scale: "4 / 8 / 12 / 16 / 24 / 32 / 48px"
---

# Design System: Night Shift Revenue

## Overview

**Creative North Star: "The Night Shift"**

The client's office is dark and they've gone home. A small robot crew is still on shift, working through the old leads one at a time. The page is the night sky over that office: a deep midnight field with a few stars and a crescent moon. Old leads sit in an overnight log, dim and asleep. The ones the crew wakes up glow green, and the bookings get a hand-drawn yellow underline, as if someone circled them by moonlight.

It replaces "The Sales Board" whiteboard (aluminum frame, ghost entries, blue and red marker). Its equivalents:

| Whiteboard | Night shift |
|---|---|
| Ghost (half-erased) rows | **Asleep** rows: dim midnight-blue mono text with a small "z" |
| Blue marker rewrite | **Lit** entries: glowing green mono text, faded up from the asleep color |
| Red ring around BOOKED | Glowing green **Booked** with a hand-drawn **moon-yellow underline** |
| Aluminum tray with the form | A midnight-800 **card** beside the log |
| Magnet strips | **Tags**: mono, uppercase, green outline |
| Station pucks | **Crew badges**: small robot heads with a yellow antenna light |

**Key characteristics**
- Midnight blue everywhere. Surfaces step up one shade (900 page, 800 cards, 700 borders); there are no light sections.
- Green is the "lit" color: headings, key words, buttons, links, and anything the crew has woken up.
- Body copy is mint, never green, so long reading stays calm and crisp.
- Yellow is the moon: an accent you spot, never a fill you sit in.
- The robot crew appears small and repeatedly: three heads in the log header, one at each station, and the logo.

## Colors

| Token | Hex | Role |
|---|---|---|
| `--midnight-950` | #050B1A | Inputs, footer, log header strip, button text on green |
| `--midnight-900` | #0A1630 | Page background (with a soft lift toward the top and a few CSS stars) |
| `--midnight-800` | #11214A | Cards and surfaces: hero form, log, Dana's record, deals, fit panel, timeline, demo form, contact card |
| `--midnight-700` | #1B2F63 | Borders, rules, section dividers |
| `--glow-green` | #4DFFA6 | Headings, key words, buttons, links, lit log entries, check marks, timeline dots, Booked chip |
| `--mint` | #C9F5DE | Body text, ledes, list items, field labels |
| `--moon-yellow` | #FFD25A | Accent only (see the rules below) |
| `--mint-dim` | #8FB3A4 | Captions, hints, timestamps, the "not a fit" list, fine print |
| `--asleep` | #2B4579 | Dormant log entries. Decoration only |

**Contrast (WCAG):** mint is 15.0:1 on midnight-900 and 13.1:1 on midnight-800. Glow green is 13.8:1 and 12.1:1. Moon yellow is 12.5:1 and 10.9:1. Mint-dim is 7.8:1 and 6.8:1. Midnight-950 text on a glow-green button is 15.1:1. Every combination passes AA, and AAA for body sizes. The asleep color deliberately does not pass: it is only used on `aria-hidden` decorative rows.

### What green may do
- Set headings (h1, h2, h3), the brand name, key words (`strong` in the consent rules), links, buttons, tags, check marks, the active stage chip, lit log entries and timeline dots.
- Glow: h1 and h2 get `0 0 18px rgba(77,255,166,.32)`. Lit mono entries and link hover get a tighter `0 0 10px` glow. Buttons glow via box-shadow.
- **Never** set body paragraphs, ledes or long lists in green, and never glow body copy. Mint is the reading color.

### What yellow may do
- **Moon underline** (`.moonline`): a hand-drawn SVG stroke under one key phrase per heading. It currently appears in three headings: "asleep." (hero), "when it works." (pricing) and "night shift." (after hours). Keep it to about one per screen.
- **Booked underline:** the same stroke under every "Booked …" entry.
- **Crescent moon:** the hero moon, the contact-card icon and the small crescent symbol (`#crescent`).
- **Small lights:** the crew's antenna tips, the 2:20 AM booking dot and time on the overnight timeline, and one yellow star.
- **Focus ring:** `:focus-visible` is a 3px moon-yellow outline, which reads clearly against both midnight and green.
- **Warnings:** the left rule and border of the draft flag on the policy pages, and the strikethrough on "Dead lead".
- **Never:** button fills, section or card backgrounds, body text, or more than a thin stroke or small shape at a time.

## Typography

- **Display: Oxanium** (variable 200–800, self-hosted at `assets/fonts/oxanium.woff2`, SIL OFL; copied from `../brand/logo-v2/fonts/` to match the logo). Used for h1, h2, h3, Dana's name and the contact-card name, at 700–760 with slight negative tracking.
- **Body: Schibsted Grotesk** (variable, self-hosted). Paragraphs, labels, buttons, nav and FAQ questions.
- **Crew mono: system monospace** (`ui-monospace, Cascadia Mono, SF Mono, Menlo, Consolas`). It needs no download. Used for the overnight log, tags, stage chips, message timestamps, timeline times and the log header. It's the crew's voice: anything a robot wrote or logged is set in mono.
- The Permanent Marker font was removed.

Hierarchy: display (hero, demo heading) → headline (section h2) → title (deal and after-hours h3, 1.3rem station h3) → body 1.0625rem/1.6 (1rem under 640px) → label .8125rem → mono .7–.9rem.

## Motifs

- **Night sky:** CSS radial-gradient stars and a soft top lift on `body`. No images.
- **Crescent moon:** an inline SVG symbol (`#crescent`) with a yellow drop-shadow glow, top-right of the hero.
- **Robot crew:** an inline SVG symbol (`#bot`) with a rounded head, antenna, two eyes and a mouth. Its antenna tip uses `--tip`, set to moon yellow. Three crew heads sit in the log header. Station numbers are CSS robot heads: a green-outlined rounded rectangle with a stem antenna and a yellow light.
- **Overnight log (signature):** the hero card. It has a header strip ("Overnight log" plus "Night crew on shift" with a slowly pulsing green dot) and a mono table. Asleep rows are dim and `aria-hidden`; awake rows have a green left edge and a faint green wash, and their text is lit. On load, lit entries fade up from the asleep color to glowing green, staggered by row and column, and then the Booked underline draws in. Content is lit by default, without script.
- **Text thread:** outgoing messages are the crew's, with a green-tinted bubble and green border. Incoming messages are midnight-800 with a midnight-700 border. Typing dots match each side.
- **Overnight timeline:** 6 PM to 6 AM on a midnight card. Dots glow green, and the booking at 2:20 AM is the yellow "moon" dot.

## Components

- **Buttons (`.btn`, `-sm`, `-lg`):** glow-green fill, midnight-950 text at 750, 10px corners and a green glow shadow. Hover brightens to #7DFFBF and lifts 1px; active presses 1px. `.btn-quiet` is a green outline for secondary controls such as "Replay".
- **Cards (`.card`):** midnight-800, a 1px midnight-700 border and 14px corners. The lead offer (`.deal-main`) gets a green border and an outer glow.
- **Tags (`.tag`, `.tag-dim`):** mono uppercase .72rem with a green outline and a faint green wash. The dim variant uses mint-dim on a midnight-700 border.
- **Fields:** midnight-950 fill, a #2C4685 border and 10px corners. On focus the border turns green with a 3px green halo. Invalid fields get a soft coral border, and error text is #FFB4A8.
- **Stage chips:** outlined at rest, green-outlined once reached. Booked fills solid green with a glow.
- **Header:** the logo lockup at 40px (34px under 640px), mint nav links with a yellow underline on hover, and the small green button.
- **Footer:** midnight-950, the lockup at 32px, and mint-dim text.

## Logo files

`assets/brand/`: `icon.svg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `lockup-horizontal-dark.svg`. **These are placeholders** (a glowing green rounded square, plus "NIGHT SHIFT / REVENUE" text in the lockup) until the robot-janitor logo is finalized in `../brand/logo-v2/final/`. To swap them, copy the final files over these names; nothing else needs to change.

## Motion

- The log waking up (color, glow and underline transitions), message playback and the pulsing "on shift" dot.
- Under `prefers-reduced-motion: reduce`, transitions and animations collapse to an instant change, the dot stops pulsing, and the JS skips the waking sequence and conversation autoplay. Everything is fully lit and visible.

## Do's and Don'ts

**Do**
- Keep every background midnight; step surfaces up by one shade.
- Use green for things that are lit or actionable, and mint for reading.
- Use yellow sparingly, for the moon, underlines and small lights.
- Set anything the crew logs in mono, and keep times in mono.
- Give every animation a visible-by-default fallback.

**Don't**
- Fill buttons or sections with yellow, or use it for body text.
- Set paragraphs in green or blur body text with a glow.
- Put information in the asleep color.
- Add light sections, gradient text or stock phone mockups.
- Load fonts or scripts from third-party hosts.
