import { describe, expect, it } from 'vitest';
import { getSiteContent } from '@/data/site-content';
import { buildPageSeo } from '@/lib/seo';

const content = getSiteContent('en');

describe('SEO helpers', () => {
  it('builds localized alternates for home pages', () => {
    const seo = buildPageSeo({
      baseUrl: 'https://example.com',
      content,
      currentPath: '/',
      description: content.seo.description,
      locale: 'en',
      ogType: 'website',
      title: content.seo.title,
    });

    expect(seo.canonicalUrl).toBe('https://example.com/');
    expect(seo.alternateLinks).toContainEqual({ hreflang: 'en', href: 'https://example.com/' });
    expect(seo.alternateLinks).toContainEqual({ hreflang: 'de', href: 'https://example.com/de/' });
    expect(seo.alternateLinks).toContainEqual({ hreflang: 'x-default', href: 'https://example.com/' });
  });

  it('does not invent German alternates for English-only blog pages', () => {
    const seo = buildPageSeo({
      baseUrl: 'https://example.com',
      content,
      currentPath: '/blog/example-post/',
      description: 'Post description',
      locale: 'en',
      ogType: 'article',
      title: 'Example post',
    });

    expect(seo.alternateLinks).toEqual([
      { hreflang: 'en', href: 'https://example.com/blog/example-post/' },
      { hreflang: 'x-default', href: 'https://example.com/blog/example-post/' },
    ]);
  });
});
