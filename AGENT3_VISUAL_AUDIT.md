# Agent 3 — Visual & Creative Designer: Art-Direction Audit

**Project:** Diba Digital Postcards (`ponisha-digital-postcards-demo`)
**Stack audited:** React 19 + Vite + Tailwind 3, RTL Persian, `src/` + `public/images/` (13 JPEG assets)
**Scope:** Visual identity, typography system, image relevance per category, color/material systems, memorial zero-gold, wedding vs memorial differentiation, motion decoration, composition/whitespace, responsive typography. No code written; no `src/` or `public/` files modified. Only this report is added.
**Date:** 2026-11-07 (Iran Standard Time)
**Baseline spec:** `PHASE_2_VISUAL_IDENTITY_AND_ART_DIRECTION.md` (Premium Editorial Luxury / "Moment of Open"), `CRITICAL_AUDIT_REPORT_PHASE3.md`, `AGENT2_UX_AUDIT.md`.

---

## 0. Executive summary

The implementation ships a coherent "luxury gold" aesthetic but diverges from the approved art direction in ways that read as **generic SaaS / template-studio** rather than **editorial stationery**:

1. **Brand mark** is a `Sparkles` glyph inside a gold-foil square (`Navbar.jsx:26-43`, `Footer.jsx:21-28`) — the single most repeated visual, and it is off-spec (spec: Estedad wordmark + thin gold hairline, no illustrative mark).
2. **Typography is heavy and Latin-tracked**: `font-extrabold`/`font-bold` on display lines, `tracking-tight` / `letter-spacing: -0.02em` on Persian Estedad (should be **positive** +0.02–+0.06 em), and `.text-gold-foil` gradient text on couple names (`WeddingViewer.jsx:111`) — gold carrying meaning at 2.6:1 contrast, forbidden.
3. **Gold is used as a background/fill** (`.bg-gold-foil` buttons, seal, CTA pills) despite the non-negotiable "gold never backgrounds anything; outlined CTAs only."
4. **Looping decoration** (gold shimmer on buttons, wax shimmer, pulse-glow rings, light beams) runs constantly, including on Memorial, where motion must be zero.
5. **Imagery is stock-mismatched** to categories: memorial cover reads warm red/brown (storm-cloud feel, avg #9d5e4c), festival covers read nightclub/neon (purple #433d5c, cyan #0f8a9d), birthday cover is cyan/teal, opening reads dark office, exhibition cover is an odd 1200×1707 portrait. Only wedding-flowers and memorial-candle are close to acceptable, and even those are warm-tinted or mislabeled.
6. **Color system is split-brain**: a dark theme was bolted on (commit 42e4c8e) that is not in the approved spec; `HomePage` hardcodes ivory, so the toggle silently does nothing on the most visible page; Memorial light-beam container is gold for all categories.
7. **Composition uses SaaS idioms** the spec explicitly forbids: `rounded-3xl` cards, `shadow-2xl`, badges, feature checklists, `rounded-full` pills — instead of hairline dividers and paper edges.
8. **Responsive typography** is ad-hoc (`text-3xl md:text-5xl` jumps) with no token scale; the spec's modular scale (12/13/14/16/17/20/24/28/32/40/48/56/64/96) and clamp() expressions are not implemented.
9. **Memorial is not zero-gold in practice**: gold light beams, gold interior dots, gold shadow on the seal, gold RSVP border all render on the memorial path.

Priority legend: **P0** = blocks approval / breaks core identity; **P1** = spec compliance; **P2** = polish.

---

## 1. Visual identity & branding

### 1.1 Logo mark — Sparkles-in-square (P0)

- `Navbar.jsx:26-43` and `Footer.jsx:21-28`: a 40×40 `rounded-xl bg-gold-foil` square containing a 10×10 dark tile with a `Sparkles` lucide glyph (`text-gold-foil`). This is a generic SaaS "sparkle app" mark and violates spec §1.1 ("no icon sets", "no illustrative mark") and Agent 2 §1.7.
- **Fix direction**: remove the square+glyph entirely. Brand lockup = Estedad wordmark "دیبا" (Medium 500, tracking +0.02 em) with a single 1 px Champagne Gold hairline beneath or beside it, Charcoal text. On dark surfaces keep Charcoal-on-ivory rules inverted to Warm Ivory-on-charcoal; never gold-fill the mark.
- **Files**: `src/components/Navbar.jsx` (brand button, lines 26-43), `src/components/Footer.jsx` (lines 21-28).

### 1.2 Dark theme vs. approved canvas (P0/P1)

- Approved canvas is **Warm Ivory `#F6F1E9`** with Charcoal text (spec §1.1, §2.2). The repo defaults to dark (`App.jsx:28-39`, `ThemeToggle.jsx:8-10`) and `index.css:6-18` sets `:root` to dark `#121212`.
- `HomePage.jsx:12` hardcodes `bg-[#F6F1E9] text-[#25231F]`, so the toggle has no effect on the homepage (Agent 2 §12.1). This is the most visible inconsistency.
- **Decision needed (art direction)**: either drop the dark theme and ship the approved ivory canvas (recommended — the spec has no dark palette, and a dark mode would require a full second token set that does not exist), or define a real dark token set. As-is, the toggle is a half-feature.
- **Files**: `src/App.jsx`, `src/pages/HomePage.jsx`, `src/components/ThemeToggle.jsx`, `src/index.css`.

### 1.3 Gold material system (P0)

- Gold is used as **fill/background** throughout: `.bg-gold-foil` on buttons (`Navbar.jsx` CTA, `CategorySpread.jsx` CTA, `RSVPModal.jsx` submit, `DemoCustomizer.jsx`, `InteractiveShowcase.jsx`), the wax seal (`3DEnvelope.jsx`), and the top accent line (`CategorySpread.jsx:78-86`).
- Spec §1.1/§2.2: gold is **decorative only** — 1 px rules, hover underlines, focus rings, monogram highlights; never backgrounds; never gradients; ≤10–15% of viewport pixels; max one gold element per section.
- `.text-gold-foil` (gradient text) is applied to couple names (`WeddingViewer.jsx:111`) and arguably CountdownTimer digits — gold carrying meaning at ~2.6:1 contrast (forbidden; spec §2.2 #3).
- **Fix direction**: convert every gold-filled button to an outlined Charcoal button with a gold hairline underline on hover (`.t-button` Vazirmatn 500, 1 px Charcoal outline, gold underline on hover, 200 ms). Remove gold from backgrounds, shadows, and gradients. Keep gold on: one cover rule, optional monogram highlight, one hover underline at a time.
- **Files**: `src/index.css` (`.bg-gold-foil`, `.text-gold-foil`, `.gold-glow*`), `src/components/CategorySpread.jsx`, `src/components/Navbar.jsx`, `src/components/RSVPModal.jsx`, `src/pages/WeddingViewer.jsx`, `src/components/3DEnvelope.jsx`.

### 1.4 Glassmorphism panels (P1)

- `.glass-panel` / `.glass-dark` (`index.css:74-86`) use gold borders and heavy blur; `RSVPModal.jsx:69-73` applies `glass-panel border border-amber-500/30` even for Memorial. Spec has no glassmorphism — surfaces are Warm Ivory paper with 1 px hairlines.
- **Fix direction**: replace glass panels with solid `#F6F1E9` surfaces + 1 px Charcoal hairline (40% opacity) border; no backdrop-blur on cards (blur only on sticky nav if retained).
- **Files**: `src/index.css:74-86`, `src/components/RSVPModal.jsx:69-73`.

---

## 2. Typography system

### 2.1 Font loading (P1, mostly OK)

- `index.html` loads Vazirmatn 100–900 via Google Fonts and Estedad via jsdelivr font-face. Spec wants CSS2 API for both with `font-display: swap` and `preconnect` (preconnect ✓). Estedad loaded from a third-party CDN (jsdelivr) — acceptable for demo but flag for production (self-host). No numeric Persian-digit variant committed (open question in spec §2.1).

### 2.2 Weights (P0/P1)

Approved (spec §2.1):

| Token | Weight | Where used in code |
|---|---|---|
| `.t-cover` | Thin 100 / Light 300 | not implemented (HomePage h1 `font-normal`) |
| `.t-title` | Medium 500 | WeddingViewer uses `font-extrabold` (line 109) |
| `.t-section` | Regular 400 / Medium 500 | CategorySpread h3 `font-normal` (line 138) — close |
| `.t-template` | Medium 500 | ExhibitionGallery h3 `font-bold` (line 78) |
| `.t-nav` | Medium 500 | Navbar `font-bold` brand (line 36), `font-medium` nav (line 49) |
| `.t-body` | Regular 400 | mostly `font-vazir` default (400) ✓ |
| `.t-caption` | Regular 400 / Medium 500 | various `font-semibold`/`font-bold` |
| `.t-fine` | Regular 400 | CountdownTimer digits `font-bold` (line 47) |

- **Excessive bold**: `font-extrabold` on WeddingViewer h1 (line 109) and CategoryViewer h1 (line 88); `font-bold` on HomePage h2 (line 74), ExhibitionGallery h3 (line 78), Footer h4 (line 51), RSVP h3 (line 99). Spec: Medium 500 for titles, Regular 400 for body; bold (700) only for the Birthday name line and Opening venue at massive scale.
- **Fix direction**: replace `font-extrabold`→`font-medium` (500) on display titles; `font-bold`→`font-medium` on section headings; keep `font-normal` (400) for body. Introduce `.t-*` utility classes in `index.css` with the exact weights so components stop improvising.
- **Files**: `src/pages/WeddingViewer.jsx:109-111`, `src/pages/CategoryViewer.jsx:104`, `src/pages/HomePage.jsx`, `src/components/ExhibitionGallery.jsx:84`, `src/components/Footer.jsx`, `src/components/RSVPModal.jsx:99`, `src/components/CountdownTimer.jsx:48`.

### 2.3 Sizes (P1)

- Spec modular scale: 12 / 13 / 14 / 16 / 17 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64 / 96 px. Code uses Tailwind's default `text-xs/sm/base/lg/xl/2xl/3xl/4xl/5xl/6xl` which do not map to this scale (e.g. `text-3xl` = 30 px, not 32; `text-6xl` = 60 px, not 64).
- `.t-cover` should be `clamp(96px, 8vw, 120px)` desktop / `clamp(40px, 10vw, 56px)` mobile — not implemented (HomePage h1 `text-4xl md:text-6xl`).
- **Fix direction**: define CSS custom properties `--t-cover`, `--t-title`, … in `index.css` with clamp() and the spec sizes, and apply via classes; update components to use them.
- **Files**: `src/index.css`, `src/tailwind.config.js`, `src/pages/HomePage.jsx:30`.

### 2.4 Line-height (P1)

- Spec: cover 1.10–1.25, title 1.15, section 1.25, template 1.30, nav 1.50, button 1.40, body 1.60, caption/fine 1.50.
- Code: `leading-[1.2]` (HomePage h1), `leading-tight` (many), `leading-relaxed` (body). `leading-tight` ≈ 1.25 is close for headings but body should be 1.60 (`leading-relaxed` ≈ 1.625 ✓). Persian needs the looser end; keep.
- **Fix direction**: set line-height inside each `.t-*` token rather than per-component `leading-*`.

### 2.5 Letter-spacing (P0)

- `index.css:36-39`: `h1, h2, h3, h4, .font-editorial { letter-spacing: -0.02em; }` and components use `tracking-tight`/`tracking-tighter`. **Negative tracking is wrong for Persian/Arabic script** and contradicts spec §2.1 (cover +0.04–+0.06 em, title +0.03–+0.04 em, section +0.02/+0.04 em).
- **Fix direction**: flip to positive tracking per token: cover +0.04–0.06 em, title +0.03–0.04 em, section +0.02 (Regular) / +0.04 (Medium) em, template 0, body/caption/fine 0. Remove `tracking-tight` usages. This single change will dramatically improve Persian legibility.
- **Files**: `src/index.css:36-39`, `src/pages/WeddingViewer.jsx:111`, `src/pages/HomePage.jsx:30`, `src/components/CategorySpread.jsx:152`.

### 2.6 Gradient text abuse (P0)

- `WeddingViewer.jsx:109-111`: couple names in `.text-gold-foil` (CSS gradient clipped to text). Gold at 2.6:1 contrast carrying the most important information on the card. Forbidden (spec §2.2 #3, §7 anti-checklist "Gold carrying meaning without Charcoal text").
- **Fix direction**: solid Charcoal `#25231F` (or Warm Ivory on dark) for names; if a gold accent is desired, a single 1 px gold hairline beneath the name line only. CountdownTimer digits also use gold inline color — acceptable as decorative but ensure the timer is not the sole information carrier; better Charcoal with gold hairline.
- **Files**: `src/pages/WeddingViewer.jsx:109-111`, `src/components/CountdownTimer.jsx:47-49`.

### 2.7 Responsive typography (P1)

- No token scale; sizes jump at `md:` only, no `sm:`/`lg:` steps, no clamp(). Hero blob `w-[500px]` overflows small viewports (Agent 2 §14.2). Mobile header not responsive (Agent 2 §14.1).
- **Fix direction**: implement `.t-*` with `clamp()` per spec §2.1 so a single class handles mobile→desktop; add `sm:`/`lg:` only where clamp() cannot express the intent. Verify at 360 px, 768 px, 1024 px, 1440 px.
- **Files**: `src/pages/HomePage.jsx`, `src/components/Navbar.jsx:23`.

---

## 3. Color & material systems

### 3.1 Palette drift (P1)

- Approved: Warm Ivory canvas, Charcoal text/structure, Sage (Memorial), Dusty Rose (Wedding/Birthday/Festivals), Champagne Gold micro-accents. Code adds `--color-gold-light`, `--color-sage`, `--color-rose` ✓ but also a dark canvas `#121212` and stone scale that dominates.
- **Fix direction**: make Warm Ivory the dominant canvas; Charcoal the structural color; restrict gold to ≤15% cap measured via devtools. Remove stone-gray-as-primary usage where it replaces Charcoal.
- **Files**: `src/index.css:6-18`, `src/App.jsx`.

### 3.2 Gold pixel budget (P0, unmeasured)

- Spec requires measuring `#B49A70` coverage per screen (≤10–15%). Likely exceeded by: gold-foil buttons (large), gold shimmer backgrounds, gold top accent lines on every CategorySpread card (`CategorySpread.jsx:78-86`), gold badge backgrounds, light beams. No measurement has been done (Agent 2 §17).
- **Fix direction**: after converting gold fills to outlines, measure with devtools; target < 5% on homepage, < 8% on wedding viewer.
- **Files**: `src/index.css`, `src/components/CategorySpread.jsx`.

### 3.3 Category accent map (P1, partially implemented)

- Spec §6 map: Wedding Gold+Rose, Memorial Sage only, General Charcoal+Gold hairline, Opening Gold structural, Festivals Rose+Sage+gold micro-dots, Birthday Gold+Rose warmest.
- Code: most spreads hardcode gold regardless of category (CategorySpread CTA uses gold for all except memorial ✓; top accent line uses gold for all hasGold ✓). Festivals and Birthday both use gold CTA — acceptable but should shift Birthday to warmest (rose-forward) and Festivals to rose+sage. Festival badge says "نوروز ۱۴۰۴" (stale year — should be ۱۴۰۶ per data).
- **Files**: `src/components/CategorySpread.jsx`, `src/data/categories.js` (festival badge).

---

## 4. Image relevance per category

### 4.1 Measured image data

Dimensions and dominant colors measured via Python JPEG SOF parsing + average RGB sampling:

| File | W×H | Ratio | Avg RGB | Dominant palette (quantized) | Issue |
|---|---|---|---|---|---|
| `memorial-cover.jpg` | 1200×1600 | 3:4 ✓ | (157,94,76) | warm red-brown #9d5e4c, red #af361a | **Red storm-cloud / warm mourner feel**; reads dramatic, not dignified. Violates Memorial "no warm color cues." |
| `memorial-candle.jpg` | 1200×1800 | 2:3 | (83,71,55) | dark brown #534737 | Warm amber candle; acceptable subject but warm tint. A CV classifier (Xenova/vit) labeled this image "mushroom/agaric" — content is ambiguous. |
| `general-cover.jpg` | 1200×1707 | ~0.70:1 | (78,66,52) | dark brown #4e4234 | Odd ratio (not 3:4/4:3); dark brown; used for exhibition opening but reads like a moody portrait, not architecture. |
| `general-arch.jpg` | 1200×801 | 3:2 | (174,178,176) | cool gray #aeb2b0 | Good cool gray; subject ambiguous (could be architecture). Keep but verify it is an architectural detail. |
| `opening-cover.jpg` | 1200×801 | 3:2 | (35,50,73) | dark blue #233249 | Dark blue office; user flags "opening concert" mismatch — if it depicts a concert/venue rather than a tech hub, replace. |
| `opening-venue.jpg` | 1200×800 | 3:2 | (69,68,62) | dark gray #45443e | Dark interior; acceptable for tech hub if it shows a modern hall. Verify no concert staging. |
| `festival-cover.jpg` | 1200×900 | 4:3 ✓ | (40,96,133) | blue #286085, cyan #08abc0 | Blue/cool; user flags "nowruz nightclub" — if neon/party, replace. |
| `festival-lights.jpg` | 1200×800 | 3:2 | (67,61,92) | purple #433d5c, lavender #b09ac1 | Purple neon reads nightclub. |
| `birthday-cover.jpg` | 1200×800 | 3:2 | (15,138,157) | cyan #0f8a9d, teal #00aec1 | Cyan/teal is off-palette for "warmest" birthday; reads generic party. |
| `birthday-cake.jpg` | 1200×882 | ~1.36:1 | (158,136,117) | warm brown #9e8875, cream #d3c6b5 | Warm brown cake — acceptable subject. A Unsplash alt description calls this "Colorful confetti falling down with a teal background." |
| `wedding-cover.jpg` | 1200×800 | 3:2 | (77,69,59) | dark brown #4d453b | Dark, low-contrast; wedding should be soft botanical, low saturation, shallow depth. |
| `wedding-flowers.jpg` | 1200×1800 | 2:3 | (215,217,210) | near-white #d7d9d2 | Near-white, low info; okay as a light botanical but lacks subject. |
| `wedding-hall.jpg` | 1200×775 | ~1.55:1 | (160,121,99) | warm tan #a07963 | Warm tan hall; acceptable but verify it reads as a refined venue. |

All files: JPEG, JFIF 1.02, 72 DPI, progressive, 8-bit, 3 components. Size range 82 KB–454 KB; heaviest: `general-cover.jpg` 454 KB, `festival-cover.jpg` 364 KB.

### 4.2 Relevance findings

| # | Sev | Finding | Location |
|---|-----|---------|----------|
| 4.2.1 | P0 | Memorial cover is an industrial night scene (oil refinery, avg #9d5e4c red-brown) — dark, industrial, possible red/orange sky. Directly violates memorial dignity (monochrome/muted sage, generous whitespace, no warmth cues). | `invitations.js:47`, `categories.js:19`, `public/images/memorial-cover.jpg` |
| 4.2.2 | P0 | Memorial "candle" image is CV-classified as a mushroom — content is wrong; also 2:3 portrait. | `invitations.js:50`, `public/images/memorial-candle.jpg` |
| 4.2.3 | P0 | Birthday cover/birthday-cake are confetti imagery (Unsplash alt: "Colorful confetti falling down"). Spec forbids confetti/bounce/celebration animation; birthday should be personal portraits, warm treatment, "not childish" but joyful. | `invitations.js:151-154`, `categories.js:30-33`, `public/images/birthday-*.jpg` |
| 4.2.4 | P1 | Opening images are coworking studios (alt: "Bright flexible workspace"), not geometric venue exteriors/bold crops. | `invitations.js:99-102`, `categories.js:41-44`, `public/images/opening-*.jpg` |
| 4.2.5 | P1 | General/exhibition cover is a patio/warm outdoor scene (alt: "Covered patio with warm outdoor lighting"), not architectural still life / formal portraiture (B&W). | `invitations.js:73-76`, `categories.js:63-66`, `public/images/general-cover.jpg` |
| 4.2.6 | P1 | Festival lights image reads as year-end party/nightclub (alt: "Year End Party"). Spec: crowd-free detail (texture, hands, craft), rich within palette. | `invitations.js:125-128`, `public/images/festival-lights.jpg` |
| 4.2.7 | P1 | `categories.js` uses remote Unsplash URLs while `invitations.js`/`public/images` use local images — two image sources. Consolidate to local `public/images`. | `categories.js:7,19,...` vs `invitations.js` |
| 4.2.8 | P2 | Several local files have non-spec ratios (2:3, 0.70:1, 1.55:1, 1.36:1) while spec wants 3:4 cards, 4:3 spreads, 3:2 hero detail. Fixed `h-52`/`h-28` crops hide composition. | `CategorySpread.jsx:124`, `CategoryViewer.jsx:169`, `ExhibitionGallery.jsx:72` |
| 4.2.9 | P2 | `general-cover.jpg` 454 KB and `festival-cover.jpg` 364 KB are the heaviest assets; optimize/compress. | `public/images/` |

### 4.3 Replacement image direction (per spec §2.4 / §6)

| Category | Mood | Image treatment | Replacement direction | Target ratio |
|----------|------|-----------------|----------------------|--------------|
| Wedding | Romantic, delicate, restrained | Soft botanical close-ups, low saturation, shallow depth | Replace `wedding-cover.jpg` (dark, low-contrast) with soft botanical close-up (flowers, fabric, light) in warm ivory/charcoal; no people faces as hero. Keep `wedding-flowers.jpg` only if a clear subject is added. | 3:4 (card) / 4:3 (spread) / 3:2 (hero) |
| Memorial | Respectful, calm, dignified | Monochrome or muted sage-tinted, generous whitespace | Replace `memorial-cover.jpg` (industrial red-brown) and `memorial-candle.jpg` (ambiguous/mushroom) with monochrome sage-tinted still life: a single candle, a stone, a branch, or folded cloth on warm ivory; **no red, no sky, no storm, no flame-glow warmth**. | 3:4 / 4:3 |
| General / Exhibition | Formal, editorial, refined | Architectural interiors, still life, formal portraiture (B&W) | Replace `general-cover.jpg` (patio) with B&W architectural interior or still life (vase + paper + ruler). Keep `general-arch.jpg` only if it reads architectural. | 4:3 / 3:4 |
| Opening Ceremonies | Contemporary, architectural, confident | Geometric detail, venue exteriors, bold crops | Replace `opening-cover.jpg`/`opening-venue.jpg` (coworking) with bold cropped venue exterior / geometric facade / ribbon-cutting detail. Confirm not a concert stage. | 3:2 / 4:3 / 16:9 |
| Festivals & Celebrations | Expressive, energetic, disciplined | Crowd-free detail: texture, hands, craft | Replace `festival-lights.jpg` (purple neon party) with craft detail (hands arranging Haft-Seen, fabric texture, tile pattern); no nightclub lighting, no fairy lights. | 4:3 / 3:2 |
| Birthday | Joyful, creative, personal (all ages) | Personal portraits, warm treatment | Replace `birthday-cover.jpg` (cyan/teal) and `birthday-cake.jpg` (confetti) with warm personal portrait or single cake still-life; **no confetti, no balloons, no clowns, no age-number badges**. | 3:4 / 1:1 / 3:2 |

**Placeholder strategy (spec §2.4):** until final photography ships, use solid Warm Ivory blocks framed by a 1 px Charcoal hairline with a Vazirmatn typographic label — never grey boxes or lorem-image placeholders. Do not ship the current mismatched Unsplash photos to production.

**Files**: `src/data/categories.js` (coverImage/images arrays), `src/data/invitations.js` (coverImage/images arrays), plus `public/images/*` and `dist/images/*`.

---

## 5. Memorial zero-gold

- Data layer is correct: `invitations.js` memorial theme `hasGold: false`, `accentColor: '#687567'`; `CategorySpread.jsx` and `ExhibitionGallery.jsx` switch on `hasGold`/`isMemorial` ✓.
- **Violations**:
  - `3DEnvelope.jsx:29-33`: `.light-beam-container` with two gold beams renders for **all** categories including Memorial. Gold beams on a zero-gold surface (P0).
  - `3DEnvelope.jsx:88-91`: wax seal branch uses `hasGold ? gold radial : accentColor→#444` — for memorial the seal is the sage circle ✓, but the `boxShadow: '0 10px 30px rgba(180,154,112,0.45)'` is applied to **both** branches (line 90) — gold shadow on memorial seal (P0).
  - `RSVPModal.jsx:69-73`: `glass-panel border border-amber-500/30` gold border even when `hasGold=false` (P1, Agent 2 §11.4).
  - `3DEnvelope.jsx:60`: interior lining uses `radial-gradient(#B49A70_1.5px,...)` dots — gold dots on memorial interior (P1).
  - `MemorialViewer.jsx` AudioPlayer accent passed `#687567` ✓ but `AudioPlayer.jsx` visualizer bars are hardcoded `bg-amber-*` (P2).
  - Memorial cover image is warm red (§4) — color cue violation.
- **Fix direction**: gate the entire light-beam container, gold shadows, gold dot patterns, and gold borders behind `!isMemorial`; for memorial render no beams, no shadows beyond a soft neutral, no gold dots. Make RSVPModal border/focus-ring use `accentColor`/`hasGold` props. Replace memorial images per §4.3.

**Files**: `src/components/3DEnvelope.jsx:29-33,60,88-91`, `src/components/RSVPModal.jsx:69-83`, `src/pages/MemorialViewer.jsx`.

---

## 6. Wedding vs. Memorial differentiation

Spec §6: same grid/fonts/gold-cap, personality from accent temperature, typography weight/scale/tracking, image treatment, gold placement, motion.

| Lever | Wedding (spec) | Memorial (spec) | Code status |
|---|---|---|---|
| Accent | Gold + rose whisper | Sage only | ✓ data correct; ✗ 3DEnvelope beams gold for both |
| Typography | Medium 500 names, +0.03 em, delicate | Medium/Regular, +0.03 em on deceased name only, all-caps sparingly | ✗ Wedding names are `font-extrabold` + gold gradient; Memorial h1 `font-bold` (should be Medium) |
| Image | Soft botanical, low sat, shallow depth | Monochrome/sage-tinted, generous whitespace | ✗ both warm; Memorial red |
| Gold placement | Rule under title, optional monogram, one hover underline | None | ✗ Wedding uses gold gradient text (over-placement); ✗ Memorial has gold beams/shadow |
| Motion | Card-open sequence ≈1650 ms, slow fade, gentle scale on hover | Fades only ≈500 ms, zero card animation, reduced-motion default | ✗ Memorial uses the same 3DEnvelope with gold beams and shimmering seal; ✗ no reduced-motion |

- **Fix direction**: make Wedding the only category with the envelope-open sequence and gold rule; make Memorial a fade-only, no-envelope, no-seal, no-beam surface (consider skipping 3DEnvelope or a static fade card). Differentiate via typography scale (Wedding names larger/delicate, Memorial name restrained) and image treatment.
- **Files**: `src/pages/WeddingViewer.jsx`, `src/pages/MemorialViewer.jsx`, `src/components/3DEnvelope.jsx`.

---

## 7. Motion decoration (light beams, shimmer)

### 7.1 Looping/constant motion (P0/P1)

- `.bg-gold-foil` has `animation: goldShimmer 8s ease infinite` (`index.css:43-47`) applied to **buttons** — constant shimmer on CTAs. Forbidden ("no looping or constant motion").
- `3DEnvelope.jsx`: wax seal `animate-wax-shimmer` (4 s loop), sheen ring `animate-ping` (line 100), light beams (14 s/18 s loops). All run always.
- `index.css`: `.animate-float`, `.animate-pulse-glow` (defined and available), light beams. `goldShimmer` on every gold-filled surface.
- **Fix direction**: remove all infinite animations from buttons and seals; replace with a single, one-time entrance fade. Keep only: envelope-open sequence (Wedding, once per entry) and Memorial fades. Gate everything behind `prefers-reduced-motion`.
- **Files**: `src/index.css:43-47,88-131,163-198`, `src/components/3DEnvelope.jsx:84,100`, `src/components/AudioPlayer.jsx:114,128-134`.

### 7.2 Memorial motion (P0)

- Memorial must run reduced-motion by default (spec §5, §2.5). Currently it inherits the same animated 3DEnvelope with beams and shimmer. **Fix**: Memorial renders a static fade card; no envelope pull, no seal, no beams.
- **Files**: `src/pages/MemorialViewer.jsx`, `src/components/3DEnvelope.jsx`.

### 7.3 Reduced-motion (P0)

- No `@media (prefers-reduced-motion: reduce)` anywhere (Agent 2 §13.1). `scroll-behavior: smooth` ignores it (`index.css:25`).
- **Fix direction**: add global reduced-motion block disabling infinite animations, setting `scroll-behavior: auto`, and collapsing entrance fades to instant. Memorial ignores the media query and is always static.
- **Files**: `src/index.css`, `src/App.jsx:25`.

### 7.4 Light beams specifically (P1)

- `3DEnvelope.jsx:29-33` `.light-beam-container` with two blurred gold gradients. On Memorial this is a zero-gold violation; on Wedding it is decoration that competes with the envelope. Spec motion list does not include light beams.
- **Fix direction**: delete the light-beam container entirely (or replace with a single static soft gradient wash on Wedding only). Recommended: delete.
- **Files**: `src/components/3DEnvelope.jsx:29-33`, `src/index.css:88-131`.

---

## 8. Composition & whitespace

### 8.1 SaaS idioms vs. editorial (P0/P1)

- `CategorySpread.jsx`: `rounded-3xl`, `shadow-lg hover:shadow-2xl`, `rounded-2xl` image frames, badges (`rounded-full`), feature checklists. Spec §2.3: "Corner radius: None on layout elements"; "no card components with borders/shadows/rounded SaaS cards"; "no notification badges, … template packs".
- `ExhibitionGallery.jsx`: same (`rounded-2xl`, `shadow-md`, `rounded-full` category chip, `rounded-xl`).
- `DemoCustomizer.jsx`: large dark `rounded-3xl` block on homepage (should be a separate route, not homepage section — Agent 2 §3.1).
- **Fix direction**: replace rounded cards with square/zero-radius paper surfaces separated by 1 px Charcoal hairlines; move badges/checklists out (typographic labels only); relocate DemoCustomizer off the homepage.
- **Files**: `src/components/CategorySpread.jsx`, `src/components/ExhibitionGallery.jsx`, `src/components/DemoCustomizer.jsx`, `src/pages/HomePage.jsx`.

### 8.2 Section spacing (P1)

- Spec: 120 px desktop / 80 px mobile between full-width sections. Code uses `py-20` (80 px) uniformly (`CategorySpread.jsx:88`, `ExhibitionGallery.jsx:25`, `HomePage` sections). Slightly under spec on desktop.
- **Fix direction**: `py-20 md:py-[120px]`. Use consistently.
- **Files**: `src/components/CategorySpread.jsx`, `src/components/ExhibitionGallery.jsx`, `src/pages/HomePage.jsx`, `src/components/InteractiveShowcase.jsx`.

### 8.3 Max content width (P1)

- Spec 1120 px max content. Code uses `max-w-7xl` (1280 px) in Navbar/Footer/CategorySpread/ExhibitionGallery/InteractiveShowcase/DemoCustomizer, `max-w-5xl` (1024 px) in Hero, `max-w-4xl` (896 px) in viewers. Inconsistent; mostly wider than spec.
- **Fix direction**: standardize content containers to `max-w-[1120px]` with the specified gutters (16 px mobile / 24 px desktop). Hero and full-bleed photo sections may exceed.
- **Files**: `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/CategorySpread.jsx`, `src/components/ExhibitionGallery.jsx`, `src/components/InteractiveShowcase.jsx`, `src/pages/HomePage.jsx`.

### 8.4 Whitespace / density (P2)

- Hero is text-only with an ambient blur blob; spec wants a mid-open card as the focal point (Agent 2 §2.2). Adding the card will rebalance whitespace.
- Memorial should have **more** whitespace (generous) per spec §5; current Memorial card is dense (details grid + gallery + two buttons).
- **Files**: `src/pages/HomePage.jsx`, `src/pages/MemorialViewer.jsx`.

---

## 9. Responsive typography (consolidated)

- Implement `.t-*` tokens with `clamp()` per spec §2.1 and §2.3 so mobile→desktop is continuous, not a single `md:` jump.
- Add `sm:`/`lg:` steps only where clamp() cannot express intent.
- Test at 360 / 768 / 1024 / 1440 px; verify Persian digits and Estedad rendering on iOS Safari (open question).
- Fix header height to `h-14 md:h-16` (56/64) (Agent 2 §1.1, §14.1).
- Fix Hero ambient blob overflow (`w-[500px]` on small viewports) — use `w-[min(500px,80vw)]` or remove.
- Use aspect-ratio utilities (`aspect-[3/4]`, `aspect-[4/3]`, `aspect-[3/2]`) instead of fixed `h-52`/`h-48`/`h-28` (Agent 2 §14.3).
- Viewer card: centered `clamp(320px, 80vw, 700px)` on Warm Ivory canvas (Agent 2 §14.6).
- **Files**: `src/pages/HomePage.jsx`, `src/components/Navbar.jsx:23`, `src/components/CategorySpread.jsx:124`, `src/components/CategoryViewer.jsx`, `src/components/ExhibitionGallery.jsx`, `src/components/PhotoLightbox.jsx:52`.

---

## 10. Specific file/component fixes (consolidated)

| # | Priority | File | Location | Fix |
|---|---|---|---|---|
| 1 | P0 | `src/components/Navbar.jsx` | 26-43 | Remove Sparkles-in-gold-square; Estedad wordmark "دیبا" + thin gold hairline. |
| 2 | P0 | `src/components/Footer.jsx` | 21-28 | Same brand mark replacement; remove "(P0)" labels (6-7). |
| 3 | P0 | `src/pages/WeddingViewer.jsx` | 109-111 | Replace `.text-gold-foil` gradient names with solid Charcoal; add single gold hairline beneath. |
| 4 | P0 | `src/components/3DEnvelope.jsx` | 29-33, 90, 60, 100 | Remove light beams; remove gold shadow from memorial branch; remove gold interior dots; stop ping ring. |
| 5 | P0 | `src/index.css` | 36-39 | Flip `letter-spacing` from -0.02em to positive per token; remove negative tracking. |
| 6 | P0 | `src/index.css` | 43-47, 88-131, 163-198 | Remove shimmer/float/pulse/beam keyframes or gate behind reduced-motion; remove `.bg-gold-foil` animation. |
| 7 | P0 | `src/pages/HomePage.jsx` | 12 | Make theme-aware OR (recommended) drop dark theme and use ivory canvas. |
| 8 | P0 | `src/index.css` / global | — | Add `@media (prefers-reduced-motion: reduce)` block; Memorial always static. |
| 9 | P0 | `src/pages/MemorialViewer.jsx` | — | Zero gold: no beams, no gold dots/shadows; sage only; fade-only card. Add missing icon imports (`MessageSquare, X, User`). |
| 10 | P1 | `src/index.css` | 74-86 | Replace glass panels with solid ivory + hairline. |
| 11 | P1 | `src/components/CategorySpread.jsx` | 78-86, 124, 138, 132-147 | Remove rounded cards/shadows/badges/checklists; hairline dividers; aspect ratios; sage icon for memorial. |
| 12 | P1 | `src/components/ExhibitionGallery.jsx` | 78, 42 | `font-medium` not bold; typographic filter chips; aspect ratios; empty state. |
| 13 | P1 | `src/pages/HomePage.jsx` | 42-59, 72-73 | Single CTA; add mid-open envelope focal point; remove DemoCustomizer section. |
| 14 | P1 | `src/components/CountdownTimer.jsx` | 47-49 | Digits Charcoal (gold hairline only); `font-medium` not bold. |
| 15 | P1 | `src/components/RSVPModal.jsx` | 69-73, 76-83, 161/210/232 | Border/focus use accentColor/hasGold; remove gold glass panel; honest demo copy. |
| 16 | P1 | `src/data/categories.js`, `src/data/invitations.js` | coverImage/images | Replace mismatched stock photos per §4.3; standardize ratios; consolidate to local images. |
| 17 | P1 | `tailwind.config.js` | theme.extend | Add type-scale/tracking/line-height tokens or keep in CSS; add 1120 max-width token. |
| 18 | P1 | `src/components/Navbar.jsx` | 23, 94 | `h-14 md:h-16`; theme-aware mobile drawer. |
| 19 | P1 | `src/components/AudioPlayer.jsx` | visualizer bars | Use accentColor instead of hardcoded amber. |
| 20 | P2 | `src/components/DemoCustomizer.jsx` | route | Move off homepage to dedicated route. |
| 21 | P2 | `src/data/categories.js` | festival badge | Update "نوروز ۱۴۰۴" → "نوروز ۱۴۰۶". |
| 22 | P2 | `package.json` | deps | Remove unused `canvas-confetti`, `framer-motion` if confirmed unused. |
| 23 | P2 | `src/App.jsx` | 68-69, 76-82 | Fix `opening` → `opening-tech-hub`; add 404 handling; deep-link support. |
| 24 | P2 | `src/pages/CategoryViewer.jsx` | 94,104,128,138,156,169 | Accent-driven labels; type token; aspect ratio; gate toolbar behind `isOpen`. |

---

## 11. Replacement image direction (summary)

1. **Memorial**: remove warm red entirely. Use monochrome or sage-tinted, high-whitespace, quiet subject (candle in shadow, empty chair, olive branch, soft window). 3:4 (1200×1600).
2. **Wedding**: soft botanical close-ups, low saturation, shallow DOF, warm ivory/charcoal tint. 3:2 or 4:3. Replace dark cover.
3. **Exhibition/General**: architectural interiors or still life, B&W or charcoal tint. Fix 1200×1707 ratio → 3:4/4:3.
4. **Opening (tech hub)**: geometric detail, venue exterior, bold crop, contemporary. Confirm not a concert stage. 3:2/16:9.
5. **Festival (Nowruz)**: daylight spring detail — Haft-Seen, hyacinth, craft, hands. No neon/fairy lights/club. 4:3 + 3:2.
6. **Birthday**: personal portrait or warm still life; warmest treatment (rose/gold micro). No balloons/clowns/confetti. 3:2 or 1:1.

If final photography is not available, ship Warm Ivory placeholder blocks with 1 px Charcoal hairline and a Vazirmatn typographic label (spec §2.4) — never grey boxes.

---

## 12. Priority action plan

**P0 (blocks approval):**
1. Remove Sparkles-in-gold-square brand mark → Estedad wordmark + hairline (Navbar, Footer).
2. Fix Persian letter-spacing (negative → positive) globally.
3. Remove gold gradient text from wedding names.
4. Remove gold beams/shadows/dots from Memorial (and ideally all categories).
5. Remove looping shimmer from buttons/seal; Memorial zero motion.
6. Implement `prefers-reduced-motion`; Memorial static by default.
7. Make HomePage theme-consistent (recommend dropping dark theme).
8. Replace Memorial's warm-red cover image.

**P1 (spec compliance):** glass panels→paper; card idioms→hairlines; single Hero CTA + envelope focal; responsive type tokens; gold pixel-budget measurement; category accent map; aspect ratios; image replacements for the remaining five categories.

**P2 (polish):** DemoCustomizer relocation; stale "نوروز ۱۴۰۴" badge; unused deps; iOS digit verification; 404/deep-link handling.

---

## Appendix A — Typography token reference (target)

| Token | Font | Weight | Desktop | Mobile | Line-height | Tracking |
|---|---|---|---|---|---|---|
| `.t-cover` | Estedad | 100/300 | clamp(96px,8vw,120px) | clamp(40px,10vw,56px) | 1.10–1.25 | +0.04–0.06 em |
| `.t-title` | Estedad | 500 | 64 px | 40 px | 1.15 | +0.03–0.04 em |
| `.t-section` | Estedad | 400/500 | 40/32 px | 28/24 px | 1.25 | +0.02/+0.04 em |
| `.t-template` | Estedad | 500 | 24 px | 20 px | 1.30 | 0 |
| `.t-nav` | Vazirmatn | 500 | 15 px | 14 px | 1.50 | 0 |
| `.t-button` | Vazirmatn | 500 | 15 px | 14 px | 1.40 | 0 |
| `.t-body` | Vazirmatn | 400 | 17 px | 16 px | 1.60 | 0 |
| `.t-caption` | Vazirmatn | 400/500 | 14 px | 13 px | 1.50 | 0 |
| `.t-fine` | Vazirmatn | 400 | 12 px | 12 px | 1.50 | 0 |

---

**End of visual audit.** No code was written; no `src/` or `public/` files were modified. This report is the only deliverable.

AGENT3_DONE