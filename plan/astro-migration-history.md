# Astro Static Blog Architecture

## Summary

- Migrate the portfolio from Vite SPA to Astro so portfolio and blog pages are generated as static HTML.
- Use Markdown files in Git for posts; no admin page in v1.
- Deploy to Netlify first. DigitalOcean App Platform can host the generated `dist` later, but a Droplet is unnecessary unless a custom backend, admin, or database is added.
- Publishing workflow: write Markdown, commit, push, Netlify builds and publishes.

## Key Changes

- Add Astro routing for `/`, `/blog/`, `/blog/[slug]/`, `/404/`, `/rss.xml`, and sitemap generation.
- Move existing non-blog portfolio data from `src/content` to `src/data` because Astro reserves content collections for `src/content`.
- Add an Astro v5 blog content collection loaded from Markdown files with the Content Layer API, `defineCollection`, and a `glob()` loader. Use filename-derived entry IDs/slugs and frontmatter like:

```yaml
title: "Post title"
description: "Short SEO/social summary"
publishedAt: 2026-04-24
updatedAt: 2026-04-24 # optional
tags: ["React", "Career"]
draft: false
cover: "./cover.png" # optional
```

- Filter `draft: true` from production builds while allowing drafts in local development if useful.
- Keep the current glass/gradient visual language, Tailwind tokens, fonts, and motion style.

## Astro and React Boundaries

- Create an Astro `BaseLayout.astro` for document HTML, metadata, global styles, fonts, theme boot script, background orbs, footer, and the static Netlify form.
- Replace the current React `AppShell` wrapper with Astro layout structure plus a smaller hydrated React header island. Do not hydrate the whole page just to support the menu/theme controls.
- Keep the header/navigation React island with `client:load` because it needs scroll state, mobile menu state, theme toggling, and accessible interactive controls.
- Keep `Contact` as a React island with `client:load` because it owns form state, submit state, and AJAX submission.
- Convert static sections (`Hero`, `About`, `TechStack`, `Experience`, `FeaturedProject`, `Projects`, blog cards, and blog article shell) to `.astro` components for zero client JavaScript.
- Replace the React `Reveal`/`framer-motion` wrapper in static sections with CSS-based reveal animation or Astro-friendly static transitions. If a React reveal component is retained for a section, hydrate that specific component with `client:visible`, not `client:load`.
- Keep `framer-motion` only where animation genuinely requires React runtime behavior; prefer CSS for page-load and scroll reveal effects to reduce shipped JS.

## Theme Strategy

- Move the dark-mode initialization out of the React `useTheme` hook and into an inline head script in `BaseLayout.astro`.
- The inline script must run before paint, read `localStorage.theme`, fall back to `prefers-color-scheme`, and add/remove the `dark` class on `<html>` to prevent flash-of-wrong-theme.
- Keep the same storage key (`theme`) so existing user preferences survive the migration.
- The hydrated header theme button should only toggle the already-initialized `html.dark` class and update `localStorage`.

## Blog UX

- Homepage gets a "Latest Writing" section with the newest 3 published posts and a "Read all" link.
- `/blog/` shows an editorial hero, latest/featured post card, tag chips, and a responsive post grid.
- `/blog/[slug]/` shows title, description, publish date, updated date if present, tags, reading time, optional cover image, Markdown body, back link, and contact/project CTA.
- Markdown body uses a reusable `Prose.astro` wrapper with Tailwind Typography classes for headings, links, lists, code blocks, blockquotes, and images.
- Use Astro's built-in Shiki syntax highlighting for fenced Markdown code blocks; configure light/dark themes in `astro.config.mjs` if the default does not match the site theme.

## Navigation

- Add a real `Blog` nav item that links to `/blog/`.
- On the homepage, section links should remain anchors like `#about`, `#projects`, and `#contact`.
- On blog/detail pages, the same section links should point back to homepage anchors like `/#about`, `/#projects`, and `/#contact`.
- Header active state should be pathname-aware: use the IntersectionObserver section state only on `/`, and mark `Blog` active on `/blog/` and `/blog/[slug]/`.

## Content and Validation

- Use Astro v5's Content Layer API in `src/content.config.ts`; do not use the Astro v4 `src/content/config.ts` file or old magic-folder assumptions.
- Define the blog collection with `defineCollection` from `astro:content`, `glob` from `astro/loaders`, and `z` from `astro/zod`.
- Store blog posts in a normal content directory such as `src/data/blog` and load them with `glob({ pattern: "**/*.{md,mdx}", base: "./src/data/blog" })`.
- Keep the existing `zod`-based `site-content.schema.ts` for portfolio JSON validation during the migration because that data remains ordinary JSON, not an Astro content collection.
- Revisit the external `zod` dependency only after portfolio JSON is either stable enough to stop runtime validation or moved into an Astro-supported data/content pattern.
- Sort posts explicitly by `publishedAt` descending; Astro collection order is not the source of truth.
- Derive reading time from Markdown body during build/render and keep the helper deterministic.

## Netlify Forms

- Move the current hidden `portfolio-contact` form from `index.html` into `BaseLayout.astro` or a static `NetlifyContactForm.astro` rendered by the base layout.
- Preserve the exact static detection fields: `name="portfolio-contact"`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`, hidden `form-name`, `name`, `email`, `message`, and `bot-field`.
- Keep the visible contact UI as a hydrated React form that posts URL-encoded data to `/` with `form-name=portfolio-contact`.
- Do not use `client:only` for the contact form; Netlify must be able to see static form markup during deploy.

## Dependencies and Config

- Add `astro`, `@astrojs/react`, `@astrojs/check`, `@astrojs/rss`, `@astrojs/sitemap`, and `@tailwindcss/typography`.
- Do not add `@astrojs/tailwind` for this migration. Current Astro docs mark it deprecated; keep the existing Tailwind v3/PostCSS setup and import the global CSS from `BaseLayout.astro`.
- Keep Tailwind v3 for the first migration because the current project already uses Tailwind v3 config and PostCSS; upgrade to Tailwind v4 with `@tailwindcss/vite` only as a separate follow-up.
- Add `@tailwindcss/typography` to `tailwind.config.js` plugins and use `prose`/`dark:prose-invert` in the blog prose wrapper.
- Replace `vite.config.ts` with `astro.config.mjs`, including React, sitemap, site URL, Markdown Shiki configuration, and any Vite resolver config still needed for aliases.
- Preserve the `@/*` import alias through `tsconfig.json` paths and Astro config/Vite resolver support as needed.
- Keep Netlify config with `npm run build` and `dist`; no SPA redirect is needed after Astro static route generation.
- Do not add the Netlify adapter in v1 unless server-side Astro features or Netlify Image CDN become required.
- Set `PUBLIC_SITE_URL` or Astro `site` before production so canonical URLs, RSS, and sitemap are correct.

## Test Plan

- Run Astro type/content validation with `astro check`.
- Run production build and confirm generated routes include `/`, `/blog/`, each post page, `/rss.xml`, `/sitemap-index.xml` or sitemap output, and `/404/`.
- Verify direct page loads on Netlify for `/blog/` and `/blog/example-post/`.
- Verify homepage anchor navigation, blog page navigation back to homepage anchors, mobile menu behavior, theme toggle behavior, and no dark-mode FOUC.
- Verify draft posts are excluded from production output.
- Verify Markdown rendering for headings, links, images, blockquotes, lists, inline code, and fenced code blocks.
- Verify Netlify still detects `portfolio-contact` and that the visible contact form submits successfully.
- Add unit tests or build-time checks for post sorting, draft filtering, and reading-time calculation if implemented outside Astro templates.

## Assumptions

- You are the only blog author for now.
- Posts are not high-frequency enough to require a database or runtime CMS.
- SEO and direct article URLs matter enough to justify Astro migration.
- Netlify is the primary host for v1.

## Post-Migration Review

- Completed cleanup of dead Vite SPA files: old `index.html`, `vite.config.ts`, React root, old shell/layout, old static React sections, old unused UI wrappers, and obsolete `App.test.tsx`.
- Kept `src/sections/Contact.tsx` as the active hydrated React island and refactored it to depend only on `src/ui/Button.tsx`.
- Kept `@vitejs/plugin-react` because `vitest.config.ts` still runs React component tests directly outside Astro; the config documents this.
- Kept `src/content.config.ts`; this is the canonical Astro v5 content collection config location according to current Astro docs. The root-level move suggestion was invalid.
- Updated Shiki to light/dark themes and added `.dark .astro-code` CSS so code blocks follow the site theme.
- Added the `/rss.xml` autodiscovery `<link>` in `BaseLayout.astro`.
- Added an empty blog state for zero published posts.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Astro front-end framework components](https://docs.astro.build/en/guides/framework-components/)
- [Astro syntax highlighting](https://docs.astro.build/en/guides/syntax-highlighting/)
- [Astro Tailwind Typography recipe](https://docs.astro.build/en/recipes/tailwind-rendered-markdown/)
- [Astro import aliases](https://docs.astro.build/en/guides/imports/#aliases)
- [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
- [Netlify Forms setup](https://docs.netlify.com/forms/setup/)
- [Astro RSS](https://docs.astro.build/en/recipes/rss/)
- [Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
