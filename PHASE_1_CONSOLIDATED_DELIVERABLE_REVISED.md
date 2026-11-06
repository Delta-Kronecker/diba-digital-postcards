# PHASE 1 — Product Analysis & Creative Strategy (Consolidated Deliverable — Revised)
**Ponisha — Premium Digital Postcards & Invitations (Frontend-Only Interactive Demo)**

| Field | Value |
|---|---|
| **Status** | Phase 1 revised — pending Agent 1 approval before Phase 2 design proposals |
| **Mandatory root** | `D:\Hermes\ponisha-digital-postcards-demo` |
| **Art direction** | Premium & Elegant — Editorial Luxury / Timeless Digital Elegance |
| **Palette** | Warm Ivory `#F6F1E9`, Charcoal `#25231F`, Champagne Gold `#B49A70` (accent only, ≤10–15% of pixels per screen), Sage Green `#687567`, Dusty Rose `#A77D80` |
| **Typography** | Estedad (expressive headings/editorial), Vazirmatn (UI, interface, forms); Persian glyph rendering + RTL required |
| **Categories** | Wedding, Memorial/Funeral, General Invitations, Opening Ceremonies, Festivals & Celebrations, Birthday |
| **Interaction concepts** | Card-opening, slideshow, scroll-based storytelling, page fade, transitions, swipe, touch, progressive reveals, hover, micro-interactions (GSAP/ScrollTrigger where valuable), reduced-motion support |
| **Constraints** | Frontend only; mock data + client-side state; no backend/database/API/auth/payments; Agents 6 & 7 excluded; Agent 1 does not write application code; stack decision deferred to Phase 3; approval gates preserved |

---

## Contents

1. [Scope & Constraints](#1-scope--constraints)
2. [Verified Facts vs Assumptions](#2-verified-facts-vs-assumptions)
3. [Product Analysis](#3-product-analysis)
4. [User Roles & Personas](#4-user-roles--personas)
5. [User Journey Analysis](#5-user-journey-analysis)
6. [Information Architecture](#6-information-architecture)
7. [Navigation Structure](#7-navigation-structure)
8. [Essential Interactions](#8-essential-interactions)
9. [Priority Screens](#9-priority-screens)
10. [Demo Strategy](#10-demo-strategy)
11. [Homepage Creative Direction](#11-homepage-creative-direction)
12. [Invitation Category Differentiation](#12-invitation-category-differentiation)
13. [Visual Identity & Typography](#13-visual-identity--typography)
14. [Reference Research: DigiPostal & Manesh Store](#14-reference-research-digipostal--manesh-store)
15. [Recommended Interactive Experiences](#15-recommended-interactive-experiences)
16. [Prioritized Feature List](#16-prioritized-feature-list)
17. [Revision Decision Log & Change Summary](#17-revision-decision-log--change-summary)
18. [Open Questions for Agent 1](#18-open-questions-for-agent-1)
19. [Phase 2 Entry Criteria](#19-phase-2-entry-criteria)

---

## 1. Scope & Constraints (verified facts)

| Item | Position |
|---|---|
| Backend / database / API | **None.** All dynamic behavior is mock data + client-side state. |
| Auth / payments | Not in scope; simulated only where the demo needs it (mocked toast, no server). |
| Persistence | localStorage mock at most; nothing crosses sessions in production terms. |
| Tech stack | **Undecided (Phase 3 decision).** Do not commit in Phase 1 or 2. |
| Build target | Interactive demo for client impact, not a production product. |
| Languages | Persian (RTL) is a hard requirement; English secondary (scoped to UI chrome + event metadata; editorial copy Persian-first). |
| Agency limits | No Agent 6 or Agent 7. Agent 1 (PM/CTO) does not write application code; this document is analysis/specification only. |
| Subagents used | Temporary general-purpose subagents (UX strategy, visual design strategy, reference research, strategy revision, decision log) — clearly identified as general executors, not Agents 2/3/4/5/8. |

---

## 2. Verified Facts vs Assumptions

### Verified (web-checked)

| # | Fact | Source |
|---|---|---|
| F1 | **Estedad** is on Google Fonts (fonts.google.com/specimen/Estedad), designed by Amin Abedi / Fontamin, first released to Google Fonts May 2026, SIL Open Font License, 9 weights (100–900) + variable `wght` axis, scripts: arabic, latin, latin-ext, vietnamese — Persian/Arabic glyphs present in the specimen. | Google Fonts specimen; fonts.codes; fontfinderai |
| F2 | **Vazirmatn** is on Google Fonts (fonts.google.com/specimen/Vazirmatn), Persian/Arabic type project running since 2015, 9 weights (100–900) + variable, SIL OFL; widely cited as the de-facto Persian UI font. | Google Fonts specimen; fonts.codes |
| F3 | Both fonts load via Google Fonts CSS2 API with `wght@100..900`, support `font-display: swap`, preconnect to `fonts.gstatic.com`. | fonts.googleapis.com CSS output |
| F4 | Third-party packaging (next-persian-fonts) splits Estedad into "Estedad" (Latin digits) and "Estedad FD" (Persian digits ۰–۹) — third-party detail, not confirmed upstream; verify at Phase 3. | GitHub: amiryxe/next-persian-fonts |
| F5 | **DigiPostal** exists at digipostal.ir — Iranian DIY digital postcard & invitation platform; Android app on Google Play (developer "neno", package `com.neno.digipostal`); categories include wedding, engagement, birthday, anniversary, openings, business events, religious/mourning; features text/image/music/envelope personalization, RSVP, QR guest check-in, countdown, location/map, memory messages. | digipostal.ir (homepage, article, card detail, card view pages) + Google Play listing |
| F6 | **Manesh Store** exists at maneshstore.ir — Iranian digital invitation store active since Persian year 1403 (~2024/25); catalog by model number (wedding D*, opening OP*, mourning DT*, birthday DB*); double-sided cards with flip button, changeable background music, editable text & fonts, RSVP form, online map, unique shareable link + QR barcode; photo + video galleries; countdown; sold via Telegram/Instagram (no web checkout); ~48h fulfillment. | maneshstore.ir (homepage, product page, webcard-info page) |

### Assumptions (to be confirmed by Agent 1 / validated in Phase 2–3)

| # | Assumption |
|---|---|
| A1 | Primary audience reads Persian/Farsi; UI is RTL by default with Latin fallback support. |
| A2 | The demo is a clickable frontend prototype — no real sending, printing, RSVPs, or payments. |
| A3 | Final photography is supplied by Agency/Design; Phase 1–2 uses placeholder art direction only. |
| A4 | Champagne Gold `#B49A70` is an accent color (≤10–15% of pixels per screen) per the art-direction brief — this is a constraint, not a hypothesis. |
| A5 | Memorial category defaults toward reduced motion (dignified, minimal). |
| A6 | Shared-link entry (`/invite/:category/:slug`) is the primary guest entry point. |
| A7 | Persian digit handling (Estedad FD variant) needs Phase 3 verification before committing to font stack. |

---

## 3. Product Analysis

**Product:** Ponisha — a premium digital postcards and invitations platform. Users explore, select, personalize, and present digital invitations and postcards through multiple visual templates and interactive presentation effects.

**Core value proposition (for the demo):** A single clickable link delivers an art-directed, emotionally resonant digital invitation experience — card opening, background music, countdown, RSVP, gallery — without printing, post, or app installation.

**Central product concept — "Moment of Open":** A digital invitation is not a webpage. It is an envelope you open. Every screen, interaction, and motion decision exists to serve one emotional beat: the seal breaks, the flap lifts, the inside is revealed. Nothing competes with that moment. This concept governs visuals (one card at a time, full-bleed, tactile materials), interaction (the opening sequence — envelope pull → seal break → flap reveal → inside — is the hero interaction; every other interaction happens *inside* the opened card, never before it), and an exclusion test (any section or feature that does not serve the moment of open is cut or deferred).

**Six categories (from brief):**

| Category | Visual character | Demo priority |
|---|---|---|
| Wedding | Romantic, delicate, elegant, refined, emotional, timeless | P0 |
| Memorial & Funeral | Respectful, calm, understated, minimal, dignified | P0 |
| General Invitations | Formal, editorial, refined, structured | P1 |
| Opening Ceremonies | Contemporary, architectural, geometric, confident | P1 |
| Festivals & Celebrations | Expressive, energetic, creative, visually rich | P2 |
| Birthday | Joyful, creative, personal, flexible (not childish) | P2 |

**Referenced products:** DigiPostal (DIY platform) and Manesh Store (done-for-you webcard shop) — see Section 14.

**Demo priorities (from brief):** Design quality over page count; coherence over feature quantity; meaningful interactions over decorative effects; creative differentiation over generic components; precision over unnecessary complexity.

---

## 4. User Roles & Personas (conceptual)

### Role A — Visitor / Guest (invitee)
Receives a digital invitation link (the primary entry point), opens the card on phone or desktop, reads event details, optionally RSVPs, and may share or download the card.
- **Mindset:** emotional, time-poor, expecting a premium tactile-like experience on screen.
- **Devices:** mobile-first (most invitations opened from WhatsApp/Instagram/SMS on phone); desktop secondary but must feel deliberate, not stretched.
- **Language:** Persian (RTL) preferred; English switch available.

### Role B — Prospect / Browser (demo visitor)
Lands on the Ponisha homepage to browse invitation categories, preview templates, and imagine their own event. Not tied to a specific invitation.
- **Mindset:** evaluating quality, elegance, and fit for their event category.
- **Devices:** desktop exploration common; mobile must not break.

### Role C — Platform Owner / Presenter (demo operator)
Conceptual owner of the demo: presents Ponisha to prospective clients, toggles between categories, resets mock state, reviews interaction flows.
- **Mindset:** needs fast category switching, clean reset, and a "wow" moment per category without backend support.

---

## 5. User Journey Analysis

All journeys are frontend-only; submissions are mocked (local toast, no server).

### Journey A — Invited Guest (core delivery journey)
**Entry:** shared link, e.g. `ponisha-demo.com/invite/wedding/amir-sara`

| Stage | Doing | Thinking | Feeling | Touchpoint | Opportunity |
|---|---|---|---|---|---|
| 1. Receive link | Taps link in WhatsApp/Telegram/SMS | "Who is this from?" | Curious | Shared link | Immediate brand impression on first screen |
| 2. Open card | Card loads; envelope/card-open animation plays | "This feels different from a PDF" | Intrigued | Card viewer (full-bleed) | Own the "moment of open" |
| 3. Read details | Reads couple/event names, date, time, location | "When and where is this?" | Informed | Event info block + map | Clear typographic hierarchy (Estedad) |
| 4. Experience | Plays background music; views gallery; watches countdown | "This is thoughtful" | Moved | Audio toggle, gallery, countdown | Differentiate via motion + audio |
| 5. Respond | Taps RSVP (mocked); receives confirmation toast | "I've replied" | Reassured | Mock RSVP form + toast | Frontend-only simulation |
| 6. Share / save | Copies link, downloads card, or shares to social | "I'll save this" | Satisfied | Copy link / download / share | Extend reach beyond the invitee |

### Journey B — Prospect / Browser (evaluation journey)
**Entry:** homepage landing

| Stage | Doing | Thinking | Feeling | Touchpoint | Opportunity |
|---|---|---|---|---|---|
| 1. Arrive | Homepage hero loads; one featured invitation | "What is Ponisha?" | Impressed | Hero + CTA | Establish premium identity instantly |
| 2. Browse | Scrolls category editorial spreads | "Do they have my occasion?" | Interested | Category spreads | Six distinct category personalities |
| 3. Preview | Opens a template preview | "Can I picture my event here?" | Evaluating | Template preview | Real card proportions, no grid clutter |
| 4. Exit | Leaves with brand impression | "I'd use this for my event" | Convinced | Footer / contact | Memorable closing impression |

*(Note: "Customize (mock)" was removed from Journey B Stage 4 in this revision — mock customization is now P1 and located in the template-preview flow behind a "Customize" CTA, not on the homepage.)*

### Journey C — Platform Owner / Presenter (demo operator)
**Entry:** homepage → category toggle → reset mock state

| Stage | Doing | Thinking | Feeling | Touchpoint | Opportunity |
|---|---|---|---|---|---|
| 1. Present | Toggles between Wedding, Memorial, etc. | "Each category feels different" | Confident | Category switcher | Show range without separate sites |
| 2. Demonstrate | Runs card-open, scroll, fade sequences | "The motion feels premium" | Impressed | Motion controls | Controlled, repeatable wow moments |
| 3. Reset | Clears mock state; returns to clean demo | "Ready for next client" | Relieved | Reset control | Frontend-only state reset |

---

## 6. Information Architecture

```
Ponisha (root)
├── Homepage
│   ├── Hero ("the moment of open")
│   ├── Categories (6 editorial spreads)
│   ├── Experience showcase (fade → card-open → fade)
│   ├── Exhibition gallery (real card proportions)
│   └── Footer / contact
├── Category pages (6, one per category)
│   └── Template previews
├── Template preview flow (incl. P1 mock customization behind "Customize" CTA)
├── Invitation viewer (deep link /invite/:category/:slug → opens card directly)
│   ├── Card front (cover)
│   ├── Card-open transition (envelope / flap / seal)
│   ├── Card back / inside (event details)
│   ├── Background music (toggle)
│   ├── Countdown timer
│   ├── Photo gallery (photo only; video cut per revision)
│   ├── Location + map (mock)
│   ├── RSVP form (mock, toast confirmation)
│   ├── Share (copy link / social)
│   └── Download
├── About / Concept (platform story)
└── Contact (demo inquiry)
```

**Deep-linking pattern:** `/invite/:category/:slug` — shared links open cards directly, no login required (frontend-only mock).

---

## 7. Navigation Structure

| Element | Desktop | Mobile | RTL mirroring |
|---|---|---|---|
| Global header | Logo left, navigation center, CTA right | Hamburger drawer | Mirrored: logo right, CTA left |
| Category navigation | Horizontal scroll or sidebar | Bottom action bar or drawer | Right-to-left category order |
| Breadcrumbs | Top, above content | Top, above content | Reversed (current page on left) |
| Card viewer navigation | Side arrows, keyboard | Swipe gestures | Swipe direction mirrored |
| Language switcher | Header, persistent | Footer or drawer toggle | Labeled "فارسی / English" |

---

## 8. Essential Interactions

| # | Interaction | Desktop | Mobile | Art-direction alignment |
|---|---|---|---|---|
| 1 | Card-opening reveal (envelope pull, seal break, flap reveal) | Click/tap | Tap | The "moment of open" — premium tactile metaphor |
| 2 | Page fades (section transitions) | Crossfade | Crossfade | Quiet, dignified; Memorial uses fades only |
| 3 | Scroll-based storytelling | Scroll reveals | Scroll reveals | Progressive content reveal, no parallax |
| 4 | Swipe (card front/back, gallery) | N/A | Swipe | Touch-responsive, natural physics |
| 5 | Hover micro-interactions | Subtle gold underline/focus | N/A | Champagne Gold as micro-accent only |
| 6 | Progressive reveals (content appears on scroll) | Fade-in | Fade-in | Controlled pacing, no constant movement |
| 7 | Mock RSVP | Form → toast | Form → toast | Simulated, no backend |
| 8 | Copy link / download | Button + toast | Button + toast | Frontend-only simulation |
| 9 | Language toggle | Header switcher | Drawer/footer switcher | Persian default, English secondary |
| 10 | Reduced-motion fallback | `prefers-reduced-motion` → no animation | Same | Accessibility requirement |

**Motion governance:** GSAP + ScrollTrigger only where they provide meaningful value. Avoid excessive animation, unnecessary parallax, constant movement, slow interactions, effects that distract from content, animations that compromise mobile performance. `prefers-reduced-motion` supported everywhere.

---

## 9. Priority Screens

| Priority | Screens | Devices | Notes |
|---|---|---|---|
| **P0** | Homepage | Desktop + Mobile | Establishes brand identity immediately |
| **P0** | Wedding invitation viewer | Desktop + Mobile + Persian RTL | Primary category; emotional anchor |
| **P0** | Memorial invitation viewer | Desktop + Mobile + Persian RTL | Dignified, minimal, reduced motion |
| **P0** | Deep-link entry `/invite/:category/:slug` | Mobile-first | Shared-link is primary guest entry |
| **P0** | Mock RSVP (toast confirmation) | Mobile + Desktop | Frontend-only simulation |
| **P0** | Persian RTL support (all P0 screens) | — | Hard requirement |
| **P1** | Remaining 4 category landings | Desktop + Mobile | General, Opening, Festivals, Birthday |
| **P1** | Mock customization panel (template-preview flow, not homepage) | Desktop + Mobile | Live text/visual preview; relocated per revision |
| **P1** | Share / download | Mobile | Copy link, social share |
| **P1** | Operator reset panel | Desktop | Demo walkthroughs |
| **P1** | Reduced-motion variants | All | Accessibility |
| **P2** | Operator dashboard, token system, multi-language beyond Persian+English | — | Post-demo |

**Phase 2 design proposals (approval gate):** Homepage, Wedding invitation, Memorial invitation — each with desktop + mobile + Persian RTL specifics.

---

## 10. Demo Strategy

**Goal:** Make the original Ponisha client recognize the quality of the proposed platform and want to work with us. The demo must communicate:

1. The product has a clear and attractive visual identity.
2. The invitation and postcard experience is genuinely distinctive.
3. The frontend team can translate a product concept into a polished, high-quality digital experience.

**Strategy pillars:**
- **Smaller number of exceptional experiences** over a large collection of average pages (P0 screens first).
- **Frontend-only realism:** every interaction works in the browser with mock data; nothing requires a backend to demonstrate.
- **Mobile-first guest experience:** the shared-link journey is the core delivery path; desktop is the prospect evaluation path.
- **Category differentiation:** each of the six categories has its own visual personality within one premium brand.
- **Moment-of-open ownership:** animated card opening is the hero moment that neither reference product animates.

**What is deliberately NOT built:** real authentication, payments, backend dashboards, email/SMS sending, printing, production infrastructure, QR check-in, guest book / memory messages, video gallery, coupons, tokens, customization editor on homepage.

---

## 11. Homepage Creative Direction

**Final homepage hierarchy — 5 sections (reduced from 6).** Visual priority 1 = highest.

| # | Section | Visual priority | Phase | Purpose | Content |
|---|---|---|---|---|---|
| 1 | Hero — "The moment of open" | 1 | P0 | Establish premium identity instantly; own the opening beat before the user reads a word | One card, mid-open (envelope/flap visible), one Estedad editorial line, one outlined CTA ("Open an invitation"); no carousel, no stock split layout |
| 2 | Category editorial spreads | 2 | P0 | Prove category range; answer the prospect's "do they have my occasion?" | Six spreads, one per category, each with a distinct visual identity within one brand (consolidated Section 12 moods/accents) |
| 3 | Experience showcase | 3 | P1 | Prove motion is real, not static images | Three-step sequence: fade → card-open → fade; demonstrates the interaction vocabulary |
| 4 | Exhibition gallery | 4 | P1 | Tangible proof of template quality | Template previews at real card proportions, one per row, typographic empty states; no badges, ratings, pricing, or product grid |
| 5 | Footer / contact | 5 | P1 | Memorable closing impression; demo inquiry | Contact/demo inquiry, language switcher, brand close |

**Removed from the homepage:** Customization Mock and Coupons & Tokens. Rationale: customization is relocated to the template-preview flow (P1, behind a "Customize" CTA); coupons/tokens are cut entirely (see Revision Decision Log, Section 17). A homepage that leads with the moment of open and follows with category range makes a single, strong impression. Adding an editor panel or a commerce treatment to the homepage splits attention between "receiving an invitation" and "editing/selling one" — two different journeys.

---

## 12. Invitation Category Differentiation

| Category | Mood | Accent temperature | Estedad treatment | Imagery | Motion policy | Prohibitions |
|---|---|---|---|---|---|---|
| Wedding | Romantic, delicate, elegant | Champagne Gold (foil simulation) | Expressive, wide tracking | Restrained floral | Slow fades, gentle card-open | No excessive ornament |
| Memorial | Respectful, calm, dignified | None (gold dropped entirely) | Restrained, sober | Quiet, neutral | Fades only; minimal | No playful effects, no excessive motion |
| General Invitations | Formal, editorial | Sage Green | Strong typography | Balanced | Moderate reveals | No decorative noise |
| Opening Ceremonies | Contemporary, architectural | Dusty Rose | Precise, geometric | Architectural | Confident transitions | No softness overload |
| Festivals | Expressive, energetic | Richer combinations | Creative scale | Visually rich | More motion | Maintain discipline |
| Birthday | Joyful, creative, personal | Flexible | Adaptable | Personal | Joyful but refined | Not childish |

**Seven levers for making each invitation feel individually designed within one brand:**
1. Shared grid (consistency)
2. Variable composition per template
3. Typography per template
4. Accent temperature (gold → sage → rose → none)
5. Image treatment per category
6. Gold placement (hairline rules, corner accents, monogram highlights — never sole carrier of meaning)
7. Motion per category (fades for Memorial, gentle opens for Wedding, etc.)

---

## 13. Visual Identity & Typography

**Recommended concept:** "Timeless Press" (Concept B) — tactile, quiet luxury informed by letterpress: Warm Ivory canvas, Charcoal text, Champagne Gold as foil simulation (hairline rules, corner accents, monogram highlights), classical proportions, minimal motion. Governed by Concept C's restraint discipline (gold as micro-accent only, no decorative noise). Concept A's editorial headline scale borrowed for display typography.

**Working name:** "Ponisha Press" (proposal — not yet approved; brand naming must be presented for evaluation per the brief).

**Typography spec:**
- **Estedad** (variable 100–900): headings, display, editorial typography. Persian/Arabic glyphs confirmed on Google Fonts.
- **Vazirmatn** (variable 100–900): navigation, interface elements, forms, functional text. De-facto Persian UI font.
- Weight map, modular scale, line-heights defined in the visual spec.
- RTL-first logical properties; no justified Persian text.
- Persian digit handling flagged for Phase 3 verification.

**Color rules:**
- Warm Ivory: dominant background / canvas.
- Charcoal: primary text and structure.
- Champagne Gold: capped at ≤10–15% of pixels per screen; hairline rules/underlines/focus rings only; decorative, never sole carrier of meaning; Memorial drops gold entirely.
- Sage Green and Dusty Rose: category accent temperatures where appropriate.

---

## 14. Reference Research: DigiPostal & Manesh Store

### Evidence method and limits

Both references were examined via server-side page extraction (no JavaScript execution, no click-through flows). Consequences:
- Page copy is treated as a vendor claim, not observed behavior.
- Card-open animation, slideshow behavior, touch/swipe gestures, editor interactions, and checkout/payment flows were NOT directly observed.
- Where page copy asserts an interaction (e.g., "animated effect when opened", "card flip button"), it is reported as a claim; any deduction about how it behaves is marked INFERENCE.
- No weaknesses are asserted beyond what is directly observable on reviewed pages (e.g., missing visible pricing, missing visible checkout). Aesthetic or performance judgments are not made.

Existing verified facts in Section 2 (F5, F6) are preserved; this section expands the observable detail behind them.

### 14.1 DigiPostal (digipostal.ir)

**VERIFIED OBSERVATIONS**
- Site exists at digipostal.ir; Iranian DIY digital postcard & invitation platform. Homepage copy: "ساخت کارت پستال و کارت دعوت دیجیتال برای هر مناسبت" (create digital postcards and invitations for any occasion); "طراحی کارت پستال دیجیتال در کمتر از چند دقیقه" (design in under a few minutes); "ارسال آنلاین ... با یک لینک" (send online via one link); "شخصی‌سازی کامل متن، تصاویر، موسیقی و پاکت" (full personalization of text, images, music, envelope/"paket").
- Native Android app on Google Play: developer "neno", package `com.neno.digipostal`; copy describes personalizing all postcard elements and sending via SMS/email/social networks.
- Occasions covered: wedding, engagement, birthday, anniversary, openings, business events, religious/mourning (Muharram, Safar), business coupons/thank-you cards; free and paid templates mentioned.
- Templates carry designer attribution (e.g., "طراحی توسط نسترن حسینی") with designer profile pages.
- Homepage presents three value props: design in minutes, send via one link, full personalization (text, images, music, envelope/"paket").
- Fixed 3-step journey on homepage: 1) choose card → 2) personalize → 3) send via social/email/SMS.
- Template library organized by category pages (wedding category shows 24+ pages of results). Card detail pages show couple names, date/time/venue, designer credit, breadcrumbs, "view card" + "edit card" links, share buttons (copy link, Telegram, Facebook, Twitter, Pinterest).
- Card view page assets listed on homepage: background audio MP3; cover front/back/flap images; seal front/back; postmark; stamp; lining; flap shadows — a full physical-envelope metaphor (front cover, back cover, flap, wax seal, lining, postmark). Category copy mentions "پوستال پشت و رو" (front-and-back) and "دعوت عروسی دوطرفه دیجیتال" (two-sided digital invitation).
- Homepage feature list ("همه چیز را شخصی‌سازی کنید"): envelope design, inside-envelope design, background image, stamp, seal, recipients, wax seal, animated effect ("وقتی کارت پستال باز می‌شود، جلوه‌های متحرک نمایش داده می‌شود" — when the postcard opens, animated effects are displayed), music, card message, recipients, add link.
- Guest-facing features listed: location with navigation, countdown, photo gallery, memory messages, RSVP attendance form, QR guest check-in, per-guest names on envelopes.
- Blog with Persian-calendar occasion calendar (year 1405) and occasion-specific postcard content; custom design order page (`/orderDesign`); contact page.
- Creator journey: browse category → pick template → detail page → view share-ready link OR edit → send via WhatsApp/Telegram/Instagram/SMS/email.

**REASONABLE INFERENCES** (deduced from page copy/assets; behavior not observed)
- INFERENCE: the envelope-metaphor assets (front/back cover, flap, seal, lining, postmark, stamp) imply a physical-card unboxing mental model for the card view; whether any of it is animated cannot be confirmed from extraction.
- INFERENCE: the homepage's "animated effect" copy indicates some motion exists around card open, but its trigger, timing, duration, and quality were not observed.
- INFERENCE: the Google Play app plus app-linked edit paths suggest part of the personalization flow may live in the native app; the extent of web self-serve editing is unclear.
- INFERENCE: designer attribution plus profile pages suggest a template-marketplace dynamic (designers contribute templates); revenue/terms were not observed.
- INFERENCE: "free and paid templates" copy implies a tiered pricing model; no prices were visible on reviewed pages.

**RECOMMENDATIONS** (Agent 1/2/3 opinion only; not validated against DigiPostal)
- Treat the animated envelope-open as Ponisha's hero moment: DigiPostal lists envelope assets and claims animation, but no premium animated open was observable in the reviewed pages.
- Match DigiPostal's occasion breadth (incl. business/corporate and mourning) while rendering every Ponisha category with equal premium editorial quality.
- Per-guest personalization (names on envelopes) is listed by the competitor; worth prototyping as a mock feature in the Wedding viewer.

### 14.2 Manesh Store (maneshstore.ir)

**VERIFIED OBSERVATIONS**
- "منش استور" — digital invitation store; homepage states active online (+physical presence) since Persian year 1403 (~2024/25); copy: "modernize your wedding card digitally", "no printing/post hassle; exact location + guest attendance".
- Product catalog organized by model number: wedding D5307, D5246, D0431, D2501, D3241, D5241, D5245; openings OP01–OP06; mourning DT01, DT13, DT20–DT24; birthday DB5244, DB534, DB533, DB532, DB5250, DB5249, DB5248.
- Product titles carry "دعوت آنلاین موسیقی و فرم حضور" (online invitation with music and attendance form).
- "Webcard" product (webcard-info page, published 2025-12-06): dedicated online page per couple with unique short link + dedicated QR barcode; couple intro; date/time; map location; photo gallery; video gallery (teaser/intro clip/behind-the-scenes); invitation text; countdown; fully customizable colors/fonts/images/text/background music; real-time updates without reprinting; responsive (mobile/tablet/desktop).
- Product page (D5307) claims: double-sided card with visual effect; changeable background music; editable text and fonts; RSVP form (attendance + companions, auto-email to host); online map/navigation; sharing via one link; design within 24 hours, preview sent via customer's Telegram ID, up to two revision rounds; exclusive link after approval.
- "مشاهده وب کارت ها" (view web cards) → `/reels` — web cards demonstrated as reels/short videos.
- Sales channel: purchase only online via Telegram (`t.me/maneshstore`) or Instagram (`instagram.com/manesh.store`); phone numbers listed; no visible web checkout on reviewed pages. Order → exclusive link delivered within 48 hours → editable → sent to guests.
- Magazine/blog ("مجله منش استور") with articles on wedding-card importance and welcome cards; "Manesh Plus" tier mentioned in nav; account login/register, wishlist, and compare UI present.

**REASONABLE INFERENCES** (deduced from page copy/assets; behavior not observed)
- INFERENCE: the "card flip button" (دکمه چرخش کارت) claimed on product pages implies a front/back flip interaction; its gesture (tap vs drag), physics, and mobile behavior were not observed.
- INFERENCE: video gallery plus `/reels` preview suggests motion/video is core to the Manesh webcard experience; actual in-card video playback was not observed.
- INFERENCE: messenger-only order flow means no self-serve web editor is publicly visible; the editor's actual capabilities (editable fields, live preview) are not confirmed by observation.
- INFERENCE: 48-hour fulfillment plus up to two revision rounds implies a human-mediated done-for-you service rather than instant self-serve.
- INFERENCE: account/wishlist/compare UI implies conventional ecommerce scaffolding exists somewhere on the site, though no checkout or pricing was visible on reviewed pages.

**RECOMMENDATIONS** (Agent 1/2/3 opinion only; not validated against Manesh Store)
- Extend Manesh's reel-based preview into the card itself: a short motion preview (countdown + music + photo montage) as the shareable asset ("video-first invitations").
- Make QR part of the venue experience (check-in/welcome card), not just a link shortcut.
- A fast, web-visible self-serve editor with instant preview would contrast with the observed 48h messenger fulfillment — a candidate Ponisha differentiator, to be built frontend-only/mock.

### 14.3 Visual & UX comparison (observable evidence only)

| Dimension | DigiPostal (digipostal.ir) | Manesh Store (maneshstore.ir) |
|---|---|---|
| Model (observed) | DIY platform — choose, personalize, send | Done-for-you webcard shop — order via messenger, receive link |
| Sales channel (observed) | Web + Google Play app | Telegram / Instagram only; no web checkout visible |
| Fulfillment (observed/claimed) | Immediate share-ready link claimed; edit path unclear | ~48h link delivery claimed; editable after approval |
| Language scope (observed) | Farsi-first, Iran-focused | Farsi-first, Iran-focused |
| Occasions (observed) | Broad: wedding, engagement, birthday, anniversary, openings, business, religious/mourning | Wedding-heavy; also openings, mourning, birthday |
| Pricing (observed) | "Free and paid" mentioned; no prices visible on reviewed pages | No prices or checkout visible on reviewed pages |
| Editor path (observed) | "view card" + "edit card" links on detail pages; app-linked edit suspected | Messenger fulfillment; no public self-serve editor observed |
| Card metaphor assets (observed) | Full physical-envelope metaphor: front/back cover, flap, seal, lining, postmark, stamp | Double-sided card with claimed "visual effect"; flip button claimed |
| Audio (observed) | Background audio MP3 listed as card asset | Changeable background music claimed |
| RSVP (observed) | RSVP/attendance + QR check-in claimed | RSVP form (attendance + companions) claimed |
| Map / location (observed) | Location with navigation claimed | Online map/navigation claimed |
| Countdown (observed) | Countdown claimed | Countdown claimed |
| Gallery (observed) | Photo gallery claimed | Photo gallery + video gallery claimed |
| Share (observed) | Share-ready link; copy link, Telegram, Facebook, Twitter, Pinterest buttons | Unique short link + dedicated QR barcode |
| Mobile presence (observed) | Native Android app on Google Play | Responsive mobile/tablet/desktop claimed; no app observed |
| Designer attribution (observed) | Yes — designer names + profile pages | Not observed |
| Content marketing (observed) | Blog + Persian occasion calendar (1405) | Magazine blog (wedding cards, welcome cards) |

**Observable interaction claims (copy only — behavior NOT tested)**
- DigiPostal: animated effect on card open claimed ("when the postcard opens, animated effects are displayed"); 3-step journey; per-guest names; QR check-in; memory messages.
- Manesh Store: card flip button claimed; changeable music; editable text/fonts; RSVP form; real-time updates without reprinting; responsive design.

**Not observed — therefore not claimed as strengths or weaknesses**
Card-open animation quality/behavior, slideshow autoplay, touch/swipe gestures, editor UX, checkout/payment flow, page-load performance, mobile rendering fidelity.

### 14.4 Differentiation opportunities for Ponisha (recommendations only)

Framed as opportunities, not validated gaps. None are asserted as confirmed competitor failures.
1. **Moment-of-open experience** — animated envelope/card-open (seal break, flap reveal, lining). References imply the envelope metaphor statically and claim animation/flip, but behavior was not observed; Ponisha can own a deliberately animated, art-directed open.
2. **Instant web-first self-serve editor with real-time preview** — vs DigiPostal's unclear app-linked edit and Manesh's 48h messenger fulfillment. Frontend mock only.
3. **Multi-language + all six occasions equally premium from launch** — vs both references being Farsi/Iran-first and wedding-heavy.
4. **Transparent pricing + instant online purchase (demo)** — vs pricing/checkout not visible on reviewed reference pages.
5. **Frontend-demo-friendly clickable experience** — card-open, countdown, background audio, RSVP, gallery as one immediately clickable experience; references require purchase before the full card is previewable.

---

## 15. Recommended Interactive Experiences

| Experience | Purpose | Category fit | Tech note |
|---|---|---|---|
| Card-opening reveal (envelope pull → seal break → flap reveal → inside) | Hero moment; tactile metaphor | All categories | GSAP; reduced-motion fallback |
| Slideshow presentation | Photo montage with countdown + music | Festivals, Birthday, Wedding | ScrollTrigger or auto-advance |
| Scroll-based storytelling | Progressive content reveal as user scrolls | Memorial, General Invitations | Intersection Observer / ScrollTrigger |
| Page fade transitions | Quiet, dignified section changes | Memorial, Wedding | CSS crossfade; minimal JS |
| Swipe / touch (card front/back, gallery) | Touch-responsive card handling | All categories | Touch events; mobile-first |
| Hover micro-interactions | Champagne Gold hairline underline/focus | Desktop only | CSS; gold as micro-accent |
| Mock RSVP (toast confirmation) | Simulated attendance | All categories | Frontend-only; local toast |
| Copy link / download | Shareable asset | All categories | Clipboard API (mock fallback) |
| Background music toggle | Atmospheric audio | Wedding, Festivals, Birthday | `<audio>` with user gesture |
| Countdown timer | Event anticipation | All categories | Client-side date math |

**Motion governance:** GSAP + ScrollTrigger only where they provide meaningful value. Avoid excessive animation, unnecessary parallax, constant movement, slow interactions, effects that distract from content, animations that compromise mobile performance. `prefers-reduced-motion` supported everywhere.

---

## 16. Prioritized Feature List

| Priority | Feature | Rationale | Phase |
|---|---|---|---|
| P0 | Homepage (hero + categories + experience showcase + exhibition gallery + footer) | Establishes brand identity immediately | Phase 4 |
| P0 | Wedding invitation viewer (card-open, music, RSVP mock, share) | Primary category; emotional anchor | Phase 4 |
| P0 | Memorial invitation viewer (fades only, dignified, minimal) | Respectful category; reduced motion | Phase 4 |
| P0 | Deep-link entry `/invite/:category/:slug` | Primary guest entry path | Phase 4 |
| P0 | Mock RSVP (form → toast) | Frontend-only simulation of attendance | Phase 4 |
| P0 | Persian RTL support (all P0 screens) | Hard requirement | Phase 4 |
| P1 | Remaining 4 category landings (General, Opening, Festivals, Birthday) | Category range | Phase 4 |
| P1 | Mock customization panel (live text/visual preview) | Demonstrates platform flexibility | Phase 4 |
| P1 | Share / download (copy link, social) | Extends reach | Phase 4 |
| P1 | Operator reset panel (demo walkthrough) | Client presentation tool | Phase 4 |
| P1 | Reduced-motion variants | Accessibility | Phase 4 |
| P2 | Operator dashboard, token system, multi-language beyond Persian+English | Out of scope for this demo | Post-demo |

**Cut from demo scope (per revision):** QR check-in, guest book / memory messages, video gallery, coupons, tokens, customization editor on homepage.

---

## 17. Revision Decision Log & Change Summary

This section records every change made in response to the Agent 1 conditional approval of Phase 1, what stayed the same, and why. It preserves traceability without shortening or removing previously established requirements.

| # | Revision point | Previous position | New position | Changed? | Reason |
|---|---|---|---|---|---|
| R1 | Central product concept | Five differentiation pillars (moment-of-open, web-first editor, multi-language, transparent pricing, frontend-demo-friendly) | ONE coherent concept: **"Moment of Open"** — a digital invitation is an envelope you open | Yes | Feature collection is not a product strategy; moment-of-open is the only differentiator verified against both references |
| R2 | Homepage hierarchy | 6 sections: Hero → Categories → Template Gallery → Customization Mock → Experience Showcase → Coupons & Tokens | 5 sections: Hero → Category editorial spreads → Experience showcase → Exhibition gallery → Footer / contact | Yes | Homepage must communicate one premium identity, not catalog every feature; customization and coupons/tokens removed |
| R3 | Mock customization priority | Classified simultaneously as major homepage component AND P1 | **P1, not on homepage** — relocated to template-preview flow behind "Customize" CTA | Yes | Resolves P0-vs-P1 contradiction; homepage sells the received invitation, not the editing tool; customization impresses only after prospect believes the opened card is worth customizing |
| R4 | Feature discipline | QR check-in, guest book, video gallery, coupons, tokens all listed as demo features | QR check-in cut; guest book cut; video gallery cut (photo retained); coupons cut entirely; tokens cut from demo scope; bilingual kept but scoped (English = UI chrome + event metadata only) | Yes | Only what materially improves the initial client demo stays; backend-dependent or commerce features diluted the central concept |
| R5 | Reference experience analysis | Section 14 separated verified observations / reasonable inferences / recommendations; already marked untested interactions as not observed | Further strengthened: explicit "Not observed — therefore not claimed" list added; all recommendations framed as opinion only; visual/UX comparison table uses observable evidence only | Partial (already largely compliant; now explicit) | User required no invented weaknesses and no claims of untested interactions |
| R6 | "Timeless Press" concept | Retained as recommended creative concept | Retained as recommended creative concept — explicitly **not** finally approved; Phase 2 must demonstrate its visual potential | No (clarified) | User confirmed retention but required non-final status |
| R7 | Decision traceability | No decision log existed | New Section 17 added — full change log with what changed, stayed, and why | Yes | Required by user for traceability |

**Requirement preservation verification (17 / 17 hard requirements):** All previously established hard requirements (frontend-only; no auth/payments; mock data + client-side state; Persian RTL hard requirement; six categories; art direction; palette ≤10–15% gold accent; Estedad/Vazirmatn typography; interaction concepts incl. card-open/fades/swipe/reduced-motion; Agents 6 & 7 excluded; Agent 1 does not write application code; stack deferred to Phase 3; approval gates preserved; deep-link entry; P0/P1/P2 boundaries; build target = client-impact demo; localStorage mock at most) remain present, unchanged in substance, and none were removed, shortened, weakened, or re-prioritized.

---

## 18. Open Questions for Agent 1

| # | Question | Disposition |
|---|---|---|
| Q1 | Tech stack: Vite + Vanilla JS vs React vs Preact | **Open** — deferred to Phase 3; do not commit in Phase 1–2 |
| Q2 | Image sourcing: placeholder art direction vs Agency/Design photography | **Open** — confirm source before final assets |
| Q3 | Persian digits (Estedad FD variant ۰–۹) | **Open** — Phase 3 verification |
| Q4 | Bilingual UI scope | **Resolved** — keep; English limited to UI chrome + event metadata; editorial copy Persian-first (Revision R4) |
| Q5 | Memorial motion default | **Resolved** — fades only, minimal, reduced-motion default (Revision R4 / Proposal 3 scope) |
| Q6 | Token semantics / coupons | **Resolved** — cut from demo scope; no sale language (Revision R4) |
| Q7 | iOS Safari font + animation behavior | **Open** — confirm for the demo |

---

## 19. Phase 2 Entry Criteria

Before Phase 2 design proposals begin, Agent 1 requires:

- [x] Phase 0 environment inspection complete (directory empty, ready for build)
- [x] Phase 1 product analysis & creative strategy complete (this revised document)
- [x] Subagent deliverables on disk:
  - `PHASE_1_UX_RESEARCH_AND_STRATEGY.md` (316 lines, 22.9 KB)
  - `PHASE1_VISUAL_IDENTITY.md` (~257 lines, 21.8 KB)
  - `PHASE_1_STRATEGY_REVISION.md` (strategy revision analysis)
  - `PHASE_1_REVISION_DECISION_LOG.md` (decision log & consistency check)
- [ ] **User approval of this revised Phase 1 deliverable (pending)**
- [ ] Open questions in Section 18 resolved or acknowledged

**Phase 2 design proposals (next, upon explicit approval):**
1. Homepage — 5-section hierarchy per Section 11
2. Wedding invitation viewer — card-open, music, countdown, photo gallery, mock RSVP, share
3. Memorial invitation viewer — fades-only motion, no gold, restrained typography, reduced-motion default

Each proposal: desktop + mobile + Persian RTL, reviewed critically by Agent 1 against the approved art direction (Premium & Elegant / Editorial Luxury / Timeless Digital Elegance). **Approval gate: no full implementation until design direction is approved.**

---

**Delivered by:** Agent 1 — Project Manager / CTO / Orchestrator  
**Subagents used (general-purpose, temporary):** UX strategy, visual design strategy, reference research, strategy revision, decision log — clearly identified as general executors, not Agents 2/3/4/5/8; Agents 6 & 7 excluded  
**Application code written:** None (per mandatory delegation policy)