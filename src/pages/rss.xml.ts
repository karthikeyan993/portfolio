import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSiteContent } from '@/data/site-content';
import { filterPublishedPosts, filterPostsByLocale, getPostPath, sortPostsByPublishedDate } from '@/lib/blog';
import { DEV_SITE_URL } from '@/lib/constants';

export const GET = (async ({ site }) => {
  const content = getSiteContent('en');
  const posts = sortPostsByPublishedDate(filterPostsByLocale(filterPublishedPosts(await getCollection('blog')), 'en'));
  const finalSite = site ?? new URL(DEV_SITE_URL);

  return rss({
    title: `${content.hero.name} Blog`,
    description: content.seo.description,
    site: finalSite,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: getPostPath(post, 'en'),
      categories: [...post.data.tags, post.data.language.toUpperCase()],
    })),
  });
}) satisfies APIRoute;
