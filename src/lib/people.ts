/**
 * People in the site's structured data (JSON-LD). Nothing here is shown on the page: names reach
 * search engines through JSON-LD, photo alt text and the photos' own XMP metadata
 * (scripts/tag-gallery-photos.mjs). Keep every statement true; Kennedy's BGS 2026 role is from
 * his LinkedIn posts below.
 *
 * - Kennedy Abubakar (built this site): a full Person node on every page (BaseLayout).
 * - Jerry Ofori: only on /2026-gallery/, attached to his photos.
 *
 * Who is in which photo: src/data/gallery-2026-tags.json.
 */
import people from '../data/people.json';
import tags from '../data/gallery-2026-tags.json';
import manifest2026 from '../data/gallery-2026.json';
import { site, contact } from '../data/config';

export type PersonKey = keyof typeof people;

const SITE = site.url;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const EVENT_2026_ID = `${SITE}/summit-2026/#event`;
const GALLERY_2026 = `${SITE}/2026-gallery/`;

const ref = (key: PersonKey) => ({ '@type': 'Person', '@id': people[key].id, name: people[key].name });

const linkedinPost = (activity: string, headline: string, datePublished: string) => ({
  '@type': 'SocialMediaPosting',
  '@id': `https://www.linkedin.com/feed/update/urn:li:activity:${activity}/`,
  url: `https://www.linkedin.com/feed/update/urn:li:activity:${activity}/`,
  headline,
  datePublished,
  author: ref('kennedy'),
});

const posts = {
  bgsWrap: {
    ...linkedinPost('7526995049004412929', "That's a wrap on the Boardroom Governance Summit 2026", '2026-11-13T13:11:04Z'),
    about: { '@id': EVENT_2026_ID },
  },
  career: {
    ...linkedinPost('7528472686348533760', "How far I've come", '2026-11-17T15:02:40Z'),
    mentions: { '@id': EVENT_2026_ID },
  },
  hayame: linkedinPost('7526993711726161921', 'A promise made, a promise kept.', '2026-11-13T13:05:45Z'),
};

/** Site-wide: the person who designed and built boardroomgovsummit.com. */
export const kennedySchema = {
  '@type': 'Person',
  '@id': people.kennedy.id,
  name: people.kennedy.name,
  alternateName: people.kennedy.alternateName,
  url: people.kennedy.url,
  jobTitle: 'Senior Associate Software Engineer',
  worksFor: { '@type': 'Organization', name: site.organiser, url: 'https://www.panavest.com/' },
  description:
    'Full-stack developer and founder in Accra. Designed and built boardroomgovsummit.com and led the creative and digital side of the Boardroom Governance Summit 2026.',
  knowsAbout: ['Full-stack web development', 'Mobile app development', 'UI/UX design', 'Brand and event identity design', 'Digital strategy'],
  sameAs: people.kennedy.sameAs,
  subjectOf: [posts.career, posts.bgsWrap],
};

/** BGS 2026 as an event: on /summit-2026/ and /2026-gallery/. */
export const event2026Schema = {
  '@type': 'Event',
  '@id': EVENT_2026_ID,
  name: 'Boardroom Governance Summit 2026',
  alternateName: 'BGS 2026',
  description: "The Boardroom Governance Summit 2026, under the theme 'Board Committees: From Oversight to Impact'.",
  url: `${SITE}/summit-2026/`,
  startDate: '2026-11-12',
  endDate: '2026-11-12',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: contact.venue,
    address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
  },
  organizer: { '@type': 'Organization', '@id': ORG_ID, name: site.name, url: SITE },
  contributor: ref('kennedy'),
  subjectOf: posts.bgsWrap,
};

/** Extra things a photo is about, beyond the people in it. */
const photoAbout: Record<string, object[]> = {
  // The Hayame stand is in the shot (Kennedy founded Hayame).
  'img-0649': [
    {
      '@type': 'Organization',
      '@id': `${GALLERY_2026}#hayame`,
      name: 'Hayame',
      description: "Ghana's car-sharing marketplace",
      url: 'https://www.hayamegh.com/',
      founder: ref('kennedy'),
      subjectOf: posts.hayame,
    },
  ],
};

/** /2026-gallery/: the gallery, the event, and the photos that name someone. */
export function gallery2026Schema() {
  const named = new Set<PersonKey>();
  const images = Object.entries(tags).flatMap(([name, tag]) => {
    const photo = manifest2026.find((p) => p.name === name);
    if (!photo) return [];
    const who = tag.people as PersonKey[];
    who.forEach((k) => named.add(k));
    return [
      {
        '@type': 'ImageObject',
        contentUrl: `${SITE}/gallery/2026/full/${name}.webp`,
        thumbnailUrl: `${SITE}/gallery/2026/thumb/${name}.webp`,
        width: photo.w,
        height: photo.h,
        caption: tag.alt,
        about: [...who.map(ref), ...(photoAbout[name] ?? [])],
        dateCreated: '2026-11-12',
        contentLocation: { '@type': 'Place', name: `${contact.venue}, Accra` },
        creditText: site.name,
      },
    ];
  });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery',
        '@id': `${GALLERY_2026}#gallery`,
        url: GALLERY_2026,
        name: 'BGS 2026 Gallery',
        about: { '@id': EVENT_2026_ID },
        isPartOf: { '@id': WEBSITE_ID },
        image: images,
      },
      event2026Schema,
      // Kennedy's full node is already on every page (BaseLayout); the others are defined here.
      ...[...named]
        .filter((k) => k !== 'kennedy')
        .map((k) => ({ '@type': 'Person', '@id': people[k].id, name: people[k].name, url: people[k].url, sameAs: people[k].sameAs })),
    ],
  };
}

/** Alt text for 2026 photos that name someone. */
export const alt2026: Record<string, string> = Object.fromEntries(Object.entries(tags).map(([name, t]) => [name, t.alt]));
