import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* ------------------------------------------------------------------------- *
 * ThreeDEnvelope — a real, layered, interactive luxury envelope.
 *
 * It knows nothing about the occasion or the message it carries. It is
 * stationery: warm cotton paper with a visible tooth and floating fibres,
 * embossed botanicals, champagne-gold foil along the fold edges, a sage
 * grosgrain ribbon and a hand-pressed wax seal. Everything specific to an
 * event arrives through props (label, monogram, palette, motion).
 *
 * Drawn in one 580x400 space; every layer is a child of one preserve-3d stage
 * so the flap can swing through the paper and the card can rise out of the
 * pocket while the folds still occlude it.
 *
 * Every surface is lit with neutral black/white overlays only, so the same
 * component works for a pale ivory paper and for the customiser's charcoal
 * paper without ever hard-coding an occasion palette.
 * ------------------------------------------------------------------------- */

const W = 580;
const H = 400;
const POCKET_TOP = 152; // where the bottom fold ends and the clean front face begins
const FLAP_TIP = 184; // where the closing flap's point lands, over the pocket

const FLAP_PATH = `M 0 0 L 282 176 Q 290 187 298 176 L ${W} 0 Z`;
/* The bottom fold's folded edge sits 12.5 units in from the sides, and every
 * corner is turned by a hair: a folded sheet has no knife corners, and a sharp
 * corner is the single clearest tell of a rectangle drawn on top of a rectangle.
 * It also tapers (10.2 wide at the fold, 1.5 wide at the foot), so its margins
 * are not equal — which is what makes the panel read as folded paper rather than
 * as a panel floating over one. */
const POCKET_PATH =
  `M 12.5 ${POCKET_TOP} L ${W - 12.5} ${POCKET_TOP}` +
  ` Q ${W - 10.8} ${POCKET_TOP} ${W - 10.2} ${POCKET_TOP + 2.6}` +
  ` L ${W - 1.5} ${H - 3.4} Q ${W - 1.1} ${H} ${W - 4.6} ${H}` +
  ` L 4.6 ${H} Q 1.1 ${H} 1.5 ${H - 3.4}` +
  ` L 10.2 ${POCKET_TOP + 2.6} Q 10.8 ${POCKET_TOP} 12.5 ${POCKET_TOP} Z`;
/* The side folds stop ON the bottom fold's fold line (152), not past it.
 * Their diagonal is the same straight line either way — (0,0) to (288,182) put
 * its 152 mark at x=240.5 — so the mouth, the flap's V and the fold-cast shadow
 * are untouched. What the old 152..182 tail did was leave a 12.5 x 30 unit wedge
 * of the side fold exposed under the fold line, between the envelope's edge and
 * the pocket's tapered edge: flat (the side folds carry no texture filter) and a
 * clear step brighter than the pocket beside it. At 4x it read as a tab of
 * lighter paper stuck to each edge. Truncated, that wedge is the interior panel
 * instead, which is the same textured stock as the pocket, so the margin reads
 * as one sheet with a crease on it rather than as two. */
const SIDE_L_PATH = 'M 0 0 L 240.5 152 L 0 152 Z';
const SIDE_R_PATH = `M ${W} 0 L ${W - 240.5} 152 L ${W} 152 Z`;
/* one foil rule, following the flap's real cut edge (inset 14 units). There used
 * to be a second at inset 17: 3 units away at the top and 1 unit at the tip, so
 * it visibly pinched onto the first just above the seal. Two parallel gold
 * hairlines are an edge artifact, not a margin. */
const FLAP_RULE = 'M 49 14 L 284 160 Q 290 168 296 160 L 531 14';
/* the ribbon: 50 units wide, down from 56. It runs from above the fold line —
 * where the flap and the wax hide it — over the crease and around the bottom
 * cut edge, so it reads as a band wrapped round the packet rather than as a
 * stripe printed on the face. */
const RIBBON_PATH =
  'M 265 116 C 259 214 269 326 263 400 L 313 400 C 319 326 309 214 315 116 Z';
const RIBBON_LEFT_EDGE = 'M 265 116 C 259 214 269 326 263 400';
const RIBBON_RIGHT_EDGE = 'M 315 116 C 309 214 319 326 313 400';
/* the creases where the side folds' folded edges run, just inside the mouth */
const CREASE_LEFT = 'M -2 3 L 287 184';
const CREASE_RIGHT = `M ${W + 2} 3 L ${W - 287} 184`;

const IVORY = '#f6f1e9';
const GOLD = '#b49a70';

/* --- the botanical ---------------------------------------------------------
 *
 * A sprig is a stem plus leaflets. Each leaflet is a CLOSED lens, not an open
 * stroke, because a blind emboss needs a surface: the light edge sits along the
 * leaf's upper-left boundary and the shadow along its lower-right, so the leaf
 * reads as raised out of the paper rather than drawn on it. The leaflets also
 * alternate up the stem instead of pairing, and each is unequal (outer lobe
 * wider than inner), so the motif is natural rather than a mirrored icon. */
function leaflet(x, y, angle, len, wide, skew) {
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const nx = -sa;
  const ny = ca;
  const tx = x + ca * len;
  const ty = y + sa * len;
  const mx = x + ca * len * 0.4;
  const my = y + sa * len * 0.4;
  return `M ${x.toFixed(1)} ${y.toFixed(1)} C ${(mx + nx * wide).toFixed(1)} ${(
    my +
    ny * wide
  ).toFixed(1)} ${(tx + nx * wide * 0.45).toFixed(1)} ${(ty + ny * wide * 0.45).toFixed(
    1
  )} ${tx.toFixed(1)} ${ty.toFixed(1)} C ${(tx - nx * wide * skew * 0.45).toFixed(1)} ${(
    ty -
    ny * wide * skew * 0.45
  ).toFixed(1)} ${(mx - nx * wide * skew).toFixed(1)} ${(my - ny * wide * skew).toFixed(
    1
  )} ${x.toFixed(1)} ${y.toFixed(1)} Z`;
}

/* the stem leans and bends, so the sprig is never a straight rule */
const STALK = 'M 52 150 C 43 112 59 62 49 6';
const LEAF_PATHS = [
  leaflet(51, 124, -160, 27, 10.6, 0.8),
  leaflet(52, 107, -20, 25, 10.0, 0.72),
  leaflet(54, 88, -152, 23, 9.2, 0.78),
  leaflet(53, 70, -24, 21, 9.6, 0.7),
  leaflet(53, 52, -158, 18, 7.6, 0.8),
  leaflet(51, 36, -18, 17, 8.2, 0.72),
  leaflet(50, 20, -168, 13, 5.6, 0.78),
];
/* the single leaflet and stem tip that carry the foil */
const FOIL_LEAF = LEAF_PATHS[3];
const FOIL_TIP = 'M 51 22 C 47 16 53 10 49 4';
const LEAF_SKELETON = [STALK, ...LEAF_PATHS];

/* the mark the die presses into the wax when the occasion supplies no initials.
 * Real lettering is always preferred when it exists — an anonymous seal carrying
 * invented glyphs is exactly the mistake the brief warns about — so this only
 * appears when `sealText` is empty. It is built from the same closed leaflets as
 * the envelope's own sprig, sized to sit inside the dished field (the field is
 * ~64 units across), so the seal carries the stationery's motif rather than a
 * borrowed ornament. */
const EMBLEM_STEM = 'M 50 72 C 46.5 58 53.5 42 50 28';
const EMBLEM_LEAVES = [
  leaflet(49, 65, -166, 12.5, 5.2, 0.78),
  leaflet(51, 55.5, -14, 12, 5.0, 0.72),
  leaflet(50, 46, -168, 10.5, 4.4, 0.78),
  leaflet(50.5, 37.5, -16, 9.5, 4.2, 0.72),
];
const EMBLEM_PATHS = [EMBLEM_STEM, ...EMBLEM_LEAVES];

/* the sealed blob, and the little lobes squeezed out from under the die.
 *
 * A pressed wax seal is a squat ellipse, not a circle, and its rim is facetted
 * where the hand pressed it. The previous generator alternated every other
 * sample between 0.845r and 0.982r of it, which is a petal pattern — it read as
 * a flower, not as wax. So: a narrow radius band, angle jitter, two forced-flat
 * facets, and an explicit break of every diametric mirror pair. 11 samples with
 * the Catmull-Rom tangent divided by 7.5 (not 6) so the curve cannot overshoot
 * into lobes. */
function waxBlob(rx, ry, seed, cx = 50, cy = 50) {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const n = 14;
  const start = -96 * (Math.PI / 180);
  const ang = [];
  for (let i = 0; i < n; i += 1) {
    ang.push(start + (i / n) * Math.PI * 2 + (rnd() - 0.5) * (14 * Math.PI) / 180);
  }
  const rad = [];
  for (let i = 0; i < n; i += 1) rad.push(0.92 + rnd() * 0.14);
  /* a mirror pair would make the blob symmetric, so push near-equal opposites apart */
  for (let i = 0; i < n; i += 1) {
    const j = (i + 7) % n;
    if (Math.abs(rad[i] - rad[j]) < 0.04) {
      rad[j] = rad[i] < 1 ? Math.min(1.06, rad[i] + 0.045) : Math.max(0.92, rad[i] - 0.045);
    }
  }
  /* two flat thumb facets, where the wax was pressed against the paper */
  rad[3] = (rad[3] + rad[4]) / 2;
  rad[4] = rad[3];
  rad[8] = (rad[8] + rad[9]) / 2;
  rad[9] = rad[8];

  const p = rad.map((r, i) => [cx + Math.cos(ang[i]) * r * rx, cy + Math.sin(ang[i]) * r * ry]);
  const at = (i) => p[(i + n) % n];
  let d = `M ${at(0)[0].toFixed(2)} ${at(0)[1].toFixed(2)}`;
  for (let i = 0; i < n; i += 1) {
    const c1 = [
      at(i)[0] + (at(i + 1)[0] - at(i - 1)[0]) / 7.5,
      at(i)[1] + (at(i + 1)[1] - at(i - 1)[1]) / 7.5,
    ];
    const c2 = [
      at(i + 1)[0] - (at(i + 2)[0] - at(i)[0]) / 7.5,
      at(i + 1)[1] - (at(i + 2)[1] - at(i)[1]) / 7.5,
    ];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(
      2
    )} ${at(i + 1)[0].toFixed(2)} ${at(i + 1)[1].toFixed(2)}`;
  }
  return `${d} Z`;
}

const WAX_BODY = waxBlob(46.5, 43.5, 9137);
/* every rim ring is a scaled copy of the same blob, so no two "circles" on the
 * seal are concentric — which is the single biggest tell of a drawn button */
const WAX_RING = (k) => `translate(50 50) scale(${k}) translate(-50 -50)`;

function Sprig({ x = 0, y = 0, scale = 1, rotate = 0, tone, opacity = 1, width = 1.3, fill = 'none' }) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      fill={fill}
      stroke={tone}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      <path d={STALK} />
      {LEAF_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/* the same motif, blind-embossed into the paper.
 *
 * The light comes from the upper left, so a RAISED form is bright along its
 * upper-left boundary and dark along its lower-right one: the dark copy is
 * offset down-right, the light copy up-left, and the leaf bodies sit between
 * them. Getting this the wrong way round is what makes a "blind emboss" read as
 * a printed icon. */
function Embossed({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  opacity = 1,
  weight = 1,
  metal = false,
  accent = GOLD,
}) {
  return (
    <g opacity={opacity}>
      <Sprig
        x={x + 1.4}
        y={y + 1.6}
        scale={scale}
        rotate={rotate}
        tone="rgba(42,30,14,0.34)"
        width={1.35 * weight}
      />
      <Sprig
        x={x - 1.1}
        y={y - 1.2}
        scale={scale}
        rotate={rotate}
        tone="rgba(255,253,246,0.6)"
        width={1.15 * weight}
      />
      <Sprig
        x={x}
        y={y}
        scale={scale}
        rotate={rotate}
        tone="rgba(92,74,44,0.34)"
        width={0.85 * weight}
        fill={metal ? 'rgba(180,154,112,0.1)' : 'rgba(104,117,103,0.09)'}
      />
      {metal ? (
        <g
          transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
          fill="none"
          stroke={accent}
          strokeOpacity="0.6"
          strokeWidth="0.6"
          strokeLinecap="round"
        >
          <path d={FOIL_LEAF} />
          <path d={FOIL_TIP} />
        </g>
      ) : null}
    </g>
  );
}

export default function ThreeDEnvelope({
  isOpen = false,
  onOpen = () => {},
  openLabel = 'گشودن پاکت',
  hint = 'برای گشودن، لمس کنید',
  openingHint = 'در حال گشودن...',
  openedHint = 'پاکت گشوده شد',
  sealText = '',
  motion = 'rich',
  accent = GOLD,
  metal = true,
  paper = IVORY,
  ribbon = '#687567',
  onDark = false,
  className = '',
  children,
}) {
  const reduced = useReducedMotion();
  const gentle = motion === 'gentle';

  const [isOpening, setIsOpening] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  const stageRef = useRef(null);

  const opened = isOpening || isOpen;

  /* --- choreography ------------------------------------------------------ *
   * One thing per beat, in physical order: the wax lets go, the cloth relaxes,
   * the flap swings (carrying the cast shadow and the reframe), then the card
   * blooms out of the mouth.
   *
   * The beats are staggered so nothing unrelated moves at once. Two of them are
   * deliberately ordered rather than merely non-overlapping:
   *   · the seal's whole release (30 + 250 ms) finishes at 280 ms, before the
   *     flap's 300 ms start — it used to still be moving when the flap had
   *     already begun, which is backwards;
   *   · the cloth is released by the seal, so the band starts to settle while
   *     the wax is still leaving (~168 ms) and is still relaxing as the flap
   *     lifts. That overlap is physical: the band is attached to the closure and
   *     continues under the flap, so the flap does drag it. */
  const ease = gentle ? 'var(--ease-ui-out)' : 'var(--ease-out-expo)';
  const sealT = gentle ? 280 : 250;
  const sealD = gentle ? 40 : 30;
  const flapT = gentle ? 760 : 700;
  const flapD = gentle ? 360 : 300;
  const ribbonT = gentle ? 560 : 520;
  /* the ribbon leads the flap, because the seal — not the flap — released it */
  const ribbonD = Math.round(sealD + sealT * 0.55);
  const cardT = gentle ? 620 : 470;
  const cardD = gentle ? 620 : 700;
  /* how far the card climbs out of the mouth, in % of the card's own height */
  const cardRise = 34;

  /* --- the paper tilts under the pointer, with a little inertia ----------- */
  useEffect(() => {
    if (reduced || opened) return undefined;
    let id = 0;
    const step = () => {
      setTilt((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        if (Math.abs(dx) < 0.02 && Math.abs(dy) < 0.02) return prev;
        return { x: prev.x + dx * 0.12, y: prev.y + dy * 0.12 };
      });
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    rafRef.current = id;
    return () => cancelAnimationFrame(id);
  }, [target, reduced, opened]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  const handleMove = (event) => {
    if (reduced || opened || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    setTarget({ x: -ny * 6, y: nx * 8 });
  };

  const handleLeave = () => setTarget({ x: 0, y: 0 });

  const handleOpen = () => {
    if (opened) return;
    setIsOpening(true);
    setTarget({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
    const settle = reduced ? 200 : gentle ? 1300 : 1240;
    timerRef.current = window.setTimeout(() => {
      setIsOpening(false);
      onOpen();
    }, settle);
  };

  const tSeal = reduced
    ? 'opacity 150ms linear'
    : `transform ${sealT}ms ${ease} ${sealD}ms, opacity ${Math.round(
        sealT * 0.7
      )}ms linear ${sealD + 80}ms`;
  const tFlap = reduced ? undefined : `transform ${flapT}ms ${ease} ${flapD}ms`;
  const tCard = reduced
    ? 'opacity 150ms linear'
    : `transform ${cardT}ms ${ease} ${cardD}ms, opacity 260ms linear`;
  const tRibbon = reduced ? undefined : `transform ${ribbonT}ms ${ease} ${ribbonD}ms`;
  /* the flap's shadow has to leave as soon as the flap lifts */
  const tCast = reduced ? 'opacity 120ms linear' : `opacity 130ms linear ${flapD}ms`;

  const latin = /^[A-Za-z0-9&\s]+$/.test(sealText);
  const glyphs = Array.from(sealText).length;
  const monoLen = glyphs <= 1 ? 26 : glyphs <= 2 ? 40 : glyphs <= 4 ? 52 : 62;
  const monoFont = latin ? 'font-latin' : 'font-display';

  return (
    <div className={`relative flex w-full flex-col items-center ${className}`}>
      <div className="relative w-full" style={{ maxWidth: 520 }}>
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            {/* ---- the tooth of a fine cotton sheet ----------------------- *
                 The old tooth ran at baseFrequency 0.86 with 3 octaves and a
                 steep alpha cut, which is a coarse sandpaper grain. A premium
                 cotton sheet is much finer than that and its irregularity is
                 low-amplitude.
                 The frequency is 0.9, not higher: the filter is evaluated on the
                 device-pixel grid, so at 1.35 a noise cell was about 1.3 device
                 pixels wide and the second octave aliased into dark flecks - on
                 a phone the sheet read as speckled sand rather than as paper.
                 0.9 puts a cell at ~2-3 device pixels at every breakpoint, which
                 resolves instead of aliasing, so the grain is *smoother* and
                 more even while being, in user units, coarser. */}
            <filter
              id="envTooth"
              x="-3%"
              y="-3%"
              width="106%"
              height="106%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="23" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.5" intercept="-0.17" />
              </feComponentTransfer>
              <feFlood floodColor="#3a2b16" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>

            {/* ---- the long fibres that float inside cotton paper ---------- *
                 One direction per surface: cotton fibres are combed, so they
                 lie mostly one way. The old H+V crosshatch read as a woven
                 grid, not as a sheet. */}
            <filter
              id="envFibreH"
              x="-3%"
              y="-3%"
              width="106%"
              height="106%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.34"
                numOctaves="1"
                seed="7"
                result="n"
              />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.85" intercept="-0.47" />
              </feComponentTransfer>
              <feFlood floodColor="#6a5334" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>
            <filter
              id="envFibreV"
              x="-3%"
              y="-3%"
              width="106%"
              height="106%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.34 0.006"
                numOctaves="1"
                seed="41"
                result="n"
              />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.8" intercept="-0.47" />
              </feComponentTransfer>
              <feFlood floodColor="#7a6244" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>

            {/* ---- the surface shade ------------------------------------- *
                 This replaces `envLaid`, a 26x26 tile of ruled lines. A tile is
                 a repeat and the eye finds it immediately; this is one
                 non-repeating low-frequency turbulence instead, so the sheet
                 has a soft unevenness without ever showing a stripe. */}
            <filter
              id="envShade"
              x="-3%"
              y="-3%"
              width="106%"
              height="106%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0.0075" numOctaves="2" seed="5" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.45" intercept="-0.18" />
              </feComponentTransfer>
              <feFlood floodColor="#4a381e" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>

            {/* ---- light and shade ---------------------------------------- */}
            <radialGradient id="envFaceLight" cx="26%" cy="-8%" r="96%">
              <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.62" />
              <stop offset="52%" stopColor="#fffdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fffdf8" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="envFaceWarm" x1="0.15" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#4a381e" stopOpacity="0" />
              <stop offset="56%" stopColor="#4a381e" stopOpacity="0.03" />
              <stop offset="86%" stopColor="#4a381e" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#3a2a14" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient
              id="envSideL"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="-170"
              y2="272"
            >
              <stop offset="0%" stopColor="#3f2f16" stopOpacity="0.24" />
              <stop offset="10%" stopColor="#3f2f16" stopOpacity="0.07" />
              <stop offset="52%" stopColor="#fffdf6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#fffdf6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="envSideR"
              gradientUnits="userSpaceOnUse"
              x1="580"
              y1="0"
              x2="750"
              y2="272"
            >
              <stop offset="0%" stopColor="#3f2f16" stopOpacity="0.24" />
              <stop offset="10%" stopColor="#3f2f16" stopOpacity="0.07" />
              <stop offset="52%" stopColor="#fffdf6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#fffdf6" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient
              id="envFlapFace"
              gradientUnits="userSpaceOnUse"
              x1="80"
              y1="0"
              x2="470"
              y2="184"
            >
              <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.5" />
              <stop offset="38%" stopColor="#fffdf8" stopOpacity="0.24" />
              <stop offset="72%" stopColor="#4a381e" stopOpacity="0.035" />
              <stop offset="100%" stopColor="#4a381e" stopOpacity="0.11" />
            </linearGradient>
            <linearGradient
              id="envFlapFold"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="26"
            >
              <stop offset="0%" stopColor="#fffefb" stopOpacity="0.34" />
              <stop offset="58%" stopColor="#fffefb" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fffefb" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="envFlapBack"
              gradientUnits="userSpaceOnUse"
              x1="290"
              y1="184"
              x2="150"
              y2="0"
            >
              <stop offset="0%" stopColor="#3f2f16" stopOpacity="0.13" />
              <stop offset="26%" stopColor="#3f2f16" stopOpacity="0.04" />
              <stop offset="70%" stopColor="#fffdf6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#fffdf6" stopOpacity="0.34" />
            </linearGradient>

            {/* ---- the inside of the envelope ----------------------------- */}
            <linearGradient id="envInterior" x1="0.1" y1="0" x2="0.55" y2="1">
              <stop offset="0%" stopColor="#33240f" stopOpacity="0.36" />
              <stop offset="20%" stopColor="#33240f" stopOpacity="0.14" />
              <stop offset="58%" stopColor="#33240f" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#33240f" stopOpacity="0.1" />
            </linearGradient>

            {/* ---- thickness: the cut edge of the paper stack ------------- */}
            <linearGradient id="envEdge" x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="#fffdf7" stopOpacity="0.42" />
              <stop offset="44%" stopColor="#3f2f16" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#33240f" stopOpacity="0.42" />
            </linearGradient>

            {/* ---- the ribbon: a rolled bolt of cloth, not a flat rectangle.
                 The band's roundness (the cross-section) is legitimately a
                 gradient, but the WEAVE must not be a tiled pattern: the old
                 `envRib` was a 9x3.4 tile of ruled lines and read as repetitive
                 banding. Cloth is two non-repeating anisotropic turbulences —
                 one dark (the gaps between threads) and one light (the nap). */}
            <linearGradient id="envRibbonForm" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2b3226" stopOpacity="0.34" />
              <stop offset="6%" stopColor="#10160d" stopOpacity="0.14" />
              <stop offset="14%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="23%" stopColor="#ffffff" stopOpacity="0.13" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="47%" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="59%" stopColor="#10160d" stopOpacity="0.07" />
              <stop offset="74%" stopColor="#10160d" stopOpacity="0.16" />
              <stop offset="89%" stopColor="#10160d" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#141a10" stopOpacity="0.4" />
            </linearGradient>
            <filter id="envRibWeave" x="-8%" y="-3%" width="116%" height="106%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="17" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.24" intercept="-0.11" />
              </feComponentTransfer>
              <feFlood floodColor="#0f150c" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>
            {/* the nap: a broad, soft, non-repeating undulation. A real ribbon at
                fifty pixels across cannot show individual ribs — a resolvable
                stripe pattern is what made the old band read as banding. What
                sells cloth is the unevenness, not the ribs. */}
            <filter id="envRibNap" x="-8%" y="-3%" width="116%" height="106%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.045 0.13" numOctaves="3" seed="91" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="cut">
                <feFuncA type="linear" slope="0.17" intercept="-0.08" />
              </feComponentTransfer>
              <feFlood floodColor="#ffffff" result="tint" />
              <feComposite in="tint" in2="cut" operator="in" />
            </filter>
            {/* how the cloth drapes down the face of the envelope */}
            <linearGradient id="envRibbonFolds" x1="0.1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f150c" stopOpacity="0.3" />
              <stop offset="11%" stopColor="#0f150c" stopOpacity="0.05" />
              <stop offset="27%" stopColor="#0f150c" stopOpacity="0.13" />
              <stop offset="41%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="58%" stopColor="#0f150c" stopOpacity="0.13" />
              <stop offset="74%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="91%" stopColor="#0f150c" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0f150c" stopOpacity="0.3" />
            </linearGradient>
            {/* a soft diagonal drape so the cloth is never evenly lit */}
            <linearGradient
              id="envRibbonDrape"
              gradientUnits="userSpaceOnUse"
              x1="248"
              y1="116"
              x2="332"
              y2="400"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="26%" stopColor="#ffffff" stopOpacity="0.07" />
              <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="74%" stopColor="#0f150c" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#0f150c" stopOpacity="0.24" />
            </linearGradient>
            <filter id="envRibbonDrop" x="-40%" y="-6%" width="180%" height="114%">
              <feDropShadow dx="2" dy="2.2" stdDeviation="2.2" floodColor="#2b2212" floodOpacity="0.4" />
            </filter>

            {/* ---- bronze wax, pressed by hand ---------------------------- *
                 The hotspot deliberately sits off-centre (37/33) and the deepest
                 stop is a warm brown-black, not a black: a centred white hotspot
                 over a hard round falloff is what made this read as a glossy UI
                 button rather than as wax. */}
            <radialGradient id="envWax" gradientUnits="userSpaceOnUse" cx="37" cy="33" r="74">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#f3e2bd" />
                  <stop offset="8%" stopColor="#e6d0a4" />
                  <stop offset="20%" stopColor="#d3b683" />
                  <stop offset="36%" stopColor="#bd9d68" />
                  <stop offset="54%" stopColor="#9e7f4c" />
                  <stop offset="72%" stopColor="#7b5c30" />
                  <stop offset="88%" stopColor="#573d1c" />
                  <stop offset="100%" stopColor="#34240e" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f2f5ed" />
                  <stop offset="8%" stopColor="#e2e8db" />
                  <stop offset="20%" stopColor="#cbd4c3" />
                  <stop offset="36%" stopColor="#adb9a4" />
                  <stop offset="54%" stopColor="#8b997f" />
                  <stop offset="72%" stopColor="#6a785f" />
                  <stop offset="88%" stopColor="#4c5843" />
                  <stop offset="100%" stopColor="#2a3323" />
                </>
              )}
            </radialGradient>
            {/* the cut lip of the pour. It is a gradient, not a flat hairline:
                only the part of the edge facing the light catches it, so the
                silhouette does not end up ringed by one even bright line, which
                is what made the seal read as a drawn coin. */}
            <linearGradient id="envWaxLip" gradientUnits="userSpaceOnUse" x1="16" y1="10" x2="84" y2="92">
              <stop offset="0%" stopColor="#fff6e0" stopOpacity="0.46" />
              <stop offset="30%" stopColor="#fff1d4" stopOpacity="0.16" />
              <stop offset="56%" stopColor="#fff1d4" stopOpacity="0" />
              <stop offset="100%" stopColor="#2a1b06" stopOpacity="0.3" />
            </linearGradient>
            {/* the raised rim, built as two slopes. Light from the upper left, so
                the rim's OUTER slope is lit at the upper left and its INNER slope
                is lit at the lower right — hence two gradients running opposite
                ways. One symmetric band cannot reproduce that. */}
            <linearGradient id="envWaxCrestOut" gradientUnits="userSpaceOnUse" x1="18" y1="12" x2="84" y2="90">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#fdf3dd" stopOpacity="0.62" />
                  <stop offset="22%" stopColor="#f2e0b8" stopOpacity="0.3" />
                  <stop offset="46%" stopColor="#f2e0b8" stopOpacity="0" />
                  <stop offset="72%" stopColor="#2e1e06" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#201303" stopOpacity="0.58" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f6f8f1" stopOpacity="0.56" />
                  <stop offset="22%" stopColor="#dee4d8" stopOpacity="0.26" />
                  <stop offset="46%" stopColor="#dee4d8" stopOpacity="0" />
                  <stop offset="72%" stopColor="#232c1d" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#151b10" stopOpacity="0.58" />
                </>
              )}
            </linearGradient>
            <linearGradient id="envWaxCrestIn" gradientUnits="userSpaceOnUse" x1="84" y1="90" x2="18" y2="12">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#fff4dc" stopOpacity="0.42" />
                  <stop offset="26%" stopColor="#e9d6ab" stopOpacity="0.18" />
                  <stop offset="52%" stopColor="#e9d6ab" stopOpacity="0" />
                  <stop offset="78%" stopColor="#241604" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#180e02" stopOpacity="0.52" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f8faf2" stopOpacity="0.38" />
                  <stop offset="26%" stopColor="#d6ddcd" stopOpacity="0.16" />
                  <stop offset="52%" stopColor="#d6ddcd" stopOpacity="0" />
                  <stop offset="78%" stopColor="#1b2216" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#0f140a" stopOpacity="0.52" />
                </>
              )}
            </linearGradient>
            {/* the dished field inside the rim: the same ramp one value down */}
            <radialGradient id="envWaxField" gradientUnits="userSpaceOnUse" cx="40" cy="36" r="48">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#dcc9a2" />
                  <stop offset="10%" stopColor="#cdb488" />
                  <stop offset="24%" stopColor="#b89b66" />
                  <stop offset="40%" stopColor="#a3854c" />
                  <stop offset="58%" stopColor="#846a38" />
                  <stop offset="74%" stopColor="#66502a" />
                  <stop offset="88%" stopColor="#4a3818" />
                  <stop offset="100%" stopColor="#2d200c" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#e6ebdf" />
                  <stop offset="10%" stopColor="#d3dac9" />
                  <stop offset="24%" stopColor="#b6c0ac" />
                  <stop offset="40%" stopColor="#96a38b" />
                  <stop offset="58%" stopColor="#78876e" />
                  <stop offset="74%" stopColor="#5c6b52" />
                  <stop offset="88%" stopColor="#43503a" />
                  <stop offset="100%" stopColor="#27301f" />
                </>
              )}
            </radialGradient>
            <filter id="envWaxShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="1.7" dy="2.6" stdDeviation="2.8" floodColor="#1d1509" floodOpacity="0.4" />
            </filter>
            {/* the flap lies on top of the pocket, so it casts a soft edge shadow */}
            <filter id="envCast" x="-10%" y="-40%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            {/* the bottom fold stands proud of the back panel, so it lays a
                contact shadow upward onto it. This is the cue that makes the
                panel read as attached to the packet instead of floating on it. */}
            <linearGradient
              id="envFoldCast"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={POCKET_TOP - 13}
              x2="0"
              y2={POCKET_TOP}
            >
              <stop offset="0%" stopColor="#3f2e14" stopOpacity="0" />
              <stop offset="62%" stopColor="#3f2e14" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#3f2e14" stopOpacity="0.3" />
            </linearGradient>
            {/* once the flap stands up, the fold at the hinge keeps a contact
                shadow. Fading every shadow to zero is what made the opened
                envelope read as one flat mass of ivory. */}
            <linearGradient id="envHinge" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="12">
              <stop offset="0%" stopColor="#3a2a12" stopOpacity="0.36" />
              <stop offset="46%" stopColor="#3a2a12" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3a2a12" stopOpacity="0" />
            </linearGradient>
            {/* how the cloth curls away over the bottom cut edge */}
            <linearGradient id="envRibCurl" gradientUnits="userSpaceOnUse" x1="0" y1="390" x2="0" y2="400">
              <stop offset="0%" stopColor="#0f150c" stopOpacity="0" />
              <stop offset="55%" stopColor="#0f150c" stopOpacity="0.2" />
              <stop offset="86%" stopColor="#ffffff" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
            </linearGradient>
            <clipPath id="envRectClip">
              <rect x="0" y="0" width={W} height={H} />
            </clipPath>
          </defs>
        </svg>
        {/* the surface the envelope rests on */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-0 h-14"
          style={{
            borderRadius: '999px',
            background: onDark
              ? 'radial-gradient(48% 46% at 50% 46%, rgba(240,232,216,0.16) 0%, transparent 74%)'
              : 'radial-gradient(48% 46% at 50% 46%, rgba(56,42,20,0.42) 0%, transparent 74%)',
            filter: 'blur(10px)',
          }}
        />

        <div
          ref={stageRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="group relative w-full"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <div
            aria-hidden="true"
            /* under reduced motion nothing rotates, so freezing the texture
               would only pop the grain back in at the end of the beat */
            className={`absolute inset-0 ${isOpening && !reduced ? 'env-opening' : ''}`}
          >
            <div className="absolute inset-0" style={{ perspective: '1500px' }}>
              <div
                className="h-full w-full transition-transform duration-slow ease-out-expo"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(0, ${opened && !reduced ? (gentle ? 26 : 38) : 0}px, 0)`,
                  /* This reframe exists because the flap swings up and the
                     composition grows; so it belongs to the flap's beat, not to
                     the seal's. Starting it at 0 put two moves in the first
                     300ms and dropped the envelope while the wax was releasing.
                     Delayed, each beat carries one thing: the seal, then the
                     flap (with the ribbon and the shadow), then the card. The
                     close is un-delayed, because an exit should be immediate. */
                  transitionDelay: opened ? `${reduced ? 0 : flapD}ms` : '0ms',
                }}
              >
                <div
                  className="relative h-full w-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: reduced
                      ? undefined
                      : `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`,
                  }}
                >
                  {/* 0 — the thickness of the paper stack, behind everything */}
                  <div
                    className="absolute -inset-[3px] rounded-card"
                    style={{
                      backgroundColor: paper,
                      backgroundImage:
                        'linear-gradient(148deg, rgba(255,253,247,0.24) 0%, rgba(63,47,22,0.26) 52%, rgba(45,32,13,0.52) 100%)',
                      transform: 'translateZ(-4px)',
                      boxShadow:
                        '0 30px 52px -24px rgba(50,36,16,0.66), 0 8px 18px -10px rgba(50,36,16,0.38)',
                    }}
                  />

                  {/* 1 — the inside of the envelope */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-card"
                    style={{
                      backgroundColor: paper,
                      transform: 'translateZ(-3px)',
                      boxShadow: 'inset 0 0 32px rgba(45,32,13,0.15)',
                    }}
                  >
                    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
                      <rect width="100%" height="100%" filter="url(#envShade)" opacity="0.35" />
                      <rect width="100%" height="100%" filter="url(#envTooth)" opacity="0.3" />
                      <rect width="100%" height="100%" filter="url(#envFibreV)" opacity="0.06" />
                    </svg>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(51,36,15,0.33) 0%, rgba(51,36,15,0.13) 18%, rgba(51,36,15,0.02) 54%, rgba(51,36,15,0.07) 100%)',
                      }}
                    />
                    <svg
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <Embossed x={245} y={-26} scale={0.9} opacity={0.42} metal={metal} accent={accent} />
                    </svg>
                  </div>

                  {/* 2 — the invitation card, seated inside the pocket. It sits
                        behind the folds, so the two side folds hold its edges and
                        the pocket hides its foot: only the mouth shows it. */}
                  <div
                    className="absolute left-1/2 overflow-hidden rounded-card"
                    style={{
                      top: '8%',
                      width: '48%',
                      height: '88%',
                      backgroundColor: paper,
                      border: '1px solid rgba(84,64,31,0.34)',
                      boxShadow:
                        '0 30px 52px -22px rgba(45,32,13,0.75), 0 4px 14px -3px rgba(45,32,13,0.34), 0 0 0 1px rgba(255,255,252,0.4) inset',
                      /* Under reduced motion the card stays in the pocket and
                         only fades: the rise is movement, and the fade is what
                         carries the change. The centring translate has to stay,
                         so it is the rise — not the whole transform — that goes. */
                      transform: `translateX(-50%) translateZ(-2px)${
                        reduced ? '' : ` translateY(${opened ? -cardRise : 0}%)`
                      }`,
                      transition: tCard,
                      opacity: isOpen ? 0 : 1,
                    }}
                  >
                    {/* a brighter stock than the envelope, so it separates from it */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(165deg, rgba(255,255,252,0.75) 0%, rgba(255,254,248,0.44) 44%, rgba(255,253,246,0.14) 100%)',
                      }}
                    />
                    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
                      <rect width="100%" height="100%" filter="url(#envShade)" opacity="0.14" />
                      <rect width="100%" height="100%" filter="url(#envTooth)" opacity="0.34" />
                    </svg>
                    <svg
                      viewBox="0 0 100 144"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <path
                        d="M 4 5 L 96 5 L 96 139 L 4 139 Z"
                        fill="none"
                        stroke={metal ? accent : 'rgba(92,74,44,0.5)'}
                        strokeOpacity={metal ? 0.5 : 1}
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d="M 6.6 7.6 L 93.4 7.6 L 93.4 136.4 L 6.6 136.4 Z"
                        fill="none"
                        stroke={metal ? accent : 'rgba(92,74,44,0.4)'}
                        strokeOpacity={metal ? 0.26 : 1}
                        strokeWidth="0.4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    <svg
                      viewBox="0 0 100 144"
                      preserveAspectRatio="xMidYMid meet"
                      className="absolute inset-x-0 top-[9%] h-[34%] w-full"
                    >
                      <Embossed x={9} y={-5} scale={0.82} opacity={0.7} metal={metal} accent={accent} />
                    </svg>
                    {sealText ? (
                      <span
                        className={`absolute inset-x-0 bottom-[20%] flex justify-center ${monoFont}`}
                        style={{
                          color: metal ? 'rgba(96,74,38,0.9)' : 'rgba(72,84,66,0.9)',
                          letterSpacing: '0.24em',
                        }}
                      >
                        <span className="text-xs">{sealText}</span>
                      </span>
                    ) : null}
                  </div>

                  {/* 3 — the folds: two side folds tucked under the bottom fold,
                        which is the clean, uninterrupted front face */}
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    style={{ transform: 'translateZ(-1px)' }}
                    aria-hidden="true"
                  >
                    <defs>
                      <clipPath id="envFaceClip">
                        <path d={POCKET_PATH} />
                      </clipPath>
                      {/* the mouth: the area the two side folds leave open */}
                      <clipPath id="envMouthClip">
                        <path d={FLAP_PATH} />
                      </clipPath>
                      {/* the back panel: nought but the two side folds, so the
                          pocket's contact shadow can never spill into the mouth */}
                      <clipPath id="envBackClip">
                        <path d={SIDE_L_PATH} />
                        <path d={SIDE_R_PATH} />
                      </clipPath>
                    </defs>

                    <path d={SIDE_L_PATH} fill={paper} />
                    <path d={SIDE_L_PATH} fill="url(#envSideL)" />
                    <path d={SIDE_R_PATH} fill={paper} />
                    <path d={SIDE_R_PATH} fill="url(#envSideR)" />

                    {/* the creases: each side fold's folded edge, dark on the
                        shadow side and lit on the side the paper turns toward */}
                    <path d={CREASE_LEFT} fill="none" stroke="#4a381e" strokeOpacity="0.22" strokeWidth="2" />
                    <path d={CREASE_RIGHT} fill="none" stroke="#4a381e" strokeOpacity="0.22" strokeWidth="2" />
                    <path d="M 1.5 6 L 283 181" fill="none" stroke="#fffdf7" strokeOpacity="0.4" strokeWidth="1.1" />
                    <path d={`M ${W - 1.5} 6 L ${W - 283} 181`} fill="none" stroke="#fffdf7" strokeOpacity="0.4" strokeWidth="1.1" />

                    {/* the bottom fold stands proud of the back panel: its edge
                        lays a contact shadow upward, which is what makes the
                        panel read as attached rather than as a rectangle on a
                        rectangle. Clipped to the back panel so it cannot bleed
                        into the open mouth. */}
                    <rect
                      x="0"
                      y={POCKET_TOP - 13}
                      width={W}
                      height="13"
                      fill="url(#envFoldCast)"
                      clipPath="url(#envBackClip)"
                    />

                    {/* the bottom fold — the clean front face of the envelope */}
                    <path d={POCKET_PATH} fill={paper} />
                    <path d={POCKET_PATH} fill="url(#envFaceLight)" />
                    <g clipPath="url(#envFaceClip)">
                      <path d={POCKET_PATH} filter="url(#envTooth)" opacity="0.5" />
                      <path d={POCKET_PATH} filter="url(#envFibreH)" opacity="0.22" />
                      <path d={POCKET_PATH} filter="url(#envFibreV)" opacity="0.1" />
                      {/* the sheet's own edge, softened just inside the silhouette
                          so the paper reads as slightly domed rather than as a
                          flat fill with a hard boundary */}
                      <path
                        d={POCKET_PATH}
                        fill="none"
                        stroke="#3a2a12"
                        strokeWidth="7"
                        opacity="0.13"
                        filter="url(#envCast)"
                      />
                    </g>
                    <path d={POCKET_PATH} fill="url(#envFaceWarm)" />

                    {/* the side folds lie over the card: their edges drop a soft
                        shadow into the mouth, which the flap hides while closed */}
                    <g clipPath="url(#envMouthClip)">
                      <path
                        d="M 0 0 L 288 182"
                        fill="none"
                        stroke="#3f2e14"
                        strokeOpacity="0.34"
                        strokeWidth="5"
                        filter="url(#envCast)"
                        transform="translate(2.5 0)"
                      />
                      <path
                        d={`M ${W} 0 L ${W - 288} 182`}
                        fill="none"
                        stroke="#3f2e14"
                        strokeOpacity="0.34"
                        strokeWidth="5"
                        filter="url(#envCast)"
                        transform="translate(-2.5 0)"
                      />
                    </g>

                    {/* the fold's crease: one lit crest, with the paper dipping
                        just behind it. A second bright hairline here (there used
                        to be two) reads as a doubling artifact, not a fold. */}
                    <path
                      d={`M 12.5 ${POCKET_TOP} L ${W - 12.5} ${POCKET_TOP}`}
                      fill="none"
                      stroke="#fffaf0"
                      strokeOpacity="0.72"
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M 15 ${POCKET_TOP + 3.4} L ${W - 15} ${POCKET_TOP + 3.4}`}
                      fill="none"
                      stroke="#4a381e"
                      strokeOpacity="0.1"
                      strokeWidth="3"
                      filter="url(#envCast)"
                    />

                    {/* one champagne-foil rule laid on the fold. It bows by two
                        units, because foil follows the crest of a fold rather than
                        ruling a straight line across it. It is the only gold on the
                        front face, so it stays a detail instead of becoming a frame. */}
                    {metal ? (
                      <path
                        d={`M 30 ${POCKET_TOP + 9} Q 290 ${POCKET_TOP + 11} ${W - 30} ${POCKET_TOP + 9}`}
                        fill="none"
                        stroke={accent}
                        strokeOpacity="0.68"
                        strokeWidth="0.95"
                      />
                    ) : (
                      <path
                        d={`M 30 ${POCKET_TOP + 10} L ${W - 30} ${POCKET_TOP + 10}`}
                        fill="none"
                        stroke="#4a381e"
                        strokeOpacity="0.16"
                        strokeWidth="0.9"
                      />
                    )}

                    {/* the botanical: one sprig per lower corner, but NOT a
                        mirrored pair — the two are at different sizes, angles
                        and insets, so they no longer set a horizontal axis
                        across the face that fights the seal — ribbon axis, and
                        they no longer reach the panel's edges */}
                    <Embossed x={32} y={232} scale={0.67} rotate={-20} opacity={0.66} weight={1.4} metal={metal} accent={accent} />
                    <Embossed
                      x={W - 42}
                      y={252}
                      scale={0.56}
                      rotate={13}
                      opacity={0.62}
                      weight={1.35}
                      metal={metal}
                      accent={accent}
                    />
                  </svg>

                  {/* 4 — the sage cloth band, pinned under the wax */}
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    style={{ transform: 'translateZ(-0.5px)' }}
                    aria-hidden="true"
                  >
                    <g clipPath="url(#envRectClip)">
                      {/* the fold at the hinge keeps a contact shadow once the
                          flap stands up, so the opened envelope still has depth */}
                      <rect
                        x="0"
                        y="0"
                        width={W}
                        height="12"
                        fill="url(#envHinge)"
                        style={{ opacity: opened ? 1 : 0, transition: tCast }}
                      />
                      <g
                        style={{
                          /* The release: the wax was compressing the cloth, so
                             when the seal lets go the band loses a little
                             tension — it settles down into slack and relaxes
                             back to its true width. The old exit squashed the
                             whole band sideways, which read as the stripe being
                             re-printed narrower. */
                          transform: reduced
                            ? 'none'
                            : opened
                              ? 'translateY(3px) scaleX(1.012)'
                              : 'none',
                          transformOrigin: 'center',
                          transition: tRibbon,
                        }}
                      >
                        <g filter="url(#envRibbonDrop)">
                          <path d={RIBBON_PATH} fill={ribbon} />
                        </g>
                        <path d={RIBBON_PATH} fill={ribbon} />
                        <path d={RIBBON_PATH} fill="url(#envRibbonForm)" />
                        <path d={RIBBON_PATH} filter="url(#envRibWeave)" />
                        <path d={RIBBON_PATH} filter="url(#envRibNap)" transform="translate(0 0.7)" />
                        <path d={RIBBON_PATH} fill="url(#envRibbonDrape)" />
                        <path d={RIBBON_PATH} fill="url(#envRibbonFolds)" />
                        {/* the wrinkles where the cloth crosses the crease and the fold */}
                        <path d="M 258 186 C 274 192 300 198 322 202" fill="none" stroke="#0f150c" strokeOpacity="0.15" strokeWidth="2.4" />
                        <path d="M 258 191 C 274 197 300 203 322 207" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.7" />
                        <path d="M 256 330 C 276 334 302 338 322 336" fill="none" stroke="#0f150c" strokeOpacity="0.15" strokeWidth="2.4" />
                        <path d="M 256 335 C 276 339 302 343 322 341" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.6" />
                        {/* the band is trapped between the flap and the fold, so
                            where the wax pressed it there is a compression crease.
                            It stays after the seal goes, which is what keeps the
                            cloth looking attached rather than printed. */}
                        <path d="M 264 180 C 278 183 302 183 316 180" fill="none" stroke="#0f150c" strokeOpacity="0.3" strokeWidth="3.4" />
                        <path d="M 264 175 C 278 178 302 178 316 175" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
                        {/* the selvedges: the lit left edge, and on the right the
                            cloth's own thickness curling into its shadow */}
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#0f150c" strokeOpacity="0.16" strokeWidth="1" transform="translate(-1.5 0)" />
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.2" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1" transform="translate(-3.2 0)" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#0b1008" strokeOpacity="0.3" strokeWidth="2.4" transform="translate(-1.2 0)" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#0f150c" strokeOpacity="0.24" strokeWidth="1" />
                        {/* the cloth curling away over the bottom cut edge */}
                        <path d={RIBBON_PATH} fill="url(#envRibCurl)" />
                      </g>

                      {/* the flap lies on the cloth, so its cast shadow falls on
                          the band as well as on the face. It is drawn here, above
                          the band, because physically the flap is above both.
                          It retracts into the hinge as the flap lifts. */}
                      <g
                        style={{
                          opacity: opened ? 0 : 1,
                          transition: tCast,
                          transform: opened ? 'translateY(-7px) scaleY(0.62)' : 'none',
                          transformOrigin: '290px 152px',
                          transformBox: 'view-box',
                        }}
                      >
                        <path
                          d={FLAP_PATH}
                          fill="none"
                          stroke="#3f2e14"
                          strokeOpacity="0.3"
                          strokeWidth="7"
                          filter="url(#envCast)"
                          transform="translate(0 3.5)"
                        />
                        <path
                          d={FLAP_PATH}
                          fill="none"
                          stroke="#3f2e14"
                          strokeOpacity="0.16"
                          strokeWidth="2.4"
                          transform="translate(0 2)"
                        />
                      </g>
                    </g>
                  </svg>

                  {/* 5 — the closing flap, hinged on the top fold */}
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: `${((FLAP_TIP / H) * 100).toFixed(2)}%`,
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      /* The flap must reach the open state in every mode. Under
                         prefers-reduced-motion the global rule pins
                         `transition-property` to the opacity/colour set, so this
                         lands in one frame instead of rotating: the movement goes,
                         the state stays. Suppressing the transform outright left
                         reduced-motion users looking at a shut envelope. */
                      transform: `translateZ(${opened ? (gentle ? -46 : -12) : 0}px) rotateX(${
                        opened ? (gentle ? -168 : -178) : 0
                      }deg)`,
                      transition: tFlap,
                      /* the flap carries the paper grain filters, so promote it
                         for the one rotation: this keeps the grain from being
                         re-rasterised on every frame of the opening */
                      willChange: reduced ? undefined : 'transform',
                    }}
                  >
                    {/* the face of the flap, seen while it is closed */}
                    <div className="absolute inset-0 backface-hidden">
                      <svg
                        viewBox={`0 0 ${W} ${FLAP_TIP}`}
                        preserveAspectRatio="none"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <defs>
                          <clipPath id="envFlapClip">
                            <path d={FLAP_PATH} />
                          </clipPath>
                        </defs>
                        <path d={FLAP_PATH} fill={paper} />
                        <path d={FLAP_PATH} fill="url(#envFaceLight)" />
                        <g clipPath="url(#envFlapClip)">
                          <path d={FLAP_PATH} filter="url(#envTooth)" opacity="0.42" />
                          <path d={FLAP_PATH} filter="url(#envFibreV)" opacity="0.18" />
                        </g>
                        <path d={FLAP_PATH} fill="url(#envFlapFace)" />
                        <path d={FLAP_PATH} fill="url(#envFlapFold)" />

                        <Embossed x={252.5} y={24} scale={0.75} opacity={0.86} metal={metal} accent={accent} />

                        {/* A single foil hairline inset 14 units from the flap's
                            true cut edge. There used to be a second at inset 17,
                            which pinched onto this one just above the seal and
                            read as a drafting error rather than a margin. */}
                        <path
                          d={FLAP_RULE}
                          fill="none"
                          stroke={metal ? accent : '#4a381e'}
                          strokeOpacity={metal ? 0.72 : 0.22}
                          strokeWidth={metal ? 1.1 : 1}
                        />

                        <path
                          d={FLAP_PATH}
                          fill="none"
                          stroke="#4a381e"
                          strokeOpacity="0.18"
                          strokeWidth="1"
                          transform={`translate(290 92) scale(0.986) translate(-290 -92)`}
                        />
                        <path d={FLAP_PATH} fill="none" stroke="#fffdf7" strokeOpacity="0.5" strokeWidth="1.2" />
                      </svg>
                    </div>

                    {/* the reverse of the flap: what opening reveals */}
                    <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                      <svg
                        viewBox={`0 0 ${W} ${FLAP_TIP}`}
                        preserveAspectRatio="none"
                        className="h-full w-full"
                        aria-hidden="true"
                      >
                        <defs>
                          <clipPath id="envFlapClipBack">
                            <path d={FLAP_PATH} />
                          </clipPath>
                        </defs>
                        <path d={FLAP_PATH} fill={paper} />
                        <path d={FLAP_PATH} fill="url(#envFlapBack)" />
                        <g clipPath="url(#envFlapClipBack)">
                          <path d={FLAP_PATH} filter="url(#envTooth)" opacity="0.5" />
                        </g>
                        <Embossed x={252.5} y={30} scale={0.78} rotate={180} opacity={0.42} metal={metal} accent={accent} />
                        <path d={FLAP_PATH} fill="none" stroke="#4a381e" strokeOpacity="0.22" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>

                  {/* 6 — the hand-pressed wax closure.
                        Sized at ~10.5% of the envelope's width (the previous
                        15% read as a decorative button). Every ring below is a
                        scaled copy of WAX_BODY, so nothing on the seal is a
                        perfect circle and no two rings are concentric. */}
                  <div
                    className="absolute aspect-square w-[10.5%] min-w-[35px] max-w-[58px]"
                    style={{
                      left: '50%',
                      top: `${((FLAP_TIP / H) * 100).toFixed(2)}%`,
                      transform: reduced
                        ? 'translate(-50%, -50%)'
                        : `translate(-50%, -50%) translate(${opened ? 4 : 0}px, ${
                            opened ? 22 : 0
                          }px) rotate(${opened ? -13 : 0}deg) scale(${opened ? 1.04 : 1})`,
                      transition: tSeal,
                      opacity: opened ? 0 : 1,
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
                      <g filter="url(#envWaxShadow)">
                        {/* 1 · the body of the pour */}
                        <path d={WAX_BODY} fill="url(#envWax)" />
                        {/* 2 · the cut lip, on the lit side only */}
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxLip)"
                          strokeWidth="1.3"
                          transform="translate(-1.1 -1.4)"
                        />
                        {/* 3 · the raised rim, built as two slopes rather than as
                               rings. A ridge is lit on its OUTER slope where that
                               slope faces the light (the upper left) and on its
                               INNER slope where that one does (the lower right);
                               using one symmetric band loses that, and stacking
                               hairline rings to fake it leaves exactly the visible
                               concentric bands a drawn button has. */}
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxCrestOut)"
                          strokeWidth="5"
                          transform={WAX_RING(0.95)}
                        />
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxCrestIn)"
                          strokeWidth="5"
                          transform={WAX_RING(0.85)}
                        />
                        {/* 4 · the dished field of the die — a recess, not a dome,
                               so it is lit on its LOWER-RIGHT wall and dark on the
                               upper-left. A dome would be lit the other way round,
                               which is what made the old seal read as a plastic cap. */}
                        <g transform={WAX_RING(0.815)}>
                          <path d={WAX_BODY} fill="url(#envWaxField)" />
                          <path
                            d={WAX_BODY}
                            fill="none"
                            stroke="#2e1f0a"
                            strokeOpacity="0.26"
                            strokeWidth="2.6"
                            transform="translate(2 2.3)"
                          />
                          <path
                            d={WAX_BODY}
                            fill="none"
                            stroke="#ffeec8"
                            strokeOpacity="0.22"
                            strokeWidth="1.8"
                            transform="translate(-1.8 -2)"
                          />
                        </g>
                        {/* 5 · one leaflet each side, pressed into the wax under
                               the die, so the seal carries the envelope's own motif */}
                        {[[17, 64, -104], [83, 62, 104]].map(([x, y, r]) => (
                          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(0.8) rotate(${r})`}>
                            <g transform="translate(1.2 1.2)" opacity="0.3">
                              <path d={LEAF_PATHS[0]} fill="none" stroke="#2a1a02" strokeWidth="2" strokeLinecap="round" />
                            </g>
                            <g opacity="0.24">
                              <path d={LEAF_PATHS[0]} fill="none" stroke="#fff6dd" strokeWidth="1.7" strokeLinecap="round" />
                            </g>
                          </g>
                        ))}
                      </g>
                      {/* 7 · the monogram, PRESSED into the wax rather than
                             printed on it. The light comes from the upper-left,
                             so the sunken groove is dark on its upper-left wall
                             and lit on its lower-right wall: the dark copy sits
                             up-and-left of the glyph, the light copy down-and-
                             right. Nothing here is a decal. */}
                      {sealText ? (
                        <g
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={monoFont}
                          /* A pressed monogram is chunky: at the 35 px seal the
                             whole glyph is barely 11 px tall, and thin strokes
                             dissolve into mush. A heavier weight is what keeps it
                             legible at small sizes without changing the mark. */
                          style={{
                            fontSize: '31px',
                            fontWeight: 600,
                            direction: latin ? 'ltr' : 'rtl',
                          }}
                        >
                          <text
                            x="51.5"
                            y="51.5"
                            textLength={monoLen + 0.8}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#fff3d8' : '#e8ede4'}
                            fillOpacity={metal ? 0.34 : 0.28}
                          >
                            {sealText}
                          </text>
                          <text
                            x="48.5"
                            y="48.5"
                            textLength={monoLen + 0.8}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#2a1a06' : '#161d11'}
                            fillOpacity="0.48"
                          >
                            {sealText}
                          </text>
                          <text
                            x="50"
                            y="50"
                            textLength={monoLen}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#412c0a' : '#222b19'}
                            fillOpacity={metal ? 0.9 : 0.92}
                          >
                            {sealText}
                          </text>
                        </g>
                      ) : (
                        /* no initials given, so the die carries the botanical
                           emblem instead. Engraved the same way — dark copy up
                           and left, light copy down and right, body between —
                           so it is pressed into the wax, not printed on it. */
                        <g aria-hidden="true">
                          {EMBLEM_PATHS.map((d) => (
                            <path
                              key={`emb-d-${d}`}
                              d={d}
                              fill="none"
                              stroke={metal ? '#2a1a06' : '#161d11'}
                              strokeOpacity="0.46"
                              strokeWidth="2.6"
                              strokeLinecap="round"
                              transform="translate(1.3 1.4)"
                            />
                          ))}
                          {EMBLEM_PATHS.map((d) => (
                            <path
                              key={`emb-l-${d}`}
                              d={d}
                              fill="none"
                              stroke={metal ? '#fff3d8' : '#e8ede4'}
                              strokeOpacity="0.3"
                              strokeWidth="2"
                              strokeLinecap="round"
                              transform="translate(-1.1 -1.2)"
                            />
                          ))}
                          {EMBLEM_PATHS.map((d) => (
                            <path
                              key={`emb-b-${d}`}
                              d={d}
                              fill="none"
                              stroke={metal ? '#412c0a' : '#222b19'}
                              strokeOpacity="0.72"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          ))}
                        </g>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!opened && (
            <button
              type="button"
              onClick={handleOpen}
              aria-label={openLabel}
              className="absolute inset-0 cursor-pointer rounded-card"
            />
          )}
        </div>

      </div>
      <p
        aria-hidden="true"
        className="mt-6 text-center text-xs font-medium"
        style={{
          color: onDark ? 'rgba(245,240,230,0.62)' : 'var(--color-ink-subtle)',
          opacity: opened ? 0 : 1,
          transition: reduced ? 'opacity 150ms linear' : 'opacity 220ms linear',
        }}
      >
        {isOpening ? openingHint : hint}
      </p>

      {isOpen && <div className="w-full animate-reveal-up">{children}</div>}

      <p className="sr-only" aria-live="polite">
        {isOpening ? openingHint : isOpen ? openedHint : ''}
      </p>
    </div>
  );
}

