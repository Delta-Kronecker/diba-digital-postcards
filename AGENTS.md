# Standing instructions (persistent)

Owner request, kept permanently in this repo so every session continues it:

> Go through the UI skills **one at a time**, in the fixed order below. For each skill: load it,
> audit this site against that skill only, apply the real, verifiable improvements it implies,
> then verify (build + relevant Playwright tests) and log the result. Only then move to the
> next skill. Full effort, patient, no skipping.

Order + progress: `reports/skill-upgrade/PROGRESS.md`.
Per-skill findings + edits: `reports/skill-upgrade/SKILL_<NN>_<id>.md`.

Rules:
- One skill per pass. No bundling.
- Every change must trace to a specific skill rule and be verifiable.
- Never regress the existing design identity, RTL, dark mode, a11y, or reduced-motion.
- Keep the project's existing tokens/components; prefer deletion over addition.
