/**
 * News content. Published articles come from Supabase (written in the BGS
 * Dashboard ▸ Website). If Supabase isn't configured or can't be reached, the
 * 15 articles bundled in src/content/news are used instead, so the site never
 * shows an empty newsroom.
 */
import { Marked, type Tokens } from 'marked';

export const CATEGORIES = ['Announcements', 'Speeches', 'Insights', 'Summit News'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Article = {
  slug: string;
  title: string;
  date: Date;
  category: Category;
  excerpt: string;
  cover: string | null;
  coverAlt: string;
  author: string | null;
  /** Markdown. Empty in listings (only loaded for the article page). */
  body: string;
};

const SUPABASE_URL = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const cmsConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/* ------------------------------------------------------------------ */
/*  Bundled fallback                                                    */
/* ------------------------------------------------------------------ */

const files = import.meta.glob('../content/news/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parseBundled(raw: string): Article {
  const [, fm, ...rest] = raw.split(/^---$/m);
  const meta: Record<string, string> = {};
  for (const line of fm.trim().split('\n')) {
    const i = line.indexOf(':');
    meta[line.slice(0, i).trim()] = JSON.parse(line.slice(i + 1).trim());
  }
  return {
    slug: meta.slug,
    title: meta.title,
    date: new Date(meta.date.includes('T') ? meta.date : `${meta.date}T09:00:00Z`),
    category: meta.category as Category,
    excerpt: meta.excerpt ?? '',
    cover: meta.cover ?? null,
    coverAlt: meta.coverAlt ?? '',
    author: meta.author ?? null,
    body: rest.join('---').trim(),
  };
}

const bundled: Article[] = Object.values(files)
  .map(parseBundled)
  .sort((a, b) => b.date.getTime() - a.date.getTime());

/* ------------------------------------------------------------------ */
/*  Supabase                                                            */
/* ------------------------------------------------------------------ */

type Row = {
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  body?: string;
  cover_url: string | null;
  cover_alt: string;
  author: string | null;
  published_at: string;
};

const LIST_COLUMNS = 'slug,title,category,excerpt,cover_url,cover_alt,author,published_at';

async function rest<T>(path: string): Promise<T | null> {
  if (!cmsConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const fromRow = (r: Row): Article => ({
  slug: r.slug,
  title: r.title,
  date: new Date(r.published_at),
  category: r.category,
  excerpt: r.excerpt ?? '',
  cover: r.cover_url,
  coverAlt: r.cover_alt ?? '',
  author: r.author,
  body: r.body ?? '',
});

/** Published articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const rows = await rest<Row[]>(
    `website_articles?select=${LIST_COLUMNS}&status=eq.published&order=published_at.desc,created_at.desc`,
  );
  return rows ? rows.map(fromRow) : bundled.map((a) => ({ ...a, body: '' }));
}

/** One published article with its body, or null. */
export async function getArticle(slug: string): Promise<Article | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const rows = await rest<Row[]>(`website_articles?select=${LIST_COLUMNS},body&status=eq.published&slug=eq.${slug}&limit=1`);
  if (rows) return rows[0] ? fromRow(rows[0]) : null;
  return bundled.find((a) => a.slug === slug) ?? null;
}

export type GalleryPhoto = { src: string; width: number | null; height: number | null; caption: string };

/** Photos uploaded from the dashboard for one edition (shown after the bundled ones). */
export async function getUploadedPhotos(album: string): Promise<GalleryPhoto[]> {
  const rows = await rest<{ image_url: string; width: number | null; height: number | null; caption: string }[]>(
    `website_gallery_photos?select=image_url,width,height,caption&album=eq.${encodeURIComponent(album)}&is_published=eq.true&order=sort_order.asc,created_at.asc`,
  );
  return (rows ?? []).map((r) => ({ src: r.image_url, width: r.width, height: r.height, caption: r.caption }));
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');

/** WordPress-style permalink: /YYYY/MM/DD/slug/ (Accra time is UTC). */
export function articleUrl(a: Pick<Article, 'slug' | 'date'>) {
  const d = a.date;
  return `/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${a.slug}/`;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readingTime(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230));
}

const SIZES = [320, 480, 640, 800, 1200, 1600, 2000] as const;
const onVercel = import.meta.env.PROD && typeof process !== 'undefined' && !!process.env.VERCEL;

/** An optimised URL for any image (bundled path or Supabase URL) at about `width` px. */
export function imageUrl(src: string, width: number) {
  if (!onVercel || src.endsWith('.svg')) return src;
  const w = SIZES.find((s) => s >= width) ?? 2000;
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=78`;
}

export function imageSrcset(src: string, widths: number[]) {
  if (!onVercel) return undefined;
  return widths.map((w) => `${imageUrl(src, w)} ${SIZES.find((s) => s >= w) ?? 2000}w`).join(', ');
}

/* Markdown → HTML. Raw HTML in the body is shown as text, never executed. */
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeHref = (href: string) => (/^(https?:|mailto:|tel:|\/|#)/i.test(href.trim()) ? href : '#');

const md = new Marked({ gfm: true });
md.use({
  walkTokens(token) {
    if (token.type === 'link' || token.type === 'image') {
      (token as Tokens.Link).href = safeHref((token as Tokens.Link).href);
    }
  },
  renderer: {
    html(token) {
      return escapeHtml(token.text);
    },
    image({ href, title, text }) {
      const t = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(imageUrl(href, 1200))}" alt="${escapeHtml(text)}"${t} loading="lazy" decoding="async">`;
    },
  },
});

export function renderMarkdown(body: string) {
  return md.parse(body, { async: false }) as string;
}

export function categoryOf(value: string | null): Category | null {
  return (CATEGORIES as readonly string[]).includes(value ?? '') ? (value as Category) : null;
}
