# Write the RSVP confirmation's guest count in Persian digits

Written against: `aa43c8b` (working tree carries unrelated uncommitted changes; this plan
touches one expression in one file)

## Evidence chain

- Surface: `#/wedding` → `src/pages/WeddingViewer.jsx:72-80` → `RSVPModal`, step "submit
  RSVP", the confirmation panel shown after a successful submit.
- Problem: the confirmation row writes the guest count with **Latin** digits — rendered as
  `تعداد نفرات` / `2 نفر` — while the form that produced that number offers it in **Persian**
  digits: `۱ نفر، فقط خودم` / `۲ نفر` / `۳ نفر` / `۴ نفر` / `۵ نفر یا بیشتر`. The same stored
  value is written two ways, one screen apart, inside one task.
- Design evidence: `src/utils/numbers.js:3` (`toPersianDigits`) is this repository's owner
  for writing a count for a Persian reader, and it is what every other user-facing count
  uses: `src/components/CountdownTimer.jsx:64` (rendered inside `InvitationCard`, inside the
  same viewer), `src/components/GallerySection.jsx:100`
  (`{toPersianDigits(cards.length)} کارت نمایش داده شد.` — a Persian word attached to a
  count, the exact shape of `… نفر`), `:151`, `:221`, and `src/components/Footer.jsx:24`.
  Rendered evidence: `scratchpad/skill23/rsvp-form-guests.png` (`۱ نفر، فقط خودم`) and
  `scratchpad/skill23/rsvp-summary.png` (`2 نفر`).
- Owner: `src/components/RSVPModal.jsx:216`.
- Scope and affected surfaces: every surface that mounts `RSVPModal` — `#wedding`
  (`WeddingViewer.jsx:72`), `#memorial` (`MemorialViewer.jsx:119`), and the category
  viewers (`CategoryViewer.jsx:76`) — plus `DemoCustomizer.jsx` if it mounts the modal.
  The change is theme- and variant-independent.
- Uncertainty: none. The count is a numeral, never an input value; nothing renders it as a
  form value, `dir="ltr"` region or Latin-fallthrough context. (Contrast that with
  `PhotoLightbox.jsx:98`, where a Latin counter sits under a Latin `Gallery` kicker and is
  deliberately excluded.)

## Design decision

`guestCount` is a count shown to a Persian reader, so it is written the way every other
count on this site is written: through `toPersianDigits`. This is not a new convention —
it removes the one place in the traced surface that bypasses the existing one.

## Reuse

- `toPersianDigits` — `src/utils/numbers.js:3` (already exported; import it as
  `src/components/RSVPModal.jsx` already imports `useScrollLock` from `../hooks/useScrollLock`,
  so `import { toPersianDigits } from '../utils/numbers';` matches the file's existing style).
- Exemplar: `src/components/CountdownTimer.jsx:2,64`.
- No new primitive is required, and no design-system change is implied.

## Changes

1. `src/components/RSVPModal.jsx`
   - Change: add `import { toPersianDigits } from '../utils/numbers';` beside the existing
     imports, and at line 216 replace `<dd className="text-ink">{guestCount} نفر</dd>` with
     `<dd className="text-ink">{toPersianDigits(guestCount)} نفر</dd>`.
   - Preserve: the `<dl>`/`<div>`/`<dt>`/`<dd>` structure, the classes, the conditional row
     (`attending === 'yes'`), the stored value (still `Number`, still the same
     `localStorage` key `ponisha_rsvp_<slug>` and the same option values `1…5`), and the
     `flex flex-col gap-2` container from skill #21.
   - Verify: submitting with two guests renders `تعداد نفرات` / `۲ نفر`; selecting a saved
     answer repopulates the same way.

## Scope

- Inherit: `#wedding`, `#memorial`, `#general`/`#opening`/`#festival`/`#birthday` viewers —
  any mount of `RSVPModal` picking the `attending === 'yes'` branch.
- Verify: the RSVP e2e specs (`e2e/rsvp-validation.spec.js`) still pass; the confirmation
  panel's `aria-live="polite"` announcement is unchanged.
- Exclude: `PhotoLightbox.jsx:98` (Latin counter in Latin chrome, `dir="ltr"`),
  `PhotoLightbox.jsx:157` (`aria-label`), `FeaturedInvitations.jsx:143`, all home-page
  surfaces, and `toPersianDigits` itself.

## Validation

- Product: open `#/wedding`, open the envelope, open the RSVP form, submit with `attending =
  yes` and two guests → the confirmation reads `تعداد نفرات` / `۲ نفر`.
- Interface: 1280×900 and 390×844; light and dark; `#wedding` and `#memorial` (memorial takes
  the same branch and must show Persian digits too); reload with a saved answer.
- System: `toPersianDigits` is reused, not re-implemented; no digits are produced by a second
  code path.
- Repository: `npm run build` → succeeds; `npm run check:design` → `PASS`;
  `npx playwright test` → 17/17 passed.

## Stop conditions

- Stop if `guestCount` must start being rendered somewhere that needs Latin digits
  (an input value, a `dir="ltr"` region, a filename) — the numeral helper would then have to
  be applied per site rather than in the confirmation row.
- Stop if the modal is refactored so the confirmation no longer reads `guestCount` from the
  same state.

## Design documentation

- None. The type scale, the tracking table and the numeral convention already say what this
  change follows; no sentence in `docs/DESIGN_SYSTEM.md` needs to change.

---

**Status: executed.** `toPersianDigits` is imported and applied at `RSVPModal.jsx:217`.
Verified in the rendered DOM at five mounts — `#wedding` 1280 light, `#wedding` 390, `#wedding`
1280 dark, `#memorial`, `#birthday` — all reading `تعداد نفرات` / `۲ نفر`
(`scratchpad/rsvp-fix-verify.mjs`, evidence in `scratchpad/skill23/fixed/`).
