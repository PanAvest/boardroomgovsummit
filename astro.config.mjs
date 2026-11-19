// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { readFileSync } from 'node:fs';

/** BGS 2026 photos, listed as images of /2026-gallery/ in the sitemap (most sit behind "Show more"). */
const gallery2026 = JSON.parse(readFileSync(new URL('./src/data/gallery-2026.json', import.meta.url), 'utf8'));

/**
 * Every address the old WordPress site used still answers.
 * Pages and posts keep their exact paths (they are real pages in src/pages);
 * WordPress-only machinery (shop, archives, feeds) is redirected here.
 * /wp-content/uploads/… is served as-is from public/wp-content/uploads.
 */
const legacy = {
  // WooCommerce / Eventin ticketing (registration is now "register interest")
  '/cart': '/registration/',
  '/checkout': '/registration/',
  '/my-account': '/registration/',
  '/tickets-checkout': '/registration/',
  '/product/boardroom-governance-summit-regular-ticket': '/tickets/',
  '/etn-tags': '/',
  '/etn_category': '/',
  // WordPress archives
  '/blog': '/news/',
  '/uncategorized': '/news/',
  '/category/news': '/news/',
  '/category/uncategorized': '/news/',
  '/author/nananvame': '/news/',
  '/author/boardroom': '/news/',
  '/2024/09': '/news/',
  '/2024/10': '/news/',
  '/2025/07': '/news/',
  '/2025/09': '/news/',
  '/2025/10': '/news/',
  '/2026/07': '/news/',
  '/2026/09': '/news/',
  '/2026/10': '/news/',
  '/2026/11': '/news/',
  '/comments/feed': '/feed/',
  // Email and hosting logins used to live on the main domain (cPanel hosting)
  '/webmail': 'https://webmail.boardroomgovsummit.com/',
  '/cpanel': 'https://cpanel.boardroomgovsummit.com/',
  // Short addresses
  '/faqs': '/frequently-asked-questions-faqs/',
  '/summit-2027': '/registration/',
  '/certificate': '/certificates/',
  '/verify': '/certificates/',
  '/verify-certificate': '/certificates/',
  '/certificate-verification': '/certificates/',
};

export default defineConfig({
  site: 'https://boardroomgovsummit.com',
  trailingSlash: 'ignore',
  // Pages are static by default; news pages opt in to on-demand rendering so
  // articles published from the dashboard appear without a rebuild.
  adapter: vercel({
    // Use Vercel's image optimiser everywhere, so images on live (on-demand)
    // pages work the same as on static ones.
    imageService: true,
    imagesConfig: {
      sizes: [96, 180, 240, 320, 400, 480, 640, 800, 1000, 1200, 1400, 1600, 2000],
      domains: [],
      remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
    },
  }),
  integrations: [
    sitemap({
      // Rendered on demand, so not discovered at build time.
      customPages: ['https://boardroomgovsummit.com/certificates/'],
      filter: (page) => !Object.keys(legacy).some((p) => page.endsWith(p + '/')),
      serialize: (item) =>
        item.url === 'https://boardroomgovsummit.com/2026-gallery/'
          ? /** @type {import('@astrojs/sitemap').SitemapItem} */ ({
              ...item,
              img: gallery2026.map((/** @type {{ name: string }} */ p) => ({ url: `https://boardroomgovsummit.com/gallery/2026/full/${p.name}.webp` })),
            })
          : item,
    }),
  ],
  redirects: legacy,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  image: {
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
