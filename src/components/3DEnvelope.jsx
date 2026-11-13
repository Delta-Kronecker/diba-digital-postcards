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
 * stripe printed on the face.
 *
 * The band is ONE table of stations — (y, centre, half-width) — and both
 * selvedges, and the closed outline, are interpolated from it. One table is
 * what lets the cloth behave like cloth: the wax has pinched it (22.8 half
 * width against 25 on either side), it swells back out below the seal, and the
 * centre drifts, so the two long edges are never the same line twice. Two
 * hand-written cubics per edge could not be kept in step, and an outline that
 * has drifted away from a selvedge stroke is what makes a band read as a shape
 * with an outline drawn on it rather than as a strip of cloth. */
const RIBBON_STATIONS = [
  /*   y,  centre, half-width */
  [116, 290, 25], /* hidden under the flap and the wax */
  [140, 289.8, 24.6],
  [168, 289.6, 23.3], /* the wax has pressed the cloth in here */
  [186, 289.6, 22.8],
  [206, 289.8, 24.7], /* and it swells back out just below the seal */
  [228, 290.2, 25.8],
  [258, 289.4, 25.4],
  [292, 289.6, 25.2],
  [330, 290, 25],
  [362, 290.4, 24.7],
  [384, 290.8, 24.2],
  [400, 291, 23.8], /* the turn over the bottom cut edge */
];

/* x(y) through the stations as a cubic Hermite, slopes from the neighbours, so
 * every station is met smoothly and y stays monotone */
function ribbonEdge(side, reversed) {
  const st = reversed ? [...RIBBON_STATIONS].reverse() : RIBBON_STATIONS;
  const px = st.map(([, c, hw]) => c + side * hw);
  const py = st.map(([sy]) => sy);
  const slope = (i) => {
    if (i === 0) return (px[1] - px[0]) / (py[1] - py[0]);
    if (i === st.length - 1) return (px[i] - px[i - 1]) / (py[i] - py[i - 1]);
    return (px[i + 1] - px[i - 1]) / (py[i + 1] - py[i - 1]);
  };
  let d = `M ${px[0].toFixed(2)} ${py[0]}`;
  for (let i = 0; i < st.length - 1; i++) {
    const h = py[i + 1] - py[i];
    d +=
      ` C ${(px[i] + (slope(i) * h) / 3).toFixed(2)} ${(py[i] + h / 3).toFixed(2)}` +
      ` ${(px[i + 1] - (slope(i + 1) * h) / 3).toFixed(2)} ${(py[i + 1] - h / 3).toFixed(2)}` +
      ` ${px[i + 1].toFixed(2)} ${py[i + 1]}`;
  }
  return d;
}

const RIBBON_LEFT_EDGE = ribbonEdge(-1, false);
const RIBBON_RIGHT_EDGE = ribbonEdge(1, false);
/* the closed outline: down the lit selvedge, across the cut edge, back up the
 * shadowed one, so the fill can never disagree with either stroke */
const RIBBON_PATH = `${RIBBON_LEFT_EDGE} ${ribbonEdge(1, true).replace(/^M/, 'L')} Z`;
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

/* the pressed blob, and the lobes squeezed out from under the die.
 *
 * A pressed wax seal is a squat ellipse with a facetted, dented rim. A smooth
 * ellipse is read as a drawn disc — which is half of why this used to look like
 * a button — so the silhouette needs its radius to vary sharply around the
 * perimeter. 15 samples (odd, so no sample has a diametric twin and the blob
 * cannot mirror), a wide radius band, one deliberate NOTCH where the pour
 * pinched and one deliberate SQUASH where it overran. The Catmull-Rom tangents
 * are divided by 8, not 6: a small divisor lets the spline fly past the sample
 * points, which rounds every notch back out and turns the overrun into a thorn.
 * The squash is capped so the lobe still fits inside the 0..100 viewBox. */
function waxBlob(rx, ry, seed, cx = 50, cy = 50) {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const n = 15;
  const start = -104 * (Math.PI / 180);
  const ang = [];
  for (let i = 0; i < n; i += 1) {
    ang.push(start + (i / n) * Math.PI * 2 + (rnd() - 0.5) * (20 * Math.PI) / 180);
  }
  const rad = [];
  for (let i = 0; i < n; i += 1) rad.push(0.925 + rnd() * 0.075);
  /* a pinch: two adjacent samples pulled in hard, so the rim takes a notch */
  const notch = 2 + Math.floor(rnd() * (n - 4));
  rad[notch] = 0.82;
  rad[(notch + 1) % n] = 0.86;
  /* an overrun: one sample pushed out with its neighbour, so the wax visibly
   * squashes outward there instead of stopping at an even margin */
  const squash = (notch + 6) % n;
  rad[squash] = Math.min(1.08, rad[squash] + 0.18);
  rad[(squash + 1) % n] = Math.min(1.04, rad[(squash + 1) % n] + 0.1);
  /* any pair of opposite samples that agree would twin the blob, so pull them
   * apart; a symmetric wax blob reads as a manufactured disc */
  for (let i = 0; i < Math.floor(n / 2); i += 1) {
    const j = (i + 7) % n;
    if (Math.abs(rad[i] - rad[j]) < 0.04) rad[j] = Math.max(0.92, rad[j] - 0.045);
  }
  /* one flat thumb facet, where the wax was pressed against the paper */
  rad[5] = (rad[5] + rad[6]) / 2;
  rad[6] = rad[5];

  const p = rad.map((r, i) => [cx + Math.cos(ang[i]) * r * rx, cy + Math.sin(ang[i]) * r * ry]);
  const at = (i) => p[(i + n) % n];
  let d = `M ${at(0)[0].toFixed(2)} ${at(0)[1].toFixed(2)}`;
  for (let i = 0; i < n; i += 1) {
    const c1 = [
      at(i)[0] + (at(i + 1)[0] - at(i - 1)[0]) / 8,
      at(i)[1] + (at(i + 1)[1] - at(i - 1)[1]) / 8,
    ];
    const c2 = [
      at(i + 1)[0] - (at(i + 2)[0] - at(i)[0]) / 8,
      at(i + 1)[1] - (at(i + 2)[1] - at(i)[1]) / 8,
    ];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(
      2
    )} ${at(i + 1)[0].toFixed(2)} ${at(i + 1)[1].toFixed(2)}`;
  }
  return `${d} Z`;
}

const WAX_BODY = waxBlob(45.5, 42.5, 9137);
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
 * A die does not draw a line, it presses a groove. The light comes from the
 * upper left, so the wall of that groove which the light cannot reach is the
 * one on the UPPER-LEFT side of the mark and the wall it strikes is the one on
 * the LOWER-RIGHT side — a dark wall up-left, a lit wall down-right.
 *
 * This used to be the other way round (dark copy offset down-right, lit copy
 * up-left), which is the shading of a RAISED form, and on top of that both
 * copies were crisp: two hairlines 1.3 units apart with a translucent fill
 * between them. That is a drawn sketch of a leaf, and it is what made the two
 * front-face sprigs read as pencil.
 *
 * So: the walls are one group carrying `envRelief` (they are offset copies of
 * the same paths, softened until they stop reading as outlines), and the
 * recessed floor is the leaflets' own fill and nothing else — the stem is not
 * stroked there, because a stroke is a line.
 *
 * The two walls must not overlap, and that is a constraint on the numbers, not
 * a taste: as the lit copy is painted second it cancels the dark copy wherever
 * the two bands cross, and a first attempt at 2.5/1.9 units wide came out both
 * paler and mushier than the drawing it replaced. The bands are as wide as they
 * can be while the two half-widths together still fall short of the ~2 units
 * between the two centre-lines (1.75/2 + 1.2/2 = 1.48 < 2), so the shadow wall
 * keeps an uncancelled core; and they are blurred by more than their own width
 * so that at 1 device px per user unit the wall lands as about two soft pixels
 * of shading rather than one hard pixel of line. */
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
      <g filter="url(#envRelief)">
        <Sprig
          x={x - 0.95}
          y={y - 1.05}
          scale={scale}
          rotate={rotate}
          tone="rgba(34,22,6,0.78)"
          width={1.75 * weight}
        />
        <Sprig
          x={x + 1.05}
          y={y + 1.2}
          scale={scale}
          rotate={rotate}
          tone="rgba(255,254,250,0.95)"
          width={1.2 * weight}
        />
      </g>
      <Sprig
        x={x}
        y={y}
        scale={scale}
        rotate={rotate}
        tone="none"
        fill={metal ? 'url(#envMotifMetal)' : 'url(#envMotifSage)'}
      />
      {metal ? (
        <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
          {/* the gilded leaflet is the one thing on the motif that is metal, so
              it is the one thing that is opaque: a directional sheen, not a
              gold wash, and the foil runs out along the stem tip. */}
          <path d={FOIL_LEAF} fill="url(#envFoilSheen)" />
          <path
            d={FOIL_TIP}
            fill="none"
            stroke={accent}
            strokeOpacity="0.62"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
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
   *     continues under the flap, so the flap does drag it.
   *
   * One more thing rides on the same clock but is not a beat: the paper grain is
   * faded out and back in at the two ends of the animation (see the grain
   * effect), because a texture filter cannot be switched instantly without the
   * pocket face changing brightness in a single frame. */
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

  /* --- the paper grain cannot be painted while the flap turns ------------- *
   * An SVG filter inside a 3D-rotating subtree is re-executed on every raster,
   * which was the whole of this animation's excess frame time. The layers used
   * to be switched off by a class for the duration, which made the pocket face
   * step 8 luminance points brighter on the first frame of the click and 8-9
   * darker on the frame the envelope settled (measured, one frame wide, no
   * intermediate value). They are now faded over one `--duration-base`: the
   * grain is gone before the flap starts to turn (240 < flapD) and returns only
   * after the card has landed, so the layer is still out of the paint for the
   * whole expensive window — `visibility` takes it out once the fade is over.
   *
   * The overlays deliberately carry no `fill` (their filters generate their own
   * turbulence and never read SourceGraphic), so they must never be shown with
   * the filter removed: only `opacity` and `visibility` are touched, and both
   * are set back to exactly what the markup asked for. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const hide = isOpening && !reduced;
    const grain = stage.querySelectorAll("[filter*='envTooth'], [filter*='envFibre'], [filter*='envShade']");
    for (const el of grain) {
      el.style.transition = `opacity var(--duration-base) linear, visibility 0s linear ${
        hide ? 'var(--duration-base)' : '0s'
      }`;
      el.style.opacity = hide ? '0' : el.getAttribute('opacity') || '1';
      el.style.visibility = hide ? 'hidden' : 'visible';
    }
  }, [isOpening, reduced]);

  const handleMove = (event) => {
    if (reduced || opened || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    setTarget({ x: -ny * 6, y: nx * 8 });
  };

  const handleLeave = () => setTarget({ x: 0, y: 0 });

  const handleOpen = () => {
    /* The ref is both the handle and the latch. Without the latch a second
       click (or a held key repeating) inside the settle window registered a
       second settle timer; only the newest one is tracked, so the older one
       outlived the unmount and called `onOpen()` a second time. */
    if (opened || timerRef.current) return;
    setIsOpening(true);
    setTarget({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
    const settle = reduced ? 200 : gentle ? 1300 : 1240;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = 0;
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
  /* item 93 — the die is a fixed `monoLen` wide and the glyphs are fitted into
     it with `lengthAdjust="spacingAndGlyphs"`, so every glyph past the fourth is
     drawn narrower than its own shape: measured, eight Persian glyphs come out
     compressed 2.01x and `WWWWWWWW` 3.73x at 1440 (4.73x at 390). Clamping the
     size to the count keeps the glyphs in proportion. The die holds about four
     glyph-widths at the full size, so the size steps down past four and stays
     31px at and below it, where every realistic die is untouched: a single
     glyph, a four-glyph word, four digits, `A & S`. */
  const monoSize = glyphs <= 4 ? 31 : Math.round(((31 * 4.4) / glyphs) * 2) / 2;
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

            {/* ---- light and shade ---------------------------------------- *
                 `envFaceLight` is the local highlight the flap and the pocket
                 share. `envFaceWarm` is the sheet's MACRO ramp and is the only
                 gradient that spans the whole 580x400 sheet: without it a 520
                 px-wide face is one flat value plus grain, which is what makes
                 paper read as a plate.
                 Its axis runs from the sheet's top-left to its bottom-right
                 along the 45-degree "equal drop" direction for this 580x400
                 rectangle — at that angle a point halfway across the top and a
                 point halfway down the left fall on the same stop, so the ramp
                 is genuinely diagonal instead of being a vertical wash with a
                 horizontal wobble. It must stay userSpaceOnUse: an
                 objectBoundingBox axis on the pocket path is normalised to
                 that path's 560x248 box, which tilts the axis with the path's
                 aspect and is how the previous ladder of near-equal stops got
                 its mostly-vertical direction. Five stops, each at a different
                 value and a different slope, with the first two nearly flat, so
                 the ramp eases in from the lit corner instead of stepping. */}
            <radialGradient id="envFaceLight" cx="26%" cy="-8%" r="96%">
              <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.62" />
              <stop offset="52%" stopColor="#fffdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fffdf8" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient
              id="envFaceWarm"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="373.9"
              y2="542.2"
            >
              <stop offset="0%" stopColor="#4a381e" stopOpacity="0" />
              <stop offset="40%" stopColor="#4a381e" stopOpacity="0.005" />
              <stop offset="62%" stopColor="#44331a" stopOpacity="0.055" />
              <stop offset="84%" stopColor="#3f2f16" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#33240f" stopOpacity="0.225" />
            </linearGradient>

            {/* ---- the two side folds ------------------------------------- *
                 These two triangles are planes at an angle to the face, not
                 parts of it, so they must not share its value. Each keeps its
                 own shading — darkest along its folded edge, easing out toward
                 the envelope's rim, which is the direction its surface turns
                 away from the upper-left light — but both are now set a clear
                 step BELOW the pocket: the fold tucks under the front face and
                 catches less of the light, so the old pair of light stops
                 (white at 0.05 and 0.2) that made fold and pocket measure
                 within 2.7 units of each other are gone. The right fold is a
                 shade deeper than the left because it faces away from the
                 light, which is also what gives the two folds a difference
                 from each other and not just from the pocket.
                 Both axes run perpendicular to their fold's crease, so the
                 offset along the gradient is simply the distance out from the
                 folded edge; the visible triangle only reaches offset 0.40 of
                 the axis, so the stops end there instead of carrying an
                 unreachable tail. */}
            <linearGradient
              id="envSideL"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="-170"
              y2="272"
            >
              <stop offset="0%" stopColor="#3f2f16" stopOpacity="0.276" />
              <stop offset="10%" stopColor="#3f2f16" stopOpacity="0.139" />
              <stop offset="40%" stopColor="#3f2f16" stopOpacity="0.094" />
            </linearGradient>
            <linearGradient
              id="envSideR"
              gradientUnits="userSpaceOnUse"
              x1="580"
              y1="0"
              x2="750"
              y2="272"
            >
              <stop offset="0%" stopColor="#3f2f16" stopOpacity="0.315" />
              <stop offset="10%" stopColor="#3f2f16" stopOpacity="0.162" />
              <stop offset="40%" stopColor="#3f2f16" stopOpacity="0.117" />
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
                 gradient — but the WEAVE must not be a tiled pattern: the old
                 `envRib` was a 9x3.4 tile of ruled lines and read as repetitive
                 banding. Two non-repeating turbulences remain the right tool;
                 what follows fixes why the last pair of them rendered as a flat
                 sage sticker. The lit selvedge is NOT in this gradient: the
                 band's edges wander (the drape), so a gradient in the band's
                 bounding box would slide off the silhouette at the pinch. The
                 selvedges are strokes along the same edge paths the fill uses,
                 further down — they cannot drift. */}
            <linearGradient id="envRibbonForm" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="8%" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="34%" stopColor="#ffffff" stopOpacity="0.11" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="62%" stopColor="#10160d" stopOpacity="0.06" />
              <stop offset="78%" stopColor="#10160d" stopOpacity="0.14" />
              <stop offset="91%" stopColor="#10160d" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#141a10" stopOpacity="0.32" />
            </linearGradient>
            {/* THE WEAVE. Both earlier attempts failed from opposite ends. The
                 tiled pattern read as ribs; the single turbulence read as
                 NOTHING, because luminanceToAlpha leaves a fractal noise
                 centred near 0.5 and `slope 0.24 intercept -0.11` turns that
                 into a mean alpha of ~0.01 — a filter that renders, measures as
                 a flat fill, and is invisible at 1:1. (0.78 in user units was
                 also past Nyquist at 0.70 cycles/device px, so even that 0.01
                 was aliasing mush.)
                 So: the transfer is centred on the noise, and the SAME noise
                 drives both halves of the weave — the pixels that dip below it
                 go dark (the gaps between threads) and the pixels that rise
                 above it go light (threads catching the light). Two anti-
                 correlated streams out of one noise is what a woven surface
                 is. Their means are balanced against each other — the dark
                 flood is 0.06 luminance and the light one 0.96, so the light
                 stream carries ~0.67 of the dark stream's mean alpha — which is
                 what lets the weave add variance without moving the band's tone.
                 0.4/0.3 user units is 0.36/0.27 cycles per device px at 1440:
                 features at 2-4 px with the second octave at 1-2 px, which is
                 the scale a weave is visible at, and inside Nyquist on both
                 viewports. */}
            <filter id="envRibWeave" x="-8%" y="-3%" width="116%" height="106%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.4 0.3" numOctaves="2" seed="17" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="ga">
                <feFuncA type="linear" slope="0.42" intercept="-0.16" />
              </feComponentTransfer>
              <feFlood floodColor="#0d130b" result="gt" />
              <feComposite in="gt" in2="ga" operator="in" result="gaps" />
              <feComponentTransfer in="a" result="la">
                <feFuncA type="linear" slope="-0.4" intercept="0.235" />
              </feComponentTransfer>
              <feFlood floodColor="#f2f7ec" result="lt" />
              <feComposite in="lt" in2="la" operator="in" result="lit" />
              <feMerge result="tex">
                <feMergeNode in="gaps" />
                <feMergeNode in="lit" />
              </feMerge>
              {/* and the grain is clipped to the CLOTH. The alpha stream comes
                   from the noise, not from the source, so without this the weave
                   paints its speckle over the whole filter region — a 4 px
                   darker, grainy frame around the band on the paper, which is
                   invisible at the old filter's 0.01 mean alpha and obvious at
                   this one's. */}
              <feComposite in="tex" in2="SourceAlpha" operator="in" />
            </filter>
            {/* the nap: the same biphasic reading, but broad. A real ribbon at
                 fifty pixels across cannot show individual ribs — a resolvable
                 stripe pattern is what made the old band read as banding; what
                 sells cloth is that no part of it is evenly lit. The old nap was
                 a one-sided white wash at a mean alpha of 0.005: invisible AND a
                 brightener. This one dips and rises about the same mean over
                 patches 35-60 px across, which is the drape — the band's tone
                 wanders down its length instead of sitting on one value. */}
            <filter id="envRibNap" x="-10%" y="-4%" width="120%" height="108%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.055 0.026" numOctaves="3" seed="91" result="n" />
              <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
              <feComponentTransfer in="a" result="da">
                <feFuncA type="linear" slope="0.4" intercept="-0.11" />
              </feComponentTransfer>
              <feFlood floodColor="#0f150c" result="dt" />
              <feComposite in="dt" in2="da" operator="in" result="dip" />
              <feComponentTransfer in="a" result="ua">
                <feFuncA type="linear" slope="-0.34" intercept="0.23" />
              </feComponentTransfer>
              <feFlood floodColor="#ffffff" result="ut" />
              <feComposite in="ut" in2="ua" operator="in" result="rise" />
              <feMerge result="tex">
                <feMergeNode in="dip" />
                <feMergeNode in="rise" />
              </feMerge>
              {/* clipped to the cloth, for the reason above */}
              <feComposite in="tex" in2="SourceAlpha" operator="in" />
            </filter>
            {/* how the cloth drapes down the face of the envelope. In user
                 space, not in the band's box, so the stops land on the envelope
                 features the cloth is crossing: the flap's shadow at the top,
                 the crease the wax left, the swell just below it, and the fall
                 into the pocket's own shadow. That is what gives the band a
                 top-to-bottom tone instead of one even mid value. */}
            <linearGradient id="envRibbonFolds" gradientUnits="userSpaceOnUse" x1="0" y1="116" x2="0" y2="400">
              <stop offset="0%" stopColor="#0f150c" stopOpacity="0.32" />
              <stop offset="10%" stopColor="#0f150c" stopOpacity="0.12" />
              <stop offset="17%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="22%" stopColor="#0f150c" stopOpacity="0.1" />
              <stop offset="26%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="47%" stopColor="#0f150c" stopOpacity="0.01" />
              <stop offset="60%" stopColor="#0f150c" stopOpacity="0.06" />
              <stop offset="72%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="85%" stopColor="#0f150c" stopOpacity="0.09" />
              <stop offset="94%" stopColor="#0f150c" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#0f150c" stopOpacity="0.17" />
            </linearGradient>
            {/* a soft diagonal drape so the cloth is never evenly lit. The old
                 axis ran 116 -> 400, i.e. almost straight down, so the "lower
                 right" it darkened was the whole bottom of the band and the
                 cross-band half of it did nothing. The axis is squarer now
                 (250,250 -> 330,340) so the light really does fall from the
                 upper left and the shadowed turn really is the lower right. */}
            <linearGradient
              id="envRibbonDrape"
              gradientUnits="userSpaceOnUse"
              x1="258"
              y1="250"
              x2="330"
              y2="340"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.01" />
              <stop offset="55%" stopColor="#0f150c" stopOpacity="0.03" />
              <stop offset="80%" stopColor="#0f150c" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#0f150c" stopOpacity="0.12" />
            </linearGradient>
            {/* CONTACT. One feDropShadow at 2.2 blur is a uniform halo: it says
                 the band is floating 3 px off the paper all the way round. Two
                 lobes say what actually happens where a strip of cloth lies on a
                 sheet — a tight, dark line right at the selvedge where the two
                 surfaces touch, and a broad, faint spread under it where the
                 light is only partly blocked. The tight lobe is the one that
                 makes the right selvedge read as curled onto the paper rather
                 than as a drawn outline. */}
            <filter id="envRibbonDrop" x="-50%" y="-8%" width="200%" height="116%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="amb" />
              <feOffset in="amb" dx="2" dy="3.6" result="ambO" />
              <feFlood floodColor="#2b2212" floodOpacity="0.15" result="ambF" />
              <feComposite in="ambF" in2="ambO" operator="in" result="ambS" />
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="con" />
              <feOffset in="con" dx="1" dy="1.9" result="conO" />
              <feFlood floodColor="#2b2212" floodOpacity="0.42" result="conF" />
              <feComposite in="conF" in2="conO" operator="in" result="conS" />
              <feMerge>
                <feMergeNode in="ambS" />
                <feMergeNode in="conS" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* ---- bronze wax, pressed by hand ---------------------------- *
                 MATTE. There is no specular anywhere in this seal: the lightest
                 wax is a warm mid-tone that is already darker than the paper, and
                 it rolls off through eight close stops so the falloff is a
                 gradient rather than a hotspot with a hard edge. A near-white
                 stop at 0% over a fast falloff is precisely what made this read
                 as a glossy UI button instead of wax. The light still sits
                 off-centre (36/32), so the blob is never evenly lit. */}
            <radialGradient id="envWax" gradientUnits="userSpaceOnUse" cx="36" cy="32" r="78">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#b6a17c" />
                  <stop offset="14%" stopColor="#aa9570" />
                  <stop offset="30%" stopColor="#9a8260" />
                  <stop offset="46%" stopColor="#87704f" />
                  <stop offset="62%" stopColor="#73603f" />
                  <stop offset="78%" stopColor="#5d4c2f" />
                  <stop offset="90%" stopColor="#4a3b22" />
                  <stop offset="100%" stopColor="#382b17" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#a4b198" />
                  <stop offset="14%" stopColor="#98a68c" />
                  <stop offset="30%" stopColor="#8a9880" />
                  <stop offset="46%" stopColor="#7a886e" />
                  <stop offset="62%" stopColor="#68765c" />
                  <stop offset="78%" stopColor="#556249" />
                  <stop offset="90%" stopColor="#444f38" />
                  <stop offset="100%" stopColor="#333c29" />
                </>
              )}
            </radialGradient>
            {/* the thin outer margin of the pour, where the wax is only a skin:
                 the paper beneath reads faintly back through it, so the
                 silhouette dies in a soft translucent band rather than at a
                 painted edge. */}
            <radialGradient id="envWaxThin" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="50">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="72%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="90%" stopColor="#f2e9d6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e9dfc8" stopOpacity="0.24" />
            </radialGradient>
            {/* where the pour kissed the paper: a faint warm bleed just outside
                 the silhouette, on the paper side. It is blurred, so it reads as
                 a waxy glaze and never as a second ring drawn round the blob. */}
            <radialGradient id="envWaxBleed" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="50">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#6f5730" stopOpacity="0" />
                  <stop offset="70%" stopColor="#6f5730" stopOpacity="0" />
                  <stop offset="100%" stopColor="#6f5730" stopOpacity="0.34" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#4e5a43" stopOpacity="0" />
                  <stop offset="70%" stopColor="#4e5a43" stopOpacity="0" />
                  <stop offset="100%" stopColor="#4e5a43" stopOpacity="0.3" />
                </>
              )}
            </radialGradient>
            <filter id="envWaxBleedBlur" x="-32%" y="-32%" width="164%" height="164%">
              <feGaussianBlur stdDeviation="1.9" />
            </filter>
            {/* the cut lip. It is a gradient, not a flat hairline: only the part
                of the edge facing the light catches it, and only faintly now.
                A bright even line round the whole silhouette is the ring that
                makes a seal read as a drawn coin. */}
            <linearGradient id="envWaxLip" gradientUnits="userSpaceOnUse" x1="16" y1="10" x2="84" y2="92">
              <stop offset="0%" stopColor="#fdf3dd" stopOpacity="0.2" />
              <stop offset="26%" stopColor="#f2e0b8" stopOpacity="0.07" />
              <stop offset="52%" stopColor="#f2e0b8" stopOpacity="0" />
              <stop offset="100%" stopColor="#2a1b06" stopOpacity="0.22" />
            </linearGradient>
            {/* the one rounded rim, built as two ADJACENT slopes. Light from the
                upper left, so the rim's OUTER slope is lit at the upper left and
                its INNER slope is lit at the lower right — hence two gradients
                running opposite ways. They overlap, so they fuse into a single
                rounded ridge. A gap between them let the body gradient show
                through as a third visible concentric band, and a stack of visible
                concentric bands is the signature of a drawn button. */}
            <linearGradient id="envWaxCrestOut" gradientUnits="userSpaceOnUse" x1="18" y1="12" x2="84" y2="90">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#ddcaa2" stopOpacity="0.4" />
                  <stop offset="30%" stopColor="#c6b189" stopOpacity="0.18" />
                  <stop offset="58%" stopColor="#c6b189" stopOpacity="0" />
                  <stop offset="80%" stopColor="#2b1c05" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#1c1102" stopOpacity="0.52" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ccd5c4" stopOpacity="0.38" />
                  <stop offset="30%" stopColor="#bcc7b3" stopOpacity="0.17" />
                  <stop offset="58%" stopColor="#bcc7b3" stopOpacity="0" />
                  <stop offset="80%" stopColor="#222b1c" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#131a0e" stopOpacity="0.52" />
                </>
              )}
            </linearGradient>
            <linearGradient id="envWaxCrestIn" gradientUnits="userSpaceOnUse" x1="84" y1="90" x2="18" y2="12">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#e0cda3" stopOpacity="0.32" />
                  <stop offset="30%" stopColor="#c9b486" stopOpacity="0.14" />
                  <stop offset="58%" stopColor="#c9b486" stopOpacity="0" />
                  <stop offset="80%" stopColor="#241604" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#170d02" stopOpacity="0.48" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#c6cfbd" stopOpacity="0.3" />
                  <stop offset="30%" stopColor="#b2bea9" stopOpacity="0.13" />
                  <stop offset="58%" stopColor="#b2bea9" stopOpacity="0" />
                  <stop offset="80%" stopColor="#1a2115" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#0e1309" stopOpacity="0.48" />
                </>
              )}
            </linearGradient>
            {/* the dished field inside the rim: the same ramp one clear value
                down, so the rim reads as a ridge standing off a recess instead of
                a band lying on a disc. Its wall is ONE gradient stroke, not two
                offset solid rings — two rings are two visible concentric bands,
                while a single gradient stroke is a rounded shoulder that is dark
                on its upper-left and lit on its lower-right, which is how a
                recess actually takes the light. */}
            <radialGradient id="envWaxField" gradientUnits="userSpaceOnUse" cx="40" cy="37" r="50">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#98835f" />
                  <stop offset="16%" stopColor="#8a7452" />
                  <stop offset="34%" stopColor="#7a6545" />
                  <stop offset="52%" stopColor="#685438" />
                  <stop offset="70%" stopColor="#54422b" />
                  <stop offset="86%" stopColor="#41321e" />
                  <stop offset="100%" stopColor="#2e2211" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#8b987e" />
                  <stop offset="16%" stopColor="#7d8a71" />
                  <stop offset="34%" stopColor="#6e7b63" />
                  <stop offset="52%" stopColor="#5f6c54" />
                  <stop offset="70%" stopColor="#4f5a45" />
                  <stop offset="86%" stopColor="#3f4836" />
                  <stop offset="100%" stopColor="#2d3525" />
                </>
              )}
            </radialGradient>
            <linearGradient id="envWaxDieWall" gradientUnits="userSpaceOnUse" x1="20" y1="16" x2="80" y2="84">
              {metal ? (
                <>
                  <stop offset="0%" stopColor="#2c1d08" stopOpacity="0.3" />
                  <stop offset="42%" stopColor="#2c1d08" stopOpacity="0.1" />
                  <stop offset="58%" stopColor="#e8d6ac" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#f0e0ba" stopOpacity="0.3" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#161d11" stopOpacity="0.3" />
                  <stop offset="42%" stopColor="#161d11" stopOpacity="0.1" />
                  <stop offset="58%" stopColor="#dbe2d2" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#e6ecdd" stopOpacity="0.28" />
                </>
              )}
            </linearGradient>
            {/* an uneven contact shadow: one tight dark core plus a wider, softer
                spill, both down-and-right. A single even blur reads as a UI
                drop-shadow; two, of different size, read as wax sitting on paper
                and lifting along one edge. */}
            <filter id="envWaxShadow" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow dx="1.3" dy="2" stdDeviation="1.5" floodColor="#241a0c" floodOpacity="0.32" />
              <feDropShadow dx="2.6" dy="4.4" stdDeviation="4.8" floodColor="#2a1e0e" floodOpacity="0.2" />
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
            {/* how the cloth curls away over the bottom cut edge. Three things
                 in 14 units: the dip where the cloth leaves the face, the crease
                 where it turns, and then the lit top surface of the turn itself.
                 That last 1-2 px is the whole point — it is the band's visible
                 THICKNESS, and without it the cloth simply stopped in a clean
                 rectangle at the envelope's edge. */}
            <linearGradient id="envRibCurl" gradientUnits="userSpaceOnUse" x1="0" y1="386" x2="0" y2="400">
              <stop offset="0%" stopColor="#0f150c" stopOpacity="0" />
              <stop offset="40%" stopColor="#0f150c" stopOpacity="0.1" />
              <stop offset="62%" stopColor="#0f150c" stopOpacity="0.26" />
              <stop offset="78%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="90%" stopColor="#ffffff" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#f6f7f1" stopOpacity="0.34" />
            </linearGradient>
            <clipPath id="envRectClip">
              <rect x="0" y="0" width={W} height={H} />
            </clipPath>

            {/* ---- the embossed botanical --------------------------------- *
                 Three pieces of artwork the pressed motif needs and nothing
                 else does.

                 `envRelief` is one small gaussian, and it is the whole
                 difference between an emboss and an outline drawing: the two
                 walls of the groove are the same paths offset apart, and
                 without a blur they read as two drawn lines. It is NOT named
                 after envTooth/envFibre/envShade, because index.css drops
                 those for a frame while the envelope opens and this one is
                 artwork, not a texture. Kept cheap — the region is the
                 motif's own box, grown by a third. */}
            <filter
              id="envRelief"
              x="-33%"
              y="-33%"
              width="166%"
              height="166%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="0.85" />
            </filter>

            {/* the floor of each pressed leaflet, in the only two tones the
                 motif is allowed to carry: warm champagne when the occasion is
                 metallic, neutral sage when it is not (the memorial must never
                 resolve to gold). The ramp runs from the upper left, where the
                 die bites deepest, to the lower right, where the floor turns
                 back toward the light. */}
            <linearGradient id="envMotifMetal" x1="0.08" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#4a381e" stopOpacity="0.17" />
              <stop offset="58%" stopColor="#6b5636" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fffdf6" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="envMotifSage" x1="0.08" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#2f3a2e" stopOpacity="0.17" />
              <stop offset="58%" stopColor="#465143" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fbfdf8" stopOpacity="0.08" />
            </linearGradient>

            {/* stamped foil is a metal, so it is never a flat fill: the gilding
                 runs dark where the leaf turns away from the light, bright
                 where it turns into it, and back down at the far edge. The
                 stops are in stop-color/stop-opacity, the local SVG
                 convention, so no hex reaches a className. */}
            <linearGradient id="envFoilSheen" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#6a5123" stopOpacity="0.78" />
              <stop offset="18%" stopColor="#b1955e" stopOpacity="0.82" />
              <stop offset="38%" stopColor="#ddc596" stopOpacity="0.86" />
              <stop offset="62%" stopColor="#9c7d44" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#55400f" stopOpacity="0.76" />
            </linearGradient>
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
            /* the paper grain is faded rather than switched, and under reduced
               motion it never moves at all: see the grain effect above */
            className="absolute inset-0"
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
                    /* The pointer's tilt is written frame by frame by the rAF
                       loop above, so it must carry no transition while it is
                       tracking. The open stops that loop and clears the tilt in
                       the same commit; without a transition the paper snapped
                       4.6deg flat in one frame. It is exactly the wax releasing
                       the sheet at that instant, so the leftover tilt eases out
                       over one beat instead — and the transition is only there
                       once `opened`, so closing restores the instant response. */
                    transition:
                      opened && !reduced ? 'transform var(--duration-base) var(--ease-ui-out)' : undefined,
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
                      {/* 10, not -26: at -26 the stem's top 22 units were above
                          the svg viewport, and an SVG root clips to its
                          viewport, so the motif was pressed into nothing.
                          Measured: -21.76 units outside before, +11.6 after. */}
                      <Embossed x={245} y={10} scale={0.9} opacity={0.42} metal={metal} accent={accent} />
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
                      {/* 7, not -5: the gilded tip sat 1.3 units above the
                          viewBox, i.e. outside the sheet. */}
                      <Embossed x={9} y={7} scale={0.82} opacity={0.7} metal={metal} accent={accent} />
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

                    {/* the creases: each side fold's folded edge. The core sits
                        on the fold side of the crease line, so its old 2-unit
                        band ran from 2.6 to 4.6 units out, and the old
                        1.1-unit crest was drawn at 4.3 — inside that band —
                        so bright and dark cancelled and the fold read as a
                        line on paper. A crease is the dip plus the lit crest
                        on the lip just past it, so the core is now 2.6 wide
                        (band 2.3..4.9) and the crest a heavier 1.5 at 0.5
                        moved 3.2 units further out, so its inner edge clears
                        the core. Both strokes stay unfiltered: the blur that
                        would soften them would also run on every frame of the
                        open animation, which this region pays for. */}
                    <path d={CREASE_LEFT} fill="none" stroke="#3f2f16" strokeOpacity="0.24" strokeWidth="2.6" />
                    <path d={CREASE_RIGHT} fill="none" stroke="#3f2f16" strokeOpacity="0.24" strokeWidth="2.6" />
                    <path d={CREASE_LEFT} transform="translate(-1.7 2.7)" fill="none" stroke="#fffdf7" strokeOpacity="0.5" strokeWidth="1.5" />
                    <path d={CREASE_RIGHT} transform="translate(1.7 2.7)" fill="none" stroke="#fffdf7" strokeOpacity="0.5" strokeWidth="1.5" />

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
                        they no longer reach the panel's edges.
                        The right-hand one is inset to x-57 (was x-42): its
                        measured ink box was tangent to the pocket's tapered
                        right edge (-0.04 units; its leaves crossed onto the
                        back panel), and a stamped mark that runs off the sheet
                        is not a stamped mark. Now +9.7 units. */}
                    <Embossed x={32} y={232} scale={0.67} rotate={-20} opacity={0.66} weight={1.4} metal={metal} accent={accent} />
                    <Embossed
                      x={W - 57}
                      y={258}
                      scale={0.56}
                      rotate={11}
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
                        <path d={RIBBON_PATH} filter="url(#envRibNap)" />
                        <path d={RIBBON_PATH} fill="url(#envRibbonDrape)" />
                        <path d={RIBBON_PATH} fill="url(#envRibbonFolds)" />
                        {/* the wrinkles where the cloth crosses the fold and the
                            crease. Every one of them is inset from BOTH
                            selvedges at its own row (the edges are 45.6 to 51.6
                            units apart down the band, so a fixed x range cannot
                            be right at all of them) — the old strokes ran
                            256 -> 322, i.e. up to 6 units of wet line straight
                            out over the paper on each side, which is what made
                            the cloth look like a stripe with rules drawn across
                            it rather than a band lying on a folded sheet. */}
                        <path d="M 268.6 155.5 C 278 158.5 300 157.5 310.6 153.5" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2.2" />
                        <path d="M 268.6 160.5 C 278 163.5 300 162.5 310.6 158.5" fill="none" stroke="#0f150c" strokeOpacity="0.13" strokeWidth="2.2" />
                        <path d="M 268.6 191 C 278 195.5 299 194.5 310.7 190" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.7" />
                        <path d="M 268.6 196 C 278 200.5 299 199.5 310.7 195" fill="none" stroke="#0f150c" strokeOpacity="0.14" strokeWidth="2.4" />
                        <path d="M 267.7 331 C 277 334.5 302 334 312.4 330" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.6" />
                        <path d="M 267.7 336 C 277 339.5 302 339 312.4 335" fill="none" stroke="#0f150c" strokeOpacity="0.14" strokeWidth="2.4" />
                        {/* the band is trapped between the flap and the fold, so
                            where the wax pressed it there is a compression crease.
                            It stays after the seal goes, which is what keeps the
                            cloth looking attached rather than printed. */}
                        <path d="M 269.4 175.5 C 280 179 299 178.5 309.8 173" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
                        <path d="M 269.4 181 C 280 184.5 299 184 309.8 178.5" fill="none" stroke="#0f150c" strokeOpacity="0.28" strokeWidth="3.2" />
                        {/* THE SELVEDGES. The two long edges have to differ, and
                            they have to differ as GRADIENTS: one hairline on the
                            silhouette is a 1 px step, which is what made the band
                            read as a sticker with an outline. So each selvedge is
                            a stack of strokes along the SAME edge path the fill
                            uses, all aligned on the silhouette and stepping
                            inward — the left ones light (the cloth catches it,
                            ramping from 0.36 alpha at the edge to nothing 3 units
                            in), the right ones dark (the cloth's own thickness
                            curling away, 0.42 alpha at the edge, gone 5 units in).
                            Because they share the edge path and are offset in x
                            only — perpendicular, since the band runs down the
                            page — a ramp can never slide off the silhouette at
                            the pinch the way a bounding-box gradient would. The
                            weak wide dark on the left is the cloth's own contact
                            with the paper on the lit side, where the drop
                            shadow's offset (right and down) cannot reach. */}
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#0f150c" strokeOpacity="0.07" strokeWidth="4.5" transform="translate(-2.2 0)" />
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="3" transform="translate(1.5 0)" />
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2" transform="translate(1 0)" />
                        <path d={RIBBON_LEFT_EDGE} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.2" transform="translate(0.6 0)" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#0b1008" strokeOpacity="0.12" strokeWidth="5" transform="translate(-2.5 0)" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#0b1008" strokeOpacity="0.14" strokeWidth="3" transform="translate(-1.5 0)" />
                        <path d={RIBBON_RIGHT_EDGE} fill="none" stroke="#0b1008" strokeOpacity="0.16" strokeWidth="1.6" transform="translate(-0.8 0)" />
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
                        {/* On the reverse the motif hangs from the hinge, so it is
                            turned through 180. At y=30 that put all but the
                            bottom 27 units ABOVE the viewBox — measured: the ink
                            box left the flap by 88.19 units, i.e. 88% of the
                            motif was clipped away. y=130, scale 0.6 seats the
                            whole mark inside the flap's V with 38 units to the
                            hinge and 25 to the nearest cut edge. */}
                        <Embossed x={290} y={130} scale={0.6} rotate={180} opacity={0.42} metal={metal} accent={accent} />
                        <path d={FLAP_PATH} fill="none" stroke="#4a381e" strokeOpacity="0.22" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>

                  {/* 5.5 — a soft halo under the seal, so the wax reads as the
                        thing to touch. The glow drifts on the site's one existing
                        idle animation (`float-soft`, the same motion the hero's
                        seal already uses) — no new keyframe — and the whole cue
                        is removed under reduced motion, so a reduce user sees
                        nothing at all. `-inset-1/4` makes the bloom wider than
                        the seal; only the halo animates, never the seal. */}
                  {!opened && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute aspect-square w-[10.5%] min-w-[35px] max-w-[58px] motion-reduce:hidden"
                      style={{
                        left: '50%',
                        top: `${((FLAP_TIP / H) * 100).toFixed(2)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span
                        className="absolute -inset-1/4 animate-float-soft rounded-full"
                        style={{
                          background: `radial-gradient(closest-side, color-mix(in srgb, ${accent} 32%, transparent), transparent 72%)`,
                        }}
                      />
                    </span>
                  )}

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
                      {/* the paper-side bleed: a faint waxy kiss just outside the
                             silhouette, blurred so it is a glaze over the paper and
                             never a second drawn ring. It lies under the shadow. */}
                      <path
                        d={WAX_BODY}
                        fill="none"
                        stroke="url(#envWaxBleed)"
                        strokeWidth="5.4"
                        transform={WAX_RING(1.055)}
                        filter="url(#envWaxBleedBlur)"
                      />
                      <g filter="url(#envWaxShadow)">
                        {/* 1 · the body of the pour — matte, no specular */}
                        <path d={WAX_BODY} fill="url(#envWax)" />
                        {/* 2 · the thin outer margin, where wax is only a skin and
                               the paper beneath reads faintly back through it */}
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxThin)"
                          strokeWidth="4.6"
                        />
                        {/* 3 · the faint cut lip, on the lit side only */}
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxLip)"
                          strokeWidth="1.3"
                          transform="translate(-0.9 -1.2)"
                        />
                        {/* 4 · the one rounded rim, built as two slopes rather than
                               as a stack of rings. A ridge is lit on its OUTER slope
                               where that slope faces the light (the upper left) and on
                               its INNER slope where that one does (the lower right);
                               the two bands overlap, so they fuse into a single
                               rounded ridge. A gap between them would let the body
                               gradient show through as a third concentric band — the
                               visible banding of a drawn button. */}
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxCrestOut)"
                          strokeWidth="7"
                          transform={WAX_RING(0.94)}
                        />
                        <path
                          d={WAX_BODY}
                          fill="none"
                          stroke="url(#envWaxCrestIn)"
                          strokeWidth="7"
                          transform={WAX_RING(0.885)}
                        />
                        {/* 5 · the dished field of the die — a recess, not a dome,
                               so it is lit on its LOWER-RIGHT wall and dark on the
                               upper-left. One gradient wall, not two offset rings, so
                               the recess has a rounded shoulder and no banding. */}
                        <g transform={WAX_RING(0.8)}>
                          <path d={WAX_BODY} fill="url(#envWaxField)" />
                          <path
                            d={WAX_BODY}
                            fill="none"
                            stroke="url(#envWaxDieWall)"
                            strokeWidth="3.4"
                          />
                        </g>
                        {/* 6 · one leaflet each side, pressed into the wax under
                               the die, so the seal carries the envelope's own motif */}
                        {[[17, 64, -104], [83, 62, 104]].map(([x, y, r]) => (
                          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(0.8) rotate(${r})`}>
                            <g transform="translate(1.1 1.1)" opacity="0.28">
                              <path d={LEAF_PATHS[0]} fill="none" stroke="#2a1a02" strokeWidth="2" strokeLinecap="round" />
                            </g>
                            <g opacity="0.2">
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
                            fontSize: `${monoSize}px`,
                            fontWeight: 600,
                            direction: latin ? 'ltr' : 'rtl',
                          }}
                        >
                          {/* the two relief copies are what makes the mark read as
                             PRESSED: the light one sits down-and-right of the
                             groove, the dark one up-and-left. Both are a touch
                             stronger than before, because the glyph body below is
                             now a warm wax tone rather than an opaque near-black
                             plate — the depth comes from the offsets, not from the
                             body being printed on. */}
                          <text
                            x="51.5"
                            y="51.5"
                            textLength={monoLen + 0.8}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#fff3d8' : '#e8ede4'}
                            fillOpacity={metal ? 0.5 : 0.44}
                          >
                            {sealText}
                          </text>
                          <text
                            x="48.5"
                            y="48.5"
                            textLength={monoLen + 0.8}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#2a1a06' : '#161d11'}
                            fillOpacity="0.44"
                          >
                            {sealText}
                          </text>
                          <text
                            x="50"
                            y="50"
                            textLength={monoLen}
                            lengthAdjust="spacingAndGlyphs"
                            fill={metal ? '#3a2709' : '#1f2817'}
                            fillOpacity={metal ? 0.86 : 0.88}
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
                              strokeOpacity="0.44"
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
                              strokeOpacity="0.4"
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
                              stroke={metal ? '#3a2709' : '#1f2817'}
                              strokeOpacity="0.78"
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
      {/* item 92 — the status line used to fade at the *click* (`opened` is
          `isOpening || isOpen`), so its own `openingHint` branch was dead: the
          visible paragraph was killed on the frame it would have switched to
          "opening...", and the settled state had no text at all — only the
          `sr-only` live region spoke. It now fades as the card settles, keyed to
          `isOpen`, and carries the same three states the live region does, so
          the seen and the announced line finally agree. The geometry is the
          paragraph it always was: opacity only, one line at every width. */}
      <p
        aria-hidden="true"
        className="mt-6 text-center text-xs font-medium"
        style={{
          color: onDark ? 'rgba(245,240,230,0.62)' : 'var(--color-ink-subtle)',
          opacity: isOpen ? 0 : 1,
          transition: reduced ? 'opacity 150ms linear' : 'opacity 220ms linear',
        }}
      >
        {isOpen ? openedHint : isOpening ? openingHint : hint}
      </p>

      {isOpen && <div className="w-full animate-reveal-up">{children}</div>}

      <p className="sr-only" aria-live="polite">
        {isOpening ? openingHint : isOpen ? openedHint : ''}
      </p>
    </div>
  );
}

