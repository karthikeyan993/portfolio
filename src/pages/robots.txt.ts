import type { APIRoute } from 'astro';
import { DEV_SITE_URL } from '@/lib/constants';

export const GET = (({ site }) => {
  const finalSite = site ?? new URL(DEV_SITE_URL);
  const sitemapUrl = new URL('/sitemap-index.xml', finalSite).toString();

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}) satisfies APIRoute;
