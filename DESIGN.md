---
name: Jorge Ignacio Garay
description: A Seoul block at 1 a.m. in the rain; four neon towers are four lines of work, and scrolling is a camera that rides into them floor by floor and down to the last train.
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
  led-amber: "#ffb000"
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
    fontSize: "clamp(2.5rem, 5vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  title:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(2.1rem, 3.6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  readout:
    fontFamily: "Archivo, Gothic A1 Heavy, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "\"wdth\" 62"
  sign-hangul:
    fontFamily: "Gothic A1 Heavy, Apple SD Gothic Neo, sans-serif"
    fontWeight: 800
  lead:
    fontFamily: "Archivo, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.7vw, 1.4rem)"
    fontWeight: 600
    lineHeight: 1.375
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
  gutter-hud: "2.5vw"
  gutter-stop: "5vw"
  panel-sm: "20px"
  panel-md: "28px"
  nav: "3.5rem"
  stop-min: "55svh"
  stop-lead: "30svh"
  panel-max: "min(36rem, 42vw)"
  stage-min: "560px"
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
  stop-panel:
    backgroundColor: "rgba(5, 1, 15, 0.95)"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-md}"
    width: "{spacing.panel-max}"
  elevator-readout:
    backgroundColor: "rgba(5, 1, 15, 0.7)"
    textColor: "{colors.white}"
    typography: "{typography.readout}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  floor-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
  floor-button-hover:
    backgroundColor: "{colors.ink-3}"
    textColor: "{colors.white}"
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

The whole page is one Seoul block at 1 a.m. in the rain, seen through one camera. The first viewport is the street: violet skyline, four towers with neon roof names (APPLIED AI, PRODUCT, PLAYGROUND, EXPERIENCE), vertical hangul signs hanging beside the floors they name, orange pojangmacha tents with walkers and steam, an OPEN sign with a dead N, a rippled reflection on the asphalt, diagonal rain and lightning on demand. Scrolling does not leave that street; it moves the camera into it. Each tower is a line of work and each floor a project, read through its window (screenshot, or the name lettered in neon) while a glass elevator rides the facade. The stack lights up as signs on masts over the roofs, then the camera goes down a lit stairwell to a cut-away subway platform where the last train brakes in, opens its doors, and the contact panel waits.

Every stop of the ride carries exactly one bracketed panel of near-black ink beside the subject, so the neon stays the only light and the light source is always the line's own colour. Display type is condensed uppercase Archivo at 62% width; on white type it carries a magenta/cyan chromatic split, on line-coloured type it glows as a tube. System chrome is ui-monospace in small tracked caps between corner brackets: the HUD, the elevator readout, codes, floors. Corners on the interface are square. Depth comes from glow, the reflection and the camera's own zoom, never from lifted cards.

Motion is the world's weather and machinery, not decoration: neon fails like old glass, rain falls on one diagonal, the camera eases between stops, the elevator follows the scroll, the train brakes in and its doors open. Panels themselves scroll in plain page flow and only power on. Every one of those motions has an implemented reduced-motion fallback.

**Key Characteristics:**
- Ink-black ground (#05010f) with four towers: magenta applied AI, cyan product, acid playground, lilac experience; acid also lights the station.
- Scroll is the camera: street → lobby → floors → roof → station → platform, one canvas behind a column of panels.
- Condensed uppercase Archivo with chromatic aberration on white type; Gothic A1 Heavy for hangul sign lettering.
- Monospace HUD voice in tracked caps framed by 10px corner brackets; the elevator readout (L / nF / R / B1 / B2) is the page's position.
- Square interface geometry; light, not shadow, carries depth.
- A single rain diagonal (dx = 0.27 · dy) everywhere it falls.

## Colors

A night palette: four steps of violet-black ink, a cold lilac text haze, three saturated neon tubes plus the lilac tower, and two world-only lights (tent orange, LED amber).

### Primary
- **Applied-AI Magenta** (neon-pink): the applied AI tower and its floors, the current role's floor ("hot", whatever tower it is in), the solid "Write to me" tube, the NEWSWIRE label, the NOW badge, the active language, text selection, scrollbar hover, and the left ghost of every chromatic headline.
- **Product Cyan** (neon-cyan): the product tower, the glass elevator car and shaft, focus rings, caret, the status pip and signal bars, pressed HUD buttons, nav hover, the contact email tube, the WhatsApp/LinkedIn exits, the readout triangle off-tower, and the right ghost of every chromatic headline.

### Secondary
- **Playground Acid** (neon-acid): the playground tower, then the underground: the station canopy sign, stairwell light, platform band, train stripes, the tactile strip, open screen-door lamps, and the top edge of the roof (stack) and platform (contact) panels. Also the Strike label and the CV exit.

### Tertiary
- **Tent Orange** (neon-tent): world-only colour for the pojangmacha tents in the canvas (striped with #c94a0c). Never on UI chrome or text.
- **LED Amber** (led-amber): world-only dot-matrix lettering on the platform departure board and the train's cab sign. Its status cell switches from a red ARRIVING to a green BOARDING when the doors open; neither status colour appears outside the board.

### Neutral
- **Ink** (ink): page ground, nav bar, stage base, the HUD band, panel fills (at 95%), floor-button cells, theme-color, text on solid neon fills.
- **Ink 2 / Ink 3** (ink-2, ink-3): window wells in the canvas; ink-3 is the floor-button hover.
- **Dusk Violet** (dusk): the skyline top tone.
- **Wire** (wire): every hairline: nav underline, the floor-directory grid, panel inner rules, ticker top border, rails and screen-door posts.
- **Haze** (haze): the experience tower's light, secondary text and metadata, readout "/ nF" count, inactive language codes, bracket strokes (at 55% alpha).
- **Haze Dim** (haze-dim): tertiary labels ("company work" notes, sound OFF).
- **Lilac** (lilac): HUD and nav text, ticker items.
- **Lilac Soft** (lilac-soft): paragraph text inside panels.
- **Bone** (bone): default body text, facts lines, stack lists, floor-button labels.
- **White** (white): display and chromatic headlines, the readout, lit tube text.

### Named Rules
**The Tower Owns Its Light Rule.** Each tower has exactly one colour (AI magenta, product cyan, playground acid, experience lilac). Every surface that belongs to a tower (roof name, lobby glow, floor window outline, hangul sign, panel top edge, title tube, floor number, stack ticks, link underline, readout glow) takes that colour and nothing else. The one override is hot: the current role is lit magenta.

**The Only Light Rule.** Grounds are ink; colour appears only as emitted light (glow, tube text, hairline, pip). No neon-tinted panel fills except the three solid-fill devices: the solid tube button, the NOW badge, the NEWSWIRE label.

**The World Lights Stay In The World Rule.** Tent orange and LED amber belong to the canvas. They never become a tower colour or a UI accent.

## Typography

**Display Font:** Archivo variable (self-hosted, wght 100-900, wdth 62-125), set at 62% width, weight 800, uppercase; hangul falls to Gothic A1 Heavy.
**Body Font:** Archivo (with Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR for hangul).
**Label/Mono Font:** ui-monospace system stack (SFMono-Regular, Menlo, Consolas).
**Sign Font:** Gothic A1 Heavy 800 (self-hosted, subset), for hangul neon lettering in the canvas, sized to its sign.

**Character:** Street lettering over a terminal readout. The condensed caps shout like shop signage; the mono HUD whispers like a dashboard. Body copy stays plain Archivo so reading never fights the glow.

### Hierarchy
- **Display** (800, clamp to 6rem bounded by 11vh, 0.88): the hero name only, white with chroma and the lightning glitch.
- **Headline** (800, clamp(2.5rem, 5vw, 4.25rem), 0.88): the panel title of a lobby (tower name, lit as a tube in its colour), the roof (Stack, white with chroma, min 2.75rem) and the platform (Contact, white with chroma, up to 4.5rem).
- **Title** (800, clamp(2.1rem, 3.6vw, 3.25rem), 0.88): project and company names on floor panels, lit as tubes in the tower colour. The contact email is the same voice at clamp(1.6rem, 3.2vw, 2.6rem), lowercase, as a cyan tube.
- **Readout** (800, 1.75rem, 1): the elevator readout's floor code, white with a 10px glow in the current tower colour.
- **Lead** (600, clamp(1.125rem, 1.7vw, 1.4rem), 1.375): the role line under the hero name, white, max 30ch.
- **Body** (400, 1.0625rem, 1.6; 1.625 inside panels): default text, bone; panel paragraphs in lilac soft, max 52-62ch.
- **Body Small** (400, 0.9375rem, 1.625): project links (at 600), floor-button labels (at 500).
- **Label** (400, 0.6875rem, 0.14em, uppercase, tabular numerals): HUD, readout count, floor meta lines (nF · code · period), stack lists, education rows; nav and language switch at 0.75rem.

On Korean, `.cond` loosens to -0.02em tracking and 1.02 line-height, and body text uses `word-break: keep-all`.

### Named Rules
**The Two Voices Rule.** Condensed caps for anything that is a sign; tracked monospace caps for anything that is instrumentation. Body Archivo carries reading only. No third display voice.

**The Chroma Is For White Type Rule.** The magenta/cyan split (±0.045em) sits on white display and headline type; the ±1.5px cut only on the JG mark. Tower-coloured titles glow as tubes instead and never get chroma.

**The Names Keep Their Case Rule.** Brand words with a lowercase tail after two or more capitals (OPIc) keep their casing inside uppercase styles and in canvas lettering.

## Layout

The page is one section over one sticky stage. The stage is the canvas, pinned under the 3.5rem nav at `100svh - 3.5rem` (minimum 560px), with scanlines and a vignette over it. A column of stops scrolls over it in normal page flow; each stop is a step the camera targets, measured by its vertical centre against the stage's centre, so scroll position becomes a fractional step index.

The steps, in order: street (a full-height empty spacer), then for each tower a lobby followed by one floor per project (towers in line order, floors in code order), then the experience tower's lobby and one floor per role (oldest role on the ground floor, current role at the top), then roof (stack), station (a 75svh empty spacer while the camera descends the stairs), and platform (contact, at least full stage height on desktop). Nav anchors land on stops: Work is the first lobby, Experience its lobby, Stack the roof, Contact the platform.

A stop is at least 55svh tall with 30svh of lead-in above its panel. On desktop (lg) the panel sits vertically centred on the right at min(36rem, 42vw) with 5vw gutters while the camera frames its subject at 30% from the left edge; on phones the panel sits at the bottom of the stop, full width with 16px (32px from sm) gutters, and the camera frames its subject in the top quarter (50% across, 24% down). Panels pad 20px, 28px from sm.

The street's own overlays (name block, scrims, sign hit areas, newswire) fade with the camera: their opacity is 1 - 2.2 × progress, and they are hidden once below 5%, so they are gone before the first lobby. On desktop the name block owns the left 44vw; on phones it stacks at the bottom over a darkening gradient. HUD gutters run at 2.5vw.

Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024, xl 1280); the scene switches to its mobile camera and drops the OPEN sign below 768px.

### Named Rules
**The One Panel Per Stop Rule.** Every stop of the ride carries exactly one panel beside the subject the camera is framing. Lists inside a panel are hairline rows or the wire-gridded floor directory; never card grids.

**The Camera Not The Content Rule.** Movement between stops belongs to the canvas camera. The panels scroll at page speed and never slide, fade or parallax on their own.

## Elevation & Depth

There are no drop shadows on the interface. Depth is light, atmosphere and zoom: neon glow in the element's own colour, the mirrored and rippled street reflection, a vignette, 3px scanlines at 50% opacity, the camera's zoom into the towers, and the lit cut-away of the underground. Panels are 95% ink over the scene, edged by corner brackets and a 1px top line in the tower colour that spills light upward.

Layering, back to front: the stage (sky gradient, canvas, scanlines, vignette, then the street-only overlays); the column of stops (z 10); the HUD layer (z 30), sticky under the nav for the whole ride. The HUD layer holds a band of ink 8rem tall (9rem on phones), solid to 62% then fading to clear, whose opacity is 1 - street visibility: invisible on the street, fully in once the camera leaves it, so panels scrolling up pass under the HUD instead of colliding with it. The nav sits above everything at z 40.

### Shadow Vocabulary
- **Tube text glow** (`0 0 1px #fff, 0 0 0.18em var(--tube), 0 0 0.6em var(--tube), 0 0 1.2em color-mix(var(--tube) 45%)`): lit titles and the contact email.
- **Power-on glow** (`0 0 1px #fff, 0 0 0.16em var(--tube), 0 0 0.5em color-mix(var(--tube) 70%)`): panel titles once powered on; hover widens it.
- **Tube frame** (`inset 0 0 0 1px var(--c), 0 0 14px -4px var(--c)`, hover adds `inset 0 0 18px -8px` and `0 0 26px -2px`): tube buttons.
- **Panel edge spill** (`inset 0 1px 0 <tower>, 0 -14px 44px -26px <tower>`): every stop panel, lit from its top edge.
- **Readout glow** (`0 0 10px <tower>`): the elevator readout's floor code.
- **Pip glow** (`0 0 6px <colour>`): 6px lit squares.

### Named Rules
**The Emitted Not Cast Rule.** Every shadow is light leaving a tube in its own colour. A dark offset shadow has no source on this street.

## Shapes

The interface is square. Corner radius is 0 on every button, panel, badge, readout and directory cell; the only radii are 2px on the focus outline and the pill scrollbar thumb. Frames are drawn, not filled: inset 1px rings, 10px corner brackets, 1px hairlines, a 1px-gap wire grid. Line marks are 8px dashes (stack ticks, role bullets) and 6px square pips. Icons are 16px square-capped stroke SVGs (arrows, copy, check) and a solid 10px triangle in the readout.

The world draws its own forms and keeps them: rounded train cabs, umbrella domes, round-headed figures, striped tent awnings. Squareness governs the interface laid over the world, not the objects in it.

## Components

### Buttons
- **Tube button:** a lit neon frame. Square, min-height 2.75rem, padding 0.6rem 1.15rem, Archivo 650, white text on 62% ink, colour set per instance through `--c`. Hover deepens the inner glow and widens the outer halo over 200ms on cubic-bezier(0.16, 1, 0.3, 1).
- **Solid tube:** the single primary action ("Write to me") fills with the tube colour and takes ink text; hover mixes 18% white into the fill.
- **HUD button:** instrumentation control. 2rem tall, label voice, lilac text on 55% ink with a 28% haze inset ring; hover goes white with a cyan ring and halo; `aria-pressed="true"` holds cyan text and ring. Used for rain level, sound, strike and copy-email.

### Navigation
- Sticky 3.5rem ink bar with a wire bottom hairline. JG mark in condensed chroma at 1.7rem; full name in HUD voice from sm. Links are 0.75rem label type in lilac, cyan on hover, hidden below md; each lands on a ride stop. Language switch (EN / ES / 한) is three 2.25rem cells; the active one is magenta with an 8px glow and a 2px inset underline. A skip link appears on focus as a cyan block.

### Signature: HUD strip and band
Top-left bracketed strip on 50% ink: Seoul clock (KST, ticking each second), cyan status pip, four signal bars that drop to one on a strike and recover over 1.8s. Top-right: the HUD buttons, and beneath them the elevator readout. Both stay for the whole ride, over the HUD band described in Elevation & Depth.

### Signature: Elevator readout
A bracketed 70% ink chip, 8/12px padding: a 10px triangle in the current tower colour, the floor code in the readout voice, then "/ nF" in haze with the tower's roof name from sm. Codes: L (lobby), nF (floor n), R (roof), B1 (station), B2 (platform); nothing on the street. It updates when the camera crosses the halfway point between stops.

### Signature: Stop panel
The one panel of every stop: 95% ink, corner brackets, 20/28px padding, lit from the top edge in the tower colour (acid on roof and platform). Floor panels hold a tube title, a meta line (nF in tower colour, pip, code, dim pip, period), facts in bone, summary in lilac soft (62ch), a stack list, then links underlined 2px in the tower colour. Role panels swap the meta for dates (present in magenta) and the summary for dash-led points. The panel powers on the first time it scrolls in.

### Signature: Floor directory
On each lobby panel, the tower's floors as elevator buttons, top floor first: a wire grid with 1px gaps (two columns from sm), ink cells, the floor number in label voice and the tower colour (magenta for the current role), the name in body small. Hover lifts the cell to ink 3 and the name to white; a click centres that floor's stop.

### Signature: Towers and floors (canvas)
Each tower is a dark slab edged in 1.5px of its colour, a lobby with a lit door and its name, a parapet and the roof name on stilts. Floors are windows with mullions: unlit floors show a few warm squares; lit floors show the project's screenshot (55% when not current) or its name in neon, with a slow glass sheen. The floor being read gets a glowing outline in the tower colour; floor numbers appear beside the facade once the camera has zoomed past 1.3×. The glass elevator is a cyan shaft at 82% across the facade with a glowing car that sits at the floor the scroll has reached. Hangul signs hang beside featured floors on two bracket arms; the one beside the floor being read rises to full brightness.

### Signature: Roof masts
Over the roofs, one condensed neon sign per stack group on a thin mast, alternating heights, cycling cyan, acid, lilac, magenta; each mast carries a small red aviation lamp. They fade in only near the roof stop.

### Signature: Station and platform (canvas)
On the street, a glass canopy carrying the acid "막차 LAST TRAIN" sign over a stairwell whose acid light rises into the rain. Below, the cut-away: a lit diagonal stairwell down to a tiled hall with an acid band, fluorescent strips (one failing), platform screen doors with lamps that turn from cyan to acid when open, waiting figures (one lit by a phone), a hanging amber LED departure board, and a three-car train with warm windows, acid stripes and an amber cab sign. The platform edge carries a dotted yellow tactile strip, which the footer repeats in the DOM.

### Signature: Hero sign radiogroup and newswire
Transparent hit areas track each hangul sign as the camera moves (roving tabindex, arrow keys, Home/End); choosing one stutters it on and, 480ms later, rides the camera to that floor. Towers under the pointer show a pointer cursor and take you to their lobby; anywhere else on the sky calls lightning. At the bottom of the street, a 2.5rem newswire with a solid magenta label and a monospace marquee separated by rotating pink/cyan/acid pips, pausing on hover and focus.

### Badges, lists and footer
- **NOW badge:** solid magenta, ink label text, 4/8px padding, 14px magenta halo; marks the current role.
- **Stack list:** label-type items each led by an 8px dash in the tower colour.
- **Footer:** the platform edge continued: a 12px strip of acid dots on a 9px grid over dark olive, a 1px acid line with an 18px acid glow, then the copyright in haze.

### Motion grammar

Weather, failing glass and machinery; nothing else moves.

- **Camera between stops:** every step has a camera key (centre and zoom). Between two keys the position follows a smoothstep (3t² - 2t³) of the fractional scroll, and zoom interpolates geometrically (linear in log zoom) so the dive into a tower feels even. The pointer adds up to ±34px across and ±10px down, on the street only, eased exponentially (rate 2.6/s); after 4s idle it wanders on slow sines (0.11 and 0.07 rad/s).
- **Elevator:** the car's floor is the scroll's fractional floor, so it rides continuously with the page; floors light as it passes.
- **Neon failure states:** each sign idles steady and every 4-15s picks a failure: stutter (45%, 0.25-0.7s of random 100%/12% flicker), dropout (30%, 70-210ms at 6%), or brownout (25%, 0.4-1.2s at 48% with a 60Hz shimmer). Unselected signs rest at 60%; the chosen sign and the one beside the floor being read go to 100%, and the chosen one carries a 3.2s scan band. The OPEN sign hums at 86±4% and its N sputters; that buzz drives the optional audio.
- **Selection stutter:** choosing a sign forces a 0.5s stutter before it settles bright.
- **OPEN sign fit:** the sign sizes itself into the gap between the HUD (60px) and the top of the name minus 14px, letters at most 2.6% of the width (26-40px) and dropped below 18px; refit on every resize.
- **Train arrival:** over the scroll from station to platform the train slides in from the right (offset by its length plus 400 units), reaching the platform at 85% of that scroll, decelerating on an ease-out cubic, with acid speed streaks that shrink as it brakes. Scrolling back reverses it.
- **Doors:** once parked, the train waits 0.35s, then its doors and the screen doors open together over 0.7s (clock time, not scroll). Past half open, the screen-door lamps turn acid and the board's status flips from ARRIVING to BOARDING; the status cell blinks on a ~1.3s cycle.
- **Rain diagonal:** one slant, dx = 0.27 per unit of fall, in three depth passes (28/38/50% alpha); three levels (32/62/100% density) cycled by the Rain button; density thins to 35% once the camera leaves the street, and rain never falls inside the underground.
- **Lightning envelope:** a tap on the sky or Strike fires a branched bolt with a triple pulse (1.0 at 0, 0.55 at 70ms, 0.85 at 200ms, each decaying on a 65ms constant), visible for 340ms; the hero name glitches (420ms two-step slice) and the signal bars drop. User strikes have a 1.2s cooldown, keeping flashes under three a second. Ambient strikes every 14-32s (7-16s in Monsoon) are softer and bolt-less.
- **Power-on stutter:** 900ms linear keyframe dropping to 18% three times, a 55% dip at 40%, then on; once per panel, when it enters 12% above the bottom.
- **Street fade:** the street overlays fade over the first ~45% of the scroll to the first lobby; the HUD band fades in over the same span.
- **Ticker:** linear marquee, 14s per item.

#### Reduced motion (as implemented)
The camera cuts from stop to stop (it snaps to the nearest key, no interpolation); pointer parallax drops to 35% at a slower ease (1.5/s) and there is no idle wander. Signs hold steady (no failures, no scan band, no selection stutter; OPEN holds at 90% and never sputters); the station sign and the failing fluorescent hold steady. The train is already parked once the scroll is within half a step of the platform, its doors are open at once, there are no speed streaks, and the board status does not blink. Rain falls at 30% density and 55% speed; there are no ambient strikes; a user strike becomes a single soft 0.45 flash (350ms decay) with no bolt and no glitch; the reflection ripple shrinks to 1.5px; walkers and steam slow by half. CSS removes the power-on and glitch animations (panel titles still light, via a 200ms colour transition), slows the ticker to 600s, and turns smooth scrolling off; in-page jumps scroll instantly. The canvas stops when off screen or when the tab is hidden.

## Do's and Don'ts

### Do:
- **Do** give every surface of a tower its single colour: magenta AI, cyan product, acid playground, lilac experience; light the current role magenta.
- **Do** put new content on the ride as a stop: a camera key on the canvas plus one panel beside it.
- **Do** set signs, names and titles in condensed uppercase Archivo (62% width, 800, 0.88 line-height), and hangul sign lettering in Gothic A1 Heavy.
- **Do** put all instrumentation in the 0.6875rem monospace label voice with 0.14em tracking and tabular numerals.
- **Do** draw interface frames with 1px inset rings, 10px corner brackets and wire hairlines; keep every interface corner square.
- **Do** express depth as emitted glow in the element's own colour, on ink grounds.
- **Do** keep the rain on the 0.27 diagonal everywhere it appears.
- **Do** ship a reduced-motion branch for every new moving thing, and pause the canvas off screen and in hidden tabs.

### Don't:
- **Don't** add rounded corners, opaque filled cards or card grids, or dark offset drop shadows to the interface; panels are translucent ink with drawn frames.
- **Don't** use tent orange, LED amber or any fifth accent on UI chrome or text.
- **Don't** put chroma on tower-coloured tube titles or on body text.
- **Don't** animate panels on their own (no slides, fades or content parallax); the camera moves, panels only power on.
- **Don't** let HUD and panels collide: anything that stays on screen during the ride sits in the HUD layer above the band.
- **Don't** set hangul in the condensed Latin cut without its Korean tracking and line-height overrides.
