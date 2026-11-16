import type { APIRoute } from 'astro';
import { getArticles, articleUrl } from '../lib/cms';

// RSS at /feed/, the address WordPress used (newsletter tools and readers may poll it).
export const prerender = false;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getArticles()).slice(0, 30);
  const base = site!.href.replace(/\/$/, '');
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}${articleUrl(p)}</link>
      <guid isPermaLink="true">${base}${articleUrl(p)}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Boardroom Governance Summit</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed/" rel="self" type="application/rss+xml" />
    <description>News, speeches and insights from the Boardroom Governance Summit.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
    },
  });
};
