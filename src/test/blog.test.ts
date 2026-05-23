import { describe, expect, it } from 'vitest';
import type { BlogPost } from '@/lib/blog';
import {
  filterPublishedPosts,
  filterPostsByLocale,
  formatPostDate,
  getBlogPath,
  getLatestPosts,
  getPostAlternatePaths,
  getPostPath,
  getReadingTime,
  sortPostsByPublishedDate,
} from '@/lib/blog';

const makePost = ({
  id,
  draft = false,
  language = 'en',
  publishedAt,
  translationKey,
}: {
  id: string;
  draft?: boolean;
  language?: 'en' | 'de';
  publishedAt: string;
  translationKey?: string;
}) =>
  ({
    id,
    data: {
      draft,
      publishedAt: new Date(publishedAt),
      language,
      title: id,
      description: id,
      tags: [],
      translationKey,
    },
  }) as unknown as BlogPost;

describe('blog helpers', () => {
  it('sorts posts by publish date descending', () => {
    const posts = [
      makePost({ id: 'oldest', publishedAt: '2024-01-01T00:00:00.000Z' }),
      makePost({ id: 'newest', publishedAt: '2025-01-01T00:00:00.000Z' }),
      makePost({ id: 'middle', publishedAt: '2024-06-01T00:00:00.000Z' }),
    ];

    expect(sortPostsByPublishedDate(posts).map((post) => post.id)).toEqual([
      'newest',
      'middle',
      'oldest',
    ]);
  });

  it('filters posts by locale', () => {
    const posts = [
      makePost({ id: 'en-post', publishedAt: '2024-01-01T00:00:00.000Z', language: 'en' }),
      makePost({ id: 'de-post', publishedAt: '2024-01-01T00:00:00.000Z', language: 'de' }),
    ];

    expect(filterPostsByLocale(posts, 'en').map((p) => p.id)).toEqual(['en-post']);
    expect(filterPostsByLocale(posts, 'de').map((p) => p.id)).toEqual(['de-post']);
  });

  it('limits latest posts and excludes drafts in production mode', () => {
    const posts = [
      makePost({ id: 'first', publishedAt: '2024-01-01T00:00:00.000Z' }),
      makePost({ id: 'draft', publishedAt: '2025-01-01T00:00:00.000Z', draft: true }),
      makePost({ id: 'second', publishedAt: '2024-06-01T00:00:00.000Z' }),
      makePost({ id: 'third', publishedAt: '2024-09-01T00:00:00.000Z' }),
    ];

    const publishedPosts = filterPublishedPosts(posts);
    const publishedIds = publishedPosts.map((post) => post.id);

    if (import.meta.env.DEV) {
      expect(publishedIds).toEqual(['first', 'draft', 'second', 'third']);
      expect(getLatestPosts(posts, 2).map((post) => post.id)).toEqual(['draft', 'third']);
      return;
    }

    expect(publishedIds).toEqual(['first', 'second', 'third']);
    expect(getLatestPosts(posts, 2).map((post) => post.id)).toEqual(['third', 'second']);
  });

  it('builds stable blog paths for index and posts', () => {
    const post = makePost({ id: 'hello-world', publishedAt: '2024-01-01T00:00:00.000Z' });

    expect(getBlogPath('en')).toBe('/blog/');
    expect(getPostPath(post, 'en')).toBe('/blog/hello-world/');
    expect(getBlogPath('de')).toBe('/de/blog/');
    expect(getPostPath(post, 'de')).toBe('/de/blog/hello-world/');
  });

  it('builds translated post alternates without unpublished drafts', () => {
    const post = makePost({ id: 'hello', publishedAt: '2024-01-01T00:00:00.000Z', translationKey: 'hello' });
    const publishedTranslation = makePost({ id: 'hallo', publishedAt: '2024-01-02T00:00:00.000Z', language: 'de', translationKey: 'hello' });
    const draftTranslation = makePost({ id: 'draft', publishedAt: '2024-01-03T00:00:00.000Z', language: 'de', translationKey: 'hello', draft: true });

    const alternates = getPostAlternatePaths(post, [post, publishedTranslation, draftTranslation]);

    if (import.meta.env.DEV) {
      expect(alternates).toEqual({ en: '/blog/hello/', de: '/de/blog/draft/' });
      return;
    }

    expect(alternates).toEqual({ en: '/blog/hello/', de: '/de/blog/hallo/' });
  });

  it('formats reading metadata', () => {
    const body = 'word '.repeat(221);

    expect(getReadingTime(body, 'minutes')).toBe('2 minutes');
    const stableDate = new Date('2024-04-20T12:00:00.000Z');
    expect(formatPostDate(stableDate, 'en')).toContain('2024');
    expect(formatPostDate(stableDate, 'de')).toContain('2024');
  });
});
