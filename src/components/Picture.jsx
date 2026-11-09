import React from 'react';

/**
 * Renders a local JPEG image with a WebP source and a JPEG fallback.
 *
 * `picture` uses `display: contents` so the inner `img` keeps the exact
 * layout box the call site expects (grid, absolute positioning, h-full, …).
 */
export default function Picture({ src, alt = '', className = '', ...imgProps }) {
  const hasWebp = typeof src === 'string' && /\.jpe?g(\?.*)?$/i.test(src);
  const imgClass =
    `${className} outline outline-1 outline-black/10 [outline-offset:-1px] dark:outline-white/10`.trim();

  if (!hasWebp) {
    return <img src={src} alt={alt} className={imgClass} {...imgProps} />;
  }

  const webpSrc = src.replace(/\.jpe?g(\?.*)?$/i, '.webp$1');

  return (
    <picture className="contents">
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={imgClass} {...imgProps} />
    </picture>
  );
}
