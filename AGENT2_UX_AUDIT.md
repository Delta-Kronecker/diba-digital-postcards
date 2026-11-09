# Agent 2 — UI/UX Designer Audit Report

**Project:** Diba Digital Postcards (ponisha-digital-postcards-demo)
**Stack audited:** React 19 + Vite + Tailwind 3, RTL Persian (src/)
**Scope:** UX / IA / navigation / interaction audit against approved creative direction (Premium Editorial Luxury, Moment of Open). No code written. No files modified except this report.
**Date:** 2026-11-07

---

## 0. Executive summary

The codebase implements a functional frontend demo but diverges from the approved spec in several P0 ways: homepage still contains the DemoCustomizer (6 sections instead of 5) and a second CTA in the Hero; header exposes internal "P0" labels and a non-spec height on mobile; category cards show badges/P0 tags/feature checklists; footer repeats P0 labels and unverifiable claims; Wedding and Memorial viewers expose toolbars/music/copy before the envelope opens; MemorialViewer has **undefined icon imports that crash at runtime**; the 4 non-P0 categories share one generic template with no distinct identity; RSVP copy implies server delivery; theme toggle does not affect the homepage; and reduced-motion/keyboard accessibility are unimplemented. Build passes (`npm run build`, 5.1s) and no backend/API/auth/payment code exists.

Priority legend: **P0** = blocks approval / breaks core journey; **P1** = spec compliance / polish; **P2** = nice-to-have.

---

## 1. Header / navigation

Files: `src/components/Navbar.jsx`, `src/App.jsx`, `src/index.css`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 1.1 | P0 | Header height is `h-16` (64px) at all breakpoints. Spec: 64px desktop / **56px mobile**. | `Navbar.jsx:23` |
| 1.2 | P0 | Footer category labels include internal priority tags: `'عروسی و عقد (P0)'`, `'ترحیم و یادبود (P0 - Zero Gold)'`. Forbidden "P0 labels" must be removed from any user-facing surface. | `Footer.jsx:6-7` |
| 1.3 | P1 | Brand button has `focus:outline-none` with no focus-visible replacement → keyboard users lose focus indicator. | `Navbar.jsx:28` |
| 1.4 | P1 | Mobile drawer background is hardcoded `bg-[#F6F1E9]` and does not follow dark theme; drawer text colors hardcoded stone. | `Navbar.jsx:94,103` |
| 1.5 | P1 | Nav includes a "customizer" entry (`استودیو شخصی‌سازی`) and a primary CTA `شخصی‌سازی زنده` that route to `customizer`. Per revised IA, customization is **P1 and must not be promoted as a top-level nav item / primary CTA on the homepage**; it belongs in the template-preview flow behind a "Customize" CTA. | `Navbar.jsx:12,70-76,115-120` |
| 1.6 | P1 | Active state styling uses gold-tinted pills but no RTL-aware focus ring spec; hover states are the only affordance. | `Navbar.jsx:54-60` |
| 1.7 | P2 | Logo mark is a `Sparkles` glyph inside a gold-foil square — reads as generic SaaS. Spec calls for Estedad wordmark + thin gold hairline, no illustrative mark. | `Navbar.jsx:26-43` |

### Recommended spec

- Set header height: `h-14 md:h-16` (56px mobile / 64px desktop). Keep sticky + backdrop blur.
- Remove `(P0)` / `(P0 - Zero Gold)` from all labels; use plain category names.
- Drop `customizer` from primary nav and the gold primary CTA; replace with a single outlined "باز کردن دعوتنامه" CTA per spec §1.2. Keep gallery link if desired, but as a secondary text link.
- Add `focus-visible:ring-2 focus-visible:ring-[#B49A70] focus-visible:ring-offset-2` to brand button and all nav buttons; remove bare `focus:outline-none`.
- Make mobile drawer theme-aware: `bg-[var(--color-canvas)]` with `dark:` variants instead of hardcoded ivory.

---

## 2. Hero — "Moment of Open"

Files: `src/pages/HomePage.jsx` (lines 17-61)

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 2.1 | P0 | Hero has **two CTAs**: primary "گشودن دعوت‌نامه نمونه" and secondary "مشاهده گالری نمایشگاه". Approved spec: **single CTA** ("باز کردن دعوتنامه" / "Open invitation"). | `HomePage.jsx:42-59` |
| 2.2 | P0 | No envelope/card focal point. Hero is text-only with an ambient blur blob. Approved spec: one mid-open card (envelope pulled, seal broken, flap lifted, inside visible) as the visual anchor, centered, `clamp(320px, 80vw, 700px)`, 3:4. | `HomePage.jsx:18-61` |
| 2.3 | P1 | Hero tag pill ("نسل جدید دعوت‌نامه‌ها…") and long subtitle list features; spec calls for one Estedad editorial line + one Vazirmatn subhead line. | `HomePage.jsx:23-40` |
| 2.4 | P1 | Ambient blur blob is a gold-tinted decorative glow; gold pixel budget should be measured; ensure ≤10–15% and no more than one gold element per section. | `HomePage.jsx:21` |
| 2.5 | P2 | `selection:bg-amber-200` and `max-w-5xl` container; spec max content width 1120px. Minor. | `HomePage.jsx:12` |

### Recommended spec

- Remove the secondary "مشاهده گالری نمایشگاه" button entirely.
- Replace the ambient blob with a single centered mid-open card illustration (3:4, `clamp(320px, 80vw, 700px)`), no device frame, no collage. Envelope pull → seal break → flap reveal → inside reveal sequence (≈1.65s) plays once per page entry; under `prefers-reduced-motion` show a static mid-open card.
- Reduce copy to: one Estedad Thin/Light editorial line (`clamp(96px, 8vw, 120px)` desktop / `clamp(40px, 10vw, 56px)` mobile) + one Vazirmatn 16px subhead + one outlined CTA (Charcoal text, 1px `#B49A70` outline, gold fill on hover).
- Remove the feature-list tag pill or convert to a single quiet caption.

---

## 3. Homepage sections (5 approved) & customizer removal

Files: `src/pages/HomePage.jsx` (lines 63-78), `src/components/DemoCustomizer.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 3.1 | P0 | Homepage renders **6 sections**: Hero, CategorySpread, InteractiveShowcase, ExhibitionGallery, **DemoCustomizer**, Footer. Approved hierarchy is **5 sections**: Hero → Category editorial spreads → Experience showcase → Exhibition gallery → Footer. `DemoCustomizer` must be removed from the homepage. | `HomePage.jsx:72-73` |
| 3.2 | P1 | `DemoCustomizer` is imported and rendered on the homepage despite being classified P1 and relocated to the template-preview flow. Its presence splits attention between "receiving an invitation" and "editing one." | `HomePage.jsx:7,72-73` |
| 3.3 | P1 | `DemoCustomizer` receives `onNavigate` but its component signature is `onSelectCard` — the prop is ignored; customization never navigates. (Minor, but if kept in preview flow, fix the prop contract.) | `DemoCustomizer.jsx:6`, `HomePage.jsx:73` |
| 3.4 | P1 | Section order in code matches approved order (Hero → Categories → Experience → Gallery → Footer) once DemoCustomizer is removed. Keep. | — |

### Recommended spec

- Remove the `DemoCustomizer` import and its JSX block from `HomePage.jsx`. Keep `DemoCustomizer.jsx` as a P1 component to be mounted in the template-preview flow (not yet built) behind a "Customize" CTA.
- Ensure homepage renders exactly: Navbar → Hero → CategorySpread → InteractiveShowcase → ExhibitionGallery → Footer.
- Keep section vertical spacing 120px desktop / 80px mobile with 1px hairline dividers.

---

## 4. Category editorial spreads (6 categories)

Files: `src/components/CategorySpread.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 4.1 | P0 | Each card renders a `badge` pill ("پرطرفدارترین", "بدون طلا (Zero Gold)", "مینیمال اصیل", etc.). Anti-checklist forbids badges/ribbons. | `CategorySpread.jsx:132-136` |
| 4.2 | P0 | Image overlay shows `tag: 'دسته‌بندی اصلی P0'` (and similar) — internal priority labels leaked to UI. | `CategorySpread.jsx:11,25,38,51,64,77`, rendered `:140-147` |
| 4.3 | P0 | `features` arrays (4 bullet strings per category) are defined but not rendered; however the *intent* (feature checklists) conflicts with approved "no feature checklists/badges." Remove the data and any future rendering. | `CategorySpread.jsx:18,31,44,57,70,83` |
| 4.4 | P1 | Memorial card icon uses `text-amber-300` (gold) in the image overlay — violates zero-gold for Memorial. | `CategorySpread.jsx:142` |
| 4.5 | P1 | Memorial card has `hasGold: false` and sage CTA ✓, but the top accent hairline and icon still read gold/amber. Ensure **zero** `#B49A70` pixels on the Memorial spread. | `CategorySpread.jsx:26-32,114-121,140-147` |
| 4.6 | P1 | Cards use `rounded-3xl`, `shadow-lg`, `hover:-translate-y-1.5` — anti-checklist forbids rounded SaaS cards with shadows and hover lift. Spec: hairline dividers only, no card chrome. | `CategorySpread.jsx:111,124` |
| 4.7 | P1 | Category name is `text-2xl font-normal` (Estedad) but spec calls Estedad Medium 500, 32px desktop / 24px mobile, wide tracking +0.08em. | `CategorySpread.jsx:152` |
| 4.8 | P2 | `dustyRose` field defined but unused; harmless but dead data. | `CategorySpread.jsx:14` |

### Recommended spec

- Delete `badge`, `tag` (P0 text), and `features` from spread data; remove their JSX.
- Memorial spread: replace amber icon color with sage `#687567`; ensure no gold hairline/CTA on that row.
- Convert each spread from a bordered/shadowed card to an editorial row: category name (Estedad Medium 500, wide tracking) + one-sentence description (Vazirmatn) + one representative image at 4:3/real proportions, separated by 1px hairline dividers. Hover: opacity shift + single gold hairline underline beneath the hovered name (one at a time).
- Keep 6 categories in order: Wedding, Memorial, General, Opening, Festival, Birthday (right-to-left).

---

## 5. Exhibition gallery

Files: `src/components/ExhibitionGallery.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 5.1 | P1 | Gallery renders `INVITATIONS_DATA` (6 items) — curated count matches 6 categories ✓. Links use `onNavigate(card.slug)` → CategoryViewer ✓. | `ExhibitionGallery.jsx:18,96` |
| 5.2 | P1 | Each gallery item is a `rounded-2xl border shadow-md` card with hover shadow — anti-checklist (no bordered/shadowed cards). Spec: one template per row at real card proportions with 1px hairline dividers. | `ExhibitionGallery.jsx:68-71` |
| 5.3 | P1 | Filter chips use filled gold active state (`bg-amber-900`) — spec says text chips, no fills, hairline underline on active. | `ExhibitionGallery.jsx:47-57` |
| 5.4 | P2 | Image `alt={card.title}` OK. Venue line with 📍 emoji is acceptable but ensure consistent with editorial tone. | `ExhibitionGallery.jsx:90-92` |
| 5.5 | P2 | No empty state handling beyond `filteredCards.map` (renders nothing if empty). Spec: typographic empty state, no illustrations. | `ExhibitionGallery.jsx:64-111` |

### Recommended spec

- Convert rows to full-width exhibition rows: large preview at real card proportions (3:4, capped ~520px desktop / ~85% mobile) + title (Estedad Medium 500) + category tag (Vazirmatn), 1px hairline divider beneath each row (gold only on the featured row).
- Filter chips: outlined text chips, active = Charcoal fill with canvas text (no gold fill), horizontal scroll on mobile.
- Add a typographic empty state (Vazirmatn, Charcoal, centered) when a filter yields no items.

---

## 6. Footer

Files: `src/components/Footer.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 6.1 | P0 | Footer category list repeats P0 labels (`(P0)`, `(P0 - Zero Gold)`). | `Footer.jsx:6-7` |
| 6.2 | P1 | Bottom bar claims "100% RTL & Accessible" and "Responsive Desktop & Mobile" — unverifiable marketing claims; the audit shows a11y gaps. Remove or replace with honest, measurable statements. | `Footer.jsx:103-106` |
| 6.3 | P1 | Footer links to `customizer` and `gallery` routes that render the homepage (see §10 routing). Ensure these resolve to real destinations or remove. | `Footer.jsx:75-83` |
| 6.4 | P2 | "دیبا (Ponisha)" brand parenthetical is awkward; either commit to one brand name or mark as placeholder. | `Footer.jsx:101` |
| 6.5 | P2 | Footer uses `bg-[#25231F]` (charcoal) with light text — acceptable as a closing band, but ensure contrast and that it doesn't fight the ivory canvas. | `Footer.jsx:15` |

### Recommended spec

- Strip P0 tags from all labels.
- Remove "100% RTL & Accessible" / "Responsive Desktop & Mobile" claims; replace with a single honest line such as "دموی تعاملی فرانت‌اند — بدون بک‌اند" (Frontend-only interactive demo — no backend) or remove entirely.
- Footer columns: brand close (wordmark + one line) → contact/demo inquiry (mock, no backend) → language switcher. No newsletter, no social grid.

---

## 7. Wedding viewer — initial state

Files: `src/pages/WeddingViewer.jsx`, `src/components/3DEnvelope.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 7.1 | P0 | **Top floating action bar is visible before the envelope opens**, including ThemeToggle, AudioPlayer (music), and "کپی لینک" (copy link). Approved spec: initial state = **envelope only**; no toolbar, music, or copy before open. | `WeddingViewer.jsx:33-56` |
| 7.2 | P0 | Couple names use `font-extrabold` + `text-gold-foil` (gradient text). Spec: Estedad Medium 500, Charcoal primary text; gold is hairline only. Gradients are forbidden. | `WeddingViewer.jsx:111` |
| 7.3 | P1 | Parents line "به همراه خانواده‌های {data.parents}" — data.parents = "خانواده‌های رضایی و طباطبایی", producing "به همراه خانواده‌های خانواده‌های رضایی و طباطبایی" (duplicated "خانواده‌های"). Content defect noted in critical audit. | `invitations.js:11`, `WeddingViewer.jsx:115` |
| 7.4 | P1 | `copiedToast` etc. are fine, but the toast's "لینک کارت با موفقیت در حافظه کپی شد" implies success of a real share; acceptable as mock but should be labeled demo (see §11). | `WeddingViewer.jsx:58-64` |
| 7.5 | P1 | 3DEnvelope light-beam container animates gold beams continuously (even for Wedding) and is not gated by `prefers-reduced-motion`. | `3DEnvelope.jsx:29-33,89-100,185-198 (index.css)` |
| 7.6 | P2 | Seal uses `animate-wax-shimmer` infinite loop — violates "no constant movement"; should play once or be static. | `3DEnvelope.jsx:84` |
| 7.7 | P2 | `AudioPlayer` visualizer bars use `animate-pulse` infinite loop. | `AudioPlayer.jsx:128-134` |

### Recommended spec

- Gate the entire top action bar behind `isOpen`: render it only after the envelope opens (or move music/copy/share into the opened card's actions row). Initial view = envelope card + a single "tap to open" hint below.
- Change names to `font-estedad font-medium text-stone-900` (Estedad Medium 500) with a 1px gold hairline beneath; remove `text-gold-foil` gradient.
- Fix parents copy: either change data to "رضایی و طباطبایی" or template to "به همراه خانواده‌های {parents}".
- Add `prefers-reduced-motion` handling: disable light beams, wax shimmer, pulse glow, and gold shimmer; provide a static mid-open/envelope state.
- Ensure envelope open is keyboard-triggerable (Space/Enter) per spec §4.5.

---

## 8. Memorial viewer — distinctness, separation, honest copy

Files: `src/pages/MemorialViewer.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 8.1 | P0 | **Runtime crash:** `MemorialViewer.jsx` uses `MessageSquare`, `X`, and `User` icons but does **not import them**. Imports line 2 omits all three. The condolence button (renders `MessageSquare`) is in the opened card, so opening a memorial invitation throws `ReferenceError` and the viewer is unusable. | `MemorialViewer.jsx:2,186,218,257` |
| 8.2 | P0 | Top action bar (ThemeToggle, AudioPlayer, Copy) is visible **before** the envelope opens — same violation as Wedding. Initial state must be envelope only. | `MemorialViewer.jsx:37-60` |
| 8.3 | P1 | AudioPlayer is rendered before open with `synth-soothing`; spec says music is off by default and optional for Memorial, with no visualizer. Ensure audio cannot start before open and toggle is hidden until open. | `MemorialViewer.jsx:49` |
| 8.4 | P1 | Attendance vs condolence are separated into two buttons ✓ and two modals ✓ (RSVPModal + inline condolence modal). Good. But RSVPModal header combines them ("تأیید حضور و پیام تسلیت") — consider keeping the attendance modal's copy attendance-only and the condolence modal condolence-only to avoid conflation. | `RSVPModal.jsx:97`, `MemorialViewer.jsx:172-189` |
| 8.5 | P1 | Memorial images use `grayscale opacity-90` with hover `grayscale-0` ✓ — distinct, respectful. Keep. | `MemorialViewer.jsx:166` |
| 8.6 | P1 | Memorial uses sage `#687567` accents and no gold ✓ in most places, but 3DEnvelope light beams (gold) still render and animate. Remove gold beams from memorial render. | `3DEnvelope.jsx:29-33`, `MemorialViewer.jsx:74-82` |
| 8.7 | P1 | Condolence modal uses `User` icon (undefined import) and `MessageSquare` (undefined). Fix imports. | `MemorialViewer.jsx:257,272` |
| 8.8 | P2 | Condolence submitted toast says "پیام تسلیت شما به خانواده داغدار ابلاغ خواهد گردید" (will be delivered to the grieving family) — implies real delivery. Relabel as demo/local. | `MemorialViewer.jsx:238-239` |

### Recommended spec

- Add missing imports: `MessageSquare, X, User` from `lucide-react` (or replace icons). This is a correctness fix, not optional.
- Gate the top action bar behind `isOpen`; initial view = envelope only + tap hint.
- Keep attendance and condolence as two distinct actions with distinct modals and distinct copy; ensure RSVPModal for memorial is attendance-focused and the condolence modal is message-focused (no combined header).
- Relabel all success copy as demo-local (see §11).
- Remove gold light beams and any gold pixels from the memorial render path (pass a `hasGold={false}`-aware flag to 3DEnvelope to skip beams).

---

## 9. Other 4 categories — distinctness

Files: `src/pages/CategoryViewer.jsx`, `src/data/invitations.js`, `src/data/categories.js`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 9.1 | P1 | `CategoryViewer` is a single generic template used for general, opening, festival, and birthday. All four use hardcoded `text-amber-800` labels regardless of category accent — no distinct accent temperature. | `CategoryViewer.jsx:94,128,138,156` |
| 9.2 | P1 | Top accent line switches on `hasGold` (gold gradient vs accent color) ✓, but labels/buttons do not adapt: birthday (should be warmest, gold+rose), festival (rose+sage), opening (gold structural), general (charcoal+gold hairline) all read as wedding-gold. | `CategoryViewer.jsx:83-90,180-195` |
| 9.3 | P1 | Same layout, typography, motion, and image treatment for all four — violates "each category has its own visual personality within one brand." | `CategoryViewer.jsx` (whole) |
| 9.4 | P1 | Toolbar (ThemeToggle, AudioPlayer, Copy) visible before open for all four categories. | `CategoryViewer.jsx:33-56` |
| 9.5 | P2 | `categories.js` uses remote Unsplash URLs while `invitations.js`/`public/images` use local images — two image sources; consolidate. | `categories.js:7,19,...` vs `invitations.js` |
| 9.6 | P2 | Birthday data uses `synth-happy` track but AudioPlayer has no `synth-happy`? It does (case 'synth-happy'). OK. | `AudioPlayer.jsx:20-21` |

### Recommended spec

- Introduce per-category theme tokens (accent color, label color, image treatment, motion policy) and drive `CategoryViewer` from `data.theme` instead of hardcoded amber:
  - General: Charcoal-dominated, gold hairline, architectural still life, quick fades.
  - Opening: gold structural (corner rules/underlines), bold cropped venue exterior, confident fade with slight scale.
  - Festival: Dusty Rose + Sage, gold micro-dots, texture/craft detail, subtle animated grain.
  - Birthday: gold + rose (warmest), personal portraits, gentle fade-in; not childish.
- Gate toolbar behind `isOpen`.
- Consolidate image sources to local `public/images`.

---

## 10. Routing defects

Files: `src/App.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 10.1 | P0 | `customizer`, `gallery`, `categories`, `home`, and default all render `<HomePage />`. So `/#customizer` and `/#gallery` do **not** navigate to dedicated views; they show the homepage. Footer/nav links to these routes are effectively no-ops visually. | `App.jsx:76-82` |
| 10.2 | P1 | `opening` route maps to `CategoryViewer` with `slug={currentRoute}` = `'opening'`, which is not a key in `INVITATIONS_DATA` → falls back to `general-gallery-opening`. So `/#opening` shows the gallery card, not the opening card. Use `'opening-tech-hub'`. | `App.jsx:68-69`, `CategoryViewer.jsx:12` |
| 10.3 | P1 | No 404 / invalid-slug handling. `CategoryViewer` silently falls back to `general-gallery-opening`; Wedding/Memorial always load their fixed data. Spec: typographic 404 on Warm Ivory for invalid slugs. | `CategoryViewer.jsx:12` |
| 10.4 | P1 | Hash-based routing uses bare route ids (`wedding-amir-sara`) rather than `/invite/:category/:slug`. Spec deep-link pattern is `/invite/:category/:slug`. Pathname-based initial load supports `/invite/wedding` etc., but not full slug. Acceptable for demo but document as a known gap; consider supporting `#/invite/wedding/amir-sara`. | `App.jsx:8-20,22-26` |
| 10.5 | P2 | `navigateTo` calls `window.scrollTo({behavior:'smooth'})` on every navigation — can fight with reduced-motion preference. Gate on `prefers-reduced-motion`. | `App.jsx:25` |
| 10.6 | P2 | Theme state is set in `App.jsx` useEffect and also in `ThemeToggle` — duplicated logic; both write `localStorage` and toggle classes. Consolidate to one source (ThemeToggle) to avoid drift. | `App.jsx:28-39`, `ThemeToggle.jsx:11-21` |

### Recommended spec

- Either build dedicated routes for `customizer`/`gallery` or remove those nav/footer entries. Given revised IA, remove `customizer` from primary nav; keep `gallery` as an in-page anchor (`#gallery`) or a real route.
- Fix `opening` → `opening-tech-hub` mapping in `App.jsx`.
- Add a typographic 404 fallback for unknown slugs instead of silent fallback.
- Support `#/invite/:category/:slug` (and pathname) for shared links.
- Make scroll behavior respect `prefers-reduced-motion`.

---

## 11. RSVP honesty & demo copy

Files: `src/components/RSVPModal.jsx`, `src/pages/MemorialViewer.jsx`, `src/pages/WeddingViewer.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 11.1 | P0 | RSVPModal success copy says "پاسخ شما در حافظه دستگاه ذخیره شد و **میزبان مطلع خواهد گردید**" (host will be notified) — false; data is localStorage only, no backend. | `RSVPModal.jsx:113-115` |
| 11.2 | P1 | Memorial condolence success: "پیام شما به خانواده داغدار ابلاغ خواهد گردید" (will be delivered to family) — false. | `MemorialViewer.jsx:238-239` |
| 11.3 | P1 | Toasts ("لینک کارت با موفقیت در حافظه کپی شد", "پاسخ شما ثبت شد") imply real success. Acceptable as mock but should be labeled demo/local. | `WeddingViewer.jsx:60-62`, `RSVPModal` |
| 11.4 | P1 | RSVPModal uses a hardcoded gold glass panel (`glass-panel` border gold) even for Memorial where `hasGold=false` is passed — the top accent line correctly switches to sage, but the panel border stays gold. Minor but inconsistent with zero-gold. | `RSVPModal.jsx:69-73,76-83` |
| 11.5 | P2 | Form focus rings are hardcoded `focus:ring-amber-600/40` even for Memorial. Use accent color prop. | `RSVPModal.jsx:161,210,232` |
| 11.6 | P2 | RSVPModal `isMemorial` changes header to "تأیید حضور و پیام تسلیت" (attendance + condolence combined) — conflation. Keep attendance-only copy in RSVPModal; condolence stays in its own modal. | `RSVPModal.jsx:97` |

### Recommended spec

- Rewrite success copy to be honest: "پاسخ شما در این دستگاه (دمو) ذخیره شد — بدون ارسال به سرور" (saved locally on this device — demo, no server). Toasts similarly: "لینک کپی شد (دمو)".
- Make RSVPModal panel border/focus ring use the `accentColor`/`hasGold` props (sage for Memorial, gold for others) instead of hardcoded gold/amber.
- Keep attendance and condolence as separate flows with separate copy.

---

## 12. Theme toggle consistency

Files: `src/components/ThemeToggle.jsx`, `src/pages/HomePage.jsx`, `src/index.css`, `src/App.jsx`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 12.1 | P0 | HomePage hardcodes `bg-[#F6F1E9] text-[#25231F]` (always light ivory) and ignores the dark theme, so the theme toggle has no effect on the homepage — the most visible page. | `HomePage.jsx:12` |
| 12.2 | P1 | Mobile drawer in Navbar also hardcoded ivory (see §1.4). | `Navbar.jsx:94` |
| 12.3 | P1 | `index.css` sets `:root` to **dark** defaults (`#121212` canvas) and `.light` to ivory, while `App.jsx` defaults to dark. HomePage's hardcoded ivory means the homepage is always light even in dark mode — inconsistent. | `index.css:6-18`, `App.jsx:28-39` |
| 12.4 | P1 | ThemeToggle persists to `localStorage` and toggles `dark`/`light` classes; App.jsx duplicates this on mount. Consolidate (see §10.6). | `ThemeToggle.jsx`, `App.jsx:28-39` |
| 12.5 | P2 | ThemeToggle uses `dark:` variants that assume dark mode is the default; ensure all components use `var(--color-canvas)` + `dark:` consistently. | `ThemeToggle.jsx:26` |

### Recommended spec

- Make HomePage theme-aware: use `bg-[var(--color-canvas)] text-[var(--color-ink)]` plus `dark:` variants, like the viewer pages, instead of hardcoded ivory.
- Consolidate theme logic into ThemeToggle (or a single hook); remove the duplicate useEffect in App.jsx.
- Ensure mobile drawer and all surfaces respond to theme.

---

## 13. Accessibility

Files: across `src/`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 13.1 | P0 | **No `prefers-reduced-motion` handling anywhere.** Infinite animations (gold shimmer, wax shimmer, light beams, float, pulse glow) run always, including Memorial. Spec requires reduced-motion fallback and Memorial = zero motion by default. | `index.css:43-47,103-131,163-198`; `3DEnvelope.jsx` |
| 13.2 | P1 | Envelope open is click-only; no keyboard (Space/Enter) support. Spec: Space to open on desktop. | `3DEnvelope.jsx:16-23` |
| 13.3 | P1 | Modals (RSVPModal, condolence, PhotoLightbox) have no Esc-to-close and no focus trap; close is click-outside or X button. | `RSVPModal.jsx`, `PhotoLightbox.jsx`, `MemorialViewer.jsx:208-298` |
| 13.4 | P1 | Many interactive elements lack visible focus rings (buttons use `transition-all` but no `focus-visible:ring`). Brand button explicitly `focus:outline-none`. | `Navbar.jsx:28`; various |
| 13.5 | P1 | Touch targets below 44px: mobile menu button `p-2` (≈32px), lightbox nav `p-3` (≈40px), several icon buttons `p-2`. | `Navbar.jsx:82-88`; `PhotoLightbox.jsx:63-74` |
| 13.6 | P1 | `scroll-behavior: smooth` in index.css ignores reduced motion. | `index.css:25` |
| 13.7 | P2 | No `aria-live`/role for toasts; screen readers won't announce. | `WeddingViewer.jsx:58-64` etc. |
| 13.8 | P2 | `html` has `lang`? `index.html` sets `lang="fa" dir="rtl"` ✓. Viewer roots should also set `lang="fa"`. | `index.html:2` |
| 13.9 | P2 | Gold text gradient (`text-gold-foil`) has ~2.6:1 contrast — decorative only; ensure it never carries meaning alone (it currently does for couple names). | `WeddingViewer.jsx:111` |

### Recommended spec

- Add a global `@media (prefers-reduced-motion: reduce)` block disabling all infinite animations and setting `scroll-behavior: auto`; make Memorial render with zero motion by default regardless of setting.
- Add keyboard handlers: Enter/Space opens envelope; Esc closes modals/lightbox.
- Add focus-visible rings (2px gold for non-Memorial, 2px Charcoal for Memorial) to all interactive elements.
- Enforce min 44×44px touch targets on mobile.
- Add `role="status"` / `aria-live="polite"` to toasts.
- Remove gradient text from names (use solid Charcoal) to fix contrast.

---

## 14. Responsive

Files: across `src/`

### Findings

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 14.1 | P1 | Header height not responsive (see §1.1). | `Navbar.jsx:23` |
| 14.2 | P1 | Hero ambient blob `w-[500px] h-[500px]` may overflow small viewports (mitigated by `pointer-events-none` and `overflow-hidden` on section). | `HomePage.jsx:21` |
| 14.3 | P1 | CategorySpread image height `h-52` fixed; spec wants responsive aspect ratios (4:3 / real proportions). | `CategorySpread.jsx:124` |
| 14.4 | P2 | ExhibitionGallery chips `flex-wrap` OK; ensure horizontal scroll fallback on very small screens. | `ExhibitionGallery.jsx:42` |
| 14.5 | P2 | PhotoLightbox `h-[65vh]` may clip on landscape mobile; consider `max-h-[70vh]` with aspect containment. | `PhotoLightbox.jsx:52` |
| 14.6 | P2 | Wedding/Memorial/Category viewers use `max-w-4xl` (896px) instead of spec viewer card `clamp(320px, 80vw, 700px)` centered on canvas. Minor layout drift. | `WeddingViewer.jsx:67`, etc. |

### Recommended spec

- Implement responsive header height (56/64).
- Use aspect-ratio utilities (`aspect-[3/4]`, `aspect-[4/3]`) instead of fixed pixel heights.
- Viewer card: centered, `clamp(320px, 80vw, 700px)`, min 40px viewport padding, on Warm Ivory canvas.

---

## 15. Additional defects found (not in requested list but relevant)

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 15.1 | P0 | `MemorialViewer.jsx` missing icon imports → runtime crash (see §8.1). | `MemorialViewer.jsx:2` |
| 15.2 | P1 | `CountdownTimer` uses `padStart(2, '۰')` on a number (coerced to string) — works but verify Persian digit rendering; open Phase 3 question. | `CountdownTimer.jsx:51` |
| 15.3 | P1 | `canvas-confetti` and `framer-motion` dependencies are unused (envelope uses CSS/GSAP). Adds bundle weight; remove if unused. | `package.json:12-13` |
| 15.4 | P1 | `DemoCustomizer` prop mismatch (`onSelectCard` vs `onNavigate`) — see §3.3. | `DemoCustomizer.jsx:6` |
| 15.5 | P2 | `AudioPlayer` has no actual audio assets (synth only) — acceptable for demo but document as mock. | `AudioPlayer.jsx` |
| 15.6 | P2 | `3DEnvelope` light-beam container renders for all categories including Memorial (gold beams) — violates zero gold. | `3DEnvelope.jsx:29-33` |
| 15.7 | P2 | `ExhibitionGallery` filter uses `card.category` matching filter ids; verify all 6 categories present in `INVITATIONS_DATA` (yes: wedding, memorial, general, opening, festival, birthday). Links resolve. | `ExhibitionGallery.jsx:20-22`, `invitations.js` |

---

## 16. Prioritized action plan

**P0 (must fix before approval):**
1. Fix MemorialViewer missing imports (crash). — §8.1
2. Remove DemoCustomizer from homepage (5 sections). — §3.1
3. Single CTA in Hero + add mid-open envelope focal point. — §2.1, §2.2
4. Strip all "P0" labels from Footer and CategorySpread. — §1.2, §4.2, §6.1
5. Remove badges/feature checklists from category spreads. — §4.1, §4.3
6. Gate Wedding/Memorial/Category toolbars behind `isOpen` (envelope only initially). — §7.1, §8.2, §9.4
7. Fix Wedding names typography (no gradient, Medium 500). — §7.2
8. Make HomePage theme-aware. — §12.1
9. Implement `prefers-reduced-motion` (at minimum disable infinite animations; Memorial zero motion). — §13.1

**P1 (spec compliance):**
10. Fix `opening` route → `opening-tech-hub`. — §10.2
11. Remove customizer from primary nav/CTA; relocate to preview flow. — §1.5
12. Memorial: attendance vs condolence copy separation + honest demo labels. — §8.4, §11.2
13. RSVP honesty copy (no "host notified"). — §11.1
14. Other 4 categories distinct accent/typography/motion. — §9.1-9.3
15. Accessibility: keyboard open (Space/Enter), Esc close, focus rings, 44px targets. — §13.2-13.5
16. Footer: remove unverifiable claims. — §6.2
17. Exhibition gallery: exhibition rows, text chips, typographic empty state. — §5.2-5.5
18. Header height 56/64. — §1.1

**P2 (polish):**
19. Remove unused dependencies; fix prop contracts; consolidate theme logic; 404 handling; deep-link pattern; scroll behavior; image source consolidation.

---

## 17. Out of scope / not audited

- No visual rendering was performed (no browser run); findings are from static source review. Pixel-level gold-budget measurement, RTL rendering, and iOS Safari font behavior (Phase 3 open questions Q3/Q7) require a running build + device testing.
- No backend/API/auth/payment code exists in the repo (verified by file listing and grep) — compliance with the frontend-only constraint holds.
- Design-token values in docs (`PHASE_2_*`, `PROPOSAL_*`) were treated as the approved spec baseline; conflicts between code and docs are reported as findings above.

---

**End of audit.** No code was modified. Report saved to `D:/Hermes/ponisha-digital-postcards-demo/AGENT2_UX_AUDIT.md`.
