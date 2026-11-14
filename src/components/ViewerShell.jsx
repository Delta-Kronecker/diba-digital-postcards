import React, { useCallback, useEffect, useRef, useState } from 'react';
import ViewerBar from './ViewerBar';
import CopyToast from './CopyToast';

/* item 90 — the three viewers each opened with the same five things: the themed
 * root, the bar, the copy handler with its `copied` flag and 2600 ms timer, the
 * toast, and the `min-h-dvh bg-canvas font-body text-ink` frame. Three copies of
 * one shell is three places for it to drift (the memorial root's `data-theme` was
 * already the only difference).
 *
 * The plan is passed down as a function because `copied` is needed twice, by two
 * different owners: the toast (inside the shell) and the invitation's share button
 * (inside the route). A child that takes `{ copied, onCopy }` keeps one piece of
 * state without a context for a single boolean. */
export default function ViewerShell({ onNavigate = () => {}, theme, copyLabel, children }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2600);
    } catch {
      // Clipboard access can be denied; do not show a false success message.
    }
  }, []);

  return (
    <div data-theme={theme} className="min-h-dvh bg-canvas font-body text-ink">
      <ViewerBar onNavigate={onNavigate} onCopy={onCopy} copied={copied} />
      <CopyToast show={copied} label={copyLabel} />
      {children({ copied, onCopy })}
    </div>
  );
}
