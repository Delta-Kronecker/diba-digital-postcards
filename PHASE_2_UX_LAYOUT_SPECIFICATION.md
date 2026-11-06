# PHASE 2 — UX & Layout Specification (Design Proposals)
**Ponisha — Premium Digital Postcards & Invitations (Frontend-Only Interactive Demo)**

| Field | Value |
|-------|-------|
| **Document type** | UX / layout specification — reviewable design artifact. **No application code.** |
| **Status** | Phase 2 design proposals, pending Agent 1 approval gate before Phase 3 |
| **Mandatory root** | `D:\Hermes\ponisha-digital-postcards-demo` |
| **Art direction** | Premium & Elegant — Editorial Luxury / Timeless Digital Elegance (Concept B "Timeless Press" + Concept C restraint) |
| **Palette** | Warm Ivory `#F6F1E9` (canvas), Charcoal `#25231F` (text/structure), Champagne Gold `#B49A70` (accent only, ≤10–15% of screen pixels), Sage Green `#687567`, Dusty Rose `#A77D80` |
| **Typography** | Estedad (variable 100–900) — headings, editorial, category names, monograms; Vazirmatn (variable 100–900) — navigation, UI, forms, functional text, body |
| **Layout direction** | RTL-first (`direction: rtl`), logical CSS properties, 8 px grid, hairline dividers only |
| **Categories** | Wedding, Memorial/Funeral, General Invitations, Opening Ceremonies, Festivals & Celebrations, Birthday |
| **Proposals in scope** | 1. Homepage (5 sections) · 2. Wedding invitation viewer · 3. Memorial invitation viewer |
| **Devices per proposal** | Desktop + Mobile + Persian RTL |
| **Deep-link entry** | `/invite/:category/:slug` — shared links open the card directly, no login (frontend-only mock) |
| **Guest journey** | Mobile-first (shared link opened in WhatsApp/Telegram/SMS) |
| **Prospect journey** | Desktop evaluation (homepage browse) |
| **Constraints** | Frontend only; mock data + client-side state; no backend/auth/payments; Agents 6 & 7 excluded; Agent 1 writes no application code; stack deferred to Phase 3 |

---

## 0. How to read this document

- **Spec only.** Every section describes layout, composition, and behavior. Nothing here is code, component architecture, or a tech-stack commitment.
- **RTL is primary.** All wireframe descriptions are written for the Persian/RTH layout (right = reading start). A Latin/LTR layout is the horizontal mirror, not a re-design.
- **Wireframe descriptions** use a panel-map format: `[Region] — content — specification`. Dimensions are concrete (px / % / clamp) so the spec can be reviewed against a build without ambiguity.
- **Approval gate:** no full implementation until Agent 1 approves these three design directions against the Phase 1 art direction.

---

## 1. Design-system constants (apply to all three proposals)

### 1.1 Palette and usage rules

| Color | Hex | Role | Usage cap / rule |
|-------|-----|------|------------------|
| Warm Ivory | `#F6F1E9` | Dominant background / canvas | All screens; never replaced by white or grey washes |
| Charcoal | `#25231F` | Primary text, structure, hairlines | Body copy, headings, borders, dividers |
| Champagne Gold | `#B49A70` | Accent — foil simulation | Hairline rules, underlines, focus rings, monogram highlights only; ≤10–15% of pixels per screen; never a background; never sole carrier of meaning; **Memorial drops gold entirely** |
| Sage Green | `#687567` | Category accent temperature | Memorial primary accent; Festivals supporting |
| Dusty Rose | `#A77D80` | Category accent temperature | Wedding softness; Birthday; Festivals supporting |

Gold pixel-cap inventory (per proposal, Section 4.7 and 5.6) lists every gold touchpoint so reviewers can verify the ≤10–15% cap.

### 1.2 Typography scale

| Element | Font | Weight | Desktop size | Mobile size | Line-height | Tracking | Usage |
|---------|------|--------|--------------|-------------|-------------|----------|-------|
|| Hero display | Estedad | Thin 100 / Light 300 | `clamp(96px, 8vw, 120px)` | `clamp(40px, 10vw, 56px)` | 1.10–1.25 | +0.04–0.06em | One editorial line only ||
| Viewer principal names | Estedad | 400–500 (Medium 500) | 48px | 32px | 1.20 | +0.03em | Couple / deceased names on card |
| Section heading | Estedad | 400–500 (Medium 500) | 40px | 28px | 1.15 | +0.02em | Category names, section titles |
| Editorial body | Estedad | 400 Regular | 20px | 17px | 1.55 | +0.01em | Long-form editorial copy |
| UI body | Vazirmatn | 400 Regular | 16px | 15px | 1.60 | normal | Event details, descriptions, forms |
| UI small / meta | Vazirmatn | 400–500 | 14px | 13px | 1.50 | normal | Category tags, chips, labels, captions |
|| CTA label | Vazirmatn | 500 Medium | 15px | 14px | 1.40 | +0.01em | Buttons, outline CTAs ||
|| Fine print / toasts | Vazirmatn | Regular 400 | 12px | 12px | 1.50 | normal | Toasts, fine print ||

- No justified Persian text (ragged right edge in RTL, i.e., ragged left visual edge).
- Persian digit handling (`۰–۹`, "Estedad FD") is an open Phase 3 question (Q3); spec assumes Arabic-Indic digits may appear in event metadata.
- English is UI chrome + event metadata only; editorial copy is Persian-first.

### 1.3 Grid and spacing

| Token | Value | Use |
|-------|-------|-----|
| Base grid unit | 8 px | All spacing derives from multiples of 8 |
| Section padding (mobile) | 16 px | Left/right inside viewport |
|| Section padding (desktop ≥ lg) | 24 px | Left/right inside viewport ||
|| Section vertical spacing | 120 px desktop / 80 px mobile | Between sections ||
|| Viewer gutter (desktop) | 48 px | Viewer card side gutters (24 px minimum elsewhere) ||
|| Max content container | 1120 px | Centered on desktop; full width on mobile ||
| Typographic measure (body) | 45–75 chars | Persian/Vazirmatn body blocks |
| Hairline divider | 1 px, Charcoal or category accent | Section separation only; never a "card border" |
|| Focus ring | 2 px Champagne Gold (Wedding/General/Opening/Festivals/Birthday); 2 px solid Charcoal `#25231F` with 2 px offset (Memorial) | Interactive elements only ||

### 1.4 Responsive breakpoints (mobile-first)

| Name | Min-width | Layout behavior |
|------|-----------|-----------------|
| **Base** (mobile) | 0 px | Single column, full-bleed viewer/card, stacked sections, drawer navigation, 44 px touch targets, 16 px side padding |
| **sm** | 640 px | 24 px side padding; two-up filter chips possible; hero typography begins fluid scale-up |
| **md** | 768 px | Tablet: two-column gallery rows begin; section headings at desktop size; card viewer max-width increases |
|| **lg** | 1024 px | Desktop layout activates: centered card proportions on canvas (no side-by-side hero), 24 px gutters, 48 px viewer gutters, hover states active ||
| **xl** | 1280 px | Max container 1120 px centered; no further layout change (no stretch beyond editorial width) |

- Viewer card on desktop: `clamp(320px, 80vw, 700px)` wide, 3:4 portrait aspect, centered with minimum 40 px viewport padding.
- Mobile viewer: card occupies ~92% of viewport width, full-height scrollable inside panel.

### 1.5 Motion and reduced motion

| Motion | Timing | Easing | Rule |
|--------|--------|--------|------|
| Page / section fade | 400–600 ms | ease-out | Slow crossfades only |
|| Card-open (Wedding) | ≈1.65 s total | ease-out | Pull 300 ms → seal break 250 ms → flap lift 700 ms → inside reveal 400 ms + 100 ms delay; plays once per entry ||
|| Hover micro-interaction | 200 ms | ease | Champagne Gold hairline underline/focus (desktop only) ||
|| Memorial motion | Fades only, ≈500 ms | ease-out | Zero animation on the card itself; reduced-motion default (static unless `prefers-reduced-motion: no-preference`) ||
| Forbidden everywhere | — | — | Bounce, confetti, sliding card decks, parallax, constant movement, gradients, animated badges |

### 1.6 RTL-first composition rules (authoritative)

1. `direction: rtl` on root; logical properties only (`margin-inline-start/end`, `padding-inline-start/end`, `text-align: start`, `inset-inline-start/end`). Reading start = right.
2. **Header:** logo at inline-start (right); global CTA at inline-end (left); navigation sits between, ordered right-to-left.
3. **Two-column content rows:** primary text block at inline-start (right), right-aligned; media/image panel at inline-end (left). Positions swap vs. LTR.
4. **Category order:** right-to-left (Wedding is the rightmost/first category).
5. **Breadcrumbs:** current page at inline-start (right), root/home at inline-end (left); separator chevron points toward home (`‹` read right→left).
6. **Card-viewer arrows:** "previous" at inline-start (right), "next" at inline-end (left). Swipe advance direction is mirrored: swipe right→left to go next.
7. **Never flip:** photographic content, calligraphy, Persian script, faces, or directional imagery (calligraphy direction is meaningful). Flip only UI directionality (chevrons, arrows, progress direction).
8. **Scrollbar:** follows user-agent default for `rtl`; do not override.
9. Close/dismiss actions placed at inline-start (top-right on RTL screens).

### 1.7 Anti-checklist (this brand never does)

No card components with borders/shadows; no primary-colored CTA buttons; no notification badges; no pricing tables; no dashboard chrome; no template "packs" as product grids; no confetti or celebration animation; no gradients; no gold backgrounds; no justified Persian text; no carousels on the hero.

---

## 2. Global navigation and routing structure

### 2.1 Route map

| Route | Purpose | Entry role | Devices |
|-------|---------|------------|---------|
| `/` | Homepage (5 sections) | Prospect evaluation | Desktop + Mobile |
| `/:category` | Category landing (6 variants) | Browse within personality | Desktop + Mobile |
| `/invite/:category/:slug` | Invitation viewer — opened card | Guest delivery (shared link) | Mobile-first + Desktop |
| `/about` | Platform story / concept | Operator context | Desktop + Mobile |
| `/contact` | Demo inquiry | Operator / lead | Desktop + Mobile |

Deep-link behavior: `/invite/wedding/amir-sara` loads the Wedding viewer directly at the closed-cover state; no landing detour, no auth wall. Invalid slug → typographic 404 on Warm Ivory, Charcoal text, gold hairline divider only.

### 2.2 Global header

| Region | Desktop (≥ lg) | Mobile (< lg) | RTL mirroring |
|--------|----------------|---------------|---------------|
|| Logo | Wordmark (Esteadad, SemiBold 600, 20px) + thin gold hairline rule beneath, inline-start (right) | Same wordmark, 16px, inline-start (right) | Logo right ||
| Navigation | Category links (Vazirmatn 15px, Charcoal), ordered right-to-left, gold hairline underline on hover | Hidden; revealed in drawer | Nav left of logo |
| CTA | Outlined button, Charcoal text, 1px gold outline, gold fill on hover, label "بیشتر بدانید" / "Learn more" | Icon button (drawer toggle) at inline-end (left) | CTA left |
| Language switcher | "فارسی / English" inline-end (left of CTA) | Inside drawer footer | Label order unchanged (FA first) |

### 2.3 Breadcrumbs

- Position: top of content, below header, above section.
- Desktop: `تصاویر < Generally < Memorial` — current page rightmost (start), root leftmost (end), hairline `›` separators pointing left toward home.
- Mobile: same order, truncated to current page + parent if measure exceeds 75% of viewport width; full trail on tap.

### 2.4 Card-viewer navigation

| Element | Desktop | Mobile | RTL |
|---------|---------|--------|-----|
| Previous / Next | Side arrows outside card (44×44px, Charcoal, gold hover underline) | Not used; swipe gestures | Previous arrow right (start), Next arrow left (end) |
| Swipe | N/A | Swipe right→left to advance gallery; swipe left→right to return | Mirrored vs. LTR |
| Close | Esc key; X button top-right of canvas | X button at top-right (start), tap-outside-close on canvas | X at inline-start (right) |
| Keyboard | Space = open card (Wedding); Esc = close | N/A | Same |

### 2.5 Language switcher

- Persistent header item on desktop; drawer footer toggle on mobile.
- Label: `فارسی / English` (Persian first). Switching language does not flip layout direction — layout remains RTL-first; only label strings and metadata change (Phase 3 open question Q4 scope already resolved: English limited to UI chrome + event metadata).

---

## 3. Proposal 1 — Homepage (5 sections)

Hierarchy (visual priority →): 1. Hero, 2. Category editorial spreads, 3. Experience showcase, 4. Exhibition gallery, 5. Footer / contact. Background: Warm Ivory throughout. Dividers: 1 px Charcoal hairline between sections.

### 3.1 Section 1 — Hero: "the moment of open"

**Desktop wireframe (≥ lg)**
```
[Viewport: full-bleed Warm Ivory, min-height 100dvh]
[Card art — centered]: one mid-open card (envelope pulled, seal broken, flap lifted, inside visible), clamp(320px, 80vw, 700px), 3:4 portrait; no device frame, no collage, no shadows, no borders
[Typography — centered below card]: one Estedad editorial line (Thin 100 / Light 300, 96–120px fluid clamp, Charcoal, tracking +0.04–0.06em, line-height 1.10–1.25); one Vazirmatn subhead 16px, single line
[CTA — centered below typography]: outlined, Vazirmatn Medium 500, 15px, Charcoal text, 1px #B49A70 outline, gold fill on hover, label "باز کردن دعوتنامه" / "Open invitation"
```
- No carousel, no hero grid of thumbnails, no split image/text layout, no split stock layout, no secondary CTA.

**Mobile wireframe (< lg)**
```
[Stacked, full width, 16px side padding, min-height 70vh]
1. Mid-open card art, contained, ~88% of viewport width, bounded to 70–85vh
2. Estedad editorial line, 40–56px fluid clamp, centered, tracking +0.04–0.06em
3. Vazirmatn subhead 15px, centered
4. Outlined CTA, full width, 44px touch target
5. [Divider hairline]
```
Stack order top→bottom: card art → editorial line → subhead → CTA. Gap 40px between blocks. Card scales to fit (~70–85vh); editorial line fluid-shrinks; CTA inline-outlined.

**RTL:** all hero blocks centered; centered elements are not mirrored; editorial line and subhead remain right-aligned (`text-align: start`).

**Card-open teaser timing (step 2):** ≈1.65s sequence — pull 300ms → seal break 250ms → flap lift 700ms → inside reveal 400ms + 100ms delay; plays once per page entry; tap-triggered on mobile; static mid-open card under `prefers-reduced-motion: reduce`.

**Desktop → mobile adaptation:** card remains centered; editorial line fluid-shrinks 96–120px → 40–56px; CTA stays inline-outlined and full-width; hero height relaxes from 100dvh to min 70vh; no side-by-side layout at any breakpoint.

---

### 3.2 Section 2 — Category editorial spreads (6)

**Desktop wireframe (≥ lg)**
```
[Full-width section, per-category row, min-height 55vh, hairline divider between rows]
[Row pattern alternates image side]
[Right start side — media panel]: representative category image (soft botanical for Wedding; monochrome muted sage for Memorial; architectural for Opening; etc.), aspect 4:3, low saturation per category mood
[Left end side — text block, right-aligned]:
  • Category name, Estedad Medium 500, 40px, tracking +0.02em, accent temperature per category (Champagne Gold for Wedding; Sage for Memorial)
  • One-sentence editorial description, Vazirmatn Regular 400, 16px
  • Hover (desktop only): subtle opacity shift on name + 1px gold hairline underline appearing beneath the category name
```
Six spreads, one per category: Wedding, Memorial/Funeral, General Invitations, Opening Ceremonies, Festivals & Celebrations, Birthday. Order right-to-left: Wedding first (rightmost).

**Mobile wireframe (< lg)**
```
[Single column, per category]:
1. Category image, full width, aspect 16:9, max 260px height
2. [Divider hairline 16px from edges]
3. Category name, Estedad Medium 500, 28px, right-aligned
4. Description, Vazirmatn 15px, right-aligned
5. [Divider hairline] between categories
```
Gap 48px between category blocks. No cards, no shadows, no badges.

**RTL:** text right-aligned at start; image panel at end (left on desktop); category order reversed (right→left). Category accent color applies to name/hairline only (Wedding: Champagne Gold + Dusty Rose whisper; Memorial: Sage Green only, no gold).

**Desktop → mobile adaptation:** alternating two-column → single column with image on top; min-height relaxes 55vh → auto (~40vh); hover underline removed (no hover on mobile); tap on name navigates to category landing.

---

### 3.3 Section 3 — Experience showcase (3 steps: fade → card-open → fade)

**Desktop wireframe (≥ lg)**
```
[Full-width section, three full-width bands stacked vertically, 64px gap]
Per band:
  [Text block, centered-right, max-measure 660px]:
    • Step label (Vazirmatn small, letter-spaced): "۰۱" / "انتخاب" etc.
    • Step title, Estedad Medium 500, 40px
    • One-line description, Vazirmatn 16px
  [Media: one image or type specimen per step, flank left/right alternating or centered below text]
Transitions between steps: slow opacity crossfade 400–600ms; no progress bars, no circled step numbers, no checkmark animations.
```

**Mobile wireframe (< lg)**
```
[Stacked per step]:
1. Step label + title (right-aligned)
2. Description
3. Media image full width
```
Tap to reveal next step (progressive reveal) instead of hover.

**RTL:** text block at start (right), media at end (left) within each band; step labels Persian numerals pending Phase 3 digit verification.

**Desktop → mobile adaptation:** hover reveals → tap reveals; alternating flanks → all media below text; measure narrows to full width minus 32px padding.

---

### 3.4 Section 4 — Exhibition gallery (template exhibition, not store grid)

**Desktop wireframe (≥ lg)**
```
[Full-width section]
[Filter chips row, right-aligned start]: category name chips in Vazirmatn 14px, Charcoal text, no fills, hairline 1px underline on active chip; categories:all six. No dropdowns, no sort-by-price, no "new/popular" badges.
[Rows: one template per visual row, full width, hairline divider 1px between rows]
[Right start side — media]: large template preview image at real card proportions
[Left end side — text]:
    • Template title, Estedad Medium 500, 32px
    • Category tag, Vazirmatn 13px, small caps feel
```
Empty states: typographic only, no illustrations.

**Mobile wireframe (< lg)**
```
[Filter chips scroll horizontally or wrap]
[One template per row]:
  1. Preview image full width
  2. Title + tag right-aligned below image
  3. Hairline divider
```
Tap row → template preview (P1 flow behind "Customize" CTA, not on homepage).

**RTL:** chips ordered right-to-left; image at end (left), text at start (right).

**Desktop → mobile adaptation:** chips become horizontally scrollable; row media moves above text; no hover states.

---

### 3.5 Section 5 — Footer / contact

**Desktop wireframe (≥ lg)**
```
[Full-width, hairline divider at top]
[Three columns right-to-left]:
  Col 1 (start, right): Logo wordmark + one-line brand close
  Col 2 (center): Contact / demo inquiry (Vazirmatn 14px) + mock contact soft CTA (Charcoal button, gold hover)
  Col 3 (end, left): Language switcher "فارسی / English"
```

**Mobile wireframe (< lg)**
```
[Stacked]:
1. Logo + brand close (right-aligned)
2. Contact / demo inquiry
3. Language switcher
4. [Copyright line, Vazirmatn 13px]
```
Gap 32px between blocks.

**RTL:** column order right→left: brand, contact, language. All text right-aligned.

**Desktop → mobile adaptation:** three columns → single stack; CTA becomes full-width button.

---

### 3.6 Homepage desktop → mobile adaptation summary

| Element | Desktop (≥ lg) | Mobile (< lg) |
|---------|----------------|---------------|
|| Hero | centered mid-open card; editorial line + CTA centered, 100dvh min | centered card scaled to fit (~70–85vh); editorial line 40–56px; CTA inline-outlined, min 70vh ||
| Categories | alternating two-column rows, 55vh min | single column, image top, auto height |
| Experience | 3 full-width bands, alternating media flanks | stacked per step, tap-to-reveal |
| Gallery | rows with image + text side-by-side | rows: image above text, scrollable chips |
| Footer | 3 columns right→left | single stack |
| Nav | inline header | drawer toggle at inline-end (left) |

---

## 4. Proposal 2 — Wedding Invitation Viewer

Deep-link entry: `/invite/wedding/:slug`. Mobile-first guest journey; desktop prospect evaluation. Mood: romantic, delicate, restrained floral. Accent temperature: Champagne Gold (foil feel) + Dusty Rose whisper. Motion: slow fades, gentle card-open; no hearts, no confetti, no script fonts.

### 4.1 Viewer states (wireframe descriptions)

**State 1 — Card front (closed cover)**
```
[Full-bleed Warm Ivory canvas]
[Card, centered, real proportions, clamp 320–700px wide, 3:4 portrait]
[Cover: couple names, Estedad Medium 500, tracking +0.03em, centered-right in RTL; thin Champagne Gold hairline rule beneath names; Dusty Rose whisper as a subtle floral accent ≤5% of card surface]
[Envelope flap fold line at top third of card; seal dot at flap center (Champagne Gold, 12px)]
[Desktop: sealed envelope illustration with soft drop shadow? NO — no shadows per anti-checklist. Flap indicated by hairline fold and seal dot only.]
[Desktop and mobile: the entire card surface is the open trigger (click or tap); no separate below-card CTA]
[Subtle "tap to open" hint below card (mobile), Vazirmatn 13px]
```

**State 2 — Card-open transition (≈1.65s)**
```
Sequence:
  1. Envelope pull ~300ms
  2. Seal break ~250ms
  3. Flap lift ~700ms
  4. Inside reveal ~400ms + 100ms delay
Total ≈ 1.65s, ease-out; plays once per entry; no loop.
Reduced-motion fallback: immediate crossfade between closed and inside states, no envelope animation.

**State 3 — Card inside (event details)**
```
[Scrollable single column inside the opened card]
[Top — principal names]: Estedad 600, 48px desktop / 32px mobile, wide tracking, right-aligned
[Hairline divider 1px Champagne Gold]
[Event block, Vazirmatn 16px, right-aligned]:
  • Date (Persian calendar + Gregorian), time, venue name
  • Address line + mock map thumbnail (Opening Ceremonies-style architectural crop, low saturation)
  • Dress code line (optional)
[Hairline divider]
[Countdown timer, Vazirmatn small, Dusty Rose accent]
[Photo gallery strip: 3–5 thumbnails, real card-proportion crops, swipeable on mobile / clickable side arrows on desktop]
[Hairline divider]
[Mock RSVP form: name, companions, message; Vazirmatn labels; submit → toast "تأیید دریافت شد" / "RSVP received" (mock, no backend)]
[Bottom — actions row]: Share (copy link), Download card (mock), Music toggle (background music toggle, off by default)
```

### 4.2 Desktop layout spec (≥ lg)

| Region | Specification |
|--------|---------------|
| Canvas | Full viewport Warm Ivory; card centered with min 40px viewport padding |
| Card | Portrait 3:4, `clamp(320px, 80vw, 700px)` wide; height auto |
| Closed front | Names centered-right; gold hairline rule; seal dot top-center; no shadows/borders |
|| CTA | None — the entire card surface is the open trigger (no below-card button) | — ||
| Opened inside | Content column max 620px measure, right-aligned, 24px gutters, hairline dividers between blocks |
| Gallery | Side arrows (prev right / next left) flanking image; keyboard Space to open, Esc to close |
| Actions | Share / Download inline row at bottom of inside panel; music toggle icon-button |
| Gold inventory | Seal dot 12px, hairline rule under names 1px, dividers 1px, CTA outline 1px, focus rings 2px, hover underline on share links — estimated ≤8% of screen pixels (within ≤10–15% cap) |

### 4.3 Mobile layout spec (< lg)

| Region | Specification |
|--------|---------------|
| Canvas | Full viewport Warm Ivory |
| Card | ~92% viewport width, top safe-area padding 16px, bottom hint " tap to open" |
| Interaction | Whole card = tap-to-open target (44px min); after open, full-height scrollable inside panel |
| Names | Estedad 600, 32px, right-aligned |
| Event block | Vazirmatn 15px, full width minus 32px padding, right-aligned |
| Gallery | Horizontal swipe strip; thumbnails 80px height, 12px gap |
| RSVP | Full-width form fields stacked, 44px touch targets, submit → bottom toast |
| Actions | Share / Download stacked buttons or inline row if width permits; music toggle at top-right (start) as icon button |
| Close | X button at top-right (inline-start/right); tap outside card closes |

### 4.4 RTL mirroring (Wedding viewer)

- Names and all blocks right-aligned (`text-align: start`).
- Seal dot remains centered on flap (centered elements are not mirrored).
- Gallery swipe advance: swipe right→left to next photo.
- Previous/next arrows: previous at right (start), next at left (end).
- Close/X at top-right (inline-start).
- Photograph of couple/calligraphy never flipped.

### 4.5 Motion & interaction (Wedding)

| Interaction | Trigger | Behavior |
|-------------|---------|----------|
|| Open card | Tap/click anywhere on card (entire cover, all devices) | Pull 300ms → seal break 250ms → flap lift 700ms → inside reveal 400ms + 100ms (≈1.65s total) ||
| Hover (desktop) | Links, CTA | 1px gold underline appears; CTA fills gold |
| Gallery advance | Swipe (mobile) / side arrows (desktop) | Crossfade between photos, 300ms |
| RSVP submit | Tap submit | Local toast confirmation, no reload, no backend |
| Copy link | Tap share | Clipboard copy + toast (mock fallback) |
| Music toggle | Tap toggle | `<audio>` playback on user gesture; off by default |
| Reduced motion | `prefers-reduced-motion` | Immediate crossfade closed→inside; no envelope sequence |

### 4.6 Desktop → mobile adaptation notes (Wedding viewer)

1. **Card sizing:** desktop real-proportions card centered on canvas with 40px padding → mobile ~92% width edge-to-edge with safe-area respect.
2. **Open trigger:** click/tap anywhere on the card on all devices; keyboard Space triggers the cover on desktop.
3. **Navigation:** desktop side arrows + keyboard → mobile swipe gestures; arrows removed.
4. **Actions:** desktop inline share/download row → mobile stacked full-width buttons or bottom row; toast position bottom-center both.
5. **Typography:** names 48px → 32px; body 16px → 15px; line-height unchanged.
6. **Gold usage:** unchanged inventory, proportionally smaller absolute pixels but same cap compliance.
7. **Scroll:** desktop content fits inside card height mostly → mobile always scrollable single column.

---

## 5. Proposal 3 — Memorial Invitation Viewer

Deep-link entry: `/invite/memorial/:slug`. Mobile-first guest journey; desktop prospect evaluation. Mood: respectful, calm, understated, minimal, dignified. Accent temperature: **Sage Green `#687567` only; no Champagne Gold**. Typography: Estedad Regular 400 / Medium 500, restrained tracking +0.03em on the deceased name, all-caps sparingly. Motion: **fades only; zero animation on the card itself**. Reduced-motion default.

### 5.1 Viewer states (wireframe descriptions)

**State 1 — Card front (closed cover)**
```
[Full-bleed Warm Ivory canvas]
[Card centered, real proportions, clamp 320–700px wide, 3:4 portrait]
[Cover: deceased name, Estedad Regular 400 / Medium 500, 48px desktop / 32px mobile, wide tracking +0.03em, centered-right; Sage Green 1px hairline rule beneath name; no seal dot, no envelope flap flourish, no gold]
[Optional muted sage-tinted photograph, low saturation, generous whitespace around it]
[Desktop: soft indicated edge via hairline only (no border, no shadow)]
[Mobile: full card is tap target; hint "نمایش invitation" / "View invitation" Vazirmatn 13px]
```

**State 2 — Opening (fade only)**
```
Single slow crossfade 500–600ms from closed cover to inside details. No envelope, no flap, no seal break, no scaling, no motion on the card card itself. If `prefers-reduced-motion`: instant state change, no fade.
```

**State 3 — Card inside (event details)**
```
[Scrollable single column]
[Top — name]: Estedad Regular 400 / Medium 500, 48px desktop / 32px mobile, right-aligned, wide tracking +0.03em
[Sage Green hairline divider 1px]
[Event block, Vazirmatn 15px desktop / 14px mobile, right-aligned]:
  • Date, time, venue (funeral/memorial service)
  • Address + mock location (monochrome architectural crop)
  • Dress code / notes line (optional)
[Hairline divider Charcoal]
[Service details / message block, Vazirmatn 15px, generous measure]
[Mock RSVP form (optional for memorial): name, attendance, message; submit → toast]
[Bottom — actions]: Share copy link, Download (mock). No music toggle by default (memorial = quiet); if audio offered, off by default, Sage Green icon.
```

### 5.2 Desktop layout spec (≥ lg)

| Region | Specification |
|--------|---------------|
| Canvas | Full viewport Warm Ivory |
| Card | Portrait 3:4, `clamp(320px, 80vw, 700px)` wide, centered, min 40px padding |
| Cover | Name centered-right, Sage Green hairline rule beneath, muted photo optional, no seal, no flap |
| Opened inside | Content column max 620px, right-aligned, 24px gutters, Charcoal + Sage Green hairline dividers |
| Gold usage | **None.** Zero Champagne Gold pixels on any Memorial screen. |
| Accent | Sage Green: hairline rule under name, dividers, focus rings, optional icon |
| Keyboard | Esc = close; no Space-to-open flourish (open on click/tap with fade) |

### 5.3 Mobile layout spec (< lg)

| Region | Specification |
|--------|---------------|
| Card | ~92% width, top safe-area 16px, hint text below card |
| Names | Estedad 300/400, 28px, right-aligned |
| Event block | Vazirmatn 14px, full width minus 32px padding |
| RSVP | Stacked full-width fields, 44px targets, toast on submit |
| Actions | Share / Download row; music toggle omitted or Sage Green icon-button at top-right |
| Close | X at top-right (inline-start); tap outside closes |

### 5.4 RTL mirroring (Memorial viewer)

- Same RTL rules as Section 1.6; name right-aligned at start.
- Sage Green accents replace Champagne Gold everywhere a hairline would appear.
- No directional motion cues that imply celebration (no rightward "next" emphasis); swipe advance still mirrored per Section 1.6 but treated as neutral pagination.
- Photographs never flipped; calligraphy never flipped.

### 5.5 Motion & interaction (Memorial)

| Interaction | Trigger | Behavior |
|-------------|---------|----------|
|| Open | Click/tap | Single crossfade ≈500ms ease-out; no envelope sequence ||
| Hover (desktop) | Links | Sage Green 1px underline |
|| RSVP submit | Tap | Local toast ||
|| Countdown | Static line "X روز تا مراسم" | Hidden entirely under `prefers-reduced-motion: reduce`; no ticking animation ||
|| Reduced motion | `prefers-reduced-motion` | No fade at all; instant state switch ||
| Forbidden | — | Envelope animation, seal break, flap reveal, scaling, auto-play audio, countdown with motion |

### 5.6 Gold pixel-cap compliance (both viewers)

| Touchpoint | Wedding (gold) | Memorial (gold) |
|------------|----------------|-----------------|
| Seal dot / accent mark | 12px dot, ~0.2% of screen | None |
| Hairline rule under names | 1px, full name width, ~0.5% | Sage Green instead |
| Section dividers | 1px gold between blocks | Sage Green / Charcoal |
| CTA outline | 1px gold outline, gold fill hover | Charcoal outline, Sage Green hover |
| Focus rings | 2px gold | 2px Sage Green |
| Hover underlines on links | 1px gold | 1px Sage Green |
| Estimated gold share | ≤8–10% of viewer pixels | 0% |

Both within the ≤10–15% cap; Memorial is gold-free per art direction.

### 5.7 Desktop → mobile adaptation notes (Memorial viewer)

1. **Card sizing:** desktop centered real-proportions card → mobile ~92% width edge-to-edge.
2. **Open trigger:** desktop click → mobile tap; both use fade only (no animation difference by device).
3. **Typography:** name 36–40px → 28px; body 15px → 14px; measure narrows.
4. **Actions:** desktop inline share/download → mobile stacked or bottom row.
5. **Motion parity:** identical fade behavior on desktop and mobile; reduced-motion honored on both.
6. **Gold:** none on either device — compliance is structural, not layout-dependent.

---

## 6. Consolidated responsive breakpoint matrix (all three proposals)

| Component | Base 0–639px | sm 640px | md 768px | lg 1024px | xl 1280px |
|-----------|--------------|----------|----------|-----------|-----------|
| Page padding | 16px sides | 24px sides | 24px sides | 24px sides | 24px sides + 1120px max container |
|| Hero text | 40–56px clamp, centered | fluid scale-up | fluid scale-up | 96–120px clamp, centered | unchanged ||
| Category spreads | single column, image top | single column | two-column begins | alternating two-column, 55vh | unchanged |
| Gallery rows | image above text | image above text | side-by-side begins | side-by-side, real proportions | unchanged |
| Viewer card | ~92% width, scrollable | ~92% width | 70% width, centered | real proportions, clamped 700px | unchanged |
| Nav | drawer toggle left | drawer toggle left | drawer toggle left | inline header, logo right | unchanged |
| Touch targets | 44px min | 44px min | 44px min | hover active (mouse) | hover active |

---

## 7. Consolidated RTL mirroring rules (quick reference)

| Element | LTR default | RTL (Ponisha, required) |
|---------|-------------|-------------------------|
| Reading start | Left | Right |
| Logo in header | Left | Right (inline-start) |
| Global CTA | Right | Left (inline-end) |
| Category order | Left→right | Right→left |
| Two-column row | text left, image right | text right (start), image left (end) |
| Breadcrumbs | Home → Page (L→R) | Page → Home (R→L), chevron points toward home |
| Prev/Next arrows | Prev left, Next right | Prev right, Next left |
| Swipe advance | Swipe left → next | Swipe right → next |
| Close / dismiss | Top-left | Top-right (inline-start) |
| Text alignment | Left-aligned | Right-aligned (`text-align: start`) |
| Photographs / calligraphy | As-is | **Never flipped** |
| Scrollbar | Right | UA default for `rtl`; do not override |

---

## 8. Accessibility and motion governance

- `prefers-reduced-motion` honored on every screen: Wedding → immediate crossfade; Memorial → no fade; homepage → no fades.
- Focus rings visible: 2px Champagne Gold (Wedding/general) or 2px Sage Green (Memorial); never rely on color alone.
- Contrast: Charcoal `#25231F` on Warm Ivory `#F6F1E9` exceeds WCAG AA for body text; gold never used as sole carrier of meaning.
- Touch targets ≥44px on mobile; all interactive elements keyboard-reachable on desktop.
- Language switch persists layout direction (RTL-first) regardless of selected language.

---

## 9. Open questions deferred to Phase 3

| # | Question | Relevance to this spec |
|---|----------|------------------------|
| Q1 | Tech stack (Vite + Vanilla JS vs React vs Preact) | No impact on layout spec; build target deferred |
| Q2 | Image sourcing: placeholder art direction vs Agency photography | Wireframes assume placeholder direction; final assets may change proportions slightly |
| Q3 | Persian digits (`۰–۹`, Estedad FD variant) | Event dates/numbers may render Arabic-Indic digits; no layout change expected, verify font coverage |
| Q4 | Bilingual scope | Resolved: English = UI chrome + event metadata only; layout stays RTL-first |
| Q5 | iOS Safari font + animation behavior | Variable font loading and CSS fade timing to be verified in build |
| Q6 | Memorial audio (off by default? offered at all?) | Spec assumes optional, off-by-default music toggle; confirm with Agency |

---

## 10. Review checklist (for Agent 1 approval gate)

- [ ] All three proposals cover Desktop + Mobile + Persian RTL
- [ ] Palette applied exactly: Warm Ivory / Charcoal / Champagne Gold (≤10–15%, Memorial zero gold) / Sage / Dusty Rose
- [ ] Fonts: Estedad for editorial/headings, Vazirmatn for UI/forms, with the specified weight map
- [ ] Deep-link pattern `/invite/:category/:slug` reflected in routing section
- [ ] Five-section homepage hierarchy preserved (Hero, Categories, Experience, Gallery, Footer)
- [ ] Motion rules: Wedding slow card-open; Memorial fades-only/zero card animation; reduced-motion fallback everywhere
- [ ] Anti-checklist respected: no bordered/shadowed cards, no primary CTAs, no badges, no pricing, no confetti, no gradients
- [ ] Breakpoints are concrete mobile-first values (0 / 640 / 768 / 1024 / 1280px)
- [ ] RTL mirroring rules are explicit and cover header, breadcrumbs, arrows, swipe, close, image/text placement
- [ ] No application code present in this document

**Deliverable location:** `D:\Hermes\ponisha-digital-postcards-demo\PHASE_2_UX_LAYOUT_SPECIFICATION.md`

## Change Log — 2026-11-06
2026-11-06 — Hero display typography — previous: conflicting weights/sizes across docs — resolved: Estedad Thin 100 / Light 300, clamp(96px, 8vw, 120px) desktop / clamp(40px, 10vw, 56px) mobile, line-height 1.10–1.25, tracking +0.04–0.06em — reason: single authoritative hero scale (inconsistency B)
2026-11-06 — Heading weights — previous: Estedad 600 SemiBold on names and headings — resolved: Estedad 400–500 (Medium 500) — reason: authoritative heading scale caps at 500 (inconsistency B)
2026-11-06 — Card-open transition — previous: divergent stage durations across docs — resolved: ≈1.65s pull 300ms → seal break 250ms → flap lift 700ms → inside reveal 400ms + 100ms delay, plays once per entry; reduced-motion → immediate crossfade — reason: wedding sequence standard (inconsistency D)
2026-11-06 — Memorial focus ring — previous: not specified — resolved: 2px solid Charcoal #25231F, 2px offset — reason: memorial accessibility (inconsistency E)
2026-11-06 — Grid & spacing — previous: varying max widths, padding, gutters — resolved: 1120px max container; 16px mobile (<640px) / 24px desktop (≥640px) side padding; 48px viewer gutters; 120px desktop / 80px mobile section spacing; breakpoints 0/640/768/1024/1280 — reason: shared grid (inconsistency C)
2026-11-06 — Logo wordmark — previous: "Esteadah" misspelled — resolved: Estedad SemiBold 600, 20px desktop / 16px mobile, gold hairline rule — reason: brand consistency
2026-11-06 — Hero composition — previous: split image/text and side-by-side variants — resolved: centered mid-open card; no split layout at any breakpoint; entire card surface is open trigger; mobile stack card-first — reason: inconsistencies A/F
2026-11-06 — Wireframe heading weights — previous: SemiBold 600 in §3 category/step/template wireframes — resolved: Medium 500 — reason: heading scale
2026-11-06 — Memorial typography — previous: Light 300 / Regular 400 — resolved: Regular 400 / Medium 500, restrained tracking +0.03em on deceased name — reason: memorial typography rule
