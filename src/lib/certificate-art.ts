/**
 * The BGS certificate of attendance, drawn in the browser (A4 landscape, 300 dpi).
 *
 * A copy of the BGS Dashboard's `src/components/certificates/certificate-art.ts`, so a
 * certificate downloaded here is identical to the one the team issued and emailed.
 * If the design changes there, change it here too.
 *
 * The summit logo and the convener's signature are loaded from the dashboard (which
 * allows this site to read them), as are institution logos and signatures. The name
 * typeface (Playfair Display Italic, SIL OFL) is served from /fonts/, and Montserrat
 * from the @fontsource package, matching the dashboard.
 */
import montserratUrl from '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url';
import { DASHBOARD_URL } from './dashboard';

export type CertificateSignatory = { name: string; title: string | null; signatureUrl: string | null };
export type CertificateFace = {
  code: string;
  name: string;
  institution: { name: string; logoUrl: string | null; signatory: CertificateSignatory | null } | null;
};
export type CertificateEvent = { title: string; dateLine: string; venueLine: string; theme: string; convener: string };

export const CERT_W = 3508;
export const CERT_H = 2480;

// Print colours: a certificate never changes with the page's styles.
const PURPLE = '#804a95';
const PURPLE_LIGHT = '#925ca3';
const PURPLE_DEEP = '#703e82';
const INK = '#1e1c52';
const INK_SOFT = '#5f5b8c';
const WHITE = '#ffffff';
const TEXT_X = 1700;

/** Where the personal parts sit, in certificate pixels. Each box is plain white page. */
const NAME_BOX = { x: 1690, y: 830, w: 1618, h: 300 };
const LOGO_BOX = { x: 2990, y: 90, w: 440, h: 360 };
const CODE_BOX = { x: 1690, y: 2350, w: 1300, h: 80 };
/** The second signature slot: an institution's signatory, or the date written on the line. */
const SIG_BOX = { x: 2700, y: 1900, w: 700, h: 400 };
const LEFT_SLOT = 2120;
const RIGHT_SLOT = 3050;
const LINE_Y = 2148;
const SIGNATURE_MAX = { w: 560, h: 200 };
const LOGO_MAX = { w: 420, h: 260 };

const NAME_FONT_URL = '/fonts/PlayfairDisplay-Italic-Variable.ttf';
const NAME_STYLE = 'italic 600';
const WHITE_LOGO_URL = `${DASHBOARD_URL}/brand/logo-white.png`;
const CONVENER_SIGNATURE_URL = `${DASHBOARD_URL}/brand/signatures/convener.png`;

type Bytes = Uint8Array<ArrayBuffer>;
type Assets = { family: string; nameFont: string; brand: HTMLImageElement; convener: HTMLImageElement | null };
let assets: Promise<Assets> | undefined;

function canvas(width: number, height: number): { el: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  const ctx = el.getContext('2d');
  if (!ctx) throw new Error('This browser cannot draw certificates.');
  return { el, ctx };
}

function toBytes(el: HTMLCanvasElement, type: 'image/png' | 'image/jpeg', quality?: number): Promise<Bytes> {
  return new Promise((resolve, reject) => {
    el.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('The certificate image could not be created.'));
        blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)), reject);
      },
      type,
      quality,
    );
  });
}

export function saveBlob(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  // Safari needs the URL to outlive the click.
  setTimeout(() => URL.revokeObjectURL(href), 30_000);
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  const objectUrl = URL.createObjectURL(await response.blob());
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Loads the typefaces and the summit logo before anything is drawn. */
function loadAssets(): Promise<Assets> {
  assets ??= (async () => {
    const brandFace = new FontFace('BGS Montserrat', `url(${montserratUrl})`, { weight: '100 900' });
    const nameFace = new FontFace('BGS Name', `url(${NAME_FONT_URL})`, { style: 'italic', weight: '400 900' });
    const [brandFont, nameFont, image, convener] = await Promise.all([
      brandFace.load(),
      nameFace.load(),
      loadImage(WHITE_LOGO_URL),
      loadImage(CONVENER_SIGNATURE_URL).catch(() => null),
    ]);
    document.fonts.add(brandFont);
    document.fonts.add(nameFont);
    return {
      family: '"BGS Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
      nameFont: '"BGS Name", "Playfair Display", Georgia, "Times New Roman", serif',
      brand: image,
      convener,
    };
  })();
  assets.catch(() => {
    assets = undefined;
  });
  return assets;
}

const logoCache = new Map<string, Promise<HTMLImageElement | null>>();
/** An institution's logo or signature, or null when it cannot be loaded. */
function loadLogo(url: string): Promise<HTMLImageElement | null> {
  let hit = logoCache.get(url);
  if (!hit) {
    hit = loadImage(url).catch(() => null);
    logoCache.set(url, hit);
  }
  return hit;
}

function setTracking(ctx: CanvasRenderingContext2D, px: number) {
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
}

/** Breaks text into lines no wider than maxWidth at the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// ── Artwork that never changes ──────────────────────────────────────────────
function polygon(ctx: CanvasRenderingContext2D, points: [number, number][], fill: string) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Draws an image whole inside a box, bottom-centred, multiplied into the white page so a white background disappears. */
function drawSignatureImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, centreX: number, bottomY: number) {
  const scale = Math.min(SIGNATURE_MAX.w / image.width, SIGNATURE_MAX.h / image.height);
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(image, centreX - (image.width * scale) / 2, bottomY - image.height * scale, image.width * scale, image.height * scale);
  ctx.globalCompositeOperation = 'source-over';
}

function drawStatic(ctx: CanvasRenderingContext2D, event: CertificateEvent, { family, brand, convener }: Assets) {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, CERT_W, CERT_H);
  ctx.textBaseline = 'middle';

  // Side panel: one slanted shape with a lighter and a deeper facet.
  polygon(ctx, [[0, 0], [1020, 0], [1540, CERT_H], [0, CERT_H]], PURPLE);
  polygon(ctx, [[0, 0], [1020, 0], [0, 1120]], PURPLE_LIGHT);
  polygon(ctx, [[0, 1500], [1040, CERT_H], [0, CERT_H]], PURPLE_DEEP);

  const logoW = 700;
  const logoH = (brand.height / brand.width) * logoW;
  ctx.drawImage(brand, 640 - logoW / 2, 1250 - logoH / 2, logoW, logoH);
  ctx.textAlign = 'center';
  ctx.fillStyle = WHITE;
  ctx.font = `700 40px ${family}`;
  setTracking(ctx, 10);
  ctx.fillText(event.dateLine.toUpperCase(), 640, 1560, 760);
  ctx.fillStyle = '#e8def2';
  ctx.font = `500 28px ${family}`;
  setTracking(ctx, 5);
  ctx.fillText(event.venueLine.toUpperCase(), 640, 1620, 760);

  // Title block
  ctx.textAlign = 'left';
  ctx.fillStyle = PURPLE;
  ctx.font = `800 150px ${family}`;
  setTracking(ctx, 8);
  ctx.fillText('CERTIFICATE', TEXT_X, 430, 1650);
  ctx.fillStyle = INK;
  ctx.font = `500 56px ${family}`;
  setTracking(ctx, 22);
  ctx.fillText('OF ATTENDANCE', TEXT_X + 6, 590, 1650);
  setTracking(ctx, 0);
  ctx.font = `400 42px ${family}`;
  ctx.fillText('This certificate is proudly presented to', TEXT_X + 6, 780);

  // Rule under the name, then what the certificate is for.
  ctx.fillStyle = PURPLE;
  ctx.fillRect(TEXT_X, 1138, CERT_W - 200 - TEXT_X, 4);
  ctx.fillStyle = INK;
  ctx.font = `400 44px ${family}`;
  const body = wrap(ctx, `In recognition of attendance at the ${event.title}, held on ${event.dateLine} at the ${event.venueLine}.`, 1520);
  body.slice(0, 4).forEach((line, i) => ctx.fillText(line, TEXT_X + 6, 1270 + i * 72, 1560));
  if (event.theme.trim()) {
    ctx.fillStyle = PURPLE;
    ctx.font = `500 38px ${family}`;
    ctx.fillText(`Theme: ${event.theme.trim()}`, TEXT_X + 6, 1270 + Math.min(body.length, 4) * 72 + 70, 1560);
  }

  // The convener signs on the left. The right slot is personal (see drawSignatory).
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (convener) drawSignatureImage(ctx, convener, LEFT_SLOT, LINE_Y - 8);
  ctx.fillStyle = PURPLE;
  ctx.fillRect(LEFT_SLOT - 330, LINE_Y, 660, 4);
  ctx.fillStyle = INK;
  ctx.font = `700 48px ${family}`;
  ctx.fillText(event.convener, LEFT_SLOT, 2210, 660);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 32px ${family}`;
  ctx.fillText(`Convener · ${event.title}`, LEFT_SLOT, 2262, 660);
}

// ── The parts that change per person ────────────────────────────────────────
function clean(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

/**
 * The largest size that keeps the whole name inside the box: one line, then two, then smaller.
 * A line of this serif needs about 1.3 × its size from the tallest capital to the lowest descender.
 */
function fitName(ctx: CanvasRenderingContext2D, name: string, font: string, w: number, h: number): { lines: string[]; size: number } {
  const set = (size: number) => {
    ctx.font = `${NAME_STYLE} ${size}px ${font}`;
  };
  const width = (text: string) => ctx.measureText(text).width;
  for (let size = 170; size >= 100; size -= 4) {
    set(size);
    if (width(name) <= w && size * 1.3 <= h) return { lines: [name], size };
  }
  const words = name.split(' ');
  if (words.length > 1) {
    for (let size = 112; size >= 64; size -= 4) {
      set(size);
      if (size * 2.45 > h) continue;
      let best: string[] | null = null;
      let bestWidth = Infinity;
      for (let i = 1; i < words.length; i++) {
        const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
        const widest = Math.max(...lines.map(width));
        if (widest < bestWidth) {
          best = lines;
          bestWidth = widest;
        }
      }
      if (best && bestWidth <= w) return { lines: best, size };
    }
  }
  for (let size = 96; size >= 40; size -= 4) {
    set(size);
    if (width(name) <= w) return { lines: [name], size };
  }
  return { lines: [name], size: 40 };
}

function drawName(ctx: CanvasRenderingContext2D, name: string, { nameFont }: Assets) {
  const { w, h } = NAME_BOX;
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, w, h);
  const { lines, size } = fitName(ctx, clean(name), nameFont, w - 24, h - 12);
  ctx.font = `${NAME_STYLE} ${size}px ${nameFont}`;
  ctx.fillStyle = PURPLE;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  // Centre the ink itself, measured, so tall capitals and descenders never touch the edges.
  const lineHeight = size * 1.15;
  const first = ctx.measureText(lines[0]);
  const last = ctx.measureText(lines[lines.length - 1]);
  const ascent = first.actualBoundingBoxAscent || size * 0.9;
  const descent = last.actualBoundingBoxDescent || size * 0.3;
  let y = (h - (ascent + (lines.length - 1) * lineHeight + descent)) / 2 + ascent;
  for (const line of lines) {
    ctx.fillText(line, 12, y, w - 24);
    y += lineHeight;
  }
  ctx.textBaseline = 'middle';
}

async function drawLogo(ctx: CanvasRenderingContext2D, institution: CertificateFace['institution'], { family }: Assets) {
  const { w, h } = LOGO_BOX;
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, w, h);
  if (!institution) return;
  const image = institution.logoUrl ? await loadLogo(institution.logoUrl) : null;
  if (image) {
    // Multiplied into the white page, so a logo that was saved with a white background looks like it has none.
    const scale = Math.min(LOGO_MAX.w / image.width, LOGO_MAX.h / image.height);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(image, (w - image.width * scale) / 2, (h - image.height * scale) / 2, image.width * scale, image.height * scale);
    ctx.globalCompositeOperation = 'source-over';
    return;
  }
  // No logo: the institution's name, so the label is still there.
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 44px ${family}`;
  const lines = wrap(ctx, institution.name, w - 30).slice(0, 4);
  lines.forEach((line, i) => ctx.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 56, w - 30));
  ctx.textBaseline = 'middle';
}

function drawCode(ctx: CanvasRenderingContext2D, code: string, dateLine: string | null, { family }: Assets) {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, CODE_BOX.w, CODE_BOX.h);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 28px ${family}`;
  setTracking(ctx, 3);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(dateLine ? `Certificate no. ${code}   ·   Date ${dateLine}` : `Certificate no. ${code}`, 6, CODE_BOX.h / 2, CODE_BOX.w - 12);
  setTracking(ctx, 0);
}

/** The institution's signatory (signature, name, title), or — with none — the date written on the line. */
async function drawSignatory(ctx: CanvasRenderingContext2D, face: CertificateFace, event: CertificateEvent, { family }: Assets) {
  const cx = RIGHT_SLOT - SIG_BOX.x;
  const lineY = LINE_Y - SIG_BOX.y;
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, SIG_BOX.w, SIG_BOX.h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const signatory = face.institution?.signatory ?? null;
  if (signatory) {
    const image = signatory.signatureUrl ? await loadLogo(signatory.signatureUrl) : null;
    if (image) drawSignatureImage(ctx, image, cx, lineY - 8);
  } else {
    ctx.fillStyle = INK;
    ctx.font = `700 52px ${family}`;
    ctx.fillText(event.dateLine, cx, lineY - 44, 640);
  }
  ctx.fillStyle = PURPLE;
  ctx.fillRect(cx - 330, lineY, 660, 4);
  ctx.fillStyle = INK;
  ctx.font = `700 48px ${family}`;
  ctx.fillText(signatory ? signatory.name : 'Date', cx, lineY + 62, 660);
  if (signatory?.title) {
    ctx.fillStyle = INK_SOFT;
    ctx.font = `500 32px ${family}`;
    ctx.fillText(signatory.title, cx, lineY + 114, 660);
  }
}

/** Paints one whole certificate onto `target`. */
export async function paintCertificate(target: HTMLCanvasElement, face: CertificateFace, event: CertificateEvent): Promise<void> {
  const a = await loadAssets();
  target.width = CERT_W;
  target.height = CERT_H;
  const ctx = target.getContext('2d');
  if (!ctx) throw new Error('This browser cannot draw certificates.');
  drawStatic(ctx, event, a);
  const parts: [typeof NAME_BOX, (c: CanvasRenderingContext2D) => void | Promise<void>][] = [
    [NAME_BOX, (c) => drawName(c, face.name, a)],
    [LOGO_BOX, (c) => drawLogo(c, face.institution, a)],
    [SIG_BOX, (c) => drawSignatory(c, face, event, a)],
    [CODE_BOX, (c) => drawCode(c, face.code, face.institution?.signatory ? event.dateLine : null, a)],
  ];
  for (const [box, draw] of parts) {
    const part = canvas(box.w, box.h);
    await draw(part.ctx);
    ctx.drawImage(part.el, box.x, box.y);
  }
}

export async function certificatePng(face: CertificateFace, event: CertificateEvent): Promise<Blob> {
  const { el } = canvas(CERT_W, CERT_H);
  await paintCertificate(el, face, event);
  return new Blob([await toBytes(el, 'image/png')], { type: 'image/png' });
}

// ── PDF ─────────────────────────────────────────────────────────────────────
const encoder = new TextEncoder();

/** A flat-white image with sharp lettering: lossless Flate, or a high-quality JPEG where CompressionStream is missing. */
async function flateImage(el: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<{ dict: string; data: Bytes }> {
  const head = `<< /Type /XObject /Subtype /Image /Width ${el.width} /Height ${el.height} /ColorSpace /DeviceRGB /BitsPerComponent 8`;
  if (typeof CompressionStream === 'undefined') {
    const data = await toBytes(el, 'image/jpeg', 0.93);
    return { dict: `${head} /Filter /DCTDecode /Length ${data.length} >>`, data };
  }
  const rgba = ctx.getImageData(0, 0, el.width, el.height).data;
  const rgb = new Uint8Array(el.width * el.height * 3);
  for (let i = 0, o = 0; i < rgba.length; i += 4) {
    rgb[o++] = rgba[i];
    rgb[o++] = rgba[i + 1];
    rgb[o++] = rgba[i + 2];
  }
  const data = new Uint8Array(await new Response(new Blob([rgb]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
  return { dict: `${head} /Filter /FlateDecode /Length ${data.length} >>`, data };
}

/** The certificate as a one-page A4 landscape PDF: the artwork once, the personal parts placed on top at full print quality. */
export async function certificatePdf(face: CertificateFace, event: CertificateEvent): Promise<Blob> {
  const a = await loadAssets();
  const pageW = 841.89;
  const pageH = 595.28;
  const k = pageW / CERT_W;
  const n = (value: number) => value.toFixed(3);

  const parts: Bytes[] = [];
  const offsets: number[] = [];
  let length = 0;
  let nextId = 3;
  const push = (chunk: string | Bytes) => {
    const data = typeof chunk === 'string' ? encoder.encode(chunk) : chunk;
    parts.push(data);
    length += data.length;
  };
  const object = (id: number, dict: string, stream?: Bytes) => {
    offsets[id] = length;
    push(`${id} 0 obj\n${dict}\n`);
    if (stream) {
      push('stream\n');
      push(stream);
      push('\nendstream\n');
    }
    push('endobj\n');
  };
  const image = async (draw: (c: CanvasRenderingContext2D) => void | Promise<void>, box: { w: number; h: number }) => {
    const part = canvas(box.w, box.h);
    await draw(part.ctx);
    const encoded = await flateImage(part.el, part.ctx);
    const id = nextId++;
    object(id, encoded.dict, encoded.data);
    return id;
  };
  const place = (name: string, box: { x: number; y: number; w: number; h: number }) =>
    `q ${n(box.w * k)} 0 0 ${n(box.h * k)} ${n(box.x * k)} ${n(pageH - (box.y + box.h) * k)} cm /${name} Do Q\n`;

  push('%PDF-1.4\n%âãÏÓ\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');

  const art = canvas(CERT_W, CERT_H);
  drawStatic(art.ctx, event, a);
  const artBytes = await toBytes(art.el, 'image/jpeg', 0.93);
  object(3, `<< /Type /XObject /Subtype /Image /Width ${CERT_W} /Height ${CERT_H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${artBytes.length} >>`, artBytes);
  nextId = 4;

  const signatory = face.institution?.signatory ?? null;
  const nameId = await image((c) => drawName(c, face.name, a), NAME_BOX);
  const codeId = await image((c) => drawCode(c, face.code, signatory ? event.dateLine : null, a), CODE_BOX);
  const sigId = await image((c) => drawSignatory(c, face, event, a), SIG_BOX);
  const logoId = face.institution ? await image((c) => drawLogo(c, face.institution, a), LOGO_BOX) : null;

  const contents = encoder.encode(
    `q ${n(pageW)} 0 0 ${n(pageH)} 0 0 cm /Art Do Q\n${place('Name', NAME_BOX)}${place('Sig', SIG_BOX)}${place('Code', CODE_BOX)}${logoId ? place('Logo', LOGO_BOX) : ''}`,
  );
  const contentsId = nextId++;
  object(contentsId, `<< /Length ${contents.length} >>`, contents);
  const pageId = nextId++;
  object(
    pageId,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(pageW)} ${n(pageH)}] /Resources << /XObject << /Art 3 0 R /Name ${nameId} 0 R /Sig ${sigId} 0 R /Code ${codeId} 0 R${logoId ? ` /Logo ${logoId} 0 R` : ''} >> >> /Contents ${contentsId} 0 R >>`,
  );
  object(2, `<< /Type /Pages /Count 1 /Kids [${pageId} 0 R] >>`);

  const xref = length;
  push(`xref\n0 ${nextId}\n0000000000 65535 f \n`);
  for (let id = 1; id < nextId; id++) push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts, { type: 'application/pdf' });
}

/** "BGS-2026-certificate-Ama-Mensah-BGS-K7QM-4XWP", as the dashboard names it. */
export function certificateFileName(face: CertificateFace): string {
  const who = face.name.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
  return `BGS-2026-certificate${who ? `-${who}` : ''}-${face.code}`;
}
