import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { GalleryItem } from '../components/EditionGallery.astro';
import manifest2026 from '../data/gallery-2026.json';

const events = import.meta.glob<{ default: ImageMetadata }>('../assets/images/events/*/*.{jpg,jpeg,png}', { eager: true });
const num = (p: string) => Number(p.match(/-(\d+)(?:-of|\.)/)?.[1] ?? 0);

/** 2024 and 2025 photos ship in src/assets and are optimised at build time. */
export async function editionItems(year: '2024' | '2025'): Promise<GalleryItem[]> {
  const entries = Object.entries(events)
    .filter(([p]) => p.includes(`/events/${year}/`))
    .sort(([a], [b]) => num(a) - num(b));
  return Promise.all(
    entries.map(async ([, mod], i) => {
      const img = mod.default;
      const [thumb, full] = await Promise.all([
        getImage({ src: img, width: 720, format: 'webp', quality: 72 }),
        getImage({ src: img, width: 1800, format: 'webp', quality: 78 }),
      ]);
      const h = Math.round((img.height / img.width) * 720);
      return { thumb: thumb.src, full: full.src, w: 720, h, alt: `BGS ${year} photo ${i + 1}` };
    }),
  );
}

/** 2026 photos were pre-sized into public/gallery/2026 (497 files; too many to process on every build). */
export function items2026(): GalleryItem[] {
  return manifest2026.map((p, i) => ({
    thumb: `/gallery/2026/thumb/${p.name}.webp`,
    full: `/gallery/2026/full/${p.name}.webp`,
    w: p.tw,
    h: p.th,
    alt: `BGS 2026 photo ${i + 1}`,
  }));
}
