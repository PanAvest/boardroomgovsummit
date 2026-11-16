import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// News articles are not a build-time collection: they're read at request time
// from Supabase (with src/content/news as the fallback). See src/lib/cms.ts.

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({ title: z.string() }),
});

export const collections = { legal };
