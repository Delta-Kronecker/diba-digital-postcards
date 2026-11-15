import dimensions from '../data/image-dimensions.json';

/**
 * Intrinsic `width`/`height` for an image under public/images, read from the
 * generated manifest (npm run images). Spread it onto <Picture>:
 *
 *   <Picture src={cover} {...imageSize(cover)} />
 *
 * The numbers are the file's real pixel size, never the size of the frame it
 * is displayed in — object-cover crops, it does not change the file. Returning
 * an empty object for an unknown file is deliberate: a wrong ratio is worse
 * than a missing one.
 */
export function imageSize(src) {
  const file = String(src).split('/').pop()?.split('?')[0];
  const size = dimensions[file];
  return size ? { width: size.width, height: size.height } : {};
}