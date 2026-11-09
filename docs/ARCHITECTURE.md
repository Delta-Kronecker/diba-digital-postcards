# Architecture

- Router: hash-based in `src/App.jsx` (navigateTo updates location.hash).
- Pages lazy-loaded via React.lazy + Suspense.
- Theming: dark default, light via `.light` class; CSS vars in `src/index.css`.
- Memorial scope: `data-theme="memorial"` overrides gold tokens to sage.
- Data: `src/data/invitations.js`, `src/data/categories.js`.
- Components: `src/components/*`.