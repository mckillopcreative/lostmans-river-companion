// Base-path-aware link helper. Always use url('/ch/7/') rather than a bare '/ch/7/'
// so the site works both at a custom domain root and under /<repo>/ on GitHub project pages.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:')) return path;
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}

export const chapterUrl = (n: number) => url(`/ch/${n}/`);
export const sectionUrl = (section: string, id?: string) => url(id ? `/${section}/${id}/` : `/${section}/`);
