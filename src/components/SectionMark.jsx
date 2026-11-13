import React from 'react';

/**
 * The section mark: the `۰۱ —— label` device that opens every band.
 *
 * It lived as six near-copies across six files, with three different margins,
 * two gold steps and two cream opacities. This is the one that survives. It is
 * a paragraph, never a heading: the section's own `h2` carries the hierarchy,
 * and the numeral is decoration for the eye, not a level in the outline.
 *
 * @param {string} number      the Persian numeral, set in gold
 * @param {'light'|'dark'} tone  `light` on paper, `dark` on an ink band
 * @param {'start'|'center'} align
 * @param {string} className   the band's own margin, e.g. `mb-4`
 */
export default function SectionMark({
  number,
  tone = 'light',
  align = 'start',
  className = '',
  children,
}) {
  const dark = tone === 'dark';

  return (
    <p
      className={[
        'flex items-center gap-3 text-xs',
        dark ? 'text-cream/65' : 'text-ink-subtle',
        align === 'center' ? 'justify-center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`tabular-nums ${dark ? 'text-gold-soft' : 'text-gold-deep'}`}>{number}</span>
      <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
      {children}
    </p>
  );
}
