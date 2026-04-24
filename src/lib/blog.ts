import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export const isPublishedPost = (post: BlogPost) => {
  return import.meta.env.DEV || !post.data.draft;
};

export const sortPostsByPublishedDate = (posts: BlogPost[]) => {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
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

export const formatPostDate = (date: Date) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
