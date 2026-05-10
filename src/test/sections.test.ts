import { describe, expect, it } from 'vitest';
import { getSiteContent } from '@/data/site-content';
import { getVisibleHomeSectionIds, hasProjectsContent } from '@/lib/sections';

describe('section visibility helpers', () => {
  it('hides disabled project sections and their nav target', () => {
    const content = getSiteContent('en');

    expect(hasProjectsContent(content.projects)).toBe(false);
    expect(getVisibleHomeSectionIds(content).has('projects')).toBe(false);
  });

  it('shows a section when it is enabled and has editable content', () => {
    const content = getSiteContent('en');
    const visibleSections = getVisibleHomeSectionIds({
      ...content,
      projects: {
        ...content.projects,
        enabled: true,
      },
    });

    expect(visibleSections.has('projects')).toBe(true);
  });
});
