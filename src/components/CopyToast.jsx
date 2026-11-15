import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/* item 97 — the wedding, memorial and category viewers each carried their own
 * copy of this toast with identical classes, differing only in one noun:
 * «لینک دعوت» / «لینک یادبود». One component, one prop.
 *
 * It deliberately carries no live region. `role="status"` on a node that mounts
 * with its text already in it does not speak in most screen readers — the node
 * has to exist before the text changes — and the studio pass (A22) already proved
 * that adding the attribute without the pre-mounted node buys nothing. The state
 * is voiced where it is honest: the copy button that was just pressed flips its
 * own label to «کپی شد» while it still holds focus. */
export default function CopyToast({ show = false, label }) {
  if (!show) return null;
  return (
    /* `animate-reveal-up` carries its own transform, and with `fill-mode: both`
       its final `translateY(0)` overwrites the `-translate-x-1/2` centring for
       the animation's whole life — which would slide the toast half its width
       off centre. Centring by `inset-x-0` + `mx-auto` + `w-fit` is immune to
       the animation, so the existing reveal token is safe to reuse here. */
    <div className="fixed inset-x-0 top-20 z-toast mx-auto flex w-fit animate-reveal-up items-center gap-2 border border-line bg-ink px-5 py-2.5 text-xs text-canvas shadow-lift">
      <CheckCircle2 className="size-3.5" aria-hidden="true" />
      {label}
    </div>
  );
}
