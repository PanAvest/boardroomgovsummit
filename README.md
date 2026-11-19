# Boardroom Governance Summit website

The rebuilt boardroomgovsummit.com, built with [Astro](https://astro.build) and deployed on Vercel. News articles and extra gallery photos are managed from the **BGS Dashboard** (Website section) and read live from the dashboard's Supabase database.

## Run it

```bash
npm install            # first time only
cp .env.example .env   # optional: add the Supabase URL + anon key to read live articles
npm run dev            # http://localhost:4321
npm run build          # production build (Vercel output in .vercel/output)
```

Needs Node 20.3 or newer. Without Supabase settings the site uses the 15 articles bundled in `src/content/news/`, so it always works offline.

## How it fits together

```
BGS Dashboard (Next.js, Vercel) ──writes──▶ Supabase ◀──reads (anon, RLS)── Website (Astro, Vercel)
  Website ▸ Articles / Gallery              website_articles                 /news/, /YYYY/MM/DD/slug/,
                                            website_gallery_photos           /feed/, home + convener news,
                                            storage: assets/website/…        gallery extras
```

- **Static pages** (most of the site) are built once and served from the CDN.
- **Live pages** are rendered on request and cached for 60 seconds, so a published article appears within about a minute with no rebuild. These are `/news/`, every article, `/feed/`, `/news-sitemap.xml`, the "latest news" blocks on the homepage and the Convener page, and the 404 page.
- **Gallery photos uploaded in the dashboard** are added in the browser, after the photos that ship with the site.

### Supabase (shared with the dashboard)

Two migrations live in the **dashboard** repo:

- `supabase/migrations/20261116000001_website.sql`: the `website_articles` and `website_gallery_photos` tables, plus row-level security. The public can read only published content. Contributors write drafts, and managers publish and delete.
- `supabase/migrations/20261116000002_website_articles_seed.sql`: the 15 articles from the old WordPress site, with their original slugs and dates.

Apply them from the dashboard folder with `npm run db:push`, or paste them into the Supabase SQL editor in order. Until they're applied, the website falls back to its bundled articles.

## Environment variables (Vercel ▸ Project ▸ Settings ▸ Environment Variables)

| Variable | Notes |
|---|---|
| `PUBLIC_SUPABASE_URL` | Same project as the dashboard (Supabase ▸ Project Settings ▸ API). |
| `PUBLIC_SUPABASE_ANON_KEY` | The anon/publishable key. It's public by design, because RLS limits it to published content. |
| `PUBLIC_DASHBOARD_URL` | Optional. Shows a "Team login" link in the footer. |

In the dashboard, set `NEXT_PUBLIC_WEBSITE_URL=https://boardroomgovsummit.com` so its "View on website" links and image previews point here.

## Old URLs (newsletters, social posts, search results)

Every address the WordPress site used still works:

- **Pages** keep their exact paths: `/about/`, `/agenda/`, `/the-convener/`, `/partners/`, `/sponsorship/`, `/registration/`, `/tickets/`, `/books/`, `/contact/`, `/past-speakers/`, `/news/`, `/frequently-asked-questions-faqs/`, the three policy pages, `/main-gallery/` (gallery hub), `/gallery/` (2024, as before) and `/2025-gallery/`. The new `/2026-gallery/` is added alongside them.
- **All 15 articles** keep their WordPress permalinks, including `/2026/11/13/elementor-21099/`, `/2026/11/13/elementor-21059/` and `/2026/09/22/elementor-20998/`.
- **Every file under `/wp-content/uploads/…`** is served unchanged from `public/wp-content/uploads/`. That covers newsletter images, logos and `/wp-content/uploads/2025/10/BGS-BROCHURE.pdf`.
- **WordPress machinery** redirects with a 301: shop pages (`/cart/`, `/checkout/`, `/my-account/`, `/tickets-checkout/`, the ticket product page), archives (`/blog/`, `/category/…`, `/author/…`, `/2026/11/` and the other month archives), `/comments/feed/`, `/etn-tags/` and `/etn_category/`. The redirects are configured in `astro.config.mjs`.
- **RSS** is still at `/feed/`.

## Moving the domain to Vercel

1. Push this folder to a Git repository and import it in Vercel (framework: Astro). Add the environment variables above.
2. Check the deployment on its `*.vercel.app` address: open a few old newsletter links against it.
3. Vercel ▸ Project ▸ Domains: add `boardroomgovsummit.com` and `www.boardroomgovsummit.com`, then create the DNS records Vercel shows you at your domain registrar.
4. **Email warning.** Change only the website records (the `@` A record and the `www` CNAME). Leave the **MX**, SPF/DKIM and other mail records exactly as they are, or `info@boardroomgovsummit.com` will stop receiving mail. If you switch nameservers to Vercel instead, copy every existing mail record across first.
5. If you host the dashboard on a subdomain (e.g. `dashboard.boardroomgovsummit.com`), add it to the dashboard's own Vercel project the same way.

## Where things live

| What | Where |
|---|---|
| Contact details, socials, form endpoint | `src/data/config.ts` |
| Navigation, editions, 2024–25 speakers, partners, books, sponsorship, FAQs | `src/data/site.ts` |
| BGS 2026 people (photos + bios), panels, programme | `src/data/bgs2026.json`, `src/data/bgs2026.ts` (from the official brochure) |
| 2026 partner and media logos | `src/data/partners2026.json`, `src/assets/images/partners/2026/` |
| Articles (fallback copy) | `src/content/news/` |
| News data layer (Supabase + fallback) | `src/lib/cms.ts` |
| 2026 gallery (498 photos, pre-sized) | `public/gallery/2026/{thumb,full}/`, list in `src/data/gallery-2026.json` |
| People named in 2026 photos (alt text, JSON-LD, file metadata) | `src/data/gallery-2026-tags.json`, `src/data/people.json`, `src/lib/people.ts` |
| 2024 and 2025 galleries | `src/assets/images/events/2024`, `…/2025` (optimised at build) |
| Brochures | `public/files/` (2026), and the originals under `public/wp-content/uploads/` |
| Old WordPress uploads | `public/wp-content/uploads/` (do not rename; newsletters link here) |

### Common edits

- **Publish an article:** open Dashboard ▸ Website ▸ Articles. It appears on the site within a minute. Contributors can save drafts; managers publish.
- **Add photos to a gallery:** open Dashboard ▸ Website ▸ Gallery, then choose the year and upload. They appear at the end of that year's gallery.
- **Name someone in a 2026 photo:** add the photo to `src/data/gallery-2026-tags.json` (and the person to `src/data/people.json`), then run `node scripts/tag-gallery-photos.mjs` to write the names into the image files. Nothing is shown on the page; the name goes into the alt text and the page's structured data.
- **Announce BGS 2027:** update `nextEdition` in `src/data/site.ts` and add a 2027 entry to `editions`. Then update the text in `src/components/AnnouncementBar.astro` and change its `KEY` there, so the bar reappears for people who dismissed it.
- **Forms:** these open the visitor's email app by default. Paste a Formspree, Web3Forms or Basin endpoint into `formEndpoint` in `src/data/config.ts` to collect submissions directly.

## Reference material (not part of the build, ignored by git)

- `_original/`: full capture of the old WordPress site
- `_inspiration/`: captures of boardroom-governance.com/summit-2026 and alpha.ac
