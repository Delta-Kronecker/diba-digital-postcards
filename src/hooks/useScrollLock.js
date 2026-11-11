import { useEffect } from 'react';

/**
 * Holds the page still behind an overlay.
 *
 * Two things have to be true: the page must not scroll, and it must not move.
 * The only lever for the first is the body's `overflow` — which reaches the
 * viewport as long as the root is not itself clipping. The second is subtler:
 * hiding the viewport's scrollbar widens the content box by the width of that
 * scrollbar, so a centred layout slides sideways the moment an overlay opens.
 *
 * Padding replaces the missing strip, on whichever edge the scrollbar actually
 * occupied — that edge follows the writing direction, and this document is RTL,
 * so it is measured rather than assumed.
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const rect = document.documentElement.getBoundingClientRect();
    const gutterStart = Math.max(0, Math.round(rect.left));
    const gutterEnd = Math.max(0, Math.round(window.innerWidth - rect.right));

    const prevOverflow = body.style.overflow;
    const prevPaddingLeft = body.style.paddingLeft;
    const prevPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (gutterStart > 0) body.style.paddingLeft = `${gutterStart}px`;
    if (gutterEnd > 0) body.style.paddingRight = `${gutterEnd}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingLeft = prevPaddingLeft;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}

export default useScrollLock;
