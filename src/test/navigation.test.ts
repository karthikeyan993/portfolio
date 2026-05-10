import { describe, expect, it } from 'vitest';
import { getHeaderHomeLink, getHeaderNavLinks, getResumeDownloadName } from '@/lib/navigation';
import type { NavItem, ResumeContent } from '@/data/site-content.schema';

const navItems: NavItem[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

describe('navigation helpers', () => {
  it('uses same-page anchors on the localized home page', () => {
    expect(getHeaderNavLinks(navItems, 'en', true)).toEqual([
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ]);
  });

  it('uses localized home anchors away from the home page', () => {
    expect(getHeaderNavLinks(navItems, 'de', false)[0]).toEqual({
      label: 'Experience',
      href: '/de/#experience',
    });
  });

  it('omits the home link when already on the home page', () => {
    expect(getHeaderHomeLink('Home', 'en', true)).toBeNull();
    expect(getHeaderHomeLink('Home', 'en', false)).toEqual({ label: 'Home', href: '/' });
  });

  it('derives the resume download filename from the configured href', () => {
    const resume = {
      href: '/resume/karthikeyan-resume.pdf',
      label: 'Download Resume',
      headerLabel: 'Resume',
      note: 'PDF',
    } satisfies ResumeContent;

    expect(getResumeDownloadName(resume)).toBe('karthikeyan-resume.pdf');
  });
});
