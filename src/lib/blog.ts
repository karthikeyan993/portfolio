import type { CollectionEntry } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '@/data/site-content.schema';

export type BlogPost = CollectionEntry<'blog'>;

export const isPublishedPost = (post: BlogPost) => {
  return import.meta.env.DEV || !post.data.draft;
};

export const filterPublishedPosts = (posts: BlogPost[]) => posts.filter(isPublishedPost);

export const sortPostsByPublishedDate = (posts: BlogPost[]) => {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
};

export const filterPostsByLocale = (posts: BlogPost[], locale: Locale) => {
  return posts.filter((post) => post.data.language === locale);
};

export const getLatestPosts = (posts: BlogPost[], limit = 3) => {
  return sortPostsByPublishedDate(filterPublishedPosts(posts)).slice(0, Math.max(0, limit));
};

export const groupPostsByYear = (posts: BlogPost[]) => {
  return sortPostsByPublishedDate(posts).reduce<Array<{ year: string; posts: BlogPost[] }>>(
    (groups, post) => {
      const year = String(post.data.publishedAt.getFullYear());
      const group = groups.find((item) => item.year === year);
      if (group) {
        group.posts.push(post);
      } else {
        groups.push({ year, posts: [post] });
      }
      return groups;
    },
    []
  );
};

export const getReadingTime = (body: string, suffix = 'min read') => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} ${suffix}`;
};

export const getLanguageLabel = (language: BlogPost['data']['language']) => language.toUpperCase();

export const formatPostDate = (date: Date, locale: Locale) => {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getBlogPath = (locale: Locale) => getRelativeLocaleUrl(locale, '/blog/');
export const getPostPath = (post: Pick<BlogPost, 'id'>, locale: Locale) => getRelativeLocaleUrl(locale, `/blog/${post.id}/`);
