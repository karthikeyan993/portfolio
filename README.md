# Portfolio & Blog (Astro + Tailwind CSS)

A lightweight, performance-first portfolio and bilingual (EN/DE) blog built as a static Astro site, deployed to Netlify via GitHub Actions.

## Stack

* **Framework**: Astro 5 (static output)
* **Styling**: Tailwind CSS 3
* **Fonts**: Self-hosted Newsreader + Inter via `@fontsource`
* **Content**: Markdown in `src/data/blog/`, schema-validated site content in `src/data/site-content.*.json`
* **i18n**: `en` (default, root) and `de` (under `/de/`), with translation linking via `translationKey`
* **SEO**: Per-page metadata, JSON-LD structured data, sitemap, RSS feeds (`/rss.xml`, `/de/rss.xml`)
* **Testing**: Vitest
* **Package manager**: pnpm 11 via Corepack
* **Runtime**: Node.js 22

## Quick Start

```bash
pnpm install        # install dependencies
pnpm run dev        # start dev server at http://localhost:4321
pnpm run check      # lint + typecheck + tests + production build
pnpm run build      # production build into dist/
```

`PUBLIC_SITE_URL` is required for production/CI builds. Local `dev` and `build` fall back to `http://localhost:4321` when unset.

## Writing Blog Posts

Posts live as Markdown files in `src/data/blog/` and are validated against the schema in `src/content.config.ts`.

### Create a new post

```bash
pnpm run new-post "My First English Blog"             # English (default)
pnpm run new-post "Mein deutscher Blog" -- --lang=de  # German
```

This creates `src/data/blog/<slug>.md` with a frontmatter template.

### Frontmatter

```yaml
---
title: "My First English Blog"
description: "Brief summary of the blog post."
publishedAt: 2026-05-21
language: "en"                  # "en" or "de"
tags: []                        # e.g., ["Astro", "WebDev"]
draft: true                     # drafts are hidden in production
translationKey: "my-first-post" # (optional) links EN ↔ DE versions
---
```

### Linking translated posts

Give the EN and DE versions the **same** `translationKey`. The blog page then shows a language switcher between them.

### Publishing

Flip `draft: true` to `draft: false` and push to `main`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) is the single production deploy path. Netlify's Git auto-deploys must be disabled in the Netlify UI.

```diagram
╭──────────────╮          ╭───────────────────────────────────────╮
│ Pull request │ ───────▶ │ verify: lint, typecheck, tests,       │
╰──────────────╯          │ build, audit, OSV, Semgrep, TruffleHog│
                          ╰───────────────────────────────────────╯
╭───────────────╮         ╭───────────────────╮     ╭────────────────────────╮
│ Push to main  │ ──────▶ │ verify (as above) │ ──▶ │ deploy: download dist/ │
╰───────────────╯         │ + upload dist/    │     │ artifact, netlify-cli  │
                          ╰───────────────────╯     │ deploy --prod          │
                                                    ╰────────────────────────╯
```

The `dist/` artifact built during `verify` is reused by `deploy`, so production is never built twice and the deployed bundle is byte-identical to the one that passed quality gates.

### Required repository configuration

* **Variable** (`Settings → Secrets and variables → Actions → Variables`):
  * `PUBLIC_SITE_URL` — e.g. `https://example.com`
* **Secrets** (`Settings → Secrets and variables → Actions → Secrets`):
  * `NETLIFY_AUTH_TOKEN`
  * `NETLIFY_SITE_ID`

### Netlify configuration

`netlify.toml` only holds runtime HTTP headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, immutable cache for `/_astro/*`). The build itself runs in GitHub Actions; `netlify deploy --dir=dist` only uploads the prebuilt output.
