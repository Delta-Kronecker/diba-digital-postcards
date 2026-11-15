import React from 'react';
import useReveal from '../hooks/useReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TAGS = { div: 'div', li: 'li', section: 'section', figure: 'figure', p: 'p' };

/**
 * Reveals its children once they enter the viewport.
 *
 * The reveal is a pure state change: the element rests in `.motion-hidden` and
 * is swapped to tailwind's `animate-reveal-up` the moment the observer fires.
 * One keyframe serves every reveal on the page — `delay` only retimes it, so a
 * stagger is data rather than a new animation.
 *
 * @param {number} delay seconds added via `animation-delay`.
 *
 * The delay is dropped under reduced motion. The reduced-motion block in
 * index.css clamps `animation-duration` but deliberately leaves
 * `animation-delay` alone, so a 210ms stagger would otherwise hold a section at
 * the keyframe's `opacity: 0` for 210ms in exactly the mode that asked for no
 * motion. The stagger is part of the choreography, not part of the content.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
  style,
  ...rest
}) {
  const [ref, isVisible] = useReveal();
  const reduced = useReducedMotion();
  const Tag = TAGS[as] ?? 'div';

  // Under reduced motion NO motion class is applied at all — not the resting
  // one, and not the animation either. Applying `animate-reveal-up` here would
  // still hide the element for a frame: with `animation-fill-mode: both` the
  // keyframe's `opacity: 0` is painted before the animation's first tick, so a
  // visitor who asked for less motion would get a flash of empty space where
  // the content should be. With no class, the element is simply painted.
  const motion = reduced ? '' : isVisible ? 'animate-reveal-up' : 'motion-hidden';

  return (
    <Tag
      ref={ref}
      // Marks the element as revealable in every state, so the motion tests can
      // find it whether or not a motion class is present.
      data-reveal=""
      className={`${motion} ${className}`.trim()}
      style={delay && !reduced ? { animationDelay: `${delay * 1000}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
