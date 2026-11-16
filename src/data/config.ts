/* Plain site settings: safe to import from client-side scripts. */

export const site = {
  name: 'Boardroom Governance Summit',
  short: 'BGS',
  tagline: 'Shaping accountability in the boardrooms',
  description:
    "The Boardroom Governance Summit is Africa's pioneering boardroom-focused summit, bringing together board chairpersons, directors, chief executives, regulators and policymakers in Accra, Ghana.",
  url: 'https://boardroomgovsummit.com',
  organiser: 'PanAvest International & Partners',
  /**
   * Where forms are sent. Leave empty and forms open a pre-filled email to
   * contact.email instead. Paste a Formspree / Web3Forms / Basin endpoint
   * here to collect submissions directly.
   */
  formEndpoint: '',
};

export const contact = {
  email: 'info@boardroomgovsummit.com',
  partnershipEmail: 'partnership@boardroomgovsummit.com',
  phone: '+233 (0)53 886 5196',
  phoneHref: 'tel:+233538865196',
  whatsapp: '+233 (0)53 145 1470',
  whatsappHref: 'https://wa.me/233531451470',
  venue: 'Labadi Beach Hotel',
  city: 'Accra, Ghana',
  mapsHref: 'https://maps.google.com/?q=Labadi+Beach+Hotel+Accra',
};

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/boardroom-governance-summit/' },
  { label: 'X (Twitter)', href: 'https://twitter.com/boardroomsummit' },
  { label: 'Facebook', href: 'https://m.facebook.com/people/Boardroom-Governance-Summit/61565153116895/' },
  { label: 'Instagram', href: 'https://www.instagram.com/boardroomgsummit/' },
];

