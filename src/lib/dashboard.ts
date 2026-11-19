/** The BGS Dashboard, which holds tickets and certificates (and serves the brand assets certificates are drawn with). */
export const DASHBOARD_URL = ((import.meta.env.PUBLIC_DASHBOARD_URL as string | undefined) || 'https://bgs-dashboard-kappa.vercel.app').replace(/\/$/, '');
