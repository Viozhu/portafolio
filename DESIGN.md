---
name: Jorge Ignacio Garay
description: A Seoul alley at 1 a.m. in the rain; every featured project is a hangul neon sign you can switch on, and the street keeps working after you scroll.
colors:
  ink: "#05010f"
  ink-2: "#0b0418"
  ink-3: "#120725"
  dusk: "#1a0433"
  wire: "#2a1a47"
  haze: "#b9a9d6"
  haze-dim: "#8a7aa8"
  lilac: "#d8ccef"
  lilac-soft: "#cfc3e6"
  bone: "#f3eefc"
  white: "#ffffff"
  neon-pink: "#ff2a6d"
  neon-cyan: "#05d9e8"
  neon-acid: "#f9f002"
  neon-tent: "#ff7a1a"
typography:
  display:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(3.4rem, min(8.4vw, 11vh), 6rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  headline:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  title:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 2.9rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  sign-hangul:
    fontFamily: "Gothic A1 Heavy, Apple SD Gothic Neo, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 800
    letterSpacing: "0.06em"
  lead:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.14em"
    fontFeature: "\"tnum\" 1"
rounded:
  none: "0px"
  focus: "2px"
spacing:
  gutter-sm: "16px"
  gutter-md: "32px"
  gutter-hero: "2.5vw"
  row: "36px"
  section-head: "56px"
  section-head-lg: "80px"
  section: "96px"
  section-lg: "128px"
  page-max: "86rem"
components:
  tube-button-solid:
    backgroundColor: "{colors.neon-pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1.15rem"
    height: "2.75rem"
  tube-button-outline:
    backgroundColor: "rgba(5, 1, 15, 0.62)"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1.15rem"
    height: "2.75rem"
  hud-button:
    backgroundColor: "rgba(5, 1, 15, 0.55)"
    textColor: "{colors.lilac}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0.6rem"
    height: "2rem"
  hud-button-pressed:
    textColor: "{colors.neon-cyan}"
  nav-link:
    textColor: "{colors.lilac}"
    typography: "{typography.label}"
    padding: "0.5rem 0.75rem"
  nav-link-hover:
    textColor: "{colors.neon-cyan}"
  lang-switch-active:
    textColor: "{colors.neon-pink}"
    typography: "{typography.label}"
    height: "2.25rem"
  sign-panel:
    backgroundColor: "rgba(5, 1, 15, 0.9)"
    rounded: "{rounded.none}"
    padding: "24px"
  departure-board:
    backgroundColor: "rgba(5, 1, 15, 0.7)"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  now-badge:
    backgroundColor: "{colors.neon-pink}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "4px 8px"
  ticker-label:
    backgroundColor: "{colors.neon-pink}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "2.5rem"
---

# Design System: Jorge Ignacio Garay

## Overview

**Creative North Star: "The Alley After Last Train"**

The whole site is one wet Seoul side street at 1 a.m. The first viewport is a procedural canvas: violet skyline, near towers hung with vertical hangul neon signs (one per featured project), orange pojangmacha tents with walkers and steam, an OPEN sign with a dead N, a rippled reflection on the asphalt, diagonal rain and lightning on demand. Everything below the street is the same street walked on foot: every project as a lit sign row, experience as a dated shift log, the stack, and a last-train departure board. Copy sits on near-black ink so the neon is the only light; the light source is always the line's own colour.

Density is generous on the street and tight in the HUD. Display type is condensed uppercase Archivo pushed to 62% width with a magenta/cyan chromatic split; system chrome is ui-monospace in small tracked caps between corner brackets. Corners are square everywhere. Depth comes from glow and from the reflection, never from lifted cards.

Motion is the world's weather, not decoration: neon fails like old glass, rain falls on one diagonal, the camera drifts with the pointer, rows power on once with a stutter. Everything else stays still, and every one of those motions has an implemented reduced-motion fallback.

**Key Characteristics:**
- Ink-black ground (#05010f) with three neon lines: magenta for applied AI, cyan for product work, acid yellow for the playground.
- Condensed uppercase Archivo display with chromatic aberration; Gothic A1 Heavy for hangul sign lettering.
- Monospace HUD voice in tracked caps, framed by 10px corner brackets.
- Square geometry; light, not shadow, carries depth.
- A single rain diagonal (dx = 0.27 · dy) shared by the hero scene and the rain veil below it.

## Colors

A night palette: four steps of violet-black ink, a cold lilac text haze, and three saturated neon tubes that each own one body of work.

### Primary
- **Applied-AI Magenta** (neon-pink): the applied AI line, the solid "Write to me" tube button, the NEWSWIRE label, the NOW badge, the active language, text selection, scrollbar hover, and the left ghost of every chromatic headline.
- **Product Cyan** (neon-cyan): the product and client-work line, focus rings, caret, the status pip and signal bars, pressed HUD buttons, nav hover, the contact email tube, and the right ghost of every chromatic headline.

### Secondary
- **Playground Acid** (neon-acid): the playground line, the Strike button label, the OPEN sign, the departure board title and its blinking last row, the CV exit.

### Tertiary
- **Tent Orange** (neon-tent): world-only colour for the pojangmacha tents drawn in the canvas (striped with #c94a0c). Never used on UI chrome or text.

### Neutral
- **Ink** (ink): page ground, the nav bar, hero base, theme-color, and the text colour on solid neon fills.
- **Ink 2 / Ink 3** (ink-2, ink-3): the experience band (ink-2 at 60%), sign-plate fills, thumbnail wells.
- **Dusk Violet** (dusk): the skyline top tone and the floor of the contact gradient (ink to dusk).
- **Wire** (wire): every hairline: nav underline, row dividers, kerbs, ticker top border.
- **Haze** (haze): secondary text, metadata, stack-list items, inactive language codes, bracket strokes (at 55% alpha).
- **Haze Dim** (haze-dim): tertiary labels (row codes, "company work" notes, sound OFF).
- **Lilac** (lilac): HUD and nav text, ticker items.
- **Lilac Soft** (lilac-soft): long-form paragraph text under headings and in rows.
- **Bone** (bone): default body text and project facts lines.
- **White** (white): display headlines and lit tube text.

### Named Rules
**The Line Owns Its Light Rule.** Each body of work has exactly one neon colour (AI magenta, product cyan, playground acid). Every surface that belongs to a project (sign, tube title, code, divider, stack ticks, link underline, panel top edge) takes that line's colour and nothing else.

**The Only Light Rule.** Grounds are ink; colour appears only as emitted light (glow, tube text, hairline, pip). No neon-tinted panel fills except the three solid-fill devices: the solid tube button, the NOW badge, the NEWSWIRE label.

**The Tent Stays In The Street Rule.** Tent orange belongs to the canvas world. It never becomes a fourth line or a UI accent.

## Typography

**Display Font:** Archivo variable (self-hosted, wght 100-900, wdth 62-125), set at 62% width, weight 800, uppercase; hangul falls to Gothic A1 Heavy.
**Body Font:** Archivo (with Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR for hangul).
**Label/Mono Font:** ui-monospace system stack (SFMono-Regular, Menlo, Consolas).
**Sign Font:** Gothic A1 Heavy 800 (self-hosted, subset), for hangul neon lettering in the canvas and on sign plates.

**Character:** Street lettering over a terminal readout. The condensed caps shout like shop signage; the mono HUD whispers like a dashboard. Body copy stays plain Archivo so reading never fights the glow.

### Hierarchy
- **Display** (800, clamp to 6rem bounded by 11vh, 0.88): the hero name only, with chroma and the lightning glitch.
- **Headline** (800, clamp(3rem, 7vw, 6rem), 0.88): section titles (Work, Experience, Contact; Stack runs smaller at clamp(2.75rem, 5vw, 4.25rem)), always white with chroma.
- **Title** (800, clamp(2rem, 3.4vw, 2.9rem), 0.88): project and company names, lit as tubes in the line colour; the sign panel title runs at clamp(2rem, 3.2vw, 2.75rem), line heads at clamp(2rem, 4vw, 3.25rem), playground rows at 1.6rem.
- **Lead** (400, 1.125rem, 1.625): the intro under each section headline, max 56ch, lilac soft.
- **Body** (400, 1.0625rem, 1.6): default text, bone; row summaries max 64ch.
- **Body Small** (400, 0.9375rem, 1.625): sign panel copy, playground summaries, link rows (links at 600).
- **Label** (400, 0.6875rem, 0.14em, uppercase, tabular numerals): HUD, codes, periods, stack lists, board rows; nav and language switch at 0.75rem.

On Korean, `.cond` loosens to -0.02em tracking and 1.02 line-height, and body text uses `word-break: keep-all`.

### Named Rules
**The Two Voices Rule.** Condensed caps for anything that is a sign; tracked monospace caps for anything that is instrumentation. Body Archivo carries reading only. No third display voice.

**The Chroma Is For Headlines Rule.** The magenta/cyan split (±0.045em, `.chroma`) sits on white display and headline type; `.chroma-sm` (±1.5px) only on the JG mark. Line-coloured titles glow as tubes instead and never get chroma.

## Layout

The hero is a full-bleed canvas the height of the viewport minus the 3.5rem nav (`100svh - 3.5rem`, minimum 600px). On desktop the name block owns the left 44vw, vertically centred, and the selected sign's panel floats lower right at min(27rem, 31vw), 3.5rem above the 2.5rem ticker. Gutters in the hero and nav run at 2.5vw (name block 5vw). On phones the name block stacks at the bottom over a darkening gradient and the panel moves into its own section directly under the street.

Below the hero, content sits in an 86rem page column with 16px / 32px gutters and 96px (128px from lg) vertical section padding. Section heads reserve 56px (80px from lg) before content. Project rows are four-column grids on desktop (6.5rem code/date rail, title, summary, 13rem plate or thumbnail), collapsing to two columns at md and a single reordered column on phones (title first, then code, then summary). Experience uses a 12rem date rail. Rows are separated by wire hairlines, not boxes, with 36px vertical padding.

Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024, xl 1280) plus one height query: at lg width with a viewport under 840px tall, the sign panel drops its facts line and stack list so the signs stay clear.

### Named Rules
**The Rails Not Cards Rule.** Lists are rows on hairlines with a monospace rail on the left. No card grids.

## Elevation & Depth

There are no drop shadows. Depth is light and atmosphere: neon glow (text-shadow and outer box-shadow in the element's own colour), the mirrored and rippled street reflection, a vignette over the scene, 3px scanlines at 60% opacity, and the "kerb" pools of line-coloured radial light under each section's top hairline. Panels are translucent ink (50-90%) over the scene, edged by brackets or a 1px top line in the line colour. The fixed rain veil keeps falling behind the lower sections, clipped to them.

### Shadow Vocabulary
- **Tube text glow** (`0 0 1px #fff, 0 0 0.18em var(--tube), 0 0 0.6em var(--tube), 0 0 1.2em color-mix(var(--tube) 45%)`): lit titles and the contact email.
- **Tube frame** (`inset 0 0 0 1px var(--c), 0 0 14px -4px var(--c)`, hover adds `inset 0 0 18px -8px` and `0 0 26px -2px`): tube buttons.
- **Panel edge spill** (`inset 0 1px 0 <line>, 0 -12px 40px -24px <line>`): the sign panel, lit from its top edge.
- **Plate spill** (`inset 0 0 0 1px <line>/27%, 0 18px 40px -22px <line>`): hangul sign plates, light pooling below.
- **Pip glow** (`0 0 6px <colour>`): 6px lit squares.

### Named Rules
**The Emitted Not Cast Rule.** Every shadow is light leaving a tube in its own colour. A dark offset shadow has no source on this street.

## Shapes

Square. Corner radius is 0 on every button, panel, plate, badge and thumbnail; the only radius is 2px on the focus outline and the pill scrollbar thumb. Frames are drawn, not filled: inset 1px rings, 10px corner brackets, 1px hairlines. Line marks are 2px-wide dashes (stack ticks) and 6px square pips. Sign plates hang from two 1px wire stubs. Icons are 16px square-capped stroke SVGs (arrows, copy, check).

## Components

### Buttons
- **Tube button:** a lit neon frame. Square, min-height 2.75rem, padding 0.6rem 1.15rem, Archivo 650, white text on 62% ink, colour set per instance through `--c`. Hover deepens the inner glow and widens the outer halo over 200ms on cubic-bezier(0.16, 1, 0.3, 1).
- **Solid tube:** the single primary action ("Write to me") fills with the tube colour and takes ink text; hover mixes 18% white into the fill.
- **HUD button:** instrumentation control. 2rem tall, label type, lilac text on 55% ink with a 28% haze inset ring; hover goes white with a cyan ring and halo; `aria-pressed="true"` holds cyan text and ring. Used for rain level, sound, strike and copy-email.

### Navigation
- Sticky 3.5rem ink bar with a wire bottom hairline. JG mark in condensed chroma-sm at 1.7rem; full name in HUD voice from sm. Links are 0.75rem label type in lilac, cyan on hover, hidden below md. Language switch (EN / ES / 한) is three 2.25rem cells; the active one is magenta with an 8px glow and a 2px inset underline. A skip link appears on focus as a cyan block.

### Signature: Hero sign radiogroup
Transparent hit areas track each canvas sign as the camera moves (roving tabindex, arrow keys, Home/End). Each carries its code (P02, A01) in 0.625rem label type beneath, lit in the line colour when chosen. Choosing a sign stutters it on and swaps the panel.

### Signature: Sign panel
Bracket-framed 90% ink article, 20/24px padding, lit from the top edge in the line colour. Tube title, a meta line (code in line colour, pip, line name, dim pip, period), facts, summary (60ch), stack list, then underlined links whose 2px underline is the line colour. `aria-live="polite"`.

### Signature: HUD strip and newswire
Top-left bracketed strip: Seoul clock (KST, ticking each second), cyan status pip, four signal bars that drop to one on a strike and recover over 1.8s. Bottom: a 2.5rem ticker with a solid magenta NEWSWIRE label and a monospace marquee separated by rotating pink/cyan/acid pips; it pauses on hover and focus.

### Signature: Power-on rows
Every project and current-role row (`data-power`) starts with its tube title at 50% line colour mixed into dim violet. The first time it scrolls in (12% from the bottom), it lights to white with the line-colour glow and plays the 900ms power-on stutter once. Hover brightens the halo further.

### Signature: Sign plate
For projects without a screenshot: a 16:9 ink-2 plate with a faint line-colour ring, light spilling beneath, hung on two wire stubs, carrying the project's hangul in Gothic A1 Heavy 2.6rem as a power-on tube.

### Signature: Departure board
The contact block's last-train board: bracketed 70% ink, acid title row over a wire rule, label-type key/value rows on 60% wire dividers, the final row blinking acid (1.6s, two steps).

### Badges and lists
- **NOW badge:** solid magenta, ink label text, 4/8px padding, 14px magenta halo; marks the current role.
- **Stack list:** label-type items each led by an 8px line-colour dash.

### Motion grammar

The motion grammar is weather and failing glass; nothing else moves.

- **Neon failure states:** each canvas sign idles steady, and every 4-15s picks a failure: stutter (45%, 0.25-0.7s of random 100%/12% flicker), dropout (30%, 70-210ms at 6%), or brownout (25%, 0.4-1.2s at 48% with a 60Hz shimmer). Unselected signs rest at 60% level, the selected one at 100% with a 3.2s holographic scan band. The OPEN sign hums at 86±4% and its N sputters in uneven blips; that buzz drives the optional audio.
- **Selection stutter:** choosing a sign forces a 0.5s stutter before it settles bright.
- **Rain diagonal:** one slant, dx = 0.27 per unit of fall, in three depth passes (28/38/50% alpha); three levels (32/62/100% density) cycled by the Rain button or R. Below the hero the rain veil repeats the same diagonal at 13% haze.
- **Camera drift:** layers parallax toward the pointer (exponential ease, rate 2.6/s); after 4s idle the camera wanders on slow sines (0.11 and 0.07 rad/s).
- **Lightning envelope:** a tap on the street, Space/L, or Strike fires a branched bolt with a triple pulse (1.0 at 0, 0.55 at 70ms, 0.85 at 200ms, each decaying on a 65ms constant), visible for 340ms, lighting sky, clouds, skyline tones and the street; the hero name glitches (420ms two-step slice) and the signal bars drop. Ambient strikes every 14-32s (7-16s in downpour) are softer and bolt-less.
- **Power-on stutter:** 900ms linear keyframe dropping to 18% opacity three times, a 55% dip at 40%, then on.
- **Ticker:** linear marquee, 14s per item.
- **Board blink:** 1.6s two-step opacity 100 to 35%.

#### Reduced motion (as implemented)
Signs hold steady (no failures, no scan band, no selection stutter, OPEN never sputters); pointer parallax drops to 35% at a slower ease and the camera never drifts on its own; rain falls at 30% density and 55% speed; there are no ambient strikes; a user strike becomes a single soft 0.45 flash with no bolt (the glitch is suppressed); the reflection ripple shrinks to 1.5px; walkers and steam slow by half; the rain veil below the hero is not drawn at all; power-on, glitch and board blink animations are removed (rows still light, via a 200ms colour transition); the ticker slows to 600s; smooth scrolling is off. Canvas and veil also stop when off screen or when the tab is hidden.

## Do's and Don'ts

### Do:
- **Do** give every project surface its line's single neon colour: magenta AI, cyan product, acid playground.
- **Do** set signs, names and titles in condensed uppercase Archivo (62% width, 800, 0.88 line-height), and hangul sign lettering in Gothic A1 Heavy.
- **Do** put all instrumentation in the 0.6875rem monospace label voice with 0.14em tracking and tabular numerals.
- **Do** draw frames with 1px inset rings, 10px corner brackets and wire hairlines; keep every corner square.
- **Do** express depth as emitted glow in the element's own colour, on ink grounds.
- **Do** keep the rain on the 0.27 diagonal everywhere it appears.
- **Do** ship a reduced-motion branch for every new moving thing, and pause canvases off screen and in hidden tabs.

### Don't:
- **Don't** add rounded corners, opaque filled cards or card grids, or dark offset drop shadows; panels are translucent ink with drawn frames.
- **Don't** use tent orange or any fourth accent on UI chrome or text.
- **Don't** put chroma on line-coloured tube titles or on body text.
- **Don't** add motion outside the grammar (no scroll-triggered slides, fades or parallax on content); rows only power on.
- **Don't** set hangul in the condensed Latin cut without its Korean tracking and line-height overrides.
