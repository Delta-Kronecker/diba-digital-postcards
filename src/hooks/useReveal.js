import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Reports whether the element this ref is attached to has entered the viewport.
 *
 * Fires once, then disconnects: a reveal is an arrival, not a state that should
 * follow the scroll position back and forth. There is no scroll listener and no
 * rAF loop, so the cost is one observer callback per element and then nothing.
 *
 * When motion is reduced it reports visible immediately, without waiting for an
 * observer. That is the whole point of doing this in the hook rather than in
 * CSS: the reduced-motion block in index.css forces `animation-duration` to
 * 0.01ms, so a reveal that waited on an animation to finish — or on
 * `animationend`, which must never be the thing that reveals content — would
 * leave the section permanently invisible for exactly the people who asked for
 * less motion. Content is never gated behind an animation that will not play.
 *
 * Every branch returns a ref, so the same ref can be attached whether or not an
 * observer is ever created.
 */
export function useReveal() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or no DOM): show the content rather than risk
    // hiding it behind an animation that can never be triggered.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // Hold the reveal until a sliver of the element is genuinely on screen,
      // and fire a little before the bottom edge of the viewport so the motion
      // resolves as the element arrives rather than after it has landed.
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return [ref, isVisible || reduced];
}

export default useReveal;
