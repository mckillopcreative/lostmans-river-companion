// Writes dist/sitemap.xml and dist/robots.txt after the build. Lists every built page except
// those marked noindex and redirect stubs. Run by `npm run build`.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import site from '../site.config.mjs';

const dist = resolve(import.meta.dirname, '..', 'dist');
const domain = site.domain.replace(/\/$/, '');
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === 'index.html') pages.push(p);
  }
};
walk(dist);

const urls = [];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
  if (/<meta http-equiv="refresh"/i.test(html)) continue; // redirect stubs (/journal/)
  const rel = relative(dist, file).split(sep).slice(0, -1).join('/');
  const path = rel ? `/${rel}/` : '/';
  const priority = path === '/' ? '1.0' : path === '/app/' || /^\/ch\/\d+\/$/.test(path) ? '0.8' : '0.6';
  urls.push(`  <url><loc>${domain}${path}</loc><priority>${priority}</priority></url>`);
}
urls.sort();
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);
console.log(`✓ sitemap.xml: ${urls.length} pages (${pages.length - urls.length} left out: noindex or redirects)`);
