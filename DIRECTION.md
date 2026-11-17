# Direction Lock — Diba

Locked 2026-11-17. This supersedes the implicit direction the page had been carrying: "an editorial marketing page with warm tokens". That was a palette, not a direction — which is why five sections opened with the same recipe and every piece of copy below the `h2` was 12px.

## 1. Named reference

**A letterpress atelier's plate book** — the printed proof suite a fine-press studio sends a client: each specimen on its own numbered *plate*, a folio in the outer margin, a double rule engraving the head, photographs tipped in with a museum caption block, crop marks at the corners, and a colophon at the back.

Secondary reference for the type: **Iranian gallery catalogues of the 1970s** — big quiet Persian display, everything else modest, one rule doing all the structural work.

## 2. Three feeling words

`pressed` · `unhurried` · `expensive`

Not "elegant", "modern", "premium". If a screen could be described as "sleek" or "clean", it is wrong.

## 3. One bold decision

**The whole page is a plate suite: every band is a numbered plate with a folio in the outer margin and an engraved double rule at its head, and the section number is repeated as a large printed figure you can actually see.**

Cost: the page stops being airy-neutral. It has a visible armature and a brand voice in the margins, which means it can no longer pass as a generic template — and a mistake in the folio system is visible on every screen.

## 4. Three prohibitions

1. **No card recipe.** A photograph, a `rounded` container, a shadow, a category, a title, a description and an arrow — that exact stack, six times, is what made the old grid read as a template. Plates are captioned, never "carded".
2. **No metric row.** `۱۰۰٪ واکنشگرا و در دسترس` is an engineering claim wearing brand clothes. Nothing on this page states a number that describes the build rather than the work.
3. **No uniform fade-up.** Motion is one orchestrated entrance (the hero) and then arrival, not a coat of animation over every band.

## 5. Typeface decision

- **Display:** Estedad, weight 500 (600 only for the footer mast). Persian display carries **zero tracking** — `letter-spacing` breaks the joins, which the old `.display-hero` was doing at `-0.01em`. Only `.latin` runs get tracking (positive below 14px, negative above 40px).
- **Body:** Vazirmatn 400, **17px / 1.9**. The old page set almost all body copy at 12px, which is a Latin size applied to a Persian script; 17px is the Persian floor plus one step.
- **Micro (folio, plate number, meta):** Vazirmatn 500 at 13px, `tabular-nums`, Persian digits. Never below 13px anywhere.
- **Latin:** Cormorant Garamond, italics for plate names.
- **Scale ratio:** 1.333 between display steps (`clamp`-driven), 1.2 inside the text range.
- **Numerals:** Persian (۰۱۲۳) everywhere in the interface. Latin digits only inside Latin runs (`Est. 2015`, `+98 21 …`), `<bdi>`-safe.

## 6. Palette with ratio

Extension of the locked palette, no token replaced:

- **60%** — `canvas` #f1ebe0 warm paper, now laid over a faint fibre gradient so it reads as stock, not fill.
- **30%** — `ink` #191612 for type and for the ink-flood interleave bands.
- **10%** — `gold` #9a7a44 as **hairlines, folios and press marks only**. Gold is never a large fill; the wax seal remains the single solid gold object on the page.
- Measured: body `ink` on `canvas` = **14.8:1**; `ink-muted` #5c554a on `canvas` = **6.3:1**; `gold-deep` #74582b on `canvas` = **5.6:1**; `cream` on `ink-band` = **15.4:1**. All ≥ 4.5:1.

## 7. Motion decision

**Moves:** one hero entrance (label → headline → standfirst → action → plate, 80ms apart, 900ms `--ease-out-expo`); plate arrivals on scroll at 700ms and only once; the folio rule drawing from the start edge on hover; the envelope's own open animation; the countdown digit roll.

**Never moves:** the plate photographs (no parallax, no zoom-on-scroll), the folio figures, the double rules, the crop marks, the footer mast, any text on hover except colour and the rule.

---

## Distinctiveness budget

| Axis | Status | Decision |
|------|--------|----------|
| Typography | DEVIATION | Persian body at 17/1.9 (above the script's floor); zero tracking on Persian display, tracking only on Latin; folio figures at 13px tabular |
| Color | DEVIATION | warm paper with a fibre gradient; gold restricted to hairlines and marks; ink-flood interleave bands break the cream field three times |
| Space | DEVIATION | asymmetric plate margins — content offset from centre, a wide outer margin reserved for the folio |
| Shape | DEVIATION | zero radius; the arch is used once (hero plate) and never repeated; crop marks as registration |
| Depth | DEVIATION | nearly flat: depth by tone and rule, not shadow; the wax seal and tipped-in plates are the only elevated objects |
| Motion | DEVIATION | one orchestrated entrance, then arrival; photographs deliberately still |
| Imagery | DEVIATION | photographs framed as tipped-in plates with museum caption blocks and crop marks, at printed scale |

**Deviations: 7 / 7** (minimum 4). Coherence test: *"This is a plate book from a letterpress atelier."* Every deviation above serves that sentence; the one that did not (the metric row) was removed.