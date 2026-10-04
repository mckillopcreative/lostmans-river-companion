// Sketch, art, photo and cover assets, resolved for Astro's image pipeline.
// Originals stay in /assets untouched; Astro derives web sizes at build (CLAUDE.md).
//
// Drop-in art contract (docs/VISUAL-BRIEF.md): any file at
//   assets/art/<folder>/<id>.(png|webp|jpg)
// is picked up automatically wherever that entity is shown. Folders: fish, crew,
// critters, boats, tackle, places, chapters (ch-01 … ch-23), emblems.
import type { ImageMetadata } from 'astro';

type Mods = Record<string, { default: ImageMetadata }>;
const sketchModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/sketches/*.png', { eager: true });
const photoModules = import.meta.glob<{ default: ImageMetadata }>('/assets/photos/*.{jpg,jpeg,png}', { eager: true });
const coverModules = import.meta.glob<{ default: ImageMetadata }>('/assets/cover/*.{jpg,jpeg,png}', { eager: true });
const artModules = import.meta.glob<{ default: ImageMetadata }>('/assets/art/*/*.{png,webp,jpg,jpeg}', { eager: true });

const byName = (mods: Mods) => new Map(Object.entries(mods).map(([path, m]) => [path.split('/').pop()!, m.default]));

export const sketchImages = byName(sketchModules);
export const photoImages = byName(photoModules);
export const coverImages = byName(coverModules);

/** art keyed by "<folder>/<id>" (extension stripped) */
export const artImages = new Map(
  Object.entries(artModules).map(([path, m]) => {
    const parts = path.split('/');
    const folder = parts[parts.length - 2]!;
    const id = parts[parts.length - 1]!.replace(/\.[a-z0-9]+$/i, '');
    return [`${folder}/${id}`, m.default];
  }),
);

export function sketchImage(file: string | null | undefined): ImageMetadata | null {
  if (!file) return null;
  return sketchImages.get(file) ?? null;
}

export function artImage(folder: string, id: string): ImageMetadata | null {
  return artImages.get(`${folder}/${id}`) ?? null;
}

/** Best cover available: prefers a full-size file over the thumbnail. */
export function coverImage(): ImageMetadata | null {
  const full = [...coverImages.entries()].find(([n]) => !/thumb/i.test(n));
  return full?.[1] ?? coverImages.get('cover-thumbnail.png') ?? null;
}

export const sectionFolder: Record<string, string> = {
  fish: 'fish',
  crew: 'crew',
  critters: 'critters',
  boats: 'boats',
  gear: 'tackle',
  places: 'places',
};
