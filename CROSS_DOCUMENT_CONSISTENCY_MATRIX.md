# Cross-Document Consistency Matrix — Phase 2 Design System

Single source of truth for the five Phase 2 design documents. Reconciled 2026-11-06.
Authoritative documents: PHASE_2_UX_LAYOUT_SPECIFICATION.md (layout/navigation/routes/global UX) and
PHASE_2_VISUAL_IDENTITY_AND_ART_DIRECTION.md (brand/visual language/typography/colors/art direction).
Proposals inherit: PROPOSAL_1_HOMEPAGE_DESIGN.md, PROPOSAL_2_WEDDING_INVITATION_VIEWER.md,
PROPOSAL_3_MEMORIAL_INVITATION_VIEWER.md.

Verification status: "Verified" = value present and identical across the authoritative document and every
affected document after the 2026-11-06 edits; confirmed by full-text sweep of all five files.
"Spec text" = value stated in the authoritative document; dependent proposals cross-reference it.

| Design decision | Authoritative document | Other documents affected | Final resolved value | Verification status |
|---|---|---|---|---|
| Hero composition | PHASE_2_UX_LAYOUT_SPECIFICATION §3.1 | PROPOSAL_1 (§2 hero, §9 matrix), VI §3 | Centered mid-open invitation card (envelope + seal break + flap + inside); no split image/text layout, no side-by-side hero, no carousel, no template thumbnail grid at any breakpoint; mobile stack card-first (~70–85vh); editorial line fluid-shrinks; CTA inline-outlined | Verified |
| Hero typography scale | VI §2.1 (`.t-cover`) | UX §1.2, PROPOSAL_1 §2/§11, PROPOSAL_2 §4 | Estedad Thin 100 / Light 300; clamp(96px, 8vw, 120px) desktop / clamp(40px, 10vw, 56px) mobile; line-height 1.10–1.25; tracking +0.04–0.06em; one editorial line only | Verified |
| Heading weight scale | VI §2.1 | UX §1.2/§3, PROPOSAL_1, PROPOSAL_2, PROPOSAL_3 | Estedad 400–500 (Medium 500 max) for names, titles, section headings; no Light 300 or SemiBold 600 on headings | Verified |
| Font responsibilities | VI §2.1 | All five documents | Estedad: headings/editorial. Vazirmatn: UI/forms/body, 400–500 | Verified |
| Grid & spacing | UX + VI §2.3/§6 | All five documents | 1120px max content container, centered; 16px side padding mobile (<640px), 24px desktop (≥640px); 48px viewer column gutters; 120px desktop / 80px mobile section vertical spacing; 8px grid throughout | Verified |
| Breakpoints | UX + VI §2.3 | All five documents | Mobile-first: Base 0px, sm 640px, md 768px, lg 1024px, xl 1280px; no layout change beyond xl | Verified |
| Music default | PROPOSAL_2 §4.4 + VI §2.5/§5 | PROPOSAL_1, PROPOSAL_3 | Off by default for ALL categories; user gesture required to start; states Off / Playing / Paused; Memorial: no music, no visualizer | Verified |
| Wedding card-open sequence | UX §3.3/§4 + PROPOSAL_2 §6 | PROPOSAL_1 §8, VI §2.5/§4 | ≈1.65s: pull 300ms → seal break 250ms → flap lift 700ms → inside reveal 400ms + 100ms delay; plays once per entry; trigger: tap/click, Space on desktop; reduced motion → instant crossfade | Verified |
| Memorial motion policy | PROPOSAL_3 §4/§12 + UX §5 | VI §5, PROPOSAL_1 | Fades only, ≈500ms ease-out; zero card animation (no seal, flap, envelope pull); static default under prefers-reduced-motion: reduce | Verified |
| Memorial accent & gold | PROPOSAL_3 §3/§4 | VI §5, UX | Sage Green #687567 accent only; zero Champagne Gold #B49A70 pixels | Verified |
| Countdown | PROPOSAL_3 §4.b + PROPOSAL_2 §4.5 | PROPOSAL_1 | Wedding: number change once per second only, no ticking animation/pulse/flash; Memorial: static line "X روز تا مراسم", hidden entirely under prefers-reduced-motion: reduce | Verified |
| Gallery | PROPOSAL_2 §4 + PROPOSAL_3 §4.c | — | Wedding: photo-only lightbox; video cut. Memorial: up to 6–8 quiet neutral images, tap advances with 500ms cross-fade, no autoplay, no lightbox zoom animation | Verified |
| Focus ring | PROPOSAL_3 §13 + UX | VI, PROPOSAL_1 | Memorial: 2px solid Charcoal #25231F, 2px offset | Verified |
| RTL composition | UX §0/§10 + PROPOSAL_1 §10 | PROPOSAL_2, PROPOSAL_3 | direction: rtl; logical properties throughout; centered blocks not mirrored; editorial line and subhead text-align: start (right-aligned in RTL context); Persian-first copy | Verified |
| Deep links | PROPOSAL_2 §8 + PROPOSAL_3 §4.f | PROPOSAL_1 | /invite/wedding/:slug and /invite/memorial/:slug; opens card directly, no login | Verified |
| Mock RSVP, toast, share | PROPOSAL_2 §4.7–4.8 + PROPOSAL_3 §4.d–4.e | PROPOSAL_1 | Mock RSVP + toast; copy link / share; no QR code | Verified |
| Logo wordmark | PROPOSAL_1 §2 + UX §1.2 | VI, PROPOSAL_2, PROPOSAL_3 | Estedad SemiBold 600, 20px desktop / 16px mobile, Charcoal, thin gold hairline rule, inline-start (right in RTL) | Verified |
| CTA/button weight | VI §2.1 (`.t-button`) | PROPOSAL_1, PROPOSAL_2, PROPOSAL_3 | Vazirmatn Medium 500 (not SemiBold 600); 15px; outlined | Verified |
| Couple names / deceased names | UX §1.2 + VI §4/§5 | PROPOSAL_2, PROPOSAL_3 | Estedad Medium 500, tracking +0.03em, 56px desktop / 32px mobile, Charcoal, centered | Verified |
| Image proportions | VI §2.4 | PROPOSAL_1, PROPOSAL_2, PROPOSAL_3 | Invitation cards 3:4 portrait; hero photographic detail 3:2 single image low saturation; category spreads 4:3 or full-width band | Verified |

## Change summary (2026-11-06)
- All five markdown files updated in place; each carries a dated "## Change Log — 2026-11-06" section at end.
- Resolved inconsistencies A–F (hero composition, typography, grid & spacing, wedding interactions, memorial interactions, homepage responsive order).
- No application code written or committed; specification/markdown reconciliation only.
