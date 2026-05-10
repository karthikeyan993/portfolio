import { getRelativeLocaleUrl } from 'astro:i18n';
import { getHomeAnchor, getSamePageAnchor } from '@/lib/i18n';
import type { Locale, NavItem, ResumeContent } from '@/data/site-content.schema';

export type HeaderNavLink = {
  label: string;
  href: string;
};

export const getHeaderNavLinks = (items: NavItem[], locale: Locale, isHome: boolean): HeaderNavLink[] => {
  return items.map((item) => ({
    label: item.label,
    href: isHome ? getSamePageAnchor(item.id) : getHomeAnchor(item.id, locale),
  }));
};

export const getHeaderHomeLink = (label: string, locale: Locale, isHome: boolean): HeaderNavLink | null => {
  if (isHome) return null;

  return {
    label,
    href: getRelativeLocaleUrl(locale, '/'),
  };
};

export const getResumeDownloadName = (resume: ResumeContent) => {
  const filename = resume.href.split('/').filter(Boolean).pop();
  return filename || 'resume.pdf';
};
