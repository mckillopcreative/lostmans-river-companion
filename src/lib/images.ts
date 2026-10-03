// Sketch and photo assets, resolved for Astro's image pipeline.
// Originals stay in /assets untouched; Astro derives web sizes at build (CLAUDE.md).
import type { ImageMetadata } from 'astro';

const sketchModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/sketches/*.png', { eager: true });
const photoModules = import.meta.glob<{ default: ImageMetadata }>('/assets/photos/*.{jpg,jpeg,png}', { eager: true });

const byName = (mods: Record<string, { default: ImageMetadata }>) =>
  new Map(Object.entries(mods).map(([path, m]) => [path.split('/').pop()!, m.default]));

export const sketchImages = byName(sketchModules);
export const photoImages = byName(photoModules);

export function sketchImage(file: string | null | undefined): ImageMetadata | null {
  if (!file) return null;
  return sketchImages.get(file) ?? null;
}
