---
name: Night Shift Revenue
description: A sales-floor whiteboard in a brushed aluminum frame, where dead leads are rewritten in fresh marker as booked appointments.
colors:
  wall: "#26292e"
  wall-hi: "#33373d"
  board: "#f7f6f1"
  paper: "#ffffff"
  ink: "#1b1d22"
  ink-2: "#4a4f57"
  ink-3: "#686d75"
  ghost: "#b4b8be"
  tape: "#2f3237"
  rule-line: "rgba(47, 50, 55, 0.82)"
  strip: "#2a2c31"
  strip-quiet: "#5b6068"
  marker-blue: "#1f4fb5"
  marker-red: "#c8321f"
  marker-red-dk: "#9e2516"
  alu-1: "#eceef1"
  alu-2: "#cfd3d8"
  alu-3: "#b3b8bf"
  alu-edge: "#8e949b"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.75rem, 6.6vw, 5.25rem)"
    fontWeight: 880
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.75rem)"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)"
    fontWeight: 820
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 780
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.01em"
  strip:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
  marker:
    fontFamily: "Permanent Marker, Schibsted Grotesk, cursive"
    fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  strip: "3px"
  panel: "4px"
  field: "6px"
  magnet: "7px"
  frame: "8px"
  bubble: "16px"
  puck: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "18px"
  gutter: "clamp(18px, 4.2vw, 64px)"
  section: "clamp(48px, 6.2vw, 88px)"
components:
  button-primary:
    backgroundColor: "{colors.marker-red}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.magnet}"
    padding: "0 22px"
    height: "48px"
  button-primary-sm:
    backgroundColor: "{colors.marker-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.magnet}"
    padding: "0 16px"
    height: "40px"
  button-primary-lg:
    backgroundColor: "{colors.marker-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.magnet}"
    padding: "0 28px"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.magnet}"
    padding: "0 16px"
    height: "44px"
  strip-label:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.paper}"
    typography: "{typography.strip}"
    rounded: "{rounded.strip}"
    padding: "7px 10px 6px"
  strip-label-quiet:
    backgroundColor: "{colors.strip-quiet}"
    textColor: "{colors.paper}"
    typography: "{typography.strip}"
    rounded: "{rounded.strip}"
    padding: "7px 10px 6px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "48px"
  nav-link:
    textColor: "{colors.ink}"
    padding: "10px 2px"
  deal-panel:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(22px, 3vw, 34px)"
  message-out:
    backgroundColor: "{colors.strip}"
    textColor: "{colors.paper}"
    rounded: "{rounded.bubble}"
    padding: "11px 15px"
  message-in:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "11px 15px"
  contact-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.strip}"
    padding: "26px 24px 22px"
---

# Design System: Night Shift Revenue

## Overview

**Creative North Star: "The Sales Board"**

Every page is one physical object: an enamel-white whiteboard held in a brushed aluminum frame, hung on a dark graphite wall. The top rail carries the wordmark, navigation and the primary magnet; the board carries the content; the tray at the bottom carries the fine print, the way a marker ledge collects pens. Nothing floats off the board as an app-like card. Content is organized by ruled lines, magnet-strip headers and hand-marked entries, exactly as a sales manager would organize a real board.

The type is set, not drawn: a heavy grotesk in graphite does all the talking, at very high scale contrast between the display headline and the body. A marker hand appears only where something has just been written onto the board: a lead coming back, a booking, a name. Gray ghosting carries the memory of what was erased. Red is the one loud color and it belongs to the booked appointment and the action that produces one.

Density is moderate and editorial: generous section padding, long ruled lists, two-column splits that collapse to one. The world rejects the dark-gradient AI-agency look: no glowing phone mockups, no rows of identical feature cards, no gradient text.

**Key Characteristics:**
- One object per page: frame, top rail, board, tray.
- Graphite set type at extreme weight (850 to 880) for headlines; quiet 400 body.
- Marker hand for live entries only; ghost gray for erased history.
- Ruled lines (1.5px and 2px graphite) instead of boxes or background bands.
- Red reserved for BOOKED and the primary action.
- Brushed aluminum with a fine vertical grain on every metal part.

## Colors

A near-monochrome graphite-on-enamel palette lit by two marker colors, with aluminum as the only material tint.

### Primary
- **Booking Red** (marker-red): the primary action button (gradient from a lighter red to a deeper one), the hand-drawn ring around every BOOKED entry, the final "Booked" stage chip, the hot dot on the overnight timeline, the strikethrough on an overruled status, and invalid-field borders.
- **Deep Booking Red** (marker-red-dk): error text in form status, where the brighter red would fall short on contrast.

### Secondary
- **Marker Blue** (marker-blue): fresh entries written onto the board, link color, check marks on the "good fit" list, timeline dots, focus outlines, input focus border and caret, checkbox accent. Link hover darkens to a deeper navy.

### Neutral
- **Enamel Board** (board): the board surface itself, warm off-white with faint wipe smudges and a diagonal sheen layered over it.
- **Paper White** (paper): things pinned to or set on the board: inputs, incoming text bubbles, the contact card.
- **Graphite Ink** (ink): headlines, strong text, nav links.
- **Graphite Ink 2** (ink-2): body paragraphs, section ledes, list items.
- **Graphite Ink 3** (ink-3): captions, notes, field hints, timestamps, inactive chips.
- **Ghost Gray** (ghost): erased entries on the board, always blurred slightly and partially masked so they read as residue.
- **Tape Graphite** (tape) and **Rule Line** (rule-line): 2px section dividers and panel borders use tape; 1.5px row rules in tables, lists and FAQs use the 82% rule line.
- **Magnet Strip** (strip) and **Quiet Strip** (strip-quiet): magnetic label strips, station pucks, the outgoing message bubble.
- **Graphite Wall** (wall, wall-hi): the wall behind the frame, a soft radial lift at the top.
- **Aluminum** (alu-1, alu-2, alu-3, alu-edge): frame rails, hero tray, footer tray, always as linear gradients with a fine 3px grain, alu-edge for the machined edge line.

### Named Rules
**The Red Means Booked Rule.** Marker red marks an appointment won, the action that wins one, or a decision that overrules a status. It never decorates, never fills a section, and never appears as a second accent.

**The Ghost Is Residue Rule.** Ghost gray carries no information. Ghost rows are hidden from assistive technology, and nothing a reader needs is ever set in ghost gray.

## Typography

**Display Font:** Schibsted Grotesk (variable 400 to 900, self-hosted, with system-ui fallback)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** Permanent Marker for hand-written entries (self-hosted, falls back to the grotesk)

**Character:** A dense, heavy grotesk that sets like a printed sales report, paired with a single felt-marker hand that looks like someone just walked up to the board.

### Hierarchy
- **Display** (880, clamp(2.75rem, 6.6vw, 5.25rem), 0.94): the hero headline, max 15ch. The demo heading and policy page titles use the same weight and tracking at their own clamps.
- **Headline** (850, clamp(2.1rem, 4.6vw, 3.75rem), 1): section headings, paired with a body-lg lede in ink-2, max 58ch.
- **Title** (820, clamp(1.4rem, 2.2vw, 1.85rem), 1.05): pricing deals and after-hours articles.
- **Title Small** (780, 1.3rem, 1.15): station steps and policy page subheads.
- **Body** (400, 1.0625rem, 1.55): running text, 1rem below 640px; measures held between 40ch and 68ch.
- **Label** (650, 0.8125rem): field labels, fact terms, captions.
- **Strip** (700, 0.72rem, 0.1em, uppercase): magnet-strip headers and stage chips only.
- **Marker** (400, clamp(0.9rem, 1.15vw, 1.05rem), 1.3): ledger entries; scales up to 1.5rem for the booked handoff line and clamp(2.2rem, 4vw, 3.2rem) for the faded name on the old lead record.

### Named Rules
**The Live Ink Rule.** The marker hand is reserved for entries written on the board: lead names, statuses, times, BOOKED. Headings, body, buttons, navigation and labels are always set in the grotesk.

**The Tabular Clock Rule.** Times and timestamps use tabular figures so a column of times aligns like a schedule.

## Layout

The frame is centered at a max of 1360px with a clamp(0px, 2.4vw, 40px) wall margin; below 640px it goes full-bleed with square corners. Inside the board, horizontal padding is the gutter token and every top-level section gets the section token of vertical padding, separated by a 2px tape rule (the hero has none).

Recurring grids: a 5fr / 7fr split for pricing, consent and demo; 4fr / 7fr for the pose-and-answer example; two equal columns divided by a 2px tape rule for fit and after-hours; four stations divided by 1.5px rules with a tape arrow running across their pucks. The hero stacks headline-and-lede, the ledger, then the aluminum tray holding the quick form; on narrow screens the tray rises above the ledger.

Breakpoints: 1080px (stations drop to 2 columns, arrow removed), 900px (nav hidden, all splits to one column, vertical dividers become horizontal), 640px (full-bleed frame, single-column fields, ledger loses two columns), 380px (wordmark drops its second word). On wide but short viewports (height 1000px and 780px), ghost rows are trimmed so the first viewport still shows the board and the tray.

## Elevation & Depth

Depth belongs to physical objects only. The frame casts a large soft shadow onto the wall; the board is inset into it (inner rule plus a soft inner shadow at the top); magnets, strips, the hero tray, station pucks and the pinned contact card each sit slightly proud of the board. Content on the board itself is flat and divided by rules.

### Shadow Vocabulary
- **Frame on wall** (`0 40px 80px -20px rgba(0,0,0,.6), 0 8px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.35)`): the outer frame only.
- **Board inset** (`inset 0 0 0 1px #c3c7cc, inset 0 3px 8px rgba(0,0,0,.12), inset 0 -2px 6px rgba(0,0,0,.06)`): the board surface sits recessed in the frame.
- **Magnet** (`inset 0 1px 0 rgba(255,255,255,.28), 0 2px 3px rgba(60,10,0,.3), 0 6px 14px -4px rgba(120,20,5,.45)`): primary buttons; lifts 1px on hover, presses 1px on active.
- **Strip** (`0 1px 2px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12)`): magnet strips and active stage chips.
- **Pinned card** (`0 1px 2px rgba(0,0,0,.18), 0 10px 22px -10px rgba(0,0,0,.3)`): the contact card, rotated -1deg.
- **Tray** (`inset 0 1px 0 rgba(255,255,255,.7), 0 6px 12px -4px rgba(0,0,0,.28), 0 1px 2px rgba(0,0,0,.25)`): the hero marker tray.

### Named Rules
**The Lit Object Rule.** A shadow means "this is a separate physical thing on or around the board." Text blocks, lists, deals and forms never get a shadow; they get a rule or a border.

## Shapes

Corners stay small and machined: 3px on strips and the pinned card, 4px on ruled panels and trays, 6px on fields, 7px on buttons, 8px on the frame. Only two things are truly round: SMS bubbles (16px with a 5px tail corner on the sender side) and the circular station pucks and timeline dots. The BOOKED ring is the one freehand shape: an irregular ellipse (`48% 52% 44% 56% / 62% 44% 56% 38%`) at -1.5deg. Checks and crosses are hand-stroked SVG masks colored by currentColor.

**The Small Corner Rule.** Nothing rectangular rounds past 8px; softness comes from the marker, not from pill shapes.

## Components

### Buttons
- **Shape:** gently squared (7px).
- **Primary (magnet):** booking red vertical gradient, white 700 text, 48px tall (40px small in the rail, 56px large in the demo form), magnet shadow. Hover lifts 1px with a wider shadow; active presses 1px; disabled drops to 60% with a progress cursor. Transitions 0.18s on the ease-out curve.
- **Ghost:** transparent with a 1.5px tape border, 44px tall, 650 weight, a faint graphite wash on hover. Used for secondary in-place controls such as replaying the example.

### Chips (stage track)
- **Style:** strip typography, 1.5px gray outline, ink-3 text at rest.
- **State:** reached stages fill with magnet strip graphite and white text; the Booked stage fills with booking red; the current stage lifts 2px. Transitions 0.35s.

### Cards / Containers
- **Deal panels:** no fill, 2px tape border (3px for the lead offer), 4px corners, clamp(22px, 3vw, 34px) padding.
- **Demo form panel:** 3px tape border, 4px corners, a 45% white wash over the board.
- **Contact card:** paper white, 3px corners, pinned-card shadow, rotated -1deg, max 22rem.
- **Hero tray:** aluminum gradient with grain, 4px corners, tray shadow; holds the quick form and its note in a darker graphite for contrast on metal.

### Inputs / Fields
- **Style:** paper white, 1.5px dark graphite border, 6px corners, 48px min height, 14px horizontal padding, blue caret. Label above in the label style; optional hints in ink-3 regular. Selects carry an inline chevron.
- **Focus:** border turns marker blue with a 3px 22% blue halo.
- **Error:** border turns booking red after user interaction; status text in deep booking red, success in a dark green.

### Navigation
- **Style:** sits on the top aluminum rail beside an uppercase two-weight wordmark (850 name, 500 tracked second word). Links are 600 ink, 0.95rem, with a 2px marker-blue underline on hover. Hidden below 900px, where the rail keeps only the wordmark and the small magnet.

### Ledger (signature)
The hero board: a fixed-layout table with magnet-strip column headers, 1.5px graphite rules between rows and columns, every cell in the marker hand. Ghost rows are blurred ghost gray with a diagonal wipe mask; live rows are marker blue with the old full name ghosted underneath, and BOOKED entries are red inside the freehand ring. On load the live entries are "written" left to right with a clip-path reveal (0.7s each, staggered by row and column); content is fully visible without script and the reveal is skipped under reduced motion.

### Text thread (signature)
SMS bubbles in a ruled column: outgoing in magnet graphite on the right, incoming in paper white with a graphite border on the left, each with a small tabular timestamp. Playback inserts typing dots, then reveals each message with a 0.5s rise-and-unblur, advancing the stage track in step. The full thread shows by default; playback starts once on scroll into view and on the replay control.

### Overnight timeline (signature)
A 2px tape baseline with 12 ticks and hour labels, entries pinned to it by marker-blue dots (red for the booking), each with a tabular time in ink. Below 900px it becomes a vertical list with the dots at the left.

## Do's and Don'ts

### Do:
- **Do** build every page as frame, top rail, board and tray, with the primary magnet in the rail.
- **Do** separate sections with a 2px tape rule and rows with 1.5px rule lines.
- **Do** set headings in Schibsted Grotesk at 820 to 880 with tight negative tracking, and body at 400 in ink-2.
- **Do** use the marker hand only for entries written onto the board, in marker blue, and red only when the entry is a booking.
- **Do** label columns and groups with magnet strips (uppercase 0.72rem, 0.1em tracking, graphite fill).
- **Do** keep times in tabular figures.
- **Do** give every animation a visible-by-default fallback and honor reduced motion.

### Don't:
- **Don't** use booking red for decoration, section fills, icons or a second CTA color.
- **Don't** put information in ghost gray or let ghost rows be read by assistive technology.
- **Don't** set headings, body, buttons or navigation in the marker hand.
- **Don't** shadow text blocks or lists; shadows are for physical objects on the board.
- **Don't** round rectangular elements past 8px or use pill shapes.
- **Don't** introduce dark-gradient heroes, phone mockups or rows of identical feature cards.
