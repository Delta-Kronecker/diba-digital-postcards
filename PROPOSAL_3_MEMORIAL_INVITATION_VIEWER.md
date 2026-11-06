# Proposal 3 — Memorial Invitation Viewer (Phase 2)

**Ponisha — Premium Digital Postcards & Invitations (Frontend-Only Interactive Demo)**

| Field | Value |
|---|---|
| **Proposal** | 3 — Memorial Invitation Viewer (Phase 2 design proposal) |
| **Status** | Design specification — pending Agent 1 review (Phase 2 gate) |
| **Mandatory root** | `D:\Hermes\ponisha-digital-postcards-demo` |
| **Type** | Design proposal only — **not application code**. No HTML/CSS/JS committed; stack deferred to Phase 3. |
| **Scope** | Memorial category viewer: shared deep-link entry, card cover → gentle reveal → invitation inside, event information hierarchy, essential guest interactions, desktop + mobile + Persian RTL |
| **Entry point** | `/invite/memorial/:slug` (shared guest link; no landing interstitial) |
| **Motion policy** | Fades only (≈500 ms); reduced-motion-first; memorial baseline = zero motion unless user has no reduced-motion preference |
| **Palette** | Neutral only — accent temperature None; Champagne Gold #B49A70 dropped entirely |
| **Agency limits** | Frontend-only demo; mock data + client-side state; no backend/auth/payments; Agents 6 & 7 excluded; Agent 1 writes no code |

---

## 1. Purpose

This proposal specifies the Memorial Invitation Viewer — the digital equivalent of a respectful condolence card: one card, one moment, dignified. A guest opens a shared link, sees the card cover, taps for a gentle fade reveal, and reads the invitation inside (deceased name, date/time, venue, family message) plus restrained guest interactions (music toggle, countdown, photo gallery, mock RSVP with toast, copy link). Everything here is reviewable by inspection: values, states, hierarchy, and constraints are stated concretely. No implementation code is included.

---

## 2. Approved baseline carried from Phase 1

| Baseline item | Position carried into this proposal |
|---|---|
| Central concept | "Moment of Open" — envelope/seal/flap/inside beat; for memorial this is a quiet cover → inside reveal, never theatrical |
| Memorial character | Respectful, calm, understated, minimal, dignified (P0 category) |
| Fonts | Estedad (headings/editorial), Vazirmatn (UI/body); Persian RTL first; variable 100–900 via Google Fonts CSS2 |
| Canvas | Warm Ivory #F6F1E9; primary text Charcoal #25231F; 8 px grid; max width 1120 px desktop |
| Entry | Deep link `/invite/:category/:slug` is the primary guest entry point (here: `/invite/memorial/:slug`) |
| Build limits | Frontend only; mock state; no real RSVP, backend, auth, or payments |
| Memorial motion | Fades-only default (Phase 1 assumption Q5, awaiting confirmation — this proposal makes it concrete) |

---

## 3. Design intent & tone

- **Respectful, calm, dignified, understated, minimal.** Every visual decision serves the moment of opening a condolence card; nothing competes with it.
- **No gold accents.** Accent temperature: None. Champagne Gold #B49A70 is dropped entirely for this viewer — no gold hairline rules, fills, focus rings, underlines, or highlights.
- **No playful effects, no excessive motion, no celebratory visual language.** No confetti, bounce, sliding card decks, badges, counters counting up, autoplay carousels, or marquee text.
- **Esteadad treatment: restrained and sober.** Estedad 400–500 only, restrained wide tracking (+0.03em on the deceased name only), no decorative flourish, sentence-style setting; used for the deceased name and category-level headings.
- **Imagery: quiet, neutral.** At most one desaturated photographic detail (paper texture, single botanical or architectural detail), optional, off by default in the demo. No face close-ups, no collage, no saturation.
- **Copy tone:** formal and restrained; family voice in first-person plural where used; no urgency, no marketing language.

---

## 4. Visual system (memorial viewer)

| Element | Specification |
|---|---|
| Canvas background | Warm Ivory #F6F1E9 (full viewport) |
| Primary text — deceased name | Charcoal #25231F, Estedad 400–500 |
| Secondary text — date/time/venue/labels | Sage Green #687567, Vazirmatn 400 |
| Event values | Charcoal #25231F, Vazirmatn 500 |
| Hairline dividers | Sage Green #687567, 1px dividers between info blocks, used sparingly |
| Focus ring (keyboard) | 2 px solid Charcoal #25231F, 2 px offset |
| Press/active state | Opacity to 60%, no color shift |
| Disabled state | Opacity 40% |
| Accent color | **None** — no gold, no gradient, no shadow, no border color beyond hairline divider |

**Typography scale**

| Role | Font | Weight | Size (desktop) | Size (mobile) | Line-height |
|---|---|---|---|---|---|
| Deceased name | Estedad | 400–500 (Medium 500) | 56 px | 32 px | 1.25 |
| Event label (تاریخ و زمان / محل) | Vazirmatn | 400 | 16 px | 14 px | 1.4 |
| Event value (date, time, venue) | Vazirmatn | 500 | 20 px | 18 px | 1.5 |
| Family message | Vazirmatn | 400 | 17 px | 16 px | 1.6 (max ~62 ch) |
| Small labels / toggles | Vazirmatn | 400 | 14 px | 14 px | 1.4 |

---

## 5. Composition & states

| State | Content | Entry / exit |
|---|---|---|
| **1. Cover (front)** | Deceased name only; optional single quiet image; no event details | Initial state on deep-link entry |
| **2. Gentle reveal** | Cover fades out → inside fades in; opacity only, no slide/push | Triggered by guest tap on cover |
| **3. Inside** | Full event information hierarchy + guest interactions | Replaces cover in place; no URL change |
| **4. RSVP confirmation (mock)** | Toast overlay: "ثبت شد — حضور شما در لیست حضور ثبت شد" | Appears after mock RSVP tap; auto-dismisses |
| **5. Copy confirmation** | Toast overlay: "پیوند کپی شد" | Appears after copy-link tap; auto-dismisses |

Composition rule: the cover and inside occupy the same viewport position — the reveal replaces content in place, never navigates, never slides a new panel in.

---

## 6. Motion policy (concrete)

- **Allowed motion:** opacity cross-fade only, 500 ms, ease-out (inside the Phase 1 400–600 ms band).
- **Prohibited:** slide, push, bounce, parallax, carousel autoplay, number tickers, expanding grids, marquee text, confetti, celebration animation, scale-on-hover beyond opacity.
- **Reduced-motion-first:** the default composition is **static** — no entry fade unless the user has no reduced-motion preference. The gentle cover→inside reveal (500 ms fade) is applied only when `prefers-reduced-motion: no-preference`.
- **When `prefers-reduced-motion: reduce`:** all transitions 0 ms / disabled, state changes instant, countdown renders as static text, gallery has no auto-advance, music toggle has no motion, toasts appear/dismiss instantly.
- **Memorial baseline:** zero motion unless the user explicitly has no reduction preference — i.e., motion is opt-in by way of the OS setting, never opt-out.

---

## 7. Desktop composition (≥ 768 px)

- Direction: `rtl`; logical CSS properties throughout (`margin-inline-start/end`, `padding-inline`, `text-align: start`); no hard-coded `left`/`right` offsets.
- Centered card column, max-width 1120 px desktop, centered; side padding 16 px mobile (<640px) / 24 px desktop (≥640px); 48 px viewer column gutters (8 px grid multiples).
- Single column; cover at top of viewport, inside revealed in place below/at same position on tap; body text max ~62 ch for readability.
- Reading order right-to-left; date/time/venue labels and values align per RTL convention.
- Hover states: opacity shift only (no color shift, no gold).

---

## 8. Mobile composition (< 768 px)

- Full-bleed viewport card; 24 px side gutters; bottom safe-area padding.
- Single column, stacked; cover fills the safe area; inside scrolls within the card (no scroll behind a covered layer).
- Touch targets ≥ 44 × 44 px for every toggle/button; type scale per §4 mobile column.
- No hover-dependent affordances; all actions reachable by tap.

---

## 9. Persian RTL composition

- `direction: rtl` on the viewer root; `lang="fa"`; logical properties only (no `left`/`right` — use `inset-inline-start/end`).
- Font stack: Estedad (headings/deceased name), Vazirmatn (UI/body); `font-display: swap`; preconnect to font host.
- Persian digits shown in placeholder copy are illustrative only — upstream Estedad FD variant (۰–۹) verification is deferred to Phase 3 (Phase 1 Q3).
- Mixed Latin runs (dates, times, slugs) embedded inside RTL text follow Unicode bidi; no hard `ltr` islands except where required by the slug itself.
- Alignment: headings centered; informational labels start-aligned to the RTL start (right).
- Placeholder Farsi copy (§16) is for review only — Agency/Design finalizes all copy.

---

## 10. Event information hierarchy (inside panel)

Visual and DOM order (most to least prominent):

1. **Deceased name** — Estedad 400–500, Charcoal, shown on cover and repeated as inside header (most prominent element on screen).
2. **Date & time** — Vazirmatn 500, 20 px desktop / 18 px mobile; label "تاریخ و زمان" + value (e.g., ۱۵ مرداد ۱۴۰۴ — ساعت ۱۵:۳۰).
3. **Venue** — Vazirmatn 500, 18–20 px; label "محل" + value (e.g., تهران، حسینیهٔ زهرا).
4. **Family message** — Vazirmatn 400, 17 px desktop / 16 px mobile, max-width ~62 ch, line-height 1.6, respectful tone.
5. Optional subordinate line beneath venue (ceremony/burial note) in secondary style Sage Green #687567.

No promotional copy, no "RSVP by" urgency language, no marketing text, no price or token language.

---

## 11. Essential guest interactions

**a) Background music toggle (optional, restrained)**
- Off by default; single toggle labeled "موسیقی پس‌زمینه" (Vazirmatn 14 px).
- No visualizer, no play/pause animation, no equalizer; state shown via opacity only (no color).
- Functional under reduced motion (no motion, still tappable).
- State = client-session mock only; no audio asset specified here (deferred to Phase 3).

**b) Countdown (optional, subdued)**
- Static line: label "تا مراسم" + day count (e.g., "۷ روز تا مراسم"), Vazirmatn 14 px, Sage Green #687567.
- Static text only — no ticking seconds, no animating numbers, no urgency styling.
- Hidden entirely under `prefers-reduced-motion: reduce`.

**c) Photo gallery (restrained)**
- Up to 6–8 quiet neutral images; one image at a time.
- Tap advances with 500 ms cross-fade when motion allowed; no autoplay, no lightbox zoom animation, no carousel dots animation.
- Captions optional, Vazirmatn 14 px.

**d) Mock RSVP / attendance (toast confirmation)**
- Button "حضور دارم" (mock attendance).
- Tap → toast "ثبت شد — حضور شما در لیست حضور ثبت شد": fades in 400 ms, holds 3000 ms, fades out 400 ms; under reduced motion: instant appear/dismiss.
- Attendance count is client-side mock only, resets on reload; no backend, no email, no real guest list.

**e) Copy link / share**
- Button "پیوند را کپی کن" → copies `https://ponisha.example/invite/memorial/:slug` → toast "پیوند کپی شد".
- No social buttons; share = copy link only (mock). No real sharing backend.

**f) Deep-link entry**
- `/invite/memorial/:slug` opens the viewer directly (slug = memorial identifier, mock data key).
- No landing page, no interstitial, no category chooser on entry; cover is the first and only initial state.

---

## 12. State map (non-code)

Cover → (guest tap) → 500 ms opacity fade → Inside → (mock RSVP / copy link) → toast overlay → auto-dismiss → Inside. All transitions are opacity-only; no slide, no push, no navigation.

---

## 13. Accessibility & reduced motion checklist

- Contrast: Charcoal #25231F on Warm Ivory #F6F1E9 ≥ 7:1 (primary); secondary Sage Green #687567 ≥ 4.5:1 against canvas.
- Focus visible: 2 px Charcoal ring, 2 px offset, on every interactive element.
- Text scales to 200% without overlap or clipping (logical properties, no fixed heights on text blocks).
- `prefers-reduced-motion` honored system-wide; zero-motion default for memorial.
- No autoplay audio; music requires explicit tap; toggle labeled in Persian.
- Touch targets ≥ 44 × 44 px.
- Semantic heading order: h1 deceased name, h2 date/time and venue sections.
- `lang="fa"` on viewer root; Persian placeholder copy marked for Agency finalization.

---

## 14. Review criteria for Agent 1 (Phase 2 gate)

Each item verifiable by inspection of this document:

- [ ] No gold anywhere — no hairline, fill, focus color, or accent in Champagne Gold?
- [ ] Motion = opacity fades only, ≤ 600 ms, and none under `prefers-reduced-motion: reduce`?
- [ ] Default state = static cover; inside revealed by tap; no slide/push/navigation?
- [ ] Information hierarchy order: deceased name → date/time → venue → family message?
- [ ] All six interactions specified: music toggle, countdown, gallery, mock RSVP + toast, copy link, deep link `/invite/memorial/:slug`?
- [ ] Desktop (≥1024 px) / mobile (<640 px) / tablet (640–1023 px) compositions specified with concrete values?
- [ ] Persian RTL composition specified: `direction: rtl`, logical properties, font stack, placeholder copy marked?
- [ ] No application code committed; no stack or backend claims?

---

## 15. Deliberately out of scope

Application code (HTML/CSS/JS); tech stack selection (Phase 3); backend, database, API; real RSVP/attendance persistence or email; auth/payments; printing; production infrastructure; animation libraries (CSS-only fades); real audio assets (music toggle is specified; asset deferred); social share buttons (copy link only).

---

## 16. Placeholder Persian copy (review only — Agency/Design finalizes)

```
مرحوم آقای کریمی
تاریخ و زمان: ۱۵ مرداد ۱۴۰۴ — ساعت ۱۵:۳۰
محل: تهران ، حسینیهٔ زهرا
[پیام خانواده] در این روز سخت ، حضور شما برای ما باارزش است.
[دکمه] حضور دارم    [تایید] موسیقی پس‌زمینه    [کپی] پیوند را کپی کن
```

All Farsi copy above is illustrative placeholder for RTL composition review; not final content.

## Change Log — 2026-11-06
2026-11-06 — Typography — previous: deceased name 36px mobile — resolved: 32px mobile, Estedium Medium 500
2026-11-06 — Secondary text & dividers — previous: #6E6A62 text / #D8D4CA dividers — resolved: Sage Green #687567
2026-11-06 — Tone & tracking — previous: no tracking guidance — resolved: restrained wide tracking +0.03em on deceased name only
2026-11-06 — Canvas width — previous: 960–1120px — resolved: 1120px desktop max width
2026-11-06 — Accessibility criteria — previous: secondary #6E6A62; breakpoints ≥768 / <768 — resolved: Sage Green #687567; Desktop ≥1024 / mobile <640 / tablet 640–1023
