import { defaultLocale, getLocalePath } from '@/data/site-content';
import type { Locale } from '@/data/site-content.schema';

export const getLocalizedPath = (path: string, locale: Locale) => {
  if (locale === defaultLocale) return path;
  if (path === '/') return getLocalePath(locale);
  return `/${locale}${path}`.replace(/\/+/g, '/');
};

export const getHomeAnchor = (id: string, locale: Locale) => {
  return locale === defaultLocale ? `/#${id}` : `/${locale}/#${id}`;
};

export const getSamePageAnchor = (id: string) => `#${id}`;
