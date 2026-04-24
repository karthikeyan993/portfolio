import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSiteContent } from '@/data/site-content';
import { isPublishedPost, sortPostsByPublishedDate } from '@/lib/blog';

export async function GET(context: { site?: URL }) {
  const content = getSiteContent('en');
  const posts = sortPostsByPublishedDate((await getCollection('blog')).filter(isPublishedPost));

  return rss({
    title: `${content.hero.name} Blog`,
    description: content.seo.description,
    site: context.site ?? new URL('https://example.com'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: [...post.data.tags, post.data.language.toUpperCase()],
    })),
  });
}
