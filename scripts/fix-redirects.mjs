// The Vercel adapter emits redirects that match only the exact path ("^/cart$").
// Old WordPress links end with a slash ("/cart/"), so accept both forms.
import fs from 'node:fs';
const file = '.vercel/output/config.json';
const config = JSON.parse(fs.readFileSync(file, 'utf8'));
let n = 0;
for (const route of config.routes ?? []) {
  if (route.status >= 300 && route.status < 400 && typeof route.src === 'string' && route.src.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    n++;
  }
}
fs.writeFileSync(file, JSON.stringify(config, null, 2));
console.log(`fix-redirects: ${n} redirects now accept a trailing slash`);
