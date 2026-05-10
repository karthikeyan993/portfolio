import { defaultLocale, locales } from '@/data/site-content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale, SiteContent } from '@/data/site-content.schema';

type OgType = 'website' | 'article';

type AlternateLink = {
  hreflang: string;
  href: string;
};

type SeoInput = {
  baseUrl: URL | string;
  content: SiteContent;
  currentPath: string;
  description: string;
  image?: string;
  locale: Locale;
  noindex?: boolean;
  ogType: OgType;
  publishedTime?: Date;
  tags?: string[];
  title: string;
  updatedTime?: Date;
  alternatePaths?: Partial<Record<Locale, string>>;
};

export type PageSeo = {
  alternateLinks: AlternateLink[];
  canonicalUrl: string;
  imageUrl: string;
  localeCode: string;
  robots: string;
  structuredData: Record<string, unknown>[];
};

const localeCodes: Record<Locale, string> = {
  en: 'en_US',
  de: 'de_DE',
};

const normalizePath = (path: string) => {
  const pathname = path.split(/[?#]/)[0] || '/';
  const prefixed = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return prefixed === '/' ? prefixed : prefixed.replace(/\/?$/, '/');
};

const toAbsoluteUrl = (path: string, baseUrl: URL | string) => {
  return new URL(path, baseUrl).toString();
};

const getAlternateLinks = (currentPath: string, locale: Locale, baseUrl: URL | string, alternatePaths?: Partial<Record<Locale, string>>): AlternateLink[] => {
  const normalizedPath = normalizePath(currentPath);

  if (alternatePaths) {
    const links: AlternateLink[] = [];
    for (const [l, p] of Object.entries(alternatePaths)) {
      if (p) {
        links.push({ hreflang: l, href: toAbsoluteUrl(p, baseUrl) });
      }
    }
    if (alternatePaths[defaultLocale]) {
      links.push({ hreflang: 'x-default', href: toAbsoluteUrl(alternatePaths[defaultLocale]!, baseUrl) });
    } else {
      links.push({ hreflang: 'x-default', href: toAbsoluteUrl(normalizedPath, baseUrl) });
    }
    return links;
  }

  const localizedHomePaths = new Set(locales.map((item) => getRelativeLocaleUrl(item, '/')));
  const isLocalizedHome = localizedHomePaths.has(normalizedPath);

  if (!isLocalizedHome) {
    const canonicalUrl = toAbsoluteUrl(normalizedPath, baseUrl);
    return [
      { hreflang: locale, href: canonicalUrl },
      { hreflang: 'x-default', href: canonicalUrl },
    ];
  }

  const localizedLinks = locales.map((item) => ({
    hreflang: item,
    href: toAbsoluteUrl(getRelativeLocaleUrl(item, '/'), baseUrl),
  }));

  return [
    ...localizedLinks,
    { hreflang: 'x-default', href: toAbsoluteUrl(getRelativeLocaleUrl(defaultLocale, '/'), baseUrl) },
  ];
};

const getProfileLinks = (content: SiteContent) => {
  return content.contact.links
    .filter((link) => link.platform !== 'email' && link.href)
    .map((link) => link.href);
};

const getKnownTechnologies = (content: SiteContent) => {
  return [...new Set(content.techStack.categories.flatMap((category) => category.techs.filter(Boolean)))];
};

const buildStructuredData = (input: SeoInput, canonicalUrl: string, imageUrl: string) => {
  const homeUrl = toAbsoluteUrl(getRelativeLocaleUrl(defaultLocale, '/'), input.baseUrl);
  const personName = input.content.seo.author || input.content.hero.name || input.content.seo.siteName;
  const person = {
    '@type': 'Person',
    name: personName,
    jobTitle: input.content.hero.titles[0] || undefined,
    url: homeUrl,
    email: input.content.contact.email || undefined,
    sameAs: getProfileLinks(input.content),
    knowsAbout: getKnownTechnologies(input.content),
  };

  const website = {
    '@type': 'WebSite',
    name: input.content.seo.siteName,
    url: homeUrl,
    inLanguage: input.locale,
    publisher: person,
  };

  const page =
    input.ogType === 'article'
      ? {
          '@type': 'BlogPosting',
          headline: input.title,
          description: input.description,
          url: canonicalUrl,
          image: imageUrl,
          datePublished: input.publishedTime?.toISOString(),
          dateModified: input.updatedTime?.toISOString() ?? input.publishedTime?.toISOString(),
          keywords: input.tags,
          author: person,
          publisher: person,
        }
      : {
          '@type': 'ProfilePage',
          name: input.title,
          description: input.description,
          url: canonicalUrl,
          image: imageUrl,
          about: person,
        };

  return [
    {
      '@context': 'https://schema.org',
      '@graph': [website, person, page],
    },
  ];
};

export const buildPageSeo = (input: SeoInput): PageSeo => {
  const normalizedPath = normalizePath(input.currentPath);
  const canonicalUrl = toAbsoluteUrl(normalizedPath, input.baseUrl);
  const imageUrl = toAbsoluteUrl(input.image ?? input.content.seo.image, input.baseUrl);

  return {
    alternateLinks: getAlternateLinks(normalizedPath, input.locale, input.baseUrl, input.alternatePaths),
    canonicalUrl,
    imageUrl,
    localeCode: localeCodes[input.locale],
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
    structuredData: buildStructuredData(input, canonicalUrl, imageUrl),
  };
};
