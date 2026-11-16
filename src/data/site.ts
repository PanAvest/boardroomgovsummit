import type { ImageMetadata } from 'astro';

/* ------------------------------------------------------------------ */
/*  Site-wide settings                                                 */
/* ------------------------------------------------------------------ */

export { site, contact, socials } from './config';
import { contact } from './config';

/* ------------------------------------------------------------------ */
/*  The next edition                                                   */
/* ------------------------------------------------------------------ */

export const nextEdition = {
  year: 2027,
  status: 'Dates and theme to be announced',
  ctaLabel: 'Register interest for BGS 2027',
  ctaShort: 'BGS 2027 · Register interest',
  href: '/registration/',
};

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

export type NavItem = { label: string; href: string; children?: { label: string; href: string; note?: string }[] };

export const nav: NavItem[] = [
  {
    label: 'About',
    href: '/about/',
    children: [
      { label: 'About the Summit', href: '/about/', note: 'Purpose, audience and approach' },
      { label: 'The Convener', href: '/the-convener/', note: 'Ing. Prof. Douglas Boateng' },
      { label: 'FAQs', href: '/frequently-asked-questions-faqs/', note: 'Straight answers, before you commit' },
    ],
  },
  { label: 'BGS 2026', href: '/summit-2026/' },
  {
    label: 'Programme',
    href: '/agenda/',
    children: [
      { label: 'Programme', href: '/agenda/', note: 'How a summit day runs' },
      { label: 'Past Speakers', href: '/past-speakers/', note: 'Keynotes and panellists since 2024' },
    ],
  },
  {
    label: 'Partners',
    href: '/partners/',
    children: [
      { label: 'Our Partners', href: '/partners/', note: 'Collaborators, associates and sponsors' },
      { label: 'Sponsorship', href: '/sponsorship/', note: 'Packages and benefits' },
    ],
  },
  {
    label: 'Media',
    href: '/news/',
    children: [
      { label: 'News & Insights', href: '/news/', note: 'Announcements, speeches and op-eds' },
      { label: 'Gallery', href: '/main-gallery/', note: 'Pictures from every edition' },
      { label: 'Books', href: '/books/', note: 'Knowledge Development Series' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
];

export const footerNav = [
  {
    title: 'Summit',
    links: [
      { label: 'About the Summit', href: '/about/' },
      { label: 'BGS 2026 recap', href: '/summit-2026/' },
      { label: 'Programme', href: '/agenda/' },
      { label: 'Past Speakers', href: '/past-speakers/' },
      { label: 'Register interest', href: '/registration/' },
    ],
  },
  {
    title: 'Media',
    links: [
      { label: 'News & Insights', href: '/news/' },
      { label: 'Gallery', href: '/main-gallery/' },
      { label: 'Books', href: '/books/' },
      { label: 'BGS 2026 brochure (PDF)', href: '/files/bgs-2026-brochure.pdf' },
      { label: 'RSS feed', href: '/feed/' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'The Convener', href: '/the-convener/' },
      { label: 'Partners', href: '/partners/' },
      { label: 'Sponsorship', href: '/sponsorship/' },
      { label: 'FAQs', href: '/frequently-asked-questions-faqs/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Editions                                                           */
/* ------------------------------------------------------------------ */

import img2024 from '../assets/images/events/2024/bgs-2024-269.jpg';
import img2025 from '../assets/images/events/2025/bgs-2025-1-of-7.jpg';
import img2026 from '../assets/images/events/2026/bgs-2026-group-photo.jpg';

export type Edition = {
  year: number;
  label: string;
  date: string;
  theme: string;
  keynote: string;
  attendance: string;
  summary: string;
  image: ImageMetadata;
  links: { label: string; href: string }[];
};

export const editions: Edition[] = [
  {
    year: 2026,
    label: 'Third edition',
    date: '12 November 2026',
    theme: 'Board Committees: From Oversight to Impact',
    keynote: 'Chaired by H.E. Dr. Ekwow Spio-Garbrah',
    attendance: 'In person in Accra and online',
    summary:
      'The first African platform of this scale to examine the strategic importance of board committees: audit, risk, remuneration, nominations, finance and ESG.',
    image: img2026,
    links: [
      { label: 'Read the recap', href: '/summit-2026/' },
      { label: 'Photos', href: '/2026-gallery/' },
    ],
  },
  {
    year: 2025,
    label: 'Second edition',
    date: '14 October 2025',
    theme: 'Daring to be Different: The Role of the Chairperson in Effective Boardroom Governance',
    keynote: 'Keynote by Hon. Julius Debrah, Chief of Staff',
    attendance: '800+ participants',
    summary:
      'A full day on chairpersonship: its evolving responsibilities, ethical standards and influence on strategic board decisions, plus the role of the board secretary.',
    image: img2025,
    links: [
      { label: 'Programme', href: '/agenda/' },
      { label: 'Photos', href: '/2025-gallery/' },
    ],
  },
  {
    year: 2024,
    label: 'Inaugural edition',
    date: '8 October 2024',
    theme: 'Boardroom Governance, Accountability and Long-term Sustainable Development: The Inextricable Links',
    keynote: 'Keynote by Dr Mohammed Amin Adam, then Minister for Finance',
    attendance: '700+ C-suite executives',
    summary:
      'The maiden edition, organised with the Ministry of Finance, SIGA and the Institute of Directors Ghana, and the launch of Practical Perspectives on Boardroom Governance.',
    image: img2024,
    links: [
      { label: 'Coverage', href: '/2024/10/11/boardroom-governance-summit-sets-benchmark-for-accountability-sustainable-growth/' },
      { label: 'Photos', href: '/gallery/' },
    ],
  },
];

export const stats = [
  { value: '3', label: 'Editions since 2024' },
  { value: '1,000+', label: 'Boardroom leaders in the room each year' },
  { value: 'CPD', label: 'Accredited certificate of attendance' },
  { value: '1 day', label: 'Keynote, three panels and open Q&A' },
];

/* ------------------------------------------------------------------ */
/*  Speakers                                                           */
/* ------------------------------------------------------------------ */

import juliusDebrah from '../assets/images/people/julius-debrah.jpg';
import andani from '../assets/images/people/2026/andani.png';
import asareYeboah from '../assets/images/people/2026/asareyeboah.png';
import miezan from '../assets/images/people/2025/miezan.png';

export type Speaker = {
  name: string;
  role: string;
  badge?: string;
  edition: number;
  image?: ImageMetadata;
  tone: 'navy' | 'red' | 'gold' | 'ink';
  bio?: string;
};

export const speakers: Speaker[] = [
  { edition: 2025, name: 'Hon. Julius Debrah', role: 'Chief of Staff, Office of the President of Ghana', badge: 'Keynote', tone: 'red', image: juliusDebrah },
  { edition: 2025, name: 'Chief Alhassan Andani', role: 'Founder and Executive Chairman, LVS Africa; former CEO, Stanbic Bank Ghana', tone: 'navy', image: andani },
  { edition: 2025, name: 'Alex Apau Dadey', role: 'Executive Chairman, KGL Group', tone: 'gold' },
  { edition: 2025, name: 'Stephane Abass Miezan', role: 'President, Ghana National Chamber of Commerce and Industry', tone: 'ink', image: miezan },
  { edition: 2025, name: 'Mrs. Mary Asare-Yeboah, FIoD', role: 'President, Institute of Directors Ghana', tone: 'navy', image: asareYeboah },
  { edition: 2025, name: 'Dr. Awuraa Abenaa Safo-Boakye', role: 'Chief Legal Officer and Board Secretary, Bank of Ghana', tone: 'red' },
  { edition: 2025, name: 'Prof. Kofi Abotsi', role: 'Dean, UPSA Law School', tone: 'gold' },
  { edition: 2025, name: 'Prof. Albert Puni', role: 'Dean, Distance Learning, UPSA', tone: 'ink' },
  { edition: 2025, name: 'Akosua Apea Osafo', role: 'Partner, JLD Legal Consultancy', tone: 'navy' },
  { edition: 2024, name: 'Dr. Mohammed Amin Adam', role: 'Minister for Finance (2024)', badge: 'Keynote', tone: 'red' },
];

export const speakers2024Roles = [
  'Acting Director-General, State Interests and Governance Authority (SIGA)',
  'President, Institute of Directors Ghana',
  'Executive Chairman, McDan Group',
  'President, Ghana Bar Association',
  'Managing Director, Asante Gold Corporation',
  'Dean, UPSA Law School',
];

/* ------------------------------------------------------------------ */
/*  Partners                                                           */
/* ------------------------------------------------------------------ */

const partnerImages = import.meta.glob<{ default: ImageMetadata }>('../assets/images/partners/*', { eager: true });
const logo = (file: string) => {
  const hit = Object.entries(partnerImages).find(([p]) => p.endsWith('/' + file));
  if (!hit) throw new Error(`Missing partner logo: ${file}`);
  return hit[1].default;
};

export type Partner = { name: string; logo: ImageMetadata; group: string };

import partners2026Raw from './partners2026.json';
const logos2026 = import.meta.glob<{ default: ImageMetadata }>('../assets/images/partners/2026/*', { eager: true });
const logo2026 = (file: string) => logos2026[`../assets/images/partners/2026/${file}`].default;

/** BGS 2026 stakeholders, collaborators and media partners, as printed in the 2026 brochure. */
export const partners2026: Partner[] = partners2026Raw
  .filter((p) => p.group === 'stakeholder')
  .map((p) => ({ name: p.name, logo: logo2026(p.file), group: 'BGS 2026 stakeholders, collaborators & partners' }));
export const mediaPartners2026: Partner[] = partners2026Raw
  .filter((p) => p.group === 'media')
  .map((p) => ({ name: p.name, logo: logo2026(p.file), group: 'Media partners' }));

export const partnerGroups = [
  'Organiser & venue',
  'Government & public institutions',
  'Professional bodies',
  'Industry',
] as const;

export const partners: Partner[] = [
  { group: 'Organiser & venue', name: 'PanAvest International & Partners', logo: logo('panavest.png') },
  { group: 'Organiser & venue', name: 'Labadi Beach Hotel', logo: logo('labadi-beach-hotel.png') },
  { group: 'Government & public institutions', name: 'The Presidency, Republic of Ghana', logo: logo('the-presidency.jpg') },
  { group: 'Government & public institutions', name: 'Office of the President: Chief of Staff', logo: logo('office-of-the-chief-of-staff.png') },
  { group: 'Government & public institutions', name: 'Parliament of Ghana', logo: logo('parliament-of-ghana.jpg') },
  { group: 'Government & public institutions', name: 'Ministry of Energy and Green Transition', logo: logo('ministry-of-energy.jpg') },
  { group: 'Government & public institutions', name: 'Ministry of Trade, Agribusiness and Industry', logo: logo('ministry-of-trade.png') },
  { group: 'Government & public institutions', name: 'National Development Planning Commission', logo: logo('ndpc.jpg') },
  { group: 'Government & public institutions', name: 'Bank of Ghana', logo: logo('bank-of-ghana.jpg') },
  { group: 'Government & public institutions', name: 'Ghana Investment Promotion Centre', logo: logo('gipc.jpg') },
  { group: 'Government & public institutions', name: 'Ghana Investment Fund for Electronic Communications', logo: logo('gifec.jpg') },
  { group: 'Government & public institutions', name: 'SSNIT', logo: logo('ssnit.jpg') },
  { group: 'Government & public institutions', name: 'African Peer Review Mechanism', logo: logo('aprm.jpg') },
  { group: 'Professional bodies', name: 'Institute of Directors Ghana', logo: logo('iod-ghana.jpg') },
  { group: 'Professional bodies', name: 'Chartered Governance Institute', logo: logo('chartered-governance-institute.jpg') },
  { group: 'Professional bodies', name: 'Chartered Institute of Procurement & Supply', logo: logo('cips.jpg') },
  { group: 'Professional bodies', name: 'Chartered Institute of Logistics and Transport', logo: logo('cilt.jpg') },
  { group: 'Professional bodies', name: 'Chartered Institute of Marketing Ghana', logo: logo('cimg.jpg') },
  { group: 'Professional bodies', name: 'Ghana Institution of Engineering', logo: logo('ghie.jpg') },
  { group: 'Professional bodies', name: 'Ghana Institution of Surveyors', logo: logo('ghis.jpg') },
  { group: 'Professional bodies', name: 'Ghana Institute of Planning', logo: logo('ghana-institute-of-planning.jpg') },
  { group: 'Professional bodies', name: 'Ghana Institute of Freight Forwarders', logo: logo('giff.jpg') },
  { group: 'Industry', name: 'Association of Ghana Industries', logo: logo('agi.jpg') },
  { group: 'Industry', name: 'Ghana Chamber of Mines', logo: logo('ghana-chamber-of-mines.jpg') },
  { group: 'Industry', name: 'Ghana Chamber of Construction Industry', logo: logo('ghana-chamber-of-construction.jpg') },
  { group: 'Industry', name: 'Ghana Chamber of Bulk Oil Distributors', logo: logo('cbod.jpg') },
  { group: 'Industry', name: 'GOIL', logo: logo('goil.jpg') },
  { group: 'Industry', name: 'Verve Energy Resources', logo: logo('verve-energy.jpg') },
];

export const endorsements = [
  'Ghana Bar Association',
  'Institute of Chartered Accountants Ghana',
  'Ghana Institute of Procurement and Supply',
  'Institute of Directors Ghana',
  'The Presidency',
  'Council of State',
  'The Judiciary',
  'Parliament of Ghana',
];

/* ------------------------------------------------------------------ */
/*  Books                                                              */
/* ------------------------------------------------------------------ */

import bookSSI from '../assets/images/books/strategic-sourcing-and-industrialisation.png';
import bookBG from '../assets/images/books/boardroom-governance.png';
import bookISS from '../assets/images/books/insights-into-strategic-sourcing.png';
import bookNeg from '../assets/images/books/negotiations.png';
import bookSCM from '../assets/images/books/supply-chain-management-terms.png';
import bookSDG from '../assets/images/books/sustainable-development-goals.png';

const AMAZON_SSI =
  'https://www.amazon.com/Practical-Perspectives-STRATEGIC-SOURCING-INDUSTRIALISATION-ebook/dp/B0FN4NNW3Q';
const AMAZON_KINDLE = 'https://www.amazon.com/dp/B0FN4X79D5';

export const books = [
  { series: 'Knowledge Development Series', title: 'Practical Perspectives on Boardroom Governance', cover: bookBG, href: AMAZON_KINDLE, note: 'Launched at BGS 2024' },
  { series: 'Knowledge Development Series', title: 'Practical Perspectives on Strategic Sourcing and Industrialisation', cover: bookSSI, href: AMAZON_SSI },
  { series: 'Knowledge Development Series', title: 'Practical Perspectives on Negotiations', cover: bookNeg, href: AMAZON_SSI },
  { series: 'Knowledge Development Series', title: 'Practical Perspectives on Sustainable Development Goals', cover: bookSDG, href: AMAZON_KINDLE },
  { series: 'Executive Insight Series', title: 'Insights into Strategic Sourcing', cover: bookISS, href: AMAZON_KINDLE },
  { series: 'Executive Insight Series', title: 'Compendium of Supply Chain Management Terms', cover: bookSCM, href: AMAZON_KINDLE },
];

/* ------------------------------------------------------------------ */
/*  Sponsorship                                                        */
/* ------------------------------------------------------------------ */

export const sponsorshipTiers = [
  {
    name: 'Platinum',
    price: 'GHS 600,000',
    accent: '#E9873A',
    headline: 'Strategic Partner status and the most visible seat in the room.',
    benefits: [
      '100-book donation package under the African Conscientisation Library Project',
      'Complimentary Boardroom Governance Masterclass for the Supervisory Board or Executive Leadership',
      'Complimentary thesis supervision and mentoring for one Director or Executive Management member by Prof. Douglas Boateng',
      'Unlimited Executive Delegate passes to the Summit',
      'Access for 7 Executive Delegates to selected KDS Governance & Leadership Courses',
      '15% discount on additional governance certification and executive development programmes',
      'Top-tier logo placement across all Summit branding and marketing materials',
      'Premium exhibition space at a prime Summit location',
      'Branded executive lounge and networking area',
      'Opportunity to address delegates during selected Summit sessions',
      'Participation in high-level governance panels and executive dialogues',
      'Contribution to Summit publications and governance reports',
      'Exclusive executive networking with government officials, CEOs, board chairs, regulators, diplomats and institutional leaders',
      'Recognition as a Strategic Partner',
      'Sponsored Governance Masterclass opportunity',
      'Exclusive media interviews',
      'Logo placement on the BGS website',
      'Branded Summit memorabilia',
      'First right of renewal for future Summit editions',
      'Extensive television, radio, print, digital and livestream branding',
      'CEO and Board profile feature in BoardroomTimes',
      'Institutional governance and CSR positioning',
    ],
  },
  {
    name: 'Diamond',
    price: 'GHS 400,000',
    accent: '#3B5BDB',
    headline: 'Prominent presence, a speaking platform and ten executive passes.',
    benefits: [
      '50-book donation package under the African Conscientisation Library Project',
      '10 Executive Delegate passes to the Summit',
      'Access for 5 Executive Delegates to selected KDS Governance & Leadership Courses',
      '10% discount on governance certification and executive development programmes',
      'Prominent logo placement across all Summit branding and marketing materials',
      'Prime exhibition space at the Summit',
      'Branded executive lounge and networking area',
      'Opportunity to address delegates during selected Summit sessions',
      'Participation in governance panels and executive dialogues',
      'Opportunity to contribute to Summit publications and governance reports',
      'Executive networking with government officials, CEOs, board chairs, regulators, diplomats and institutional leaders',
      'Exclusive media interviews',
      'Logo placement on the BGS website',
      'Branded Summit memorabilia',
      'First right of renewal for future Summit editions',
      'Extensive television, radio, print, digital and livestream branding',
      'CEO and Board profile feature in BoardroomTimes',
      'Institutional governance and CSR positioning',
    ],
  },
  {
    name: 'Gold',
    price: 'GHS 200,000',
    accent: '#C9A227',
    headline: 'Full branding, exhibition space and seven executive passes.',
    benefits: [
      '20-book donation package under the African Conscientisation Library Project',
      '7 Executive Delegate passes to the Summit',
      'Access for 3 Executive Delegates to selected KDS Governance & Leadership Courses',
      'Logo placement across all Summit branding and marketing materials',
      'Exhibition space at the Summit',
      'Branded executive lounge and networking area',
      'Participation in governance panels',
      'Opportunity to contribute to Summit publications and governance reports',
      'Executive networking with policymakers, regulators, CEOs, board chairs and institutional leaders',
      'Media interviews',
      'Logo placement on the BGS website',
      'Branded Summit memorabilia',
      'Television, radio, print, digital and livestream branding',
      'CEO and Board profile feature in BoardroomTimes',
      'Institutional governance and CSR positioning',
    ],
  },
  {
    name: 'Silver',
    price: 'GHS 100,000',
    accent: '#8D96A8',
    headline: 'Visible support, exhibition space and five executive passes.',
    benefits: [
      '5 Executive Delegate passes to the Summit',
      'Access for 2 Executive Delegates to selected KDS Governance & Leadership Courses',
      'Logo placement across Summit branding and marketing materials',
      'Exhibition space at the Summit',
      'Participation in governance panels',
      'Opportunity to contribute to Summit publications and governance reports',
      'Executive networking with policymakers, regulators, CEOs, board chairs and institutional leaders',
      'Logo placement on the BGS website',
      'Branded Summit memorabilia',
      'Television, radio, print, digital and livestream branding',
      'CEO and Board profile feature in BoardroomTimes',
      'Institutional governance and CSR positioning',
      'Recognition plaque for sponsorship',
      'Access to post-Summit governance resources and recorded sessions',
    ],
  },
  {
    name: 'Bronze',
    price: 'GHS 50,000',
    accent: '#A86B3C',
    headline: 'An accessible way to stand with better governance.',
    benefits: [
      '2 Executive Delegate passes to the Summit',
      'Access for 1 Executive Delegate to selected KDS Governance & Leadership Courses',
      'Logo placement across Summit branding and marketing materials',
      'Participation in governance panels',
      'Opportunity to contribute to Summit publications and governance reports',
      'Direct networking with policymakers, regulators, CEOs, board chairs and institutional leaders',
      'Exhibition and brand activation opportunities',
      'Television, radio, print, digital and livestream branding',
      'CEO and Board profile feature in BoardroomTimes',
      'Institutional governance and CSR positioning',
      'Executive recognition for sponsorship',
      'Access to post-Summit governance resources and recorded sessions',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Programme (BGS 2025 run of show, kept as the reference day)        */
/* ------------------------------------------------------------------ */

export const programme2025 = [
  { time: '7:30 – 8:00', title: 'Arrival of guests', detail: 'Welcome, registration and morning refreshments, with highlights from BGS 2024 on screen.' },
  { time: '8:00 – 9:20', title: 'Breakfast and networking', detail: 'Facilitated social engagement before the formal programme begins.' },
  { time: '9:30 – 10:30', title: 'Opening ceremony and keynote', kind: 'Keynote', detail: 'Opening prayer and acknowledgements, remarks from the Summit Convener, keynote address by the Chief of Staff, and a spoken-word interlude.' },
  { time: '10:35 – 11:35', title: 'Panel 1: The Role of the Chairman in Effective Boardroom Governance', kind: 'Panel', detail: 'Insights from leading public and private sector chairpersons.' },
  { time: '11:35 – 12:05', title: 'Audience Q&A', kind: 'Q&A' },
  { time: '12:05 – 1:05', title: 'Lunch', detail: 'Network, connect and reflect over a curated buffet.' },
  { time: '1:10 – 2:10', title: 'Panel 2: Chair or CEO? Sequence and Governance Dynamics', kind: 'Panel', detail: 'A debate on what comes first, and why it matters.' },
  { time: '2:10 – 2:40', title: 'Audience Q&A', kind: 'Q&A' },
  { time: '2:45 – 3:45', title: 'Panel 3: The Silent Architect: The Role of the Board Secretary', kind: 'Panel', detail: 'Redefining the often-overlooked office at the centre of good governance.' },
  { time: '3:45 – 4:15', title: 'Audience Q&A', kind: 'Q&A' },
  { time: '4:15 – 4:35', title: 'Summary and reflections', detail: 'Key insights and takeaways from the day.' },
  { time: '4:35 – 4:45', title: 'Group photograph and departure', detail: 'Capturing the legacy of the gathering.' },
];

/* ------------------------------------------------------------------ */
/*  FAQs                                                               */
/* ------------------------------------------------------------------ */

export type Faq = { q: string; a: string };
export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: 'The Summit',
    items: [
      {
        q: 'Before I commit, can you just tell me plainly what this summit is?',
        a: "The Boardroom Governance Summit is Africa's pioneering boardroom-focused event, and the largest gathering of its kind in Ghana. Once a year we bring together more than 1,000 board chairpersons, directors, chief executives, C-suite leaders, regulators and policymakers at the Labadi Beach Hotel in Accra, to confront the real issues shaping modern boardrooms. Not the polished, theoretical version you find in textbooks and training slides, but how governance actually plays out under pressure.",
      },
      {
        q: 'What was the 2026 theme, and what comes next?',
        a: 'BGS 2026, held on 12 November 2026, was themed "Board Committees: From Oversight to Impact". It challenged the idea that committees are a compliance formality and asked whether Audit, Risk, ESG and Finance committees actually move the needle on organisational performance. The theme and dates for BGS 2027 will be announced soon. Register your interest and you will hear first.',
      },
      {
        q: 'Walk me through the actual programme for the day.',
        a: 'We open with a keynote from a prominent national or industry leader. Past keynote speakers have included the Chief of Staff at the Office of the President of Ghana, a former Minister for Finance, and the Chief Executive Officer of the State Interests and Governance Authority. From there, we move into three major panel discussions, each followed by audience Q&A and designed to challenge conventional boardroom thinking rather than simply confirm it.',
      },
    ],
  },
  {
    title: 'Who will be in the room',
    items: [
      {
        q: 'I have heard this used to be a mostly Ghanaian crowd. Is that still the case?',
        a: "It is, and we are not shying away from that. In previous editions attendance ran close to 90 percent Ghanaian participants and 10 percent international. The room remains majority Ghanaian executives, board chairpersons, directors and C-suite leaders from our banks, state institutions and major corporates, alongside a steadily growing contingent of delegates from elsewhere in Africa and beyond.",
      },
      {
        q: 'Why does it matter that this remains a majority Ghanaian room?',
        a: 'Because board governance is a live, urgent conversation inside Ghanaian institutions right now: in our banks, our state-owned enterprises and our regulatory bodies. Keeping the room majority Ghanaian keeps the conversation grounded in the realities you actually operate in, while delegates from across Africa add fresh perspective without diluting that focus.',
      },
      {
        q: 'Who, specifically, will I get the chance to network with?',
        a: 'C-suite leaders, CEOs, policymakers and board chairpersons from some of the largest companies locally and across the continent. Guests have included senior leadership from organisations such as VRA, Fidelity Bank, Kasapreko, ECG, Sunda, Stanbic Bank, GRA, Access Bank and Total, alongside regulators, leading governance academics, civil society organisations, church and traditional leaders, and senior figures from the Bank of Ghana and state-owned enterprises.',
      },
      {
        q: 'Who actually stands behind it, beyond the organisers?',
        a: 'Past and present endorsements have come from the Ghana Bar Association, the Institute of Chartered Accountants Ghana, the Ghana Institute of Procurement and Supply and the Institute of Directors, alongside the Presidency, the Council of State, the Judiciary and Parliament. The summit has also had the backing of ministries including Finance, Trade, Health, Works and Housing, Defence, Local Government, Agriculture, Education, Roads and Highways, Transport, Communications, Water and Sanitation, and the Public and Civil Service.',
      },
    ],
  },
  {
    title: 'Why attend in person',
    items: [
      {
        q: 'Why attend in person rather than wait for a recording or a summary?',
        a: 'Because the value of this summit does not travel well through a screen. In person, you are in the same room as board chairpersons, regulators and chief executives who are otherwise nearly impossible to access on a normal working day. You shake hands, exchange cards and get invited to the follow-up conversation. Recordings give you information. Being here gives you access, relationships and opportunities.',
      },
      {
        q: 'Is this only for very senior directors and chairpersons?',
        a: 'No. If you are an experienced director, this is where you benchmark your practice against the best and have the honest conversations your own boardroom may be avoiding. If you are a young executive, an emerging director, or quietly preparing for future board responsibility, this is a rare, compressed opportunity to see how boards genuinely operate and build relationships that would otherwise take years to form.',
      },
    ],
  },
  {
    title: 'What you walk away with',
    items: [
      {
        q: 'Beyond the panels, what do I actually walk away with?',
        a: "Every attendee receives a complimentary copy of Professor Boateng's latest book on boardroom governance. You also leave with a genuinely expanded network, direct exposure to sitting chairpersons and regulators, and governance thinking you will not find compiled anywhere else in one place.",
      },
      {
        q: 'Does attendance count towards continuing professional development?',
        a: 'Yes. Every attendee receives an official certificate of attendance, which qualifies for CPD points with the relevant professional institute.',
      },
      {
        q: 'Does the relationship end when the summit closes for the day?',
        a: "Not at all. Every attendee joins an ongoing local and continental network of boardroom professionals, receives our newsletter on boardroom governance, and becomes a recipient of NyansaKasa on Boardroom Governance, Professor Boateng's thought-leadership series. BGS 2026 delegates also get first access to the upcoming Certified Board Governance Course.",
      },
    ],
  },
  {
    title: 'The organisers',
    items: [
      {
        q: 'Who is organising and standing behind this event?',
        a: "The summit is organised by PanAvest International & Partners. It was founded and is convened by Ing. Professor Douglas K. Boateng, an International Chartered Director (UK), Professional Chairperson and Chartered Engineer recognised by both the Engineering Council UK and the Engineering Council of Ghana. He is also the Scriber of NyansaKasa (Words of Wisdom), a daily thought-leadership platform with an annual global readership of over one million, and writes two widely followed weekly op-ed series, The Inconvenient Truth and What Is Wrong With Us.",
      },
      {
        q: 'Give me one honest reason to commit to the next edition.',
        a: 'Because the gap between a board that oversees and a board that delivers impact is decided in rooms like this one, where the people who run Ghana\'s boardrooms, and the people who should, gather to work that gap out loud. You get their thinking, their contacts, a book to take home and a day built around your time. That combination does not happen twice a year.',
      },
    ],
  },
];

/** Collaborators from earlier editions who are not already in the 2026 list. */
const alsoIn2026 = [
  'PanAvest International & Partners',
  'Labadi Beach Hotel',
  'Ministry of Energy and Green Transition',
  'Institute of Directors Ghana',
  'Ghana Institution of Engineering',
  'Ghana Institution of Surveyors',
  'Chartered Institute of Logistics and Transport',
  'Association of Ghana Industries',
  'Ghana Chamber of Bulk Oil Distributors',
];
export const pastPartners = partners.filter((p) => !alsoIn2026.includes(p.name));
export const allPartners: Partner[] = [...partners2026, ...mediaPartners2026, ...pastPartners];
