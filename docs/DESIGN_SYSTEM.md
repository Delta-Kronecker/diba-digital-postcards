# Design System — Diba

This file is the design source. The build reads its values from `src/index.css` and
`tailwind.config.js`, and those two files must match what is written here.
`npm run check:design` compares this document against the build and fails on any
difference, so drift is a build error instead of a surprise.

Values live in three blocks: the light theme on `:root`, the dark theme on
`html[data-theme="dark"]`, and the memorial override on `[data-theme="memorial"]`.
Every `#rrggbb` colour also carries an `r g b` triplet so Tailwind can apply opacity
(`text-ink/60`); the checker holds the pair in sync.

## Palette

Light is the primary canvas. Dark is a second theme with its own steps, not an
inversion of the first: the ink inverts, the gold lifts, and the surfaces keep their
warm cast.

```css
:root {
  --color-canvas: #f1ebe0;
  --color-surface: #fbf8f1;
  --color-surface-2: #e8dfcf;
  --color-ink: #191612;
  --color-ink-muted: #5c554a;
  --color-ink-subtle: #665e51;
  --color-ink-band: #191612;
  --color-line: rgba(25, 22, 18, 0.14);
  --color-line-strong: rgba(25, 22, 18, 0.28);
  --color-gold: #9a7a44;
  --color-gold-soft: #c9b08a;
  --color-gold-deep: #74582b;
  --color-sage: #4c5745;
  --color-rose: #9c6d70;
  --color-cream: #f5f0e6;
  --color-danger: #b4462f;
  --color-success: #3e6b4f;
  --color-danger-on-ink: #d9744f;
}

html[data-theme="dark"] {
  --color-canvas: #131110;
  --color-surface: #1b1815;
  --color-surface-2: #24201b;
  --color-ink: #f2ecdf;
  --color-ink-muted: #b5ab9a;
  --color-ink-subtle: #9a9080;
  --color-ink-band: #0b0a08;
  --color-line: rgba(242, 236, 223, 0.14);
  --color-line-strong: rgba(242, 236, 223, 0.26);
  --color-gold: #c6a468;
  --color-gold-soft: #d9c29b;
  --color-gold-deep: #a8854c;
  --color-sage: #8a9880;
  --color-rose: #c08e91;
  --color-cream: #f5f0e6;
  --color-danger: #d9744f;
  --color-success: #6fa57f;
}
```

`sage` is the memorial colour and the only secondary accent; `rose` is reserved for
photographic captions. Both have a light and a dark step, so neither is a fixed
material.

The memorial scope strips the gold out of the palette rather than adding a colour:

```css
[data-theme="memorial"] {
  --color-gold: #687567;
  --color-gold-soft: #8a9785;
  --color-gold-deep: #4c5a4a;
  --color-rose: #7e8a7c;
  --color-sage: #4c5745;
}
```

### Status

`danger` and `success` are the two status colours. Each carries its own step per
theme, because a rust that reads 5.1:1 on warm paper reads 3.3:1 on the dark
surface. Body-size text in a status colour must clear 4.5:1 against the surface it
sits on; measuring that is `better-colors`, and the requirement is
`better-accessibility`.

The ink band is the one surface that is dark in **both** themes, so the themed
steps do not cover it: the light `danger` step reads 3.29:1 there. `danger-on-ink`
is a single value for that floor — 5.59:1 on the light band, 6.18:1 on the dark one
— and is only for status text on an ink surface.

### Materials

Paper, foil, wax and scrim are objects, not interface colours, so they keep one
value in every theme. They are named `paper-*`, `seal-*`, `foil`, and `scrim*`, and
are never used for text that has to pass contrast.

| Family | Tokens | Role |
| --- | --- | --- |
| Paper stock | `paper`, `paper-cream`, `paper-line`, `paper-line-2`, `paper-line-3`, `paper-ink`, `paper-ink-warm`, `paper-ink-muted`, `paper-ink-subtle`, `paper-gold`, `paper-gold-deep`, `paper-shade`, `paper-shade-2`, `paper-shade-3` | The card that sits inside the envelope. Fixed, because a card does not change colour with the room. |
| Wax and foil | `seal-a`, `seal-b`, `seal-c`, `seal-d`, `seal-sage-a`, `seal-sage-c`, `seal-line`, `seal-cream`, `seal-ink`, `foil` | The two seal materials (gold and sage) and the metallic hairline they share. |
| Scrim | `scrim`, `scrim-deep` | What a dialog and a lightbox put between themselves and the page. |
| Finish | `frost`, `gloss`, `mask` | Highlights and the marquee's fade. `mask` is read for its alpha only. |

## Typography

Vazirmatn is the body face, Estedad is the editorial face used for every heading and
display line (bound in the build as `font-display`), and Cormorant Garamond is the
Latin face for wordmarks, kickers and numerals set in Latin script (`font-latin`). The
Latin face is a build addition, not a third voice: it never sets a Persian word or a
Persian numeral. Cormorant ships no Persian digits, so a `.latin` span holding `۰۱` falls
through to the browser's default serif — a Persian numeral belongs to the body face.

All three load from Google Fonts with `display=swap`: Vazirmatn `100..900`, Estedad
`400;500;600` (the only weights `.font-display` asks for), Cormorant Garamond
`0,300;0,400;0,500;0,600;1,300;1,400`. A weight the family does not ship is a
synthesised one, so the requested weights and the used ones are kept equal.

The scale carries its own leading, so a step is chosen by role and never re-led
locally.

| Step | Size | Line height |
| --- | --- | --- |
| xs | 0.75rem | 1.75 |
| sm | 0.875rem | 1.85 |
| base | 1rem | 1.9 |
| lg | 1.125rem | 1.85 |
| xl | 1.25rem | 1.7 |
| 2xl | 1.5rem | 1.55 |
| 3xl | 1.875rem | 1.4 |
| 4xl | 2.35rem | 1.3 |
| 5xl | 3rem | 1.2 |
| 6xl | 3.75rem | 1.12 |
| 7xl | 4.75rem | 1.05 |
| 8xl | 6rem | 1 |

Tracking is one decision per size band, and the build only ships the two the design
reaches for. Display and section headings take the `tight` step; body copy and UI text
stay at the inherited `normal` (`0`).

| Token | Value | Band |
| --- | --- | --- |
| `tracking-tight` | `-0.01em` | Display and section headings (`24px` and up). |
| `tracking-tightest` | `-0.02em` | The reserve at the tight end of the same band. |

Sizes are in `rem`, so the reader's browser font size still applies. Inputs are `16px`
under `640px` (iOS zooms the page for anything smaller) and `14px` from `sm` up;
changing numerals carry `tabular-nums`.

## Motion

One scale, six steps. The steps are custom properties so raw CSS and the Tailwind
utilities move at the same speed.

```css
:root {
  --duration-fast: 140ms;
  --duration-ui: 150ms;
  --duration-base: 240ms;
  --duration-slow: 300ms;
  --duration-slower: 700ms;
  --duration-cinematic: 1000ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-ui-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```

`fast` and `base` answer an input, `slow` moves a state (hairlines, indicators,
scrims — the interaction ceiling is 300 ms), `slower` brings something on screen,
and `cinematic` is spent once per page — on the envelope opening. There is no step
above it and no per-component duration.

## Z-index

Six steps, one custom property each, so the utilities and the raw CSS agree.

```css
:root {
  --z-base: 0;
  --z-sticky: 40;
  --z-overlay: 50;
  --z-modal: 60;
  --z-toast: 70;
  --z-tooltip: 80;
}
```

| Step | What belongs here |
| --- | --- |
| base | Content that has to sit above a decorative layer inside its own section. |
| sticky | The page header and the viewer bar. |
| overlay | The photo lightbox, and any full-bleed surface that covers the page without taking focus. |
| modal | A dialog that takes focus: the RSVP form, the condolence form, the mobile menu. |
| toast | A confirmation that must stay visible above whatever opened it. |
| tooltip | The last rank, for what may never be covered: a tooltip, and the skip link that leads into the page. |

Layers inside the envelope stage (the flaps, the creases, the seal) order paint
inside a single 3D context and are not part of this scale.

## Spacing

Vertical rhythm is two values, not a per-section decision. A band takes
`.section-y`, which reads them, so a section's air can only change in one place.

```css
:root {
  --space-section: 5rem;
  --space-section-lg: 7rem;
}
```

`5rem` is the band's air on a phone and `7rem` from `768px` up. A band that needs
its own step states it in the utility layer (`lg:py-32`), which is emitted after
the component layer and therefore wins. Horizontal gutters are the shell's, not
this scale's: `.shell` owns the page gutter and the notch inset.

## Radii and shadows

| Token | Value | Role |
| --- | --- | --- |
| `rounded-card` | 2px | Paper and card edges. The atelier cuts, it does not round. |
| `rounded-panel` | 4px | Panels and fields. |
| `rounded-modal` | 6px | Dialogs. |
| `shadow-seal` | seal lift | The wax seal. |
| `shadow-seal-lg` | seal lift, dark | The seal on a dark band. |
| `shadow-photo` | deep | A photograph in the lightbox. |
| `shadow-soft` | resting | A surface at rest. |
| `shadow-lift` | raised | A surface that has left the page. |
| `shadow-envelope` | envelope | The envelope against the page. |

## Governed elsewhere

Contrast and focus are `better-accessibility`; type rendering is `better-typography`;
palette measurement is `better-colors`; spacing and structure are `better-layout`;
surfaces, icons and motion are `better-ui`. This file fixes the values those skills
measure against.