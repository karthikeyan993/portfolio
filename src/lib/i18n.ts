import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '@/data/site-content.schema';

export { getRelativeLocaleUrl, getAbsoluteLocaleUrl, getPathByLocale } from 'astro:i18n';

export const getHomeAnchor = (id: string, locale: Locale) => {
  return `${getRelativeLocaleUrl(locale, '/')}#${id}`;
};

export const getSamePageAnchor = (id: string) => `#${id}`;
