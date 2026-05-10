export const getRelativeLocaleUrl = (locale: string, path = '') => {
  if (locale === 'en') return path.startsWith('/') ? path : `/${path}`;
  if (path === '' || path === '/') return `/${locale}/`;
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
};
export const getAbsoluteLocaleUrl = (locale: string, path = '') => {
  return `http://localhost:4321${getRelativeLocaleUrl(locale, path)}`;
};
export const getPathByLocale = (locale: string) => locale;
