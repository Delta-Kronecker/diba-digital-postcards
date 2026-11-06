# PROPOSAL 2 — Wedding Invitation Viewer (Phase 2 Design Proposal)

**Project:** Ponisha — Premium Digital Postcards & Invitations (frontend-only interactive demo)  
**Proposal:** #2 — Wedding invitation viewer  
**Phase:** Phase 2 design proposal — approval gate; no implementation until Agent 1 approves  
**Status:** Draft — submitted for Agent 1 review  
**Date:** 2026-11-06 (Iran Standard Time, UTC+03:30)  
**Mandatory root:** `D:\Hermes\ponisha-digital-postcards-demo`  
**Related baseline:** PHASE_1_CONSOLIDATED_DELIVERABLE_REVISED.md (Sections 5, 8, 9, 11–13); PHASE1_VISUAL_IDENTITY.md (Sections 5, 6, 7)  
**Author:** temporary general-purpose executor — not Agents 2/3/4/5/8; Agents 6 & 7 excluded  
**Scope:** Design specification only. Not application code. No HTML/CSS/JS implementation, no stack commitment (deferred to Phase 3).

---

## 1. Purpose

Concrete, reviewable design specification for the Wedding invitation viewer — the P0 primary category and emotional anchor of the demo. Every element exists to serve the approved **"Moment of Open"** concept: the envelope opens first; nothing is seen or interacted with before it; all other interaction happens *inside* the opened card, never before it.

This proposal is written so Agent 1 can review it against the approved art direction (Premium & Elegant / Editorial Luxury / Timeless Digital Elegance) and either approve, reject, or request changes before any code is written.

---

## 2. Inherited baseline (non-negotiable in this proposal)

| Element | Specification |
|---|---|
| Central concept | Moment of Open — envelope pull → seal break → flap reveal → inside is the hero interaction |
| Art direction | Premium & Elegant / Editorial Luxury / Timeless Digital Elegance ("Timeless Press" concept) |
| Category mood | Romantic, delicate, elegant, refined, emotional, timeless |
| Accent temperature | Champagne Gold `#B49A70` (foil simulation), ≤10–15% of pixels per screen; Dusty Rose `#A77D80` whisper only |
| Display font | Estedad (variable 100–900) — headings, expressive wide tracking |
| UI font | Vazirmatn (variable 100–900) — navigation, forms, functional text |
| Canvas | Warm Ivory `#F6F1E9` |
| Primary text | Charcoal `#25231F` |
| Imagery | Restrained floral, low saturation, soft botanical close-ups |
| Prohibitions | No hearts, no confetti, no script fonts, no pink dominance, no excessive ornament, no borders/shadow card components, no primary-color CTAs, gold never sole carrier of meaning |
| Motion | Slow fades, gentle card-open; GSAP/ScrollTrigger only where meaningful; no parallax, no constant movement, no animation loops; `prefers-reduced-motion` supported |
| Constraints | Frontend only; mock data + client-side state; Persian RTL hard requirement; English limited to UI chrome + event metadata (editorial copy Persian-first); deep-link entry `/invite/:category/:slug`; video gallery cut (photo only); QR check-in cut |

---

## 3. Guest journey and screen states

**Entry:** shared deep link, e.g. `ponisha-demo.com/invite/wedding/amir-sara` (example slug). No login. The viewer opens directly on the card; no homepage chrome wraps it.

**States (single state machine):**

1. **Closed** — envelope/cover fills the viewport; nothing else visible or interactive.
2. **Opening** — envelope pull → seal break → flap reveal → inside (hero sequence, ≈1.65s, plays on entry).
3. **Opened** — invitation inside; all interactions available (music, countdown, gallery, RSVP, share).
4. **Confirmed** — mock RSVP submitted; confirmation state replaces form; toast overlay.

Desktop and mobile share the same states. Mobile is an edge-to-edge card; desktop is a centered card surface (max ~900px) on the Warm Ivory canvas. No back button inside the viewer — browser back returns the guest to the link source.

---

## 4. Screen anatomy

### 4.1 Card cover / envelope (Closed state)

| Element | Specification |
|---|---|
| Surface | Full-bleed Warm Ivory; centered portrait card (~3:4 aspect); desktop centered card clamp(320px, 80vw, 700px); mobile edge-to-edge with 16 px side padding (< 640 px) / 24 px (≥ 640 px); page shell 1120px max content container, centered |
| Envelope flap | Top-third fold implied by one 1px gold hairline rule (`#B49A70`) across card width; subtle rest angle (desktop only), no motion until open |
| Wax seal | Small circle, 48px desktop / 36px mobile, Charcoal fill with 1px gold stroke, centered on flap; breaks during the open sequence |
| Couple names | Estedad 400–500 (Medium 500), tracking +0.03em, 56px desktop / 32px mobile, Charcoal, centered; two lines if long |
| Event date line | Vazirmatn Regular 400, 16px, Charcoal, 24px below names; one 1px gold hairline beneath — the only gold on the cover |
| Floral detail | Single restrained botanical detail, bottom corner, low saturation, ≤60px, decorative only |
| Open trigger | Entire cover is the trigger (click desktop / tap mobile) |
| Desktop hover | Gold hairline underline appears under names (micro-interaction only, no motion loop) |

**RTL:** centered elements unchanged; asymmetrical floral detail mirrors to the line-start side under Persian RTL.

### 4.2 Opening transition (hero sequence)

| Step | Trigger | Duration | Easing | Behavior |
|---|---|---|---|---|
| 1. Envelope pull | Tap/click cover | 300ms | ease-out | Cover pulls down ~12% |
| 2. Seal break | Auto, after pull | 250ms | ease-out | Seal scales to 0 + fades out |
| 3. Flap lift | Auto, after seal | 700ms | ease-out (cubic-bezier 0.22,1,0.36,1) | Flap rotates up and away |
| 4. Inside reveal | Auto, after flap | 400ms + 100ms delay | ease-out | Inside card fades in, slight scale 98% → 100% |

**Total ≈ 1.65s.** Plays once per entry; no loop. A second tap during the sequence skips directly to Opened. No parallax, no continuous motion after open. GSAP only (one sequenced timeline); ScrollTrigger is not used in this viewer (single surface, no scroll storytelling).

### 4.3 Revealed invitation (Opened state)

Single-column centered content, information hierarchy top to bottom:

1. **Couple names** — Estedad SemiBold 600, wide tracking +0.05em, 48px desktop / 28px mobile, Charcoal (largest element on screen).
2. **Gold hairline rule** — 1px `#B49A70` beneath names (one gold element per section).
3. **When / where label** — Vazirmatn Medium 500, 18px desktop / 16px mobile, Charcoal.
4. **Date** — Vazirmatn Regular 16px: `۱۵ آذر ۱۴۰۵ — جمعهٔ` (mock Persian date; Gregorian fallback `۵ دسامبر ۲۰۲۶` in 14px).
5. **Time** — same block: `۱۸:۳۰`.
6. **Venue** — `تهران — تالار گلستان` (mock venue), wraps on mobile.
7. **Editorial line** — Estedad Light 300, 20px, tracking +0.03em, centered; short Persian-first poetic line.
8. **Actions** — music toggle, countdown, gallery entry, RSVP button.

**Desktop layout:** two columns — information block | countdown (countdown on the line-start side under RTL).  
**Mobile layout:** single stack — information → countdown → actions.  
**Gold rule:** one hairline divider max between info blocks; no other gold inside the invitation.

### 4.4 Background music toggle

| Attribute | Specification |
|---|---|
| Default state | OFF (muted). Audio starts only on an explicit user gesture — never autoplay, no audio on the cover |
| States | Off / Playing / Paused |
| Label | `موسیقی پس‌زمینه`, Vazirmatn 14px |
| Active indication | Champagne Gold hairline underline + gold icon; inactive = Charcoal |
| Placement | Top action area of the inside card (desktop header row; mobile first action row) |
| Track | Placeholder instrumental (mock), looped; no volume slider in this proposal |

### 4.5 Countdown timer

| Attribute | Specification |
|---|---|
| Target | Mock wedding date `۱۵ آذر ۱۴۰۵ / ۵ دسامبر ۲۰۲۶`, 18:30 |
| Format | `۱۴ روز ۴ ساعت ۲۲ دقیقه تا عروسی` |
| Update cadence | Once per second, number change only — no ticking animation, no pulse, no flash |
| Digit note | Persian digits (`۰–۹`) are an open question (Estedad FD variant, Phase 3 verification); demo may render digits in Vazirmatn until resolved |
| End state | Timer removed; static text `عروسی برگذشته` |
| RTL | Label reads right-to-left; digits positioned per language block |

### 4.6 Photo gallery (photo only; video cut per revision)

| Attribute | Specification |
|---|---|
| Content | 4–6 images max: restrained floral + couple detail, low saturation, Warm Ivory mats |
| Desktop | Horizontal thumbnail row (tap/click to enlarge) |
| Mobile | 2-column grid; tap opens full-screen lightbox |
| Lightbox | Full screen, swipe left/right to navigate (swipe direction mirrored under RTL), close by tap outside or close control, caption under image in Vazirmatn 13px Charcoal |
| Prohibitions | No autoplay slideshow, no video, no infinite scroll, no gold in gallery |

### 4.7 Mock RSVP form + toast confirmation

| Attribute | Specification |
|---|---|
| Fields | Name (required), Guests (1–4 mock select), Attendance (yes/no), optional message |
| Typography | All Vazirmatn; inputs 14px; labels Charcoal; 1px Charcoal borders — no gold on the form (gold is decorative only) |
| Submit | Disabled until valid; on submit → form replaced by confirmation text `پاسخ شما با تشکر ثبت شد` |
| Toast | Bottom center; Warm Ivory surface, Charcoal text, 1px gold hairline top edge; fades in 200ms; auto-dismisses 3000ms; dismissible by tap; text examples: `پاسخ شما ثبت شد` (RSVP), `لینک کپی شد` (share) |
| Persistence | localStorage mock at most; resets on refresh; no backend |

### 4.8 Copy link / share

| Attribute | Specification |
|---|---|
| Deep link shown | `ponisha-demo.com/invite/wedding/amir-sara`, selectable, Vazirmatn 13px monospace-ish |
| Copy | Button → clipboard (Clipboard API with mock fallback) → toast `لینک کپی شد` |
| Share | Web Share API where available; mock fallback toast `اشتراک‌گذاری (نمونه)` |
| Prohibitions | No QR (cut from demo scope); no social buttons beyond generic share |

---

## 5. Composition: desktop + mobile + Persian RTL

| Element | Desktop (≥1024 px, lg) | Mobile base (0–639 px) / Tablet (640–1023 px) | RTL mirroring (fa) |
|---|---|---|---|
| Canvas | Warm Ivory full viewport | Warm Ivory full viewport | Unchanged |
| Card surface | Centered, clamp(320px, 80vw, 700px) | Edge-to-edge, 16 px side padding (< 640 px) / 24 px (≥ 640 px) | Unchanged |
| Cover names | Centered | Centered | Unchanged |
| Floral detail | Bottom-right corner | Bottom-right corner | Mirrors to bottom-left |
| Inside info | Two-column: info \| countdown | Single stack: info → countdown → actions | Columns swap sides under RTL |
| Actions | Single row | Stacked column | Logical start/end; directional chevrons flip |
| Countdown | Right of info block | Top of stack | Left of info block under RTL |
| Gallery | Thumbnail row | 2-column grid | Lightbox swipe direction mirrored |
| Text direction | `direction: rtl` default; logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) | Same | Persian default; Estedad wide tracking unchanged; no justified Persian text |
| Fonts | Estedad headings; Vazirmatn UI; `font-display: swap`; preconnect to Google Fonts | Same | Same |

---

## 6. Motion specification

**Governance:** GSAP only, for the opening timeline (one sequenced tweens group). ScrollTrigger is not used in this viewer. No parallax, no constant movement, no animation loops, no motion that competes with the names or the date. Transform/opacity only; `will-change` used sparingly. Mobile performance takes precedence over effect richness.

| Step | Duration | Easing | Properties | prefers-reduced-motion alternative |
|---|---|---|---|---|
| Envelope pull | 300ms | ease-out | transform translateY | Cut instantly to pulled state |
| Seal break | 250ms | ease-out | opacity + scale | Seal absent immediately |
| Flap lift | 700ms | ease-out | transform rotateX | Flap open instantly |
| Inside reveal | 400ms + 100ms delay | ease-out | opacity + scale | Inside visible instantly |
| Hover underline (desktop) | 200ms | ease | gold underline appears | Underline present on hover, no motion |
| Toast appear/dismiss | 200ms | ease | fade | Appear/dismiss instantly |
| Lightbox open/close | 300ms | ease | fade + scale | Instant show/hide |
| Countdown update | Instant | — | number text only | Same in reduced motion |

Opening plays once per entry (≈1.65s total); second tap skips to Opened.

---

## 7. Reduced-motion alternative (full mapping)

| Motion | Standard behavior | prefers-reduced-motion alternative |
|---|---|---|
| Opening sequence | pull → seal break → flap lift → reveal (≈1.65s) | Skipped entirely; viewer opens directly on Opened state |
| Envelope / seal / flap animation | Animated transforms | Static opened envelope; no moving parts |
| Hover micro-interactions | Gold underline animates in | Gold underline present on hover, zero motion |
| Toast | Fade in/out 200ms | Instant appear/dismiss |
| Lightbox | Fade + scale transition | Instant show/hide |
| Countdown | Number changes once/sec | Same (no motion involved) |
| Page/section fades | Slow crossfade ≈400–600ms | Instant swap or ≤200ms crossfade |

Audio is unaffected by the motion setting: the toggle remains functional (off/playing/paused) with or without motion.

---

## 8. Interaction rules

- **Before open:** only the cover trigger is active. No scroll reveals, no other taps, no visible controls.
- **After open:** all interaction happens inside the opened card only. Nothing re-covers the card.
- **Desktop:** hover micro-interactions (gold underline under names); focus rings in Champagne Gold.
- **Mobile:** tap targets ≥ 44px; gallery swipe; toast dismiss by tap.
- **Focus order:** names → date/time/venue → music toggle → countdown → gallery → RSVP → share (logical, RTL-aware).
- **Language:** Persian default; English switch changes UI chrome only, never event copy (Persian-first editorial).

---

## 9. Acceptance / review checklist (Agent 1)

Concrete, verifiable criteria for approving Proposal 2:

- [ ] Cover shows couple names in Estedad with wide tracking; exactly one gold hairline on the cover
- [ ] Opening sequence plays on entry: pull → seal break → flap reveal → inside, total ≈1.65s, no loop
- [ ] Nothing visible or interactive before the opening completes
- [ ] Inside hierarchy: names (largest) → date/time → venue → editorial line → actions; Charcoal primary text; gold ≤10–15% of screen pixels
- [ ] Music off by default; starts only on toggle tap; states Off / Playing / Paused; no autoplay
- [ ] Countdown shows days/hours/minutes to mock date; updates once per second; static end state when passed
- [ ] Gallery: photos only, lightbox with swipe, no video, no autoplay slideshow
- [ ] RSVP mock submits → confirmation text + toast; toast auto-dismisses after 3000ms
- [ ] Deep link shown; copy → toast; share mock fallback; no QR
- [ ] `/invite/wedding/amir-sara` opens the viewer directly
- [ ] Desktop and mobile compositions match Section 5; RTL mirrors layout, controls, and swipe direction
- [ ] `prefers-reduced-motion` skips all animation; the viewer remains fully usable
- [ ] Fonts: Estedad + Vazirmatn via Google Fonts CSS2, `font-display: swap`, preconnect to `fonts.gstatic.com`
- [ ] This proposal contains no application code

---

## 10. Open questions and out of scope

- **Persian digits** (`۰–۹`, Estedad FD variant): Phase 3 verification (Q3 in Phase 1 baseline); demo may use Vazirmatn digits until resolved.
- **Tech stack** (Vite + Vanilla vs React vs Preact): deferred to Phase 3; no commitment here.
- **Final photography:** supplied by Agency/Design; placeholder art direction only in this proposal.
- **Video gallery:** cut per Phase 1 revision; not in this proposal.
- **QR check-in:** cut from demo scope; not in this proposal.
- **iOS Safari Persian variable-font rendering:** verify before visual sign-off (Q7 in Phase 1 baseline).
- **Music track licensing:** placeholder only; demo may ship the toggle with mock states if no cleared track.

---

## 11. Decision requested

Approve, reject, or request changes to Proposal 2. On approval, Phase 2 visual execution proceeds (static exploration per the Phase 1 plan), then implementation in Phase 3 after the stack decision. No application code is written or committed as part of this proposal.

## Change Log — 2026-11-06
2026-11-06 — Composition matrix — previous: ≥768 / <768 breakpoints; card max ~900px; 20px gutters — resolved: Desktop ≥1024 (lg); mobile 0–639 / tablet 640–1023; centered card clamp(320px, 80vw, 700px); 16px / 24px side padding
2026-11-06 — Surface spec — previous: desktop max width ~900px — resolved: centered card clamp(320px, 80vw, 700px); mobile edge-to-edge 16px / 24px padding
2026-11-06 — Couple names — previous: weight/size variants across docs — resolved: Estedad Medium 500, tracking +0.03em, 56px desktop / 32px mobile, Charcoal, centered