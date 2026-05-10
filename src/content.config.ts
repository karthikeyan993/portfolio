import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/blog' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    language: z.enum(['en', 'de']).default('en'),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
    cover: image().optional(),
  }),
});

export const collections = { blog };
