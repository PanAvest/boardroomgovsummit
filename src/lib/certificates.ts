/**
 * Certificate verification. The BGS Dashboard owns tickets and certificates; its public endpoint
 * answers for one certificate number at a time with only what is printed on that certificate.
 * The certificate number is the ticket code, e.g. BGS-K7QM-4XWP.
 */
import type { CertificateEvent, CertificateFace } from './certificate-art';
import { DASHBOARD_URL } from './dashboard';

export type CertificateLookup =
  | { status: 'valid'; code: string; certificate: CertificateFace; event: CertificateEvent }
  | { status: 'invalid' | 'not_found' | 'withdrawn' | 'error'; code: string | null };

/**
 * "bgs k7qm 4xwp", "K7QM4XWP" and "BGS-K7QM-4XWP" are all the same number. Codes never use
 * I, L, O, 0 or 1, so a value containing them is not a certificate number.
 */
export function normaliseCode(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const body = raw.startsWith('BGS') && raw.length === 11 ? raw.slice(3) : raw;
  return /^[A-HJKMNP-Z2-9]{8}$/.test(body) ? `BGS-${body.slice(0, 4)}-${body.slice(4)}` : null;
}

export async function lookupCertificate(input: string): Promise<CertificateLookup> {
  const code = normaliseCode(input);
  if (!code) return { status: 'invalid', code: null };
  try {
    const res = await fetch(`${DASHBOARD_URL}/api/public/certificate?code=${encodeURIComponent(code)}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => null)) as
      | { status?: string; certificate?: CertificateFace; event?: CertificateEvent }
      | null;
    if (body?.status === 'valid' && body.certificate && body.event) {
      return { status: 'valid', code: body.certificate.code, certificate: body.certificate, event: body.event };
    }
    if (body?.status === 'not_found' || body?.status === 'withdrawn' || body?.status === 'invalid') {
      return { status: body.status, code };
    }
    console.error('[certificates] unexpected reply', res.status);
    return { status: 'error', code };
  } catch (error) {
    console.error('[certificates] lookup failed:', error instanceof Error ? error.message : error);
    return { status: 'error', code };
  }
}
