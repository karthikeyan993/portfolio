import rawEnglishContent from './site-content.en.json';
import rawGermanContent from './site-content.de.json';
import { parseSiteContent, type Locale } from './site-content.schema';
import { hasPublicResume } from '@/lib/resume';

export const locales = ['en', 'de'] as const;
export const defaultLocale: Locale = 'en';

export const localizedContent = {
  en: parseSiteContent(rawEnglishContent),
  de: parseSiteContent(rawGermanContent),
} satisfies Record<Locale, ReturnType<typeof parseSiteContent>>;

for (const content of Object.values(localizedContent)) {
  if (!hasPublicResume(content.resume.href)) {
    throw new Error(`Configured resume file does not exist: ${content.resume.href}`);
  }
}

export const getSiteContent = (locale: Locale = defaultLocale) => localizedContent[locale];
export const siteContent = getSiteContent(defaultLocale);

export const getAlternateLocale = (locale: Locale): Locale => (locale === 'en' ? 'de' : 'en');
