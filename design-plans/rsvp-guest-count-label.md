# Name the RSVP guest-count field for the quantity it collects

Written against: `aa43c8b` (working tree carries unrelated uncommitted changes; this plan
touches one text node in one file)

## Evidence chain

- Surface: `#/wedding` → `src/pages/WeddingViewer.jsx:72-80` → `RSVPModal`, the
  `attending === "yes"` branch of the form, and the confirmation panel that echoes it.
- Problem: the control is labelled for a quantity it does not collect. The label reads
  `تعداد نفرات همراه` ("number of accompanying people", `RSVPModal.jsx:295-297`), but its
  options are **totals that include the respondent** — the first is `۱ نفر، فقط خودم`
  ("1 person, just myself") and the last is `۵ نفر یا بیشتر` (`:305-309`) — and the same
  stored `guestCount` is presented in the confirmation under the heading `تعداد نفرات`
  ("number of people", `:215-216`). So a guest who picks `۲ نفر` meaning two companions is
  answered with "number of people: ۲".
- Design evidence: the contradiction is internal to one task and one component, which is a
  binding contract for interface copy; the text of the option (`۱ نفر، فقط خودم`) and the
  confirmation's heading (`تعداد نفرات`) are the two independent expressions of the same
  state, and both say "total". Rendered evidence:
  `scratchpad/skill23/rsvp-form-guests.png` (label `تعداد نفرات همراه` above the option
  `۱ نفر، فقط خودم`) and `scratchpad/skill23/rsvp-summary.png` (`تعداد نفرات` / `2 نفر`).
- Owner: `src/components/RSVPModal.jsx:297` (the label of `#rsvp-guests`).
- Scope and affected surfaces: `#wedding` (`WeddingViewer.jsx:72`), `#memorial`
  (`MemorialViewer.jsx:113`), and the category viewers (`CategoryViewer.jsx:70`) — the
  change is variant-independent; it renders identically in light and dark.
- Uncertainty: none about the direction. The alternative below is recorded so the executor
  does not silently choose it.

## Design decision

Rename the field to the name this component already uses for the same stored value:
`تعداد نفرات`. The label is the single outlier among the three placements of the quantity
(label, options, confirmation), so the correction is determined by the component's own
naming rather than by preference — and it is the smallest change that leaves the stored
semantics (`Number`, options `1…5`, key `ponisha_rsvp_<slug>`) intact.

**Rejected alternative, for the record:** re-authoring the options as companion counts
(`بدون همراه` / `۱ همراه` / …). It would contradict the option that already exists
(`۱ نفر، فقط خودم`), would require renaming the confirmation row as well, and would change
what is persisted — with no evidence in the surface that "companions only" is the intended
quantity. Do not take this path without an owner decision.

## Reuse

- The confirmation row's existing heading `تعداد نفرات` (`RSVPModal.jsx:215`) — the string is
  already in the component, so nothing new is authored.
- The field's structure (`<label htmlFor="rsvp-guests">` + `<select id="rsvp-guests">`,
  `:295-310`) is already correct and is left alone.
- No new primitive, token or component is required.

## Changes

1. `src/components/RSVPModal.jsx`
   - Change: at line 297 replace the label text `تعداد نفرات همراه` with `تعداد نفرات`.
   - Preserve: the `<label htmlFor="rsvp-guests">` association, the `Users` icon and its
     `aria-hidden="true"`, the class list, the `<select>` and all five `option` values and
     their Persian-digit text, the `Number(e.target.value)` coercion, the
     `attending === "yes"` conditional, and the `localStorage` key and payload.
   - Verify: the form's guest-count field reads `تعداد نفرات`, its options are unchanged, and
     the confirmation row still reads `تعداد نفرات`.

## Scope

- Inherit: every mount of `RSVPModal` that renders the guest-count branch (`#wedding`,
  `#memorial`, `#general`/`#opening`/`#festival`/`#birthday`).
- Verify: the accessible name of `#rsvp-guests` changes with the label, which is the intent —
  name and collected quantity now agree. No test depends on the old string:
  `e2e/rsvp-validation.spec.js` addresses `#rsvp-name`, `#rsvp-name-error`, `#rsvp-notes` by
  id and the submit button by text.
- Exclude: the option texts, the confirmation rows, the condolence dialog
  (`MemorialViewer.jsx:127-129`), and every surface outside `RSVPModal`.

## Validation

- Product: on `#/wedding`, open the RSVP form with `attending = yes` → the field is labelled
  `تعداد نفرات` and offers the same five options; submit → the confirmation shows
  `تعداد نفرات` / `{count} نفر`.
- Interface: 1280×900 and 390×844; light and dark; `#wedding` and `#memorial`; a saved answer
  reloaded from `localStorage`.
- System: the string now matches the confirmation heading; no second wording of the same
  quantity remains in the component.
- Repository: `npm run build` → succeeds; `npm run check:design` → `PASS`;
  `npx playwright test` → 17/17 passed.

## Stop conditions

- Stop if a product decision is made that the field should collect **companions only** —
  then this plan is void and the options, the confirmation heading and the stored payload all
  change together.
- Stop if `RSVPModal` is refactored so the guest count is no longer echoed in the
  confirmation.

## Design documentation

- None required. Interface copy is not pinned in `docs/DESIGN_SYSTEM.md`; if the owner ever
  decides the quantity is "companions", record that decision next to the RSVP copy rather
  than in the design system.
