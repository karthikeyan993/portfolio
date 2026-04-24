import { describe, expect, it } from 'vitest';
import rawEnglishContent from '@/data/site-content.en.json';
import rawGermanContent from '@/data/site-content.de.json';
import { parseSiteContent } from '@/data/site-content.schema';

describe('site content schema', () => {
  it('parses valid localized content', () => {
    expect(parseSiteContent(rawEnglishContent).locale).toBe('en');
    expect(parseSiteContent(rawGermanContent).locale).toBe('de');
  });

  it('throws a readable error for invalid content', () => {
    const invalidContent = {
      ...rawEnglishContent,
      hero: {
        ...rawEnglishContent.hero,
        titles: [],
      },
    };

    expect(() => parseSiteContent(invalidContent)).toThrow(
      /Invalid site content: hero\.titles: Too small/
    );
  });
});
