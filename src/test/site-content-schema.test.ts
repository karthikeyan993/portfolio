import { describe, expect, it } from 'vitest';
import rawEnglishContent from '@/data/site-content.en.json';
import rawGermanContent from '@/data/site-content.de.json';
import { parseSiteContent } from '@/data/site-content.schema';

describe('site content schema', () => {
  it('parses valid localized content', () => {
    const englishContent = parseSiteContent(rawEnglishContent);
    const germanContent = parseSiteContent(rawGermanContent);

    expect(englishContent.locale).toBe('en');
    expect(germanContent.locale).toBe('de');
    expect(englishContent.common.homeLabel).toBeTruthy();
    expect(germanContent.common.homeLabel).toBeTruthy();
    expect(englishContent.common.postContactCtaLabel).toBeTruthy();
    expect(germanContent.common.postContactCtaLabel).toBeTruthy();
  });

  it('throws a readable error for invalid content', () => {
    const invalidContent = {
      ...rawEnglishContent,
      seo: {
        ...rawEnglishContent.seo,
        keywords: [],
      },
    };

    expect(() => parseSiteContent(invalidContent)).toThrow(
      /Invalid site content: seo\.keywords: Too small/
    );
  });

  it('applies default object when a section is missing', () => {
    const withoutAbout = { ...rawEnglishContent } as Record<string, unknown>;
    delete withoutAbout.about;
    const result = parseSiteContent(withoutAbout);
    expect(result.about).toBeDefined();
    expect(result.about.enabled).toBe(true);
    expect(result.about.title).toBe('');
    expect(result.about.paragraphs).toEqual([]);
  });
});
