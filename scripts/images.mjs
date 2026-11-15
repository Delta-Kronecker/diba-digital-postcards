/**
 * Reads the real pixel size of every image in public/images, writes resized
 * variants for the responsive srcset, and records both in
 * src/data/image-dimensions.json. Nobody types a width by hand.
 *
 *   node scripts/images.mjs           # measure + (re)generate variants + write manifest
 *   node scripts/images.mjs --check   # fail if the manifest is stale or a variant file is missing
 *   node scripts/images.mjs --measure # measure only; needs no image encoder
 *
 * Dimension reading has no dependencies: it parses the JPEG SOF marker and the
 * WebP chunk header directly. Only the variant step needs an encoder (sharp).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'public/images');
const OUT = join(ROOT, 'src/data/image-dimensions.json');

/** Rungs of the responsive ladder. The largest rung is always the file itself. */
const RUNGS = [480, 960];
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 80;

function jpegSize(buf) {
  let i = 2; // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error('malformed JPEG');
    const marker = buf[i + 1];
    // SOF0..SOF15 carry the frame size; C4/D8/CC are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('no SOF marker');
}

function webpSize(buf) {
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  if (chunk === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`unsupported WebP chunk ${chunk}`);
}

const sizeOf = (file) => {
  const buf = readFileSync(join(DIR, file));
  return /\.jpe?g$/i.test(file) ? jpegSize(buf) : webpSize(buf);
};

const base = (file) => file.replace(/\.jpe?g$/i, '');
/** Never upscale: a rung only exists if the file is at least that wide. */
const rungsFor = (width) => [...new Set([...RUNGS, width].filter((w) => w <= width))].sort((a, b) => a - b);

const isCheck = process.argv.includes('--check');
const measureOnly = process.argv.includes('--measure') || isCheck;

const files = readdirSync(DIR).sort();
const jpgs = files.filter((f) => /\.jpe?g$/i.test(f) && !/-\d+\.jpe?g$/i.test(f));
const manifest = {};
const jobs = [];

for (const file of jpgs) {
  const size = sizeOf(file);
  if (!size.width || !size.height) throw new Error(`${file}: unreadable dimensions`);
  const twin = `${base(file)}.webp`;
  if (files.includes(twin)) {
    const alt = sizeOf(twin);
    if (alt.width !== size.width || alt.height !== size.height) {
      throw new Error(`${file}: jpg is ${size.width}x${size.height} but ${twin} is ${alt.width}x${alt.height}`);
    }
  }
  const sources = rungsFor(size.width).map((width) => {
    const full = width === size.width;
    const stem = full ? base(file) : `${base(file)}-${width}`;
    const source = { width, webp: `images/${stem}.webp`, jpg: `images/${stem}.jpg` };
    if (!full) jobs.push({ file, width, source });
    return source;
  });
  manifest[file] = { width: size.width, height: size.height, sources };
}

const json = `${JSON.stringify(manifest, null, 2)}\n`;

if (isCheck) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* missing counts as stale */ }
  const missing = [];
  for (const entry of Object.values(manifest)) {
    for (const s of entry.sources) for (const p of [s.webp, s.jpg]) {
      if (!existsSync(join(ROOT, 'public', p))) missing.push(p);
    }
  }
  if (current !== json) { console.error('manifest is stale — run `npm run images`'); process.exit(1); }
  if (missing.length) { console.error(`missing variant files:\n  ${missing.join('\n  ')}`); process.exit(1); }
  console.log(`image manifest is current (${jpgs.length} images, ${jpgs.reduce((n, f) => n + manifest[f].sources.length, 0)} sources, all files present)`);
  process.exit(0);
}

writeFileSync(OUT, json);

if (jobs.length && !measureOnly) {
  const { default: sharp } = await import('sharp');
  mkdirSync(DIR, { recursive: true });
  let before = 0, after = 0;
  for (const { file, width, source } of jobs) {
    const src = join(DIR, file);
    before += statSync(src).size;
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(join(ROOT, 'public', source.webp));
    await sharp(src).resize({ width, withoutEnlargement: true }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(join(ROOT, 'public', source.jpg));
    after += statSync(join(ROOT, 'public', source.webp)).size;
    console.log(`  ${source.webp}  ${(statSync(join(ROOT, 'public', source.webp)).size / 1024).toFixed(0)} KB`);
  }
  console.log(`generated ${jobs.length * 2} variant files from ${jobs.length} sources`);
} else if (jobs.length) {
  console.log(`manifest written; ${jobs.length * 2} variants NOT generated (--measure)`);
}
console.log(`wrote ${OUT} (${jpgs.length} images)`);
