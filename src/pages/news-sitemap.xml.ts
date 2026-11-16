import type { APIRoute } from 'astro';
import { getArticles, articleUrl } from '../lib/cms';

// Articles are rendered on request, so they get their own live sitemap.
export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const urls = (await getArticles())
    .map((p) => `  <url><loc>${base}${articleUrl(p)}</loc><lastmod>${p.date.toISOString()}</lastmod></url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/news/</loc></url>\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=600' } },
  );
};
