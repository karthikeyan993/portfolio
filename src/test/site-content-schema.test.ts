import { describe, expect, it } from 'vitest';
import rawSiteContent from '@/content/site-content.json';
import { parseSiteContent } from '@/content/site-content.schema';

describe('site content schema', () => {
  it('parses valid content', () => {
    expect(parseSiteContent(rawSiteContent)).toBeDefined();
  });

  it('throws a readable error for invalid content', () => {
    const invalidContent = {
      ...rawSiteContent,
      hero: {
        ...rawSiteContent.hero,
        titles: [],
      },
    };

    expect(() => parseSiteContent(invalidContent)).toThrowError(
      /Invalid site content: hero\.titles: Too small/
    );
  });
});
