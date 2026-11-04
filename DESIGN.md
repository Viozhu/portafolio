---
name: Jorge Ignacio Garay
description: A career drawn as a Seoul Metro line; projects are stations, roles are stops, applied AI is the terminus.
colors:
  enamel: "#f4f4f1"
  paper: "#ffffff"
  ink: "#12161f"
  steel: "#4a5163"
  rule: "#d6d6cf"
  sign: "#1b2333"
  sign-deep: "#121826"
  sign-line: "#2c3548"
  sign-text: "#c7cdd9"
  line2: "#00a84d"
  line3: "#ef7c1c"
  line3-ink: "#a94f00"
  line5: "#996cac"
  line1: "#0052a4"
  exit-yellow: "#ffd200"
typography:
  display:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(3rem, 6.6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112"
  headline:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 112"
  subhead:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(1.25rem, 2.1vw, 1.625rem)"
    fontWeight: 600
    lineHeight: 1.375
    fontVariation: "\"wdth\" 112"
  title:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    fontVariation: "\"wdth\" 112"
  station-name:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.25
    fontVariation: "\"wdth\" 112"
  body:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\" 1"
  body-small:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  code:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter: "32px"
  section-mobile: "96px"
  section: "128px"
  section-head: "48px"
  line-stroke: "10px"
  page-max: "84rem"
  signbar-height: "64px"
components:
  button-primary:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "12px 20px 12px 12px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.sign-text}"
    typography: "{typography.body-small}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "{colors.sign-line}"
    textColor: "{colors.paper}"
  language-pill-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  stack-chip:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  stack-chip-dark:
    backgroundColor: "transparent"
    textColor: "{colors.sign-text}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  station-screen:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "20px"
  exit-link:
    backgroundColor: "{colors.sign-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "16px"
  exit-link-hover:
    backgroundColor: "{colors.sign-line}"
  exit-number:
    backgroundColor: "{colors.exit-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "28px"
  roundel-md:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "48px"
  now-tag:
    backgroundColor: "{colors.line3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  info-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "32px"
---

# Design System: Jorge Ignacio Garay

## Overview

**Creative North Star: "The Seoul Metro Line"**

The whole site is a working wayfinding system. Station-enamel ground, signage-navy panels, and the real Seoul line colours used as a code: green is career and product work, orange is applied AI and "now", violet is the playground. Projects are stations with codes (A01, P04, X07), roles are stops on a single green line, and the contact section is the terminus. Every device is borrowed from the metro itself: circular roundels with a line-coloured ring, transfer double-rings, 10px line strokes, a three-colour stripe under the sign band, yellow exit-number squares, and a side-on train car that marks the selected station.

Density is that of a station platform sign: one huge name, short supporting text, generous section breathing room (128px vertical on desktop), and information grouped by line rather than by card grid. Light enamel carries most of the page; the navy sign colour appears as bands and panels (the sticky sign bar, the arrival screen, the terminus), never as a full dark theme. The only motion is travel: the train glides along the line with a long ease-out, and the line scrolls the selected station into view on phones. Nothing else animates.

Type is one family doing all the work. Archivo stretched to 112% width and set heavy reads as station-name signage; the same family at normal width carries body copy. Korean falls back to Gothic A1 Heavy for display and the platform Korean sans for body, with `word-break: keep-all`, so the trilingual sign stacking (Latin name over Hangul name) holds in EN, ES and KO.

**Key Characteristics:**
- Line colour is a code with meaning, never decoration.
- Roundels, line strokes and transfer rings are the recurring structural marks.
- Flat enamel and navy surfaces; depth comes from tonal panels, not shadow.
- One stretched heavy sans for display, same family for body.
- Motion is linear travel along the line only.

## Colors

A light enamel-and-navy signage palette with three saturated metro line colours carrying meaning, plus one reserved blue and one exit yellow.

### Primary
- **Line 3 Orange** (line3): applied AI and the present. The terminus station, the AI line badge and stems, the current role's ring and "Now" tag, link underlines on navy, the email underline, selection highlight and caret.
- **Line 3 Ink** (line3-ink): the orange darkened for text on enamel ("present", the arrow beside the line label), where the bright orange would fail contrast.

### Secondary
- **Line 2 Green** (line2): career and product work. Product line stations and stem, the experience line, the photo roundel ring, the JG mark ring, past-role rings.

### Tertiary
- **Line 5 Violet** (line5): the playground line (small games and sites) and the final segment of the three-colour stripe; also the photo roundel's fill.

### Neutral
- **Station Enamel** (enamel): the page ground and scrollbar track.
- **Platform White** (paper): alternate section ground (route map, transfers), roundel discs, info cards.
- **Rail Ink** (ink): primary text, outline button stroke, text on line-colour fills.
- **Steel** (steel): secondary text, station codes, periods, chip text, bullet dots.
- **Tile Rule** (rule): hairline dividers and light chip borders.
- **Signage Navy** (sign): the sign bar, the arrival screen, the terminus section, the primary button, the train body, station plates.
- **Signage Navy Deep** (sign-deep): wells inside navy (language switcher track, exit links, image backing).
- **Signage Line** (sign-line): dividers and chip borders on navy; hover fill for nav links and exits.
- **Signage Text** (sign-text): secondary text on navy.

### Accent utilities
- **Line 1 Blue** (line1): reserved for the focus ring on enamel (3px outline, 3px offset). On navy the ring switches to a light orange (#ffb36b).
- **Exit Yellow** (exit-yellow): exit-number squares in the terminus and the train's headlight. Nowhere else.

### Named Rules
**The Line Code Rule.** Green means product/career, orange means applied AI or "now", violet means playground. A line colour appears only where it states that membership; never pick one for looks.

**The Hard Stop Rule.** Where lines meet, colours change at a hard stop (stripe segments, per-station track segments). Lines are never blended into gradients.

**The Text-Safe Orange Rule.** Orange as text on enamel uses Line 3 Ink; bright Line 3 Orange is for strokes, fills, underlines, and text set on navy or with ink on top of it.

## Typography

**Display Font:** Archivo at 112% width, weight 800 (Korean: Gothic A1 Heavy, then Apple SD Gothic Neo / Malgun Gothic)
**Body Font:** Archivo at normal width (Korean: Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR)

**Character:** A single grotesque that shifts from station-sign heavy to calm reading text by width and weight alone. Tabular numerals are on everywhere so codes and dates line up like a timetable.

### Hierarchy
- **Display** (800, clamp(3rem, 6.6vw, 5.5rem), 0.95, -0.025em, 112% width): the name sign in the hero and the terminus headline.
- **Headline** (800, clamp(2.25rem, 5vw, 3.75rem), 0.95): section titles (Route map, Experience); Transfers uses a smaller clamp(2rem, 4vw, 3rem).
- **Subhead** (600, clamp(1.25rem, 2.1vw, 1.625rem), 112% width): the role line under the name.
- **Title** (700, 1.5rem, 1.25, 112% width): line names, company names, the arrival screen's project title; project titles in the route map step down to 1.25rem.
- **Station name** (700, 0.95rem, 112% width): station labels under roundels on the featured line.
- **Body** (400, 1.0625rem, 1.6): running text, held to 58–68ch.
- **Body small** (0.9375rem): summaries in panels and compact lists, nav links, link rows.
- **Label** (500, 0.8125rem): stack chips.
- **Code** (700, 0.75rem, tabular): station codes and periods.

### Named Rules
**The Station Sign Rule.** Anything that names a place (person, project, line, company) is set in the stretched 112% width; anything that explains it is set at normal width.

**The Trilingual Stack Rule.** Names stack Latin over Hangul at reduced weight in steel; Korean text always uses `word-break: keep-all`.

## Layout

A centered page of max 84rem with 20px gutters on phones and 32px from 640px up. Sections stack full-bleed with a hairline top rule and alternate enamel and white grounds, padded 96px vertically (128px from 1024px). Section heads sit in a max-3xl block with 48px below.

The hero is a 12-column grid at 1024px+: the name sign takes 7 columns, the arrival screen 5, and the featured line spans all 12 underneath. Below 1024px the order is name sign, line, then arrival screen, so a tap on a station shows its result directly below. The featured line keeps a minimum width (60rem on phones, 46rem from 640px) and scrolls horizontally with the scrollbar hidden; the selected station is centered on change.

The route map draws each line as a vertical 10px stem with roundels on a 3–3.25rem rail column; station content splits into text, summary and media columns at md and lg. The playground line uses a compact two-column list instead. Experience is a single green stem with dates right-aligned in an 11rem column on desktop. The sign bar is sticky at 64px; anchor scrolling offsets by 5rem.

**The 10px Line Rule.** Every line stroke (featured track, stems, experience line, terminus stripe) is 10px thick with rounded or hard ends; the sign bar stripe is the one thinner (6px) echo.

## Elevation & Depth

The system is flat. Depth is tonal: navy panels on enamel, deep-navy wells inside navy, white sections alternating with enamel. There is exactly one ambient shadow, under the arrival screen, so it reads as a lit screen hanging over the platform. Box-shadow is otherwise used only as a drawing tool for the transfer double ring.

### Shadow Vocabulary
- **Arrival screen glow** (`box-shadow: 0 24px 48px -24px rgba(18,22,31,0.55)`): the hero's selected-station panel only.
- **Transfer ring** (`box-shadow: 0 0 0 3px <ground>, 0 0 0 6px <line colour>`): marks a transfer or terminus station (the contact roundel, the current role).

### Named Rules
**The One Lit Screen Rule.** Only the arrival screen casts a shadow. Everything else sits flat on the platform.

## Shapes

Circles are the dominant form: roundels, line badges, the photo frame, the JG mark, chips, pills, buttons and bullet dots are all fully round. Containers use soft corners (16px for the arrival screen and education card, 12px for exit links and project media, 8px for thumbnails). The only near-square is the exit-number tile (6px). Rings are thick and scale with size (3px, 4px, 5px, 7px roundel borders; 5–6px on hero and experience marks). The train car is the one compound silhouette: a navy body with a rounded cab, window band and an orange door stripe.

## Components

### Buttons
Pill-shaped signage buttons, confident and heavy.
- **Shape:** fully round.
- **Primary (Write to me):** navy fill, white semibold text, with a small orange-ringed white disc at the start (a station dot) and a trailing arrow that nudges 2px right on hover. Hover darkens to ink.
- **Outline (Open CV):** 2px ink stroke, ink text, external-arrow icon; hover fills ink with white text.
- **Copy chip (terminus):** 1px sign-line stroke, sign-text label, small copy/check icon; hover brightens border and text.

### Chips
- **Stack chip:** 1px rule border, steel text at 0.8125rem, fully round, no fill. On navy, sign-line border with sign-text text.
- **Now tag:** orange fill, ink text, uppercase with 0.1em tracking, beside the current company name only.

### Cards / Containers
- **Arrival screen:** navy, 16px corners, the one ambient shadow, header strip with line badge, line name and period over a sign-line divider, then media, code, title, summary, chips and links.
- **Info card (education):** white on enamel, 1px rule border, 16px corners, 24–32px padding.
- **Station plate:** used when a project has no screenshot: a navy panel crossed by a 12px line-colour band with a large roundel on top. Never a fake screenshot.

### Navigation
- **Sign bar:** sticky navy band, 64px tall, JG roundel mark plus name, nav links as pills (sign-text, hover sign-line fill and white text), and a language pill switcher (EN / ES / 한) on a deep-navy track with the active language in a white pill. A 6px three-colour stripe (green 3 : orange 2 : violet 1) runs under it. Below 768px the nav links hide; mark and language switcher remain.

### Featured Line (signature)
A horizontal track of per-station segments, each coloured by the line it runs into, with six stations as 36px roundels (white disc, 5px line-colour ring; filled when selected; the terminus has an inner dot). Labels below give code, station name and period ("Terminus" on the last). It is a radio group: click or arrow keys (Home/End too) select a station, the train car glides to it (650ms, cubic-bezier(0.16, 1, 0.3, 1), none under reduced motion), and the arrival screen swaps.

### Roundel
White disc, line-coloured ring, bold stretched code inside; sizes 36/48/64/96px. The transfer variant adds a second outer ring via the transfer shadow.

### Exit Links (terminus)
Deep-navy tiles with 12px corners, a yellow numbered square (1–4) like a metro exit sign, a white label and a trailing arrow; hover lifts the fill to sign-line.

## Do's and Don'ts

### Do:
- **Do** encode meaning with line colour: green (#00a84d) product/career, orange (#ef7c1c) applied AI / now, violet (#996cac) playground.
- **Do** draw lines as 10px strokes with hard colour stops where lines change.
- **Do** mark stations with roundels (white disc, line-colour ring, code inside) and transfers with the double ring.
- **Do** set names in Archivo at 112% width, weight 700–800; explanations at normal width.
- **Do** use Line 3 Ink (#a94f00) for orange text on enamel.
- **Do** keep every string available in EN, ES and KO, with Korean `word-break: keep-all`.
- **Do** show a station plate when a project has no real screenshot.

### Don't:
- **Don't** turn the site into a dark neon dev theme; navy is for sign bands and panels on an enamel platform.
- **Don't** use line colours decoratively or blend them into gradients.
- **Don't** add shadows beyond the arrival screen glow; depth is tonal.
- **Don't** animate anything except travel along the line, and honour reduced motion.
- **Don't** use Line 1 blue (#0052a4) or exit yellow (#ffd200) outside the focus ring and exit/headlight roles.
- **Don't** fabricate screenshots, metrics or logos; use the station plate.
