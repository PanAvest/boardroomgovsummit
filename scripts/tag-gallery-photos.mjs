// Writes who is in each tagged BGS 2026 photo into the image files (XMP: IPTC "Person shown",
// with each person's profile links), so the files carry the same names as the alt text when
// they are indexed, downloaded or shared. The pixels are not re-encoded.
//
// Tags: src/data/gallery-2026-tags.json. People: src/data/people.json.
// Needs webpmux (brew install webp). Run after changing tags: node scripts/tag-gallery-photos.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const tags = read('src/data/gallery-2026-tags.json');
const people = read('src/data/people.json');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const alt = (s) => `<rdf:Alt><rdf:li xml:lang="x-default">${esc(s)}</rdf:li></rdf:Alt>`;
const bag = (items) => `<rdf:Bag>${items.map((s) => `<rdf:li>${esc(s)}</rdf:li>`).join('')}</rdf:Bag>`;

function xmp({ alt: caption, people: keys }) {
  const who = keys.map((k) => people[k]);
  const keywords = ['Boardroom Governance Summit', 'BGS 2026', 'Labadi Beach Hotel', 'Accra', ...who.flatMap((p) => [p.name, ...p.alternateName])];
  const details = who
    .map(
      (p) =>
        `<rdf:li rdf:parseType="Resource"><Iptc4xmpExt:PersonName>${alt(p.name)}</Iptc4xmpExt:PersonName>` +
        `<Iptc4xmpExt:PersonId>${bag([...new Set([p.url, ...p.sameAs])])}</Iptc4xmpExt:PersonId></rdf:li>`,
    )
    .join('');
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    photoshop:Headline="${esc(caption)}"
    photoshop:Credit="Boardroom Governance Summit"
    photoshop:DateCreated="2026-11-12"
    photoshop:City="Accra"
    photoshop:Country="Ghana"
    Iptc4xmpCore:CountryCode="GH"
    Iptc4xmpCore:Location="Labadi Beach Hotel">
   <dc:title>${alt(caption)}</dc:title>
   <dc:description>${alt(caption)}</dc:description>
   <dc:subject>${bag([...new Set(keywords)])}</dc:subject>
   <Iptc4xmpExt:Event>${alt('Boardroom Governance Summit 2026')}</Iptc4xmpExt:Event>
   <Iptc4xmpExt:PersonInImage>${bag(who.map((p) => p.name))}</Iptc4xmpExt:PersonInImage>
   <Iptc4xmpExt:PersonInImageWDetails><rdf:Bag>${details}</rdf:Bag></Iptc4xmpExt:PersonInImageWDetails>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bgs-xmp-'));
let count = 0;
for (const [name, tag] of Object.entries(tags)) {
  const meta = path.join(tmp, `${name}.xmp`);
  fs.writeFileSync(meta, xmp(tag));
  for (const size of ['full', 'thumb']) {
    const file = path.join(root, 'public/gallery/2026', size, `${name}.webp`);
    if (!fs.existsSync(file)) {
      console.warn(`missing: ${path.relative(root, file)}`);
      continue;
    }
    const out = path.join(tmp, `${name}-${size}.webp`);
    execFileSync('webpmux', ['-set', 'xmp', meta, file, '-o', out], { stdio: 'pipe' });
    fs.copyFileSync(out, file);
    count++;
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`tagged ${count} files`);
