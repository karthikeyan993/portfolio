# Blog Authoring Guide

This project uses Astro content collections with Markdown files in `src/data/blog`.

## Create a new post

1. Copy `docs/blog-post-template.md` to `src/data/blog/<your-slug>.md`.
2. Keep the filename slug lowercase and hyphenated.
3. Fill every frontmatter field.
4. Start with `draft: true` while writing.
5. Set `draft: false` when ready to publish.

## Frontmatter rules

- `title`: short and specific.
- `description`: one sentence summary used in cards, SEO, and RSS.
- `publishedAt`: ISO date (`YYYY-MM-DD`).
- `updatedAt`: optional ISO date for substantial revisions.
- `tags`: small, consistent list (`["Astro", "Performance"]`).
- `language`: currently `en` for published routes.
- `translationKey`: optional key reserved for future bilingual linking.
- `draft`: `true` keeps it out of production builds.
- `cover`: optional path/URL.

## Writing guidelines

- Use one `#` heading as the post title.
- Keep sections scannable with `##` headings.
- Prefer short paragraphs and concrete examples.
- Use fenced code blocks with language hints.

## Publishing checklist

1. `draft` changed to `false`.
2. `title`, `description`, and `tags` reviewed.
3. `publishedAt` set correctly.
4. Run `npm run check`.
5. Verify the post appears on `/blog/` and in `/rss.xml`.
