import React from 'react';

/* The wax seal is one device, drawn twice: the hero's 96 px stamp on the plate
 * and the process band's 48 px studio mark. The small one had lost the wax — it
 * was a flat circle with a gold hairline — so the two read as two different
 * marks. This keeps the material in one place: the same radial wax ramp from
 * three existing tokens (`seal-a` → `foil` → `seal-d`), the same pressed inner
 * ring, the same `seal-ink` glyph.
 *
 * Size and placement stay at the call site (each passes the utilities it already
 * had), so nothing new enters the token set. The hero keeps its `-8deg` tilt
 * because there it is a stamp pressed onto a photograph; the studio mark stands
 * upright, where it is an identity mark rather than a physical one. */
export default function WaxSeal({
  glyph = 'د',
  className = '',
  ringClassName = '',
  glyphClassName = '',
  ...rest
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full border border-seal-line/50 bg-[radial-gradient(circle_at_34%_30%,var(--color-seal-a),var(--color-foil)_55%,var(--color-seal-d))] ${className}`}
      {...rest}
    >
      <span
        className={`flex items-center justify-center rounded-full border border-seal-cream/40 font-display text-seal-ink ${ringClassName} ${glyphClassName}`}
      >
        {glyph}
      </span>
    </span>
  );
}
