import { site, contact } from '../data/config';

/**
 * Progressive form handling for every <form data-bgs-form="Subject">.
 *
 * - If `site.formEndpoint` is set (Formspree, Web3Forms, Basin, …) the form is
 *   POSTed there with fetch and a success message is shown inline.
 * - Otherwise we open the visitor's email client with the answers pre-filled,
 *   addressed to the summit inbox, so the forms work on any static host.
 */
export function initForms() {
  const forms = document.querySelectorAll<HTMLFormElement>('form[data-bgs-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector<HTMLElement>('.form-status');
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const subject = form.dataset.bgsForm || 'Website enquiry';

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      if (data.get('_gotcha')) return; // honeypot

      const setStatus = (state: 'success' | 'error', message: string) => {
        if (!status) return;
        status.dataset.state = state;
        status.textContent = message;
        status.focus?.();
      };

      if (site.formEndpoint) {
        button?.setAttribute('disabled', '');
        try {
          data.append('_subject', `[BGS] ${subject}`);
          const res = await fetch(site.formEndpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          setStatus('success', form.dataset.success || 'Thank you. We have received your message and will be in touch.');
        } catch {
          setStatus('error', `Something went wrong. Please email us directly at ${contact.email}.`);
        } finally {
          button?.removeAttribute('disabled');
        }
        return;
      }

      // Fallback: compose an email
      const lines: string[] = [];
      const seen = new Set<string>();
      for (const [key, value] of data.entries()) {
        if (key.startsWith('_') || seen.has(key)) continue;
        seen.add(key);
        const all = data.getAll(key).map(String).filter(Boolean);
        if (!all.length) continue;
        const label = form.querySelector(`[name="${key}"]`)?.getAttribute('data-label') || key;
        lines.push(`${label}: ${all.join(', ')}`);
      }
      const href = `mailto:${contact.email}?subject=${encodeURIComponent(`[BGS] ${subject}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
      window.location.href = href;
      setStatus('success', `Your email app should now open with your details filled in. If it doesn't, write to ${contact.email}.`);
    });
  });
}
