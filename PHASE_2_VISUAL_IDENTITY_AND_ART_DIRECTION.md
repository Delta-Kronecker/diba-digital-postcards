# PHASE 2 — Visual Identity & Art Direction Specification

**Ponisha — Premium Digital Postcards & Invitations (Frontend-Only Interactive Demo)**

| Field | Specification |
|-------|---------------|
| Document | Visual identity & art direction specs for all three Phase 2 design proposals |
| Status | For Agent 1 review — reviewable specification, not application code |
| Mandatory root | `D:\Hermes\ponisha-digital-postcards-demo` |
| Related baseline | `PHASE1_VISUAL_IDENTITY.md`, `PHASE_1_STRATEGY_REVISION.md` (Phase 2 gate: Proposal 1 Homepage, Proposal 2 Wedding invitation viewer, Proposal 3 Memorial invitation viewer) |
| Art direction | Premium & Elegant / Editorial Luxury / Timeless Digital Elegance ("Moment of Open" central concept) |
| Prepared by | Temporary general-purpose executor (design specification only); no application code written |
| Date | 2026-11-06 (Iran Standard Time, UTC+03:30) |

## 1. Purpose, scope, and governing constraints

This document fixes the visual identity and art direction for the three Phase 2 design proposals before any implementation:

1. **Proposal 1 — Homepage** ("Moment of Open"): five-section hierarchy — Hero, six category editorial spreads, Experience showcase (three-step motion sequence), Exhibition gallery at real card proportions, Footer/contact.
2. **Proposal 2 — Wedding invitation viewer**: deep-link entry `/invite/wedding/:slug`; animated card-open (envelope pull → seal break → flap reveal → inside); expressive Estedad typography with Champagne Gold micro-accents.
3. **Proposal 3 — Memorial invitation viewer**: deep-link entry `/invite/memorial/:slug`; fades-only motion; no Champagne Gold; Sage/Charcoal only; reduced motion as default.

All three proposals ship desktop + mobile + Persian RTL. Nothing here is code: values, ratios, pixel caps, and rules are stated so they can be reviewed, measured, and approved or rejected as a whole.

### 1.1 Constraints carried from Phase 1 (non-negotiable)

- Frontend-only demo; mock data + client-side state; no backend, database, API, auth, payments, or printing.
- Persian (RTL) is a hard requirement; English is secondary UI chrome only.
- Fonts: Estedad (variable 100–900) for headings/display/editorial; Vazirmatn (variable 100–900) for navigation/UI/forms/body.
- Canvas: Warm Ivory `#F6F1E9`. Primary text/structure: Charcoal `#25231F`. Accent: Champagne Gold `#B49A70`, hairline rules/underlines/focus rings/monogram highlights only, decorative, never backgrounds, **≤10–15% of screen pixels**. Supporting: Sage Green `#687567`, Dusty Rose `#A77D80`.
- **No** card components with borders/shadows, no primary-color CTA buttons, no notification badges, no pricing tables, no dashboard chrome, no template packs as product grids, no confetti/bounce/slide-deck animation, no gradients, no justified Persian text.
- **Memorial category: Champagne Gold is removed entirely.** Sage Green carries its accent role.
- Gold is decorative only: meaning is always carried by Charcoal text. Contrast: Charcoal on Warm Ivory ≈ 12:1 (AAA); Gold on Charcoal ≈ 2.6:1 — never the sole carrier of information.
- Maximum one gold element visible per section at a time (one rule, one underline, or one monogram highlight — never two simultaneously).

### 1.2 The seven differentiation levers (used across all six categories)

1. **Shared grid** — identical 8 px grid, max width, gutters, and hairline dividers everywhere (one brand).
2. **Variable composition** — alignment, image crop, and headline anchoring vary per template; grid never changes.
3. **Typography per template** — Estedad weight/scale/tracking changes the mood; Vazirmatn stays constant for UI.
4. **Accent temperature** — gold / sage / rose shift the mood per category.
5. **Image treatment** — B&W vs warm tint vs low-sat vs duotone, all within the palette; per-template art direction, not uniform filters.
6. **Gold placement** — corner rule, baseline underline, monogram frame, or nowhere (Memorial): a per-template signature detail.
7. **Motion per category** — standard fade, slow fade, subtle grain, or none (Memorial).

---

## 2. Shared visual system (identical across all three proposals)

### 2.1 Typography scale (concrete values)

Modular scale rooted at 16 px: 12 / 13 / 14 / 16 / 17 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64 / 96 px.

| Token | Use | Font | Weight (variable axis) | Desktop | Mobile | Line-height | Tracking |
|-------|-----|------|------------------------|---------|--------|-------------|----------|
| `.t-cover` | Invitation cover / hero display line | Estedad | Thin 100 / Light 300 | clamp(96px, 8vw, 120px) | clamp(40px, 10vw, 56px) | 1.10–1.25 | +0.04–0.06 em |
| `.t-title` | Card / template title, section heading | Estedad | Medium 500 | 64 px | 40 px | 1.15 | +0.04 em |
| `.t-section` | Section heading, category name | Estedad | Regular 400 / Medium 500 | 40 / 32 px | 28 / 24 px | 1.25 | +0.02 em (Regular) / +0.04 em (Medium) |
| `.t-template` | Template titles in gallery | Estedad | Medium 500 | 24 px | 20 px | 1.30 | — |
| `.t-nav` | Navigation | Vazirmatn | Medium 500 | 15 px | 14 px | 1.50 | — |
| `.t-button` | Buttons / CTAs (outlined only) | Vazirmatn | Medium 500 | 15 px | 14 px | 1.40 | — |
| `.t-body` | Body copy, descriptions | Vazirmatn | Regular 400 | 17 px | 16 px | 1.60 | — |
| `.t-caption` | Captions, image labels, category tags | Vazirmatn | Regular 400 / Medium 500 | 14 px | 13 px | 1.50 | — |
| `.t-fine` | Fine print, codes, RSVP confirmation toasts | Vazirmatn | Regular 400 | 12 px | 12 px | 1.50 | — |

- Arabic script renders smaller than Latin at equal px size; where Latin headings are mixed with Persian, bump the Arabic block ~4–6% or size per language block.
- Load via Google Fonts CSS2 API: `family=Estedad:wght@100..900&family=Vazirmatn:wght@100..900&display=swap`; `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`.
- Persian digits: standard Estedad specimen carries Latin digits; `۰–۹` via Estedad FD or digit substitution is **open** — no numeric content commits to a digit variant until Phase 3 verification.
- RTL-first: `direction: rtl` on `html`; logical properties only (`margin-inline-start`, `padding-inline-end`, `text-align: start`); no justified Persian text.

### 2.2 Color palette & application rules

| Role | Color | Usage |
|------|-------|-------|
| Canvas / backgrounds | Warm Ivory `#F6F1E9` | Dominant; every page, card, preview surface |
| Primary text / rules / structure | Charcoal `#25231F` | Headings, body, hairline dividers, CTA outlines; sole carrier of meaning |
| Supporting — Memorial | Sage Green `#687567` | Memorial accent; subtle Festivals support |
| Supporting — Wedding / Birthday | Dusty Rose `#A77D80` | Wedding softness, Birthday warmth, Festivals secondary |
| Accent — Champagne Gold | `#B49A70` | 1 px rules, hover underlines, focus rings, monogram highlights only; decorative |

**Gold restraint rules (non-negotiable, reviewable):**
1. Gold never backgrounds anything; never gradients, shadows, or dominant illustration.
2. Maximum one gold element visible per section at a time.
3. Gold conveys no information by itself — every gold-accented element is fully legible in Charcoal without it.
4. Memorial: zero `#B49A70` pixels anywhere in the category.
5. Gold pixel cap: measure `#B49A70` coverage per screen via devtools; must stay ≤10–15% of viewport pixels (e.g., on a 1440 × 900 screen ≈ 1.3 M px, gold budget ≈ 130k–195k px).
6. Contrast: Charcoal on Warm Ivory ≈ 12:1 (passes AAA). Gold on Charcoal ≈ 2.6:1 — decorative only.

**Category accent map:**
- Wedding: Champagne Gold (+ Dusty Rose whisper)
- Memorial: Sage Green only — no gold
- General Invitations: Charcoal-dominated + Champagne Gold hairline
- Opening Ceremonies: Champagne Gold structural (corner rules, underlines)
- Festivals & Celebrations: Dusty Rose + Sage; Champagne Gold micro-dots only
- Birthday: Champagne Gold + Dusty Rose (warmest temperature)

### 2.3 Spacing & proportions

Base grid: **8 px**. Spacing tokens: 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 px.

| Element | Specification |
|---------|---------------|
| Max content width (desktop) | 1120 px; hero and full-bleed photographic sections excepted |
| Page padding | Mobile 16 px (0–639 px); desktop 24 px (≥ 640 px); viewer columns 48 px desktop gutters |
| Section separation | 120 px desktop / 80 px mobile between full-width sections |
| Grid gutter | 24 px |
| Hairline divider | 1 px solid, Charcoal `#25231F` at 40% opacity on Warm Ivory; gold variant only where specified per proposal |
| Touch target | Minimum 44 × 44 px on mobile |
| Image proportions | Invitation cards: real card proportions, 3:4 portrait (never square thumbnails). Hero photographic detail: 3:2, single image, low saturation. Category spreads: one representative image, 4:3 or full-width band |
| Corner radius | None on layout elements; invitations may keep a subtle paper edge only where the card-open metaphor requires it — no rounded SaaS cards |

### 2.4 Image & art direction

- Photography style: editorial, natural light, low saturation, single subject per frame. No stock collages, no illustrations, no icon sets.
- One image per screen maximum; images never carry meaning alone — every image has a Vazirmatn caption or adjacent typographic block.
- Treatment within palette only: black-and-white, warm ivory/charcoal tint, or duotone built from Charcoal + one category accent. No hue shifts outside the palette.
- Per-category image direction (matrix in Section 6): Wedding — soft botanical close-ups, shallow depth; Memorial — monochrome or muted sage-tinted, generous whitespace; General Invitations — architectural interiors, still life, formal portraiture; Opening Ceremonies — geometric detail, venue exteriors, bold crops; Festivals & Celebrations — crowd-free detail shots (texture, hands, craft); Birthday — personal portraits, warm treatment.
- Placeholder strategy for the demo (final photography is Agency/Design-supplied): solid Warm Ivory blocks framed by a 1 px Charcoal hairline with a typographic label in Vazirmatn — never grey boxes or lorem image placeholders.

### 2.5 Motion principles

| Motion | Duration | Easing | Notes |
|--------|----------|--------|-------|
| Page / section fade | 500–700 ms | `cubic-bezier(0.25, 0.8, 0.25, 1)` | Slow, unhurried |
| Hover / focus micro-interaction | 200 ms | ease-out | Gold hairline underline appearance |
| Stagger between elements | 100 ms | — | Between typographic blocks |
|| Wedding card-open sequence | ≈ 1 650 ms total (pull 300 ms → seal break 250 ms → flap lift 700 ms → inside reveal 400 ms + 100 ms delay) | ease-out | Plays once per entry; tap/click trigger, Space on desktop; reduced motion → instant crossfade ||
|| Memorial motion | Fades only, ≈ 500 ms | ease-out | Zero card animation; reduced motion is the default experience regardless of setting ||

- Forbidden everywhere: bounce, confetti, celebration animation, sliding card decks, parallax, looping or constant motion, progress bars, circle step numbers, checkmark animations.
- `prefers-reduced-motion`: all animation collapses to an instant crossfade or static state; Memorial runs reduced-motion by default regardless of setting.
- No auto-playing media; background music is user-toggle only (off by default in Memorial).

---

## 3. Proposal 1 — Homepage ("Moment of Open")

**Concept:** one invitation, mid-open; the editorial line is the hero image. No carousel, no template grid, no hero image collage.

| Section | Layout | Typography applied | Color applied | Imagery | Motion | Gold placement |
|---------|--------|-------------------|---------------|---------|--------|----------------|
|| Hero | Full viewport, centered typographic block | `.t-cover` Estedad Thin 100 / Light 300, clamp(96px, 8vw, 120px) desktop / clamp(40px, 10vw, 56px) mobile, one editorial line; `.t-body` Vazirmatn Regular 400, 16 px subhead | Charcoal on Warm Ivory; CTA: outlined, 1 px `#B49A70` outline, gold fill on hover | Optional single full-bleed photographic detail (paper texture / calligraphy close-up), low saturation, behind type — never a collage | Slow fade in, 600 ms | CTA outline only (one gold element in section) ||
|| Six category editorial spreads | Full-width horizontal sections, or two-column (name + description + image); identical grid for all six | Category name `.t-section` Estedad Medium 500, 32 px / 24 px, tracking +0.02 em; description `.t-body` Vazirmatn Regular 400, 17 px | Charcoal names; per-category accent temperature (Section 6) | One representative image per section, per-category treatment | Section fade 600 ms; hover: opacity shift + **single visible** gold hairline underline beneath the hovered category name (only one underline visible in the section at a time) | One hover underline max at a time ||
|| Experience showcase | Three full-width typographic blocks in sequence | `.t-title` Estedad Medium 500 per step; `.t-body` Vazirmatn | Charcoal; one gold hairline rule beneath step one only | Single image or type specimen per step | Sequence: fade → card-open hint → fade; slow fades only, no progress indicators | One rule beneath step one ||
|| Exhibition gallery | One template per visual row at real card proportions (3:4 portrait), 80 px mobile / 120 px desktop vertical separation, Charcoal hairline dividers | Title `.t-template` Estedad Medium 500, 24 px; category tag `.t-caption` Vazirmatn Regular 400, 14 px | Charcoal text; **featured row marked with one Champagne Gold divider; all other rows Charcoal** | Large preview at real card proportions | Clean quick fades on row enter | One gold divider (featured row) — total gold elements in section: one ||
| Footer / contact | Typographic block, language switcher (`فارسی / English`), demo inquiry | `.t-caption` Vazirmatn, 14 px | Charcoal only | None | Static | None |

**Homepage gold budget:** CTA outline + one hover underline (visible one at a time) + one featured-row divider. Expected coverage well under the 10–15% cap; verify with devtools at review.

**Mobile adaptation:** all sections stack vertically; `.t-cover` clamp(40px, 10vw, 56px) mobile; touch targets ≥44 px; category spreads become single-column with image above text.

**Proposal 1 review checklist (pass/fail):**
- [ ] `.t-cover` clamp(96px, 8vw, 120px) desktop / clamp(40px, 10vw, 56px) mobile, Estedad Thin 100 / Light 300, tracking +0.04–0.06 em
- [ ] Six category spreads share one grid; differentiated only by accent temperature, image treatment, and gold placement
- [ ] Gold coverage ≤15% of viewport pixels; never more than one gold element visible per section at once
- [ ] No carousel, no template grid, no hero collage, no CTA fill-by-default
- [ ] RTL layout verified; logical properties; no justified Persian text
- [ ] Reduced-motion variant: all fades become instant crossfades

---

## 4. Proposal 2 — Wedding invitation viewer

**Concept:** the opened wedding invitation as a stationery object; tactile, quiet luxury; the card-open sequence is the hero interaction.

**Entry:** deep link `/invite/wedding/:slug` (desktop + mobile, Persian RTL).

| Element | Specification |
|---------|---------------|
|| Card canvas | Warm Ivory `#F6F1E9`, card proportions 3:4 portrait centered on screen; centered card clamp(320px, 80vw, 700px); side padding 16 px (< 640 px) / 24 px (≥ 640 px) ||
|| Cover title | `.t-title` Estedad Medium 500, 40 px / 28 px, tracking +0.03 em, Charcoal; one Champagne Gold hairline rule beneath (1 px) ||
|| Couple names | `.t-section` Estedad Medium 500, 56 px desktop / 32 px mobile, tracking +0.03 em, Charcoal; optional monogram initials with gold highlight ||
|| Date / venue / details | `.t-body` Vazirmatn Regular 400, 17 px, Charcoal; Dusty Rose whisper allowed on one supporting line only ||
|| RSVP / actions | `.t-button` Vazirmatn Medium 500, 15 px, outlined 1 px Charcoal; hover: gold hairline underline 200 ms; mock RSVP → Vazirmatn Regular 12 px toast ||
|| Supporting blocks | Background music toggle (user gesture; off by default for all categories), client-side photo gallery (single image, low-sat botanical), countdown timer (Vazirmatn `.t-fine` 12 px), copy link / share ||
|| Card-open motion | Pull 300 ms → seal break 250 ms → flap lift 700 ms → inside reveal 400 ms + 100 ms delay; ≈ 1 650 ms total; ease-out; no bounce; plays once per entry; trigger: tap/click, Space on desktop ||
| Hover micro-interactions (desktop) | Gold hairline underline beneath interactive text, 200 ms ease-out |
| Reduced-motion variant | Single crossfade cover → inside; no envelope/seal/flap animation; all hovers instant |
| Gold elements | Cover rule (1 px), optional monogram highlight, one visible hover underline at a time. Total gold pixels well under cap; verify at review. |

**Proposal 2 review checklist (pass/fail):**
- [ ] Card-open sequence ≈ 1 650 ms total, ease-out, no bounce or confetti
- [ ] Champagne Gold used for cover rule, optional monogram highlight, hover underlines only — never backgrounds
- [ ] One gold element visible at a time; coverage ≤15% of screen pixels
- [ ] Deep link `/invite/wedding/:slug` opens the card directly, no login
- [ ] Reduced-motion variant collapses the sequence to a crossfade
- [ ] Persian RTL throughout; Estedad/Vazirmatn loaded via CSS2 with `font-display: swap`

---

## 5. Proposal 3 — Memorial invitation viewer

**Concept:** dignified, calm, understated stationery; restraint as the design language. No celebration, no gold, no motion on the card itself.

**Entry:** deep link `/invite/memorial/:slug` (desktop + mobile, Persian RTL).

| Element | Specification |
|---------|---------------|
|| Card canvas | Warm Ivory `#F6F1E9`, card proportions 3:4 portrait centered ||
|| Cover title | `.t-title` Estedad Medium 500 / Regular 400, 56 px desktop / 32 px mobile, tracking +0.03 em, all-caps sparingly, Charcoal ||
|| Details | `.t-body` Vazirmatn Regular 400, 16–17 px, Charcoal; Sage Green `#687567` for one supporting accent line or hairline rule only ||
|| Accent color | Sage Green `#687567` **only**. Champagne Gold `#B49A70`: **zero pixels** anywhere in this proposal ||
|| Imagery | Monochrome or muted sage-tinted photography; generous whitespace; no botanical cheerfulness, no warmth cues ||
|| Motion | Fades only, ≈ 500 ms ease-out; **zero animation on the card itself** (no seal break, no flap, no envelope pull); reduced motion is the default experience regardless of user setting ||
|| Background music | Off by default; user-toggle only ||
|| Countdown | Minimal (single `.t-fine` line) or omitted ||
|| RSVP / actions | `.t-button` Vazirmatn Medium 500 outlined Charcoal; mock RSVP → toast; copy link / share ||
| Forbidden | Playful effects, bright color, confetti, fade-in delays that feel gimmicky, any gold |

**Memorial dignity checklist (pass/fail):**
- [ ] Zero `#B49A70` pixels; Sage `#687567` is the only accent
- [ ] No card animation of any kind; fades only
- [ ] Reduced motion is the default; background music off by default
- [ ] No cheerful imagery, no warm color cues, no celebratory typography

**Proposal 3 review checklist:** same as above plus typography (Estedad Medium 500 / Regular 400, restrained tracking +0.03 em on the deceased name, sober scale) and deep link `/invite/memorial/:slug` behavior.

---

## 6. Category differentiation — six personalities within one brand

What never changes (shared across all three proposals and all six categories): 8 px grid, 1120 px max width, 16 px mobile / 24 px desktop side padding, 48 px viewer gutters, Estedad + Vazirmatn font pair, Warm Ivory canvas, Charcoal text, hairline dividers only, RTL-first logical properties, gold ≤10–15% cap, no forbidden components.

| Category | Mood | Accent temperature | Estedad treatment | Image treatment | Gold placement | Motion | Forbidden |
|----------|------|-------------------|-------------------|-----------------|----------------|--------|-----------|
|| Wedding | Romantic, delicate, restrained | Champagne Gold + Dusty Rose whisper | Medium 500 names, tracking +0.03 em, delicate scale | Soft botanical close-ups, low saturation, shallow depth | Rule beneath title; optional monogram highlight; one hover underline at a time | Slow fade, gentle scale on hover | Hearts, confetti, script fonts, pink dominance ||
|| Memorial / Funeral | Respectful, calm, dignified | Sage Green only — no gold | Medium 500 / Regular 400, tracking +0.03 em on the deceased name only, all-caps sparingly | Monochrome or muted sage-tinted, generous whitespace | None — zero gold pixels | Fades only ≈ 500 ms ease-out; zero card animation; reduced motion default | Playful effects, bright color, confetti, gimmicky delays ||
|| General Invitations | Formal, editorial, refined | Charcoal-dominated + Champagne Gold hairline | Medium 500 display vs Light 300 editorial, high contrast | Architectural interiors, still life, formal portraiture (B&W) | One hairline divider per section | Clean, quick fades | Illustrative decoration, rounded corners ||
| Opening Ceremonies | Contemporary, architectural, confident | Champagne Gold structural | ExtraBold 800 massive scale for venue/date, asymmetrical alignment | Geometric detail, venue exteriors, bold crops | Corner rules; underlines | Confident fades, slight scale on entry | Celebratory illustration, fireworks motifs |
| Festivals & Celebrations | Expressive, energetic, disciplined | Dusty Rose + Sage; Champagne Gold micro-dots only | Expressive scale contrast (huge vs tiny), SemiBold 600 | Crowd-free detail shots: texture, hands, craft, rich within palette | Micro-dots only | Subtle animated grain, soft fade | Multicolor palettes, carnival illustration, ticket-stub design |
| Birthday | Joyful, creative, personal (all ages) | Champagne Gold + Dusty Rose (warmest) | Medium 500 → Bold 700 flexible; personal name prominent | Personal portraits, warm treatment | Accent on name/date line only | Gentle fade-in | Balloons, clowns, primary-color party palette, age-number badges |

**Differentiation statement:** layout DNA is identical across categories (one brand); personality comes from accent temperature, typography weight/scale/tracking, image treatment, gold placement, and motion policy. Two Wedding invitations can share fonts, grid, and gold restraint while one feels delicate-floral and the other bold-architectural — individually designed pieces from one studio, not re-skinned components.

**Example — same grid, two moods:**
- Wedding invitation: Estedad SemiBold 600 names at 32 px with +0.08 em tracking; one gold rule beneath the title; botanical low-sat image; slow fade.
- Opening Ceremonies invitation: Estedad ExtraBold 800 venue/date at 64–96 px asymmetrical; gold corner rules; bold cropped venue exterior; confident fade with slight scale entry.
Same grid, same fonts, same gold cap — different brand personality.

---

## 7. Cross-proposal consistency & anti-checklist

**Identical across Proposals 1–3:** grid system, spacing tokens, type scale, font loading, canvas color, charcoal text role, hairline divider spec, RTL rules, touch targets, gold cap and measurement method, forbidden-components list, reduced-motion behavior.

**Variable across proposals:** composition (hero block vs card spread vs gallery row), typography weight/scale per screen, accent temperature (gold/rose/sage presence), image treatment per category, motion policy (standard fade vs card-open sequence vs fades-only).

**Anti-checklist (a "fail" on any item blocks approval):**
- Card components with borders, drop shadows, or rounded SaaS styling
- Primary-color (gold or otherwise) CTA buttons — outlined only, charcoal text
- Notification badges, star ratings, "new/popular" ribbons, price tags, template packs
- Confetti, bounce, slide decks, parallax, looping animation, checkmark animations
- Gradients of any kind; gold backgrounds; gold gradients; gold shadows
- Justified Persian text; `direction: ltr` anywhere in Persian UI
- Gold carrying meaning without Charcoal text; more than one gold element visible per section at once
- Champagne Gold anywhere in Proposal 3 or the Memorial category

---

## 8. Accessibility & rendering notes

- Contrast: Charcoal `#25231F` on Warm Ivory `#F6F1E9` ≈ 12:1 (AAA for body and headings).
- Focus rings: visible; Champagne Gold 1–2 px outline acceptable as a decorative ring, with Charcoal outline underneath for contrast.
- Color is never the sole carrier of meaning (hover states pair underline + opacity).
- `font-display: swap` with Vazirmatn/Estedad fallback stack to prevent layout shift.
- Persian glyph rendering: verify on Chrome/Edge, Firefox, Safari, iOS Safari; variable Arabic fonts may fall back on older WebKit (open question, Section 9).
- Persian digits: TBD — Estedad (Latin digits) vs Estedad FD (`۰–۹`) vs substitution; no numeric content ships until resolved.
- Touch targets ≥ 44 × 44 px; reduced-motion support on all animated interactions; language switcher `فارسی / English` present on all three proposals.

---

## 9. Open questions (carried from Phase 1; do not block visual review)

1. Tech stack (Vite + Vanilla JS vs React vs Preact) — deferred to Phase 3; no impact on this spec.
2. Image sourcing: placeholder hairline blocks (specified in §2.4) vs Agency/Design photography — confirm before final assets.
3. Persian digits (`۰–۹`) — Phase 3 verification; this spec sets typographic sizes assuming Latin-compatible rendering.
4. iOS Safari variable Arabic font + animation behavior — verify before Phase 2 visual sign-off.

---

## 10. Review & sign-off

**Approval gate:** no implementation of any Phase 2 proposal until this document is approved by Agent 1 against the approved art direction (Premium & Elegant / Editorial Luxury / Timeless Digital Elegance).

**Reviewer checks per proposal:**
1. Typography matches the Section 2.1 scale exactly (weights, sizes, tracking, line-heights).
2. Color application follows Section 2.2; gold coverage measured ≤15%; one gold element max per section at a time.
3. Spacing/proportions follow Section 2.3 (8 px grid, dividers, image ratios, touch targets).
4. Imagery follows Section 2.4 (single image per screen, palette-only treatments, no illustration/collage).
5. Motion follows Section 2.5 and the proposal-specific table (durations, easing, forbidden motions, reduced-motion).
6. Category accent temperature matches Section 6 for the proposal's category.
7. RTL layout, Persian fonts, and contrast ratios verified.

On approval, this document becomes the visual baseline for Phase 2 static explorations (one HTML/CSS moodboard per proposal at the mandatory root, fonts from Google Fonts, no application logic) and for Phase 3 implementation. Revisions are returned as annotated markup on this file.

---
**Application code written:** None. **Prepared by:** temporary general-purpose executor for Agent 1 review. Agents 6 & 7 excluded; not Agents 2/3/4/5/8.

## Change Log — 2026-11-06
2026-11-06 — .t-cover token — previous: Light 300, unclamped sizes — resolved: Estedad Thin 100 / Light 300, clamp(96px, 8vw, 120px) desktop / clamp(40px, 10vw, 56px) mobile, lh 1.10–1.25, tracking +0.04–0.06em
2026-11-06 — .t-title / .t-section — previous: Light 300 / SemiBold 600 — resolved: Medium 500 / Regular 400–Medium 500
2026-11-06 — .t-button — previous: Vazirmatn SemiBold 600 — resolved: Vazirmatn Medium 500
2026-11-06 — Grid & spacing — previous: 1080px max width, 32px mobile / 64px desktop padding, 64px section separation — resolved: 1120px max width; 16px mobile / 24px desktop side padding; 48px viewer gutters; 120px desktop / 80px mobile section separation
2026-11-06 — Image proportions — previous: 5:7/7:5 cards, 16:9 spreads — resolved: 3:4 portrait cards; 4:3 category spreads
2026-11-06 — Motion — previous: no homepage motion row — resolved: hero static, interaction-only; wedding ≈1.65s sequence; memorial fades ≈500ms ease-out; reduced-motion fallbacks mapped for every motion
2026-11-06 — Music — previous: default unspecified — resolved: off by default for all categories; user gesture required; states Off / Playing / Paused; Memorial no music, no visualizer