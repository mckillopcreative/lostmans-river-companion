import { defineConfig, fontProviders } from 'astro/config';
import site from './site.config.mjs';

export default defineConfig({
  site: site.domain,
  base: site.base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: {
    // Sketch scans are 900–1300px; constrained layout emits srcset + sizes automatically.
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [400, 800, 1200, 1600],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      weights: ['400', '600', '700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-hand',
      weights: ['500', '700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
  ],
});
