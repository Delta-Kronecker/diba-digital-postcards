# PROPOSAL 1 — Homepage Design (Phase 2)

**Project:** Ponisha — Premium Digital Postcards & Invitations (Frontend-Only Interactive Demo)
**Mandatory root:** `D:\Hermes\ponisha-digital-postcards-demo`
**Deliverable:** `PROPOSAL_1_HOMEPAGE_DESIGN.md` (this file)
**Status:** For Agent 1 review — approval gate. No implementation until this direction is approved.
**Prepared by:** temporary general-purpose executor — design specification only. No application code written.
**Baseline:** Phase 1 consolidated deliverable (revised) §11 homepage hierarchy (5 sections), §12 category differentiation, §13 visual identity; §7 navigation structure; §8 essential interactions; §9 priority screens.
**Related:** `PHASE1_VISUAL_IDENTITY.md`, `PHASE_1_UX_RESEARCH_AND_STRATEGY.md`

---

## How to read this document

Two kinds of content appear throughout, and they are kept deliberately separate:

- **Rendered design descriptions** — what the user sees and experiences: composition, visual hierarchy, mood, image direction, storytelling, interaction behavior in words. These describe the *rendered result*, not the implementation.
- **Written specs** — concrete, reviewable, implementation-facing measurements: design tokens, sizes, colors, spacing, breakpoints, z-layers, and component behavior rules. Every spec section is labeled `Spec (written):` and collected in tables.

No HTML, CSS, or JavaScript application code appears anywhere in this document. Stack decisions are deferred to Phase 3 per the Phase 1 baseline.

---

## 0. Design system tokens (written spec)

This section is the single source of measurements for the homepage. All other sections reference these tokens.

### 0.1 Color tokens

| Token | Role | Value | Rule |
|---|---|---|---|
| `--color-canvas` | Canvas / dominant background | `#F6F1E9` Warm Ivory | All pages and sections; never replaced by white or grey washes |
| `--color-ink` | Primary text, rules, structure | `#25231F` Charcoal | Headings, body, hairline dividers, CTA outlines |
| `--color-gold` | Accent | `#B49A70` Champagne Gold | ≤10–15% of screen pixels per section; 1px hairline rules only; max ONE gold element per section; decorative only — never sole carrier of meaning; no gold backgrounds |
| `--color-sage` | Supporting accent | `#687567` Sage Green | Memorial category accent; subtle Festivals support |
| `--color-rose` | Supporting accent | `#A77D80` Dusty Rose | Wedding softness; Birthday warmth; Festivals secondary |

Contrast (spec): Charcoal `#25231F` on Warm Ivory `#F6F1E9` ≈ 12:1 (WCAG AAA). Gold `#B49A70` on Charcoal ≈ 2.6:1 — decorative only. Memorial category: gold removed entirely; Sage carries its accent role.

### 0.2 Typography tokens

| Use | Font | Weight | Size (desktop) | Fluid target (mobile) | Tracking | Line-height |
|---|---|---|---|---|---|---|
| Hero editorial line | Estedad | Thin 100 / Light 300 | clamp(96px, 8vw, 120px) | clamp(40px, 10vw, 56px) | +0.04–0.06 em | 1.10–1.25 |
| Category names | Estedad | Medium 500 | 24–32 px | 20–24 px | +0.08 em (wide) | 1.25 |
| Section headings | Estedad | Regular 400 / Medium 500 | 28–40 px | 24–28 px | +0.02 em | 1.30 |
| Template titles | Estedad | Medium 500 | 20–24 px | 18–20 px | — | 1.40 |
| Navigation | Vazirmatn | Medium 500 | 15 px | 14 px | — | 1.50 |
| CTAs / buttons | Vazirmatn | Medium 500 | 15 px | 14 px | — | 1.50 |
| Body / descriptions | Vazirmatn | Regular 400 | 16 px | 15 px | — | 1.60 |
| Captions, tags, fine print | Vazirmatn | Regular 400 / Medium 500 | 14 px | 13 px | — | 1.50 |

Font loading (spec): Google Fonts CSS2 `family=Estedad:wght@100..900&family=Vazirmatn:wght@100..900&display=swap`; preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`. Fallback stack with `font-display: swap` to prevent layout shift. Persian glyph rendering and the Estedad FD digit variant (۰–۹) remain open Phase 3 questions (§12). Arabic script renders ~4–6% smaller visually than Latin at the same px size; when Latin headings are mixed with Persian, size per language block rather than one global size.

### 0.3 Spacing and layout tokens

| Token | Value | Rule |
|---|---|---|
| Base grid | 8 px | All spacing multiples of 8 px |
| Container max-width | 1120 px | Centered; content never edge-to-edge on desktop |
| Horizontal padding | 16 px mobile (0–639 px); 24 px desktop (≥ 640 px); viewer columns 48 px desktop gutters | Logical `padding-inline-start` / `padding-inline-end` |
| Section vertical padding | 120 px desktop / 80 px mobile | Between sections |
| Hairline divider | 1 px | `--color-ink` at 12–20% opacity, or `--color-gold` where gold is the section's single accent |
| z-layers | Base 0 → Overlay 10 → Modal 50 | Header sticky at z 100 |

### 0.4 Motion tokens

| Token | Value | Rule |
|---|---|---|
| Section fade | 400–600 ms ease | Crossfade on section entry; slow, dignified |
| Card-open teaser | ~900 ms sequence | Envelope pull → seal break → flap reveal → inside; reduced-motion replaces with static mid-open card |
| Hover / focus | 150–200 ms | Gold hairline underline or fill; no bounce, no scale > 1.03 |
| Reduced motion | `prefers-reduced-motion: reduce` | All animation → instant or no motion; Memorial category zero animation everywhere |

Breakpoints (spec): Base 0 px; sm 640 px; md 768 px; lg 1024 px (desktop layout activates); xl 1280 px (1120 px max container). Mobile-first; no further layout change beyond xl.

---

## 1. Navigation — global header

### Rendered description
The header is quiet and present, never promotional. On desktop (RTL default): the Ponisha wordmark — Estedad logotype plus a thin Champagne Gold rule, no illustrative mark — sits on the right; category navigation in the center; a single outlined CTA ("Open an invitation") on the left. A persistent language switcher ("فارسی / English") lives in the header. On mobile: the wordmark and language switcher remain; navigation collapses into a right-opening drawer triggered by a hamburger on the left. No shadows, no background color change on scroll — the header sits on the Warm Ivory canvas with a 1px hairline bottom rule.

### Spec (written)

| Element | Desktop | Mobile | RTL mirroring |
|---|---|---|---|
| Wordmark | Estedad SemiBold 600, 20 px, Charcoal, + thin gold rule below | Same, 16 px | Right-aligned; menu icon on the left |
| Navigation | Vazirmatn Medium 500, 15 px, Charcoal links; gold hairline underline on hover | Hidden; drawer list, full height | Right-opening drawer; links right-aligned |
| CTA | Outlined, Vazirmatn Medium 500, 15 px, Charcoal text, 1px `#B49A70` outline; hover fills gold | Inside drawer, full-width row | CTA on the left (desktop) |
| Language switcher | Header, persistent, "فارسی / English" | Drawer toggle or footer toggle | Label order unchanged; position mirrored |
| Header height | 64 px | 56 px | — |
| Bottom divider | 1px hairline, `--color-ink` 12% opacity | Same | — |

Behavior: sticky on scroll; focus-visible ring 2px `#B49A70` with 2px offset on interactive items; tap active state on mobile = slight opacity drop (0.7), no hover layer.

---

## 2. Section 1 — Hero: "The moment of open" (Visual priority 1)

### Rendered description
The hero occupies the full viewport and establishes the brand before the user reads a word. A single invitation card is shown mid-open: envelope pulled, wax seal broken, flap lifted, inside surface visible — one card only, at card proportions, no device frame, no mockup collage. Overlaid on the Warm Ivory canvas, one Estedad editorial line in Charcoal states the concept (Persian-first placeholder copy: [editorial copy TBD — Agency/Design], e.g. "لحظه باز شدن" / "the moment of open"). Beneath it, one Vazirmatn subhead line describes the service in plain terms. One outlined CTA, "Open an invitation" (Persian: "باز کردن دعوتنامه"), completes the fold. Nothing else: no carousel, no stock split layout, no grid of template thumbnails, no secondary CTAs.

On mobile the card scales to fit a compressed hero (~70–85vh), the editorial line fluid-shrinks (120 → 40 px), and the CTA stays inline-outlined with tighter padding. Any supporting image is a single photographic detail treated with low saturation — never a collage.

### Spec (written)

| Property | Desktop | Mobile |
|---|---|---|
| Height | 100dvh | min 70vh, card scales to fit width |
| Card art | One mid-open card (envelope + seal break + flap + inside), centered at card proportions, clamp(320px, 80vw, 700px) | Same, contained, ~88% of viewport width, bounded 70–85vh |
| Editorial line | Estedad Thin 100 / Light 300, clamp(96px, 8vw, 120px), Charcoal, tracking +0.04–0.06 em | Estedad Thin / Light, clamp(40px, 10vw, 56px), Charcoal |
| Subhead | Vazirmatn Regular 400, 16 px, single line | Vazirmatn Regular 400, 15 px, centered |
| CTA | Vazirmatn Medium 500, 15 px, Charcoal text, 1px `#B49A70` outline, inline-outlined; hover: fill `#B49A70`, text stays Charcoal | Full width, 44 px touch target, inline-outlined |
| Gold budget | CTA outline = the section's single gold element (≤10–15% of pixels trivially satisfied) | Same |

Interaction states: CTA hover fills gold (transient micro-accent); focus-visible 2px gold ring; tap on mobile triggers the same state as click (demo mock — navigation target handled in Phase 3).

---

## 3. Section 2 — Category editorial spreads (Visual priority 2)

### Rendered description
Six full-width horizontal spreads, one per category — Wedding, Memorial & Funeral, General Invitations, Opening Ceremonies, Festivals & Celebrations, Birthday — in that order. Each spread is not a card: category name in Estedad with wide tracking, a one-sentence editorial description in Vazirmatn, and one representative image at real card proportions. Each category carries a distinct visual identity through accent temperature only: Wedding = Champagne Gold (+ Dusty Rose whisper); Memorial = Sage Green only, no gold; General = Charcoal + Champagne Gold hairline; Opening = Champagne Gold structural (corner rules); Festivals = Dusty Rose + Sage, Champagne Gold micro-dots; Birthday = Champagne Gold + Dusty Rose (warmest).

Imagery per category: Wedding soft botanical close-ups, low saturation; Memorial monochrome or muted sage-tinted; General architectural still life / formal portraiture; Opening geometric venue exteriors, bold crops; Festivals texture and craft detail, crowd-free; Birthday personal warm portraiture. Hover on desktop: the category name reveals a gold hairline underline; the whole spread is tappable and links to its category page. Spreads are separated by 1px hairline dividers. Never badges, ratings, or pricing.

### Spec (written)

| Property | Value |
|---|---|
| Layout | Full-width horizontal sections, one per category; desktop two-column (text + image side by side), mobile stacked |
| Category name | Estedad SemiBold 600, 24–32 px, wide tracking +0.08 em, Charcoal |
| Description | Vazirmatn Regular 400, 16–18 px, max-width 58 ch |
| Image | Real card proportions (approx. 5:7 portrait), one per spread, treatment per category mood above |
| Divider between spreads | 1px `--color-ink` 12% opacity |
| Accent per spread | Max one accent element (underline on hover, corner rule, or micro-dots); Memorial has zero gold |
| Tap target | Entire spread row; mobile full-width touch row |

Interaction states: desktop hover → gold hairline underline beneath the category name (the spread's single gold element); focus-visible ring on the spread link; mobile tap → slight opacity 0.7, navigation on release.

---

## 4. Section 3 — Experience showcase (Visual priority 3)

### Rendered description
A three-step editorial sequence that proves Ponisha's motion is real: **Fade → Card-open → Fade**. Each step is a full-width typographic block with a single image or type specimen. Step 1 (Fade): quiet entrance — content appears on a slow crossfade. Step 2 (Card-open): the hero interaction in miniature — envelope pull, seal break, flap reveal, inside shown — played gently on load or on tap, respecting reduced-motion (static mid-open card otherwise). Step 3 (Fade): quiet close. No progress bars, no step numbers in circles, no checkmark animations, no bouncing. Slow fades only (~400–600 ms).

### Spec (written)

| Property | Desktop | Mobile |
|---|---|---|
| Block height | ~60vh per step | ~45vh per step |
| Step heading | Estedad Regular / Medium 500, 28–40 px | 24–28 px |
| Step body | Vazirmatn Regular 400, 16–18 px | 15–16 px |
| Card-open teaser | ~900 ms sequence; looped gently or tap-triggered | Tap-triggered; static fallback under reduced motion |
| Gold budget | One gold hairline rule per section max | Same |

Interaction states: tap on mobile starts the card-open sequence; desktop hover over the teaser pauses/plays (respects `prefers-reduced-motion` — then no motion at all).

---

## 5. Section 4 — Exhibition gallery (Visual priority 4)

### Rendered description
Template previews as an exhibition, not a store: one template per row at real card proportions (portrait aspect, approx. 5:7), never square thumbnails, never a multi-column product grid. Each row shows a large preview image, the template title in Estedad Medium 500, a category tag in Vazirmatn Regular 400, and a Champagne Gold hairline divider beneath. Filtering uses simple text chips (category names in Vazirmatn) — no dropdowns, no "sort by price", no "new"/"popular" badges. Empty states are typographic: Charcoal Vazirmatn on Warm Ivory, no illustrations. Clicking a row opens the template detail view (detail view is out of scope for this proposal).

### Spec (written)

| Property | Value |
|---|---|
| Row format | One template per row, full width |
| Preview image | Real card proportions (~5:7 portrait), width capped 520 px desktop / ~85% mobile |
| Title | Estedad Medium 500, 20–24 px, Charcoal |
| Category tag | Vazirmatn Regular 400, 13–14 px, Charcoal |
| Divider | 1px `#B49A70` beneath each row (the row's single gold element) |
| Filter chips | Vazirmatn Medium 500, 13–14 px, outlined 1px `--color-ink` 30% opacity; active chip fills Charcoal with `--color-canvas` text |
| Empty state | Vazirmatn Regular 400, 16–18 px, Charcoal, centered, no illustration |

Interaction states: row hover → divider opacity increases (desktop only); chip tap toggles filter with a 300ms crossfade of the row list; no hover on mobile.

---

## 6. Section 5 — Footer / contact (Visual priority 5)

### Rendered description
A quiet closing: a 1px hairline top rule, then the Ponisha wordmark (Estedad logotype + thin gold rule, no illustrative mark) closing the brand. A demo inquiry line ("Demo inquiry — [contact placeholder]") in Vazirmatn, and the language switcher ("فارسی / English"). No newsletter form, no social grid, no copyright noise beyond one fine-print line. On mobile the footer collapses to a single stacked column; on desktop it sits in two logical columns mirrored for RTL.

### Spec (written)

| Property | Desktop | Mobile |
|---|---|---|
| Top divider | 1px `--color-ink` 12% opacity | Same |
| Wordmark | Estedad Medium 500, 18–20 px + thin gold rule | 16–18 px |
| Demo inquiry | Vazirmatn Regular 400, 14–16 px, contact placeholder (mock, no backend) | Same, stacked |
| Language switcher | "فارسی / English" | Footer toggle or drawer toggle |
| Fine print | Vazirmatn Regular 400, 12–13 px, `--color-ink` 50% opacity | Same |
| Vertical padding | 80 px top / bottom | 60 px |

---

## 7. Full-page composition and visual hierarchy

Scroll narrative (priority 1 → 5):

1. **Hero** — the moment of open; premium identity before reading.
2. **Category spreads** — six distinct personalities; answers "do they have my occasion?".
3. **Experience showcase** — motion is real, demonstrated fade → card-open → fade.
4. **Exhibition gallery** — tangible template quality at real proportions.
5. **Footer** — contact, language switch, brand close.

Composition rules: every section separated by whitespace (120 px desktop / 80 px mobile vertical padding) plus a 1px hairline divider; no overlapping elements; no section competes with the hero; maximum one gold element per section; the Memorial spread and its gallery rows carry no gold.

---

## 8. Interaction states (cross-section)

| State | Desktop | Mobile | Notes |
|---|---|---|---|
| Hover | Gold hairline underline (category names), divider opacity (gallery), CTA fill | N/A — no hover layer | Hover styles never carry sole meaning |
| Focus-visible | 2px `#B49A70` ring, 2px offset | Same where keyboard used | Applies to CTA, links, chips, language switcher |
| Tap / active | Click triggers navigation | Opacity 0.7 on press, release triggers | No hover-dependent content on mobile |
| Card-open teaser | Tap to play once per entry (≈1.65s — pull → seal break → flap lift → inside reveal); static mid-open card under reduced motion | Tap to play once per entry (≈1.65s); static fallback under reduced motion | Memorial: static only |
| Page / section transition | Crossfade 400–600 ms | Same | `prefers-reduced-motion` → cut / instant |
| Language switch | Toggle swaps UI chrome; editorial copy stays Persian-first | Same in drawer / footer | Persian default; English secondary |

Reduced motion: all fades replaced with instant appearance; Memorial category has zero animation on every screen; no parallax, no confetti, no sliding decks.

---

## 9. Responsive behavior — desktop → tablet → mobile

| Section | Desktop (≥1024 px) | Tablet (640–1023 px) | Mobile (0–639 px) |
|---|---|---|---|
| Hero | 100dvh; editorial line 96–120 px | ~85vh; line 64–80 px | min 70vh; line 40–56 px; card contained |
| Navigation | Horizontal: wordmark right, nav center, CTA left | Horizontal, tighter padding | Drawer (right-opening), hamburger left |
| Category spreads | Two-column side-by-side | Two-column, narrower image | Stacked: text then image, full-width |
| Experience showcase | 60vh steps | 50vh steps | 45vh steps, tap-triggered teaser |
| Exhibition gallery | One row full width; preview capped 520 px | One row; preview ~420 px | One row; preview ~85% width; chips wrap |
| Footer | Two logical columns | Two columns | Single stacked column |

RTL applies at every breakpoint: logical properties handle start/end spacing automatically; drawer opens from the right; CTA position unchanged.

---

## 10. RTL behavior (Persian, default direction)

- `direction: rtl` default on `html`; all spacing via logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`); no physical left/right values in the spec.
- Header mirrored: wordmark right, navigation center, CTA left; drawer opens from the right.
- Category spread order top-to-bottom unchanged; within-spread horizontal pairs align to the start (right) side in RTL and reverse physically for LTR.
- Typography: Estedad for editorial/headings, Vazirmatn for UI; Persian-first editorial copy; no justified Persian text; body line-height 1.55–1.65 to accommodate Arabic glyph stacking.
- Arabic numerals vs Persian digits (۰–۹): decision deferred to Phase 3 (open item §12.2).
- Font fallback: `font-display: swap` with Estedad / Vazirmatn fallback stack; verify iOS Safari Persian variable-font rendering in Phase 3 (open item §12.3).
- Language switcher labeled "فارسی / English"; English limited to UI chrome + event metadata per Phase 1 revision R4.

---

## 11. Explicit exclusions — not on this homepage

Per Phase 1 revision R2/R4: no customization mock (relocated to the template-preview flow behind a "Customize" CTA, P1); no coupons or tokens (cut entirely); no carousel; no stock split layout; no hero or template thumbnail grid; no badges, ratings, or pricing; no template "packs"; no rounded rectangular cards with drop shadows; no primary-color buttons; no confetti, bounce, or celebration animation; no video gallery; no QR check-in; no guest book. The homepage sells the received invitation, not the editing tool.

---

## 12. Open items (decisions await Agent 1)

1. Final photography source (Assumption A3): placeholder art direction vs Agency/Design imagery — confirmed before final assets.
2. Persian digits: Estedad vs Estedad FD (۰–۹) — Phase 3 verification.
3. iOS Safari Persian variable-font behavior — Phase 3 sign-off.
4. CTA label Persian translation ("باز کردن دعوتنامه") — pending localization scope (Q4).
5. Tech stack (Vite + Vanilla JS vs React vs Preact) — deferred to Phase 3; not specified here.

---

## 13. Review and acceptance criteria (Agent 1)

- [ ] Exactly five sections in order: Hero → Category editorial spreads → Experience showcase → Exhibition gallery → Footer / contact.
- [ ] Hero: one card mid-open (envelope/flap visible), one Estedad editorial line, one outlined CTA "باز کردن دعوتنامه" / "Open invitation"; no carousel, no split layout.
- [ ] Six category spreads with distinct accent temperatures; Memorial spread with zero gold.
- [ ] Gold ≤10–15% of pixels per screen; max one gold element per section; never sole carrier of meaning.
- [ ] Typography: Estedad headings/editorial, Vazirmatn UI; RTL-first logical properties; Persian-first editorial.
- [ ] Interactions: hover / focus-visible / tap states defined; `prefers-reduced-motion` fallback; Memorial zero motion.
- [ ] Desktop + mobile + Persian RTL behavior specified per section.
- [ ] No application code in this document; no stack committed.

---

## Appendix A — Rendered description vs written spec index

| Area | Rendered design description | Written spec |
|---|---|---|
| 0 Design tokens | — | §0.1–0.4 |
| 1 Navigation | §1 Rendered description | §1 Spec (written) |
| 2 Hero | §2 Rendered description | §2 Spec (written) |
| 3 Category spreads | §3 Rendered description | §3 Spec (written) + image direction |
| 4 Experience showcase | §4 Rendered description | §4 Spec (written) |
| 5 Exhibition gallery | §5 Rendered description | §5 Spec (written) |
| 6 Footer | §6 Rendered description | §6 Spec (written) |
| 7 Composition | §7 Scroll narrative + rules | — |
| 8 Interaction states | — | §8 State matrix |
| 9 Responsive | — | §9 Breakpoint matrix |
| 10 RTL | §10 RTL rules | §0.3 logical properties, §10 |

End of proposal. No application code included.

## Change Log — 2026-11-06
2026-11-06 — Typography table — previous: unclamped hero size, Vazirmatn SemiBold 600 CTA — resolved: Estedad hero clamp sizes; CTA Vazirmatn Medium 500, 15px, inline-outlined
2026-11-06 — Spacing & breakpoints — previous: 48/32/20px padding; breakpoints ≤768 / 769–1024 / ≥1025 — resolved: 16px (<640px) / 24px (≥640px) side padding; 48px viewer gutters; breakpoints 0 / 640 / 768 / 1024 / 1280
2026-11-06 — Hero spec — previous: card max-width ~90%, SemiBold CTA — resolved: centered card clamp(320px, 80vw, 700px); mobile card 70–85vh, editorial clamp(40px,10vw,56px), min 70vh
2026-11-06 — Interaction states — previous: teaser play/pause on hover, ~900ms — resolved: tap once per entry (≈1.65s sequence); static mid-open card under reduced motion; Memorial static only
2026-11-06 — Responsive matrix — previous: Desktop ≥1025 / Tablet 769–1024 / Mobile ≤768 — resolved: Desktop ≥1024 / Tablet 640–1023 / Mobile 0–639
2026-11-06 — Acceptance CTA label — previous: "Open an invitation" — resolved: "باز کردن دعوتنامه" / "Open invitation"