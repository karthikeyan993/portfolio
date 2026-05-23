# Portfolio & Blog (Astro + Tailwind CSS)

A lightweight, performance-first portfolio and bilingual blog built as a static Astro website.

---

## Quick Start

### 1. Setup Dependencies
Ensure you have Node.js 22 installed, then run:
```bash
pnpm install
```

### 2. Local Development
Start the local server with hot module reloading (HMR):
```bash
pnpm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 3. Build & Quality Checks
Run quality checks (eslint, typescript verification, unit tests, and production build):
```bash
pnpm run check
```
This builds your static files under `/dist`.

---

## Writing Blog Posts

Blog posts are stored as Markdown files in `src/data/blog/`.

### 1. Create a New Post
Use the helper script to generate a new post with the correct headers:

* **English Post** (Default):
  ```bash
  pnpm run new-post "My First English Blog"
  ```
* **German Post**:
  ```bash
  pnpm run new-post "Mein deutscher Blog" -- --lang=de
  ```

This creates a draft file in `src/data/blog/<slug>.md` with a pre-configured template.

### 2. Post Frontmatter Fields
The generated markdown header contains the following fields:
```yaml
---
title: "My First English Blog"
description: "Brief summary of the blog post."
publishedAt: 2026-05-21
language: "en"             # "en" or "de"
tags: []                   # e.g., ["Astro", "WebDev"]
draft: true                # true (hidden in production) or false (published)
translationKey: "my-first-post" # (Optional) Used to link EN and DE versions
---
```

### 3. Linking Translated Posts
To link an English post and a German post as translations of each other:
1. Generate both posts (one with `--lang=en`, one with `--lang=de`).
2. Add the **exact same** `translationKey` string to both frontmatter headers.
3. The site will automatically display a language switcher link on the blog page.

---

## CI/CD & Deployments

GitHub Actions is the production deployment gate. Pull requests run verification only. Pushes to `main` run verification first, then deploy `dist/` to Netlify with the pinned `netlify-cli` dev dependency.

### 1. Continuous Integration (GitHub Actions)
Every time you open a Pull Request or push to `main`, GitHub Actions triggers the workflow defined in `.github/workflows/ci.yml`. It runs:
* Linting (`eslint`)
* Astro typechecking (`astro check`)
* Unit tests (`vitest`)
* Production build check
* Dependency audit, OSV Scanner, Semgrep, and TruffleHog

If any check fails, you will receive an alert on GitHub.

### 2. Deployment (Netlify)
The site is configured to compile to `dist/` as defined in `netlify.toml`.

Required GitHub repository configuration:

* Variable: `PUBLIC_SITE_URL`
* Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

Disable Netlify automatic Git deploys in the Netlify UI so GitHub Actions remains the single production deploy path and pushes to `main` do not produce double deploys.

* **To Publish a Draft**: Change `draft: true` to `draft: false` in your markdown file, then push to GitHub.
