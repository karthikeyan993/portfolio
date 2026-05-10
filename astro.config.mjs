import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath, URL } from 'node:url';

const publicSiteUrl = process.env.PUBLIC_SITE_URL;
const isCiBuild = process.env.CI === 'true' || process.env.NETLIFY === 'true';

if (isCiBuild && !publicSiteUrl) {
  throw new Error('PUBLIC_SITE_URL is required for CI/production builds.');
}

// Documented exception: we keep the local literal here since this is an mjs file
const site = publicSiteUrl ?? 'http://localhost:4321';

export default defineConfig({
  site,
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
