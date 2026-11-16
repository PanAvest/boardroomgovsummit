/**
 * BGS 2026, as published in the official brochure (12 Nov 2026 version).
 * Source: BGS Brochure 2026/source/render/data.json and build.mjs.
 */
import type { ImageMetadata } from 'astro';
import raw from './bgs2026.json';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/images/people/2026/*.png', { eager: true });

export type Person2026 = { key: string; name: string; role: string; bio: string; image?: ImageMetadata };

export const people: Record<string, Person2026> = Object.fromEntries(
  Object.entries(raw.people).map(([key, p]) => [
    key,
    { key, ...p, image: photos[`../assets/images/people/2026/${key}.png`]?.default },
  ]),
);

const get = (key: string) => {
  const p = people[key];
  if (!p) throw new Error(`Unknown BGS 2026 person: ${key}`);
  return p;
};

export const event2026 = raw.event;
export const chairman = get(raw.chair);
export const convener = get('boateng');
export const afternoonChair = get(raw.afternoonChair);
export const guestsOfHonour = raw.guests.map(get);

export type Panel2026 = {
  n: number;
  title: string;
  kicker: string;
  perspective: string;
  intro: string;
  colors: string[];
  moderator: Person2026;
  panelists: Person2026[];
  questions: string[];
};

export const panels: Panel2026[] = raw.panels.map((p) => ({
  n: p.n,
  title: p.title,
  kicker: p.kicker,
  perspective: p.perspective,
  intro: p.intro,
  colors: p.colors as string[],
  moderator: get(p.moderator),
  panelists: p.panelists.map(get),
  questions: p.questions,
}));

/** Programme of the day. Unconfirmed speaker placeholders from the brochure are dropped. */
export const programme2026 = raw.programme.map((r) => ({
  time: r.time,
  title: r.title,
  detail: /to be announced/i.test(r.detail) ? '' : r.detail,
  kind: /^Panel/.test(r.title) ? 'Panel' : /Keynote/.test(r.title) ? 'Keynote' : /Lunch/.test(r.title) ? 'Break' : undefined,
}));

/** "9:00" / "14:15" → "9.00 am" / "2.15 pm" */
export const ampm = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${h > 12 ? h - 12 : h}.${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
};
