#!/usr/bin/env node
/**
 * Design-system contract check (skill 06, build-design).
 *
 * docs/DESIGN_SYSTEM.md is the design source. This script proves the build
 * matches it, instead of trusting that it does. It fails when:
 *
 *   - a value in the document is not the value in src/index.css
 *   - a hex colour in the document has no matching `r g b` triplet
 *   - a document token is not reachable from tailwind.config.js
 *   - a colour in tailwind.config.js is a raw hex instead of a token
 *   - a duration, easing or z step is a raw number instead of a custom property
 *   - a colour token is spelled two ways (the `olive` / `sage` drift)
 *   - a z step is declared but nothing in src/ uses it, unless it is reserved
 *   - a raw numeric z utility appears outside the documented local layers
 *
 * Run: npm run check:design
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DOC = 'docs/DESIGN_SYSTEM.md';
const CSS = 'src/index.css';

const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

/* ------------------------------------------------------------------ */
/* reading the document                                               */
/* ------------------------------------------------------------------ */

const doc = readFileSync(join(ROOT, DOC), 'utf8');

const SCOPES = [':root', 'html[data-theme="dark"]', '[data-theme="memorial"]'];

/** Every declaration inside a scoped block, keyed by scope. */
function collectDeclarations(text) {
  const out = {};
  let scope = null;
  let depth = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (scope === null) {
      const open = SCOPES.find((s) => line === `${s} {` || line === `${s}{`);
      if (open) {
        scope = open;
        depth = 1;
      }
      continue;
    }
    if (line === '}') {
      depth -= 1;
      if (depth === 0) scope = null;
      continue;
    }
    const decl = /^(--[\w-]+):\s*(.+?);$/.exec(line);
    if (decl) {
      out[scope] ??= {};
      out[scope][decl[1]] = decl[2].replace(/\s+/g, ' ').trim();
    }
  }
  return out;
}

// the document's blocks: everything inside ```css fences
const fenced = [...doc.matchAll(/```css\r?\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
const expected = collectDeclarations(fenced);

// the build's blocks
const css = readFileSync(join(ROOT, CSS), 'utf8');
const actual = collectDeclarations(css);

for (const scope of SCOPES) {
  if (!expected[scope]) fail(`${DOC}: no \`${scope}\` block found`);
  if (!actual[scope]) fail(`${CSS}: no \`${scope}\` block found`);
}

let checked = 0;
for (const scope of Object.keys(expected)) {
  const want = expected[scope];
  const got = actual[scope] ?? {};
  for (const [name, value] of Object.entries(want)) {
    checked += 1;
    if (!(name in got)) {
      fail(`${CSS} ${scope}: missing ${name} (the document writes ${value})`);
    } else if (got[name] !== value) {
      fail(`${scope} ${name}: document says ${value}, build says ${got[name]}`);
    }
  }
}
notes.push(`doc values vs build: ${checked} declarations`);

/* ------------------------------------------------------------------ */
/* hex values must carry a matching rgb triplet                        */
/* ------------------------------------------------------------------ */

let triplets = 0;
for (const scope of Object.keys(expected)) {
  for (const [name, value] of Object.entries(expected[scope])) {
    const hex = /^#([0-9a-f]{6})$/i.exec(value);
    if (!hex) continue;
    const int = parseInt(hex[1], 16);
    const want = `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
    const tripletName = `${name}-rgb`;
    const got = actual[scope]?.[tripletName];
    triplets += 1;
    if (!got) fail(`${CSS} ${scope}: ${name} is a hex but ${tripletName} is missing`);
    else if (got !== want) fail(`${scope} ${tripletName}: hex ${value} implies "${want}", build says "${got}"`);
  }
}
notes.push(`hex -> rgb triplets: ${triplets} colours`);

/* ------------------------------------------------------------------ */
/* reachability: a documented token must be usable from Tailwind       */
/* ------------------------------------------------------------------ */

const { default: config } = await import(pathToFileURL(join(ROOT, 'tailwind.config.js')).href);
const theme = config.theme?.extend ?? {};

const flattenColours = (map, prefix = '') => {
  const out = new Set();
  for (const [key, value] of Object.entries(map)) {
    if (typeof value === 'string') {
      out.add(prefix ? `${prefix}-${key}` : key);
    } else {
      const name = prefix ? `${prefix}-${key}` : key;
      out.add(name);
      for (const sub of Object.keys(value)) {
        out.add(sub === 'DEFAULT' ? name : `${name}-${sub}`);
      }
    }
  }
  return out;
};
const colourNames = flattenColours(theme.colors ?? {});
const radii = new Set(Object.keys(theme.borderRadius ?? {}));
const shadows = new Set(Object.keys(theme.boxShadow ?? {}));
const zSteps = new Set(Object.keys(theme.zIndex ?? {}));
const durations = new Set(Object.keys(theme.transitionDuration ?? {}));

const documentedColours = Object.entries(expected[':root'] ?? {})
  .map(([n]) => /^--color-([\w-]+)$/.exec(n)?.[1])
  .filter((n) => Boolean(n) && !n.endsWith('-rgb'));
for (const name of documentedColours) {
  if (!colourNames.has(name)) fail(`colour token "${name}" is in the document but not in tailwind.config.js theme.colors`);
}

for (const [name, value] of Object.entries(expected[':root'] ?? {})) {
  const dur = /^--duration-([\w-]+)$/.exec(name);
  if (dur) {
    const utility = dur[1] === 'ui' ? 'DEFAULT' : dur[1];
    if (!durations.has(utility)) fail(`duration "${name}" has no tailwind transitionDuration entry (${utility})`);
  }
  const z = /^--z-([\w-]+)$/.exec(name);
  if (z && !zSteps.has(z[1])) fail(`z step "${name}" is not in tailwind.config.js theme.zIndex`);
}
notes.push(`reachable from Tailwind: ${colourNames.size} colours, ${zSteps.size} z steps, ${durations.size} durations`);

// materials: every backticked token in the Materials table must exist in the css
const materialsSection = (doc.split('### Materials')[1] ?? '').split('## ')[0];
const materialNames = [...new Set([...materialsSection.matchAll(/`([a-z][\w-]*)`/g)].map((m) => m[1]))];
let materials = 0;
for (const name of materialNames) {
  materials += 1;
  if (!css.includes(`--color-${name}:`) && !css.includes(`--color-${name}-rgb:`)) {
    fail(`${DOC}: material "${name}" has no --color-${name} in ${CSS}`);
  }
}
notes.push(`material tokens: ${materials} named`);

/* ------------------------------------------------------------------ */
/* no raw values where the design asks for a token                    */
/* ------------------------------------------------------------------ */

for (const [name, value] of Object.entries(theme.colors ?? {})) {
  const walk = (key, v) => {
    if (typeof v === 'string') {
      if (/#[0-9a-f]{3,8}\b/i.test(v)) fail(`tailwind.config.js colors.${key} is the raw hex ${v}; map it to a token`);
      if (!/^(rgb\(var\(|var\()/.test(v)) fail(`tailwind.config.js colors.${key} is "${v}"; expected a token reference`);
    } else {
      for (const [sub, sv] of Object.entries(v)) walk(sub === 'DEFAULT' ? key : `${key}-${sub}`, sv);
    }
  };
  walk(name, value);
}

for (const [group, label] of [
  ['zIndex', 'z step'],
  ['transitionDuration', 'duration'],
  ['transitionTimingFunction', 'easing'],
]) {
  for (const [name, value] of Object.entries(theme[group] ?? {})) {
    checked += 1;
    if (!/^var\(--[\w-]+\)$/.test(String(value))) {
      fail(`tailwind.config.js ${group}.${name} is ${value}; a ${label} must be var(--…)`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* naming: one name per token                                         */
/* ------------------------------------------------------------------ */

const srcFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(jsx?|css)$/.test(entry)) srcFiles.push(full);
  }
})(join(ROOT, 'src'));

for (const file of srcFiles) {
  readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!/olive/.test(line)) return;
      // the customiser's metallic palette is a name for a finish, not a token
      if (/id:\s*'olive'/.test(line)) return;
      fail(`${relative(ROOT, file)}:${i + 1}: "olive" is the old name of the sage token`);
    });
}

/* ------------------------------------------------------------------ */
/* the z scale must be used, and matter                               */
/* ------------------------------------------------------------------ */

const RESERVED_Z = [];
const LOCAL_Z_FILES = [
  'src/components/3DEnvelope.jsx', // flaps, creases, seal: paint order inside one 3D stage
  'src/components/FinalCTA.jsx', // content above the section's own decoration
  'src/components/OpeningExperience.jsx', // content above the light beam
];

const usedZ = new Map();
for (const file of srcFiles) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      // -moz-osx-font-smoothing, -moz-range-thumb and z-index are not utilities
      const stripped = line.replace(/[-\w]*osx[-\w]*|z-index|-moz-range-thumb/g, '');
      for (const m of stripped.matchAll(/(^|[\s"'`])z-(\[[^\]]+\]|\d+|[a-z][\w-]*)/g)) {
        const token = m[2];
        if (/^\d+$/.test(token)) {
          if (!LOCAL_Z_FILES.includes(rel)) {
            fail(`${rel}:${i + 1}: raw z-${token}; use a z token or add the file to LOCAL_Z_FILES with a reason`);
          }
          continue;
        }
        if (token.startsWith('[')) {
          fail(`${rel}:${i + 1}: arbitrary z-${token}; use a z token`);
          continue;
        }
        if (!zSteps.has(token)) fail(`${rel}:${i + 1}: z-${token} is not a token in theme.zIndex`);
        usedZ.set(token, (usedZ.get(token) ?? 0) + 1);
      }
      // raw CSS reads the same scale through the custom property
      for (const m of line.matchAll(/var\(--z-([\w-]+)\)/g)) {
        if (zSteps.has(m[1])) usedZ.set(m[1], (usedZ.get(m[1]) ?? 0) + 1);
      }
    });
}

for (const step of zSteps) {
  if (usedZ.has(step)) continue;
  if (RESERVED_Z.includes(step)) continue;
  fail(`z step "${step}" is declared but nothing in src/ uses it`);
}
notes.push(`z steps in use: ${[...usedZ.keys()].sort().join(', ')}`);

/* ------------------------------------------------------------------ */
/* the type scale is a design decision, so it is pinned               */
/* ------------------------------------------------------------------ */

const typeRows = [...doc.matchAll(/^\|\s*([a-z0-9]+)\s*\|\s*([\d.]+rem)\s*\|\s*([\d.]+)\s*\|$/gm)];
let typeChecked = 0;
for (const [, step, size, leading] of typeRows) {
  typeChecked += 1;
  const entry = theme.fontSize?.[step];
  if (!entry) {
    fail(`type step "${step}" is in the document but not in tailwind.config.js fontSize`);
    continue;
  }
  const [gotSize, opts] = entry;
  if (gotSize !== size) fail(`fontSize.${step}: document says ${size}, build says ${gotSize}`);
  if (String(opts?.lineHeight) !== leading) {
    fail(`fontSize.${step}: document leading is ${leading}, build says ${opts?.lineHeight}`);
  }
}
if (typeChecked === 0) fail(`${DOC}: no type-scale table rows found`);
notes.push(`type scale: ${typeChecked} steps`);

for (const m of doc.matchAll(/^\|\s*`rounded-([\w-]+)`\s*\|/gm)) {
  if (!radii.has(m[1])) fail(`radius "rounded-${m[1]}" is in the document but not in tailwind.config.js borderRadius`);
}
for (const m of doc.matchAll(/^\|\s*`shadow-([\w-]+)`\s*\|/gm)) {
  if (!shadows.has(m[1])) fail(`shadow "${m[1]}" is in the document but not in tailwind.config.js boxShadow`);
}

/* ------------------------------------------------------------------ */
/* report                                                             */
/* ------------------------------------------------------------------ */

console.log('design-system check\n');
for (const note of notes) console.log(`  ok  ${note}`);
console.log(`\n  ${problems.length === 0 ? 'PASS' : `FAIL — ${problems.length} problem(s)`}`);
for (const problem of problems) console.log(`  - ${problem}`);
process.exit(problems.length === 0 ? 0 : 1);