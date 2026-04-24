import rawEnglishContent from './site-content.en.json';
import rawGermanContent from './site-content.de.json';
import { parseSiteContent, type Locale } from './site-content.schema';

export const locales = ['en', 'de'] as const;
export const defaultLocale: Locale = 'en';

export const localizedContent = {
  en: parseSiteContent(rawEnglishContent),
  de: parseSiteContent(rawGermanContent),
} satisfies Record<Locale, ReturnType<typeof parseSiteContent>>;

export const getSiteContent = (locale: Locale = defaultLocale) => localizedContent[locale];
export const siteContent = getSiteContent(defaultLocale);

export const getLocalePath = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}/`);

export const getAlternateLocale = (locale: Locale): Locale => (locale === 'en' ? 'de' : 'en');
