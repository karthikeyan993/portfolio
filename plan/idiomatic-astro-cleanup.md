# Idiomatic Astro Cleanup

> Status: **Done**.
> Verified on 2026-05-10 with `npm run check` plus built-output spot checks
> for localized blog links, RSS links, hreflang output, schema defaults, and
> `BaseLayout.astro` line count.

> Audience: a coding agent working on this Astro 5 portfolio repo.
> Source of truth for "idiomatic": <https://docs.astro.build/en/getting-started/> and the linked sub-pages it indexes (project structure, content collections, scripts, i18n, images, endpoints).
>
> Each task below is **independent and atomic**. Execute them in the
> **Suggested execution order** near the bottom of this file — earlier tasks in
> that order remove dead code that later tasks depend on. Do **not** combine
> tasks into one mega-PR. Keep visual output identical unless the task
> explicitly says otherwise.
>
> Verify after every task with:
>
> ```bash
> npm run check   # lint + typecheck + test + build
> ```
>
> If `npm run check` was passing before your task and fails after, your task is **not done** — fix it before moving on.
>
> When a task asks you to compare built HTML, remember `dist/` is ignored by
> git. Build a before/after snapshot into temporary directories and use
> `diff -ru`, or compare against a separate `main` worktree. Do **not** rely on
> `git diff dist/`.

---

## Background — what is wrong with this repo today

The repo is functionally an Astro 5 site, but it carries patterns from its earlier Vite/React life:

- Empty leftover directories (`src/app/`, `src/sections/`, `src/ui/`, project-root `untitled folder/`).
- Component placement that works against Astro's conventional
  [Project Structure](https://docs.astro.build/en/basics/project-structure/) recommendations
  (a "page" living in `src/components/`, an empty `src/sections/` while real
  sections live in `src/components/sections/`).
- A god-layout (`src/layouts/BaseLayout.astro`, 182 lines) that mixes SEO meta,
  theme boot, mobile menu glue, scroll-to-top, locale-link binding, and the
  document shell.
- Hand-rolled i18n helpers in `src/lib/i18n.ts` that duplicate
  `astro:i18n` ([docs](https://docs.astro.build/en/guides/internationalization/#routing)).
- Endpoints (`pages/robots.txt.ts`, `pages/rss.xml.ts`) typed manually instead
  of using `APIRoute` / `APIContext`
  ([docs](https://docs.astro.build/en/guides/endpoints/)).
- `[slug].astro` uses `Astro.props as { post: BlogPost }` instead of
  `InferGetStaticPropsType` ([docs](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths)).
- Some page-side scripts still carry migration-era script patterns:
  `BaseLayout.astro` uses an unnecessary body-end `is:inline` script with
  `define:vars`, while `Header.astro` and `NetlifyContactForm.astro` use
  processed scripts but rely on explicit idempotency guards for
  `astro:after-swap` re-binding ([docs](https://docs.astro.build/en/guides/client-side-scripts/)).
- Blog cover images render as raw `<img>` tags instead of the `<Image />`
  component from `astro:assets`
  ([docs](https://docs.astro.build/en/guides/images/#image--astroassets)).
- Blog frontmatter has `language: 'en' | 'de'` but `/blog/` and `/rss.xml`
  always serve **all languages**; there is no `/de/blog/`.
- `site-content.schema.ts` repeats the same default object in field-level
  `.default()` calls **and** in the parent `.default({...})`.

The tasks below fix these one at a time.

---

## Task 1 — Delete dead directories and stray files

### Problem

These paths exist but contain no source code that ships:

- `src/app/` — empty.
- `src/sections/` — empty (real sections live in `src/components/sections/`).
- `src/ui/` — empty.
- `untitled folder/` at the workspace root — likely an editor accident.
- `astro-migrate.md` at the workspace root — historical migration note,
  superseded by `plan/`.

They confuse new contributors (and `find`/IDE jump-to-file).

### Outcome

- `src/app/`, `src/sections/`, `src/ui/`, and `untitled folder/` are deleted.
- `astro-migrate.md` is moved into `plan/astro-migration-history.md` (kept as
  an archival reference; do **not** delete it).

### Steps

1. `rm -rf src/app src/sections src/ui "untitled folder"`.
2. `git mv astro-migrate.md plan/astro-migration-history.md`.
3. `rg -n "src/app|src/sections|src/ui|astro-migrate" --glob '!plan/**'`
   — confirm no source/config reference remains. The unscoped command will
   match this plan and the archived migration note, which is expected.

### Validation

- `npm run check` passes.
- `ls src/` shows only: `components/`, `data/`, `layouts/`, `lib/`, `pages/`,
  `test/`, `content.config.ts`, `index.css`.

---

## Task 2 — Move `HomePage.astro` out of `src/components/`

### Problem

[`src/components/HomePage.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/components/HomePage.astro)
is **not a reusable component** — it is the page-level composition of the
homepage sections (Hero, About, Experience, …). It is imported by exactly two
files: [`src/pages/index.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/index.astro)
and [`src/pages/de/index.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/de/index.astro).

This works against Astro's conventional [project-structure
guidance](https://docs.astro.build/en/basics/project-structure/#srccomponents):
`src/components/` is commonly used for reusable building blocks, while route
compositions are clearer in `src/pages/` or, when shared across routes, in
`src/layouts/`. Astro does not forbid other directory choices; this task is
about making the repo easier to navigate.

### Outcome

- `HomePage.astro` is renamed to `src/layouts/HomeLayout.astro`.
- It accepts a `<slot />` for any page-specific content above/below the
  sections (currently none, but future-proof) **or** simply renders the
  sections — choose whichever keeps both EN and DE pages a single line of
  composition.
- Both `src/pages/index.astro` and `src/pages/de/index.astro` import the new
  layout via `@/layouts/HomeLayout.astro`.

### Steps

1. `git mv src/components/HomePage.astro src/layouts/HomeLayout.astro`.
2. Update the two import paths in `src/pages/index.astro` and
   `src/pages/de/index.astro`.
3. `rg -n "components/HomePage"` — must return zero matches.

### Validation

- `npm run check` passes.
- Visiting `/` and `/de/` in `npm run dev` renders identical sections to
  before.

---

## Task 3 — Replace hand-rolled i18n helpers with `astro:i18n`

### Problem

[`src/lib/i18n.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/lib/i18n.ts)
manually constructs locale paths:

```ts
export const getLocalizedPath = (path: string, locale: Locale) => {
  if (locale === defaultLocale) return path;
  if (path === '/') return getLocalePath(locale);
  return `/${locale}${path}`.replace(/\/+/g, '/');
};
```

Astro 5 already ships
[`astro:i18n`](https://docs.astro.build/en/guides/internationalization/#virtual-modules)
with `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`, and `getPathByLocale`
that respect `astro.config.mjs` (`prefixDefaultLocale`, `defaultLocale`,
trailing-slash policy). Re-implementing them by hand:

- Drifts when `astro.config.mjs` changes (e.g. enabling
  `prefixDefaultLocale: true`).
- Misses edge cases (URL-encoded segments, query/hash, `trailingSlash:
  'never'`).

### Outcome

- `src/lib/i18n.ts` re-exports `astro:i18n` helpers and contains **only**
  app-specific constants (`BLOG_INDEX_PATH`) and app-specific composers
  (`getHomeAnchor`, `getBlogPostPath`).
- `getLocalizedPath`, `getHomePath`, and any other manual locale-prefix
  builders are deleted; callers use `getRelativeLocaleUrl(locale, path)`.
- [`src/data/site-content.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/data/site-content.ts)'s
  `getLocalePath` is deleted; callers that need a locale URL use
  `getRelativeLocaleUrl(locale, '/')` from `astro:i18n` (directly or via the
  app-specific helpers in `src/lib/i18n.ts`).

### Caution — tests and virtual modules

`astro:i18n` is an Astro virtual module. Because this task's default outcome
has a plain TypeScript module (`src/lib/i18n.ts`) import or re-export it,
Vitest must be able to resolve it. Add a Vitest alias/mock for `astro:i18n`
that mirrors this repo's `astro.config.mjs` (`defaultLocale: 'en'`,
`locales: ['en', 'de']`, `prefixDefaultLocale: false`) and keep tests only
for app-specific wrapper behavior.

If you deliberately avoid a mock instead, then do not re-export `astro:i18n`
from plain TS modules that tests import; call it only from Astro-rendered code
and update this task's outcome accordingly. Do not leave `npm run test` unable
to resolve `astro:i18n`.

### Steps

1. Read the [Astro i18n routing
   docs](https://docs.astro.build/en/guides/internationalization/#routing)
   end-to-end before editing.
2. Decide and implement the Vitest strategy above **before** replacing the
   helpers.
3. Replace each call site (use `rg -n "getHomePath|getLocalizedPath|getLocalePath"`
   to find them all).
4. Update `src/test/i18n.test.ts` to assert against the new app-specific
   helpers, or delete tests that are now testing first-party Astro behavior.

### Validation

- `npm run check` passes.
- `/`, `/de/`, `/blog/`, `/blog/<slug>/` all render and link correctly.
- The header `EN/DE` toggle still navigates to the alternate locale's home.

---

## Task 4 — Type endpoints and `getStaticPaths` properly

### Problem

Three places use loose typing where Astro provides exact types:

1. [`src/pages/robots.txt.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/robots.txt.ts):
   `function GET(context: { site?: URL })` — should use `APIRoute` /
   `APIContext`.
2. [`src/pages/rss.xml.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/rss.xml.ts):
   same issue.
3. [`src/pages/blog/[slug].astro`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/blog/%5Bslug%5D.astro):

   ```ts
   const { post } = Astro.props as { post: BlogPost };
   ```

   The `as` cast hides type errors when `getStaticPaths` returns a different
   shape. Astro provides
   [`InferGetStaticPropsType`](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths)
   for this exact case.

### Outcome

- Both endpoint files export either `export const GET: APIRoute = (...) => {...}`
  or the docs-preferred `export const GET = ((...) => {...}) satisfies APIRoute;`.
- `[slug].astro` uses
  `type Props = InferGetStaticPropsType<typeof getStaticPaths>;` with
  `const { post } = Astro.props;` (no cast).

### Steps

1. `import type { APIRoute } from 'astro';` in both endpoint files.
2. In `[slug].astro`, add `import type { InferGetStaticPropsType } from 'astro';`
   and replace the cast.
3. Remove the local `BlogPost` import/type aliasing if it becomes unused.

### Validation

- `npm run typecheck` passes.
- `curl -s http://localhost:4321/robots.txt` and
  `curl -s http://localhost:4321/rss.xml` return the same body as before
  during `npm run dev`.

---

## Task 5 — Stop overusing `is:inline` and make script binding explicit

### Problem

Per the [client-side scripts
docs](https://docs.astro.build/en/guides/client-side-scripts/), Astro processes
any `<script>` tag that has no attributes other than `src`: TypeScript works,
imports are bundled, the script becomes a module, and duplicate component
instances include the script only once. The codebase partially ignores this:

- [`src/layouts/BaseLayout.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/layouts/BaseLayout.astro)
  has a body-end `<script is:inline define:vars=...>` plus a manual
  `document.body.dataset.layoutHandlersBound === 'true'` guard. This should
  be a normal processed script.
- [`src/components/Header.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/components/Header.astro)
  already uses a normal processed script, but its setup function is called on
  initial load and `astro:after-swap`; its `trigger.dataset.bound` guard is an
  idempotency guard, **not** an `is:inline` workaround.
- [`src/components/NetlifyContactForm.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/components/NetlifyContactForm.astro)
  likewise already uses a normal processed script, but its `form.dataset.bound`
  guard prevents duplicate listeners when setup runs after a view-transition
  swap.

The **only** script that legitimately needs `is:inline` is the
no-FOUC theme bootstrap in `BaseLayout.astro` head (it must run before paint
and cannot be a deferred bundle). Keep that one. JSON-LD does not need the
`is:inline` directive; a `<script type="application/ld+json" set:html={...}>`
is already unprocessed because it has a non-JavaScript type.

### Outcome

- `BaseLayout.astro` body-end script: `is:inline` removed, `dataset` guard
  removed, `define:vars` removed (replace `defaultLocale` with a normal
  `import` since the script is now a TS module).
- `Header.astro` and `NetlifyContactForm.astro` keep normal processed
  `<script>` tags. Preserve their idempotency behavior: either keep the
  `dataset.bound` guards, or replace them with an equivalent explicit cleanup
  pattern such as an `AbortController` that prevents duplicate listeners.
- The head theme bootstrap in `BaseLayout.astro` keeps `is:inline` and adds a
  short comment explaining why.
- `rg -n "is:inline" src` returns exactly one match: the no-FOUC theme
  bootstrap.

### Steps

1. Remove `is:inline` from the `BaseLayout.astro` body-end script and from
   JSON-LD. Do not add `is:inline` to processed component scripts.
2. Convert `define:vars={{ defaultLocale }}` to a top-of-script `import { defaultLocale } from '@/data/site-content';`.
3. Delete `dataset.layoutHandlersBound` from `BaseLayout.astro`. Do **not**
   delete `dataset.bound` in `Header.astro` or `NetlifyContactForm.astro`
   unless you replace it with equivalent idempotency.
4. The `astro:after-swap` listeners (`Header.astro`,
   `NetlifyContactForm.astro`) **stay** if view transitions remain possible —
   setup still needs to re-run against swapped DOM.

### Validation

- `npm run build && npm run preview` and manually exercise:
  - mobile menu open/close on `<768px`,
  - theme toggle persists across reload,
  - contact form validation triggers on blur and submit,
  - scroll-to-top button appears after scrolling >400px,
  - locale toggle saves choice in `localStorage`.
- `rg -n "is:inline" src` returns exactly one match, the theme bootstrap.
- `rg -n "define:vars|layoutHandlersBound" src` returns zero matches unless a
  later task deliberately uses `define:vars` only for the theme bootstrap.
- Do **not** require processed scripts to appear as hashed files in DevTools:
  Astro may automatically inline small processed scripts as an optimization.

---

## Task 6 — Use `<Image />` from `astro:assets` for blog covers

### Problem

[`src/pages/blog/[slug].astro`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/blog/%5Bslug%5D.astro)
renders cover images as `<img src={post.data.cover} alt="" class="..." />`.
Per the [images guide](https://docs.astro.build/en/guides/images/), this:

- Skips Astro's image optimization (no width/height inference, no `srcset`,
  no AVIF/WebP).
- Causes layout shift (no intrinsic dimensions on the `<img>`).
- Has `alt=""` even for non-decorative covers — accessibility regression.

The blog content collection's `cover` field is also currently
`z.string().optional()` — it should be `image()` so Astro can resolve and
optimize the asset at build time.

### Outcome

- [`src/content.config.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/content.config.ts)
  uses `cover: image().optional()` (Astro's
  [`image()` schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections)).
- `[slug].astro` imports `<Image />` from `astro:assets` and renders covers
  with proper `width`/`height` and `alt={post.data.title}`.
- Because `image()` changes `post.data.cover` from a string to image metadata,
  any SEO/layout prop that expects a URL string receives `post.data.cover?.src`
  (or the prop type is deliberately widened and handled safely). Do not pass
  the image metadata object to `new URL()` or string-only SEO helpers.
- Existing covers (if any) are moved into `src/data/blog/` next to the
  Markdown so the `image()` loader resolves them relatively.

### Steps

1. Update the `blog` collection schema in `content.config.ts`:
   `import { defineCollection, z } from 'astro:content';`
   change cover to use the second arg `({ image }) => z.object({...})`.
2. Update existing posts' frontmatter to use a relative cover path (currently
   none of the two seed posts has a cover — verify with
   `rg -n "^cover:" src/data/blog/`).
3. In `[slug].astro`, swap `<img>` for `<Image src={post.data.cover}
   alt={post.data.title} />`.
4. Update `BaseLayout`/SEO usage in `[slug].astro` from
   `image={post.data.cover}` to a string URL such as
   `image={post.data.cover?.src}`.

### Validation

- `npm run check` passes.
- A post with a cover image renders the optimized output (inspect the
  generated `<picture>`/`<img>` in `dist/blog/<slug>/index.html`).
- A post without a cover renders no `<img>` and no console warning.

---

## Task 7 — Filter the blog by locale and add `/de/blog/`

### Problem

The frontmatter declares `language: 'en' | 'de'`, but:

- [`src/pages/blog/index.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/blog/index.astro)
  shows **all** posts — German posts appear on the English blog index.
- [`src/pages/rss.xml.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/pages/rss.xml.ts)
  emits all posts under the EN site title.
- There is **no** `/de/blog/` or `/de/blog/[slug]/` route, even though
  `astro.config.mjs` declares `locales: ['en', 'de']`.

This contradicts the i18n config and breaks the canonical-URL/hreflang
contract `src/lib/seo.ts` is trying to honour.

### Outcome

- `src/pages/blog/index.astro` shows only `language === 'en'` posts.
- `src/pages/blog/[slug].astro`'s `getStaticPaths` only emits EN posts.
- Mirror routes `src/pages/de/blog/index.astro` and
  `src/pages/de/blog/[slug].astro` exist and show only `language === 'de'`
  posts.
- `src/pages/rss.xml.ts` filters to `language === 'en'`; add a parallel
  `src/pages/de/rss.xml.ts` for German.
- The homepage latest-writing section filters posts by active locale. If the
  German homepage has `writing.enabled` and German posts exist, it can show the
  German latest-writing section instead of being hard-coded to English only.
- Header, footer, blog-card, and RSS alternate links use locale-aware blog
  URLs. `BlogCard.astro` receives the active locale (now for links; Task 13
  will also use it for dates).
- `src/lib/blog.ts` gains `filterPostsByLocale(posts, locale)` and a unit
  test in `src/test/blog.test.ts`.
- `src/lib/i18n.ts`'s `getBlogIndexPath` becomes `getBlogIndexPath(locale)`
  (or use `getRelativeLocaleUrl(locale, '/blog/')`).
- `src/lib/seo.ts` gains enough input to build accurate alternate links for
  localized blog routes. For blog detail pages, only emit translated
  `hreflang` detail links when matching posts share a `translationKey`; do not
  guess that the same slug exists in both locales.

### Steps

1. Add `filterPostsByLocale` to `src/lib/blog.ts` with a test.
2. Apply it in the homepage latest-post query, the four blog routes (EN
   index, EN slug, DE index, DE slug), and the two RSS endpoints.
3. Update `getBlogPath`/`getBlogIndexPath`/`getPostPath` callers to pass the
   active locale. Thread `locale` through `BlogCard.astro` so post links are
   locale-aware.
4. Add a real German seed post if the repository does not already have one.
   Do **not** rely on temporarily marking an English post as German and
   reverting before merge; that makes the validation impossible to reproduce.
5. Update `src/lib/seo.ts`'s alternate-link contract. Prefer passing explicit
   alternate paths (for example `alternatePaths?: Partial<Record<Locale,
   string>>`) from the route rather than making SEO infer translations from
   only `currentPath`.
6. Make the layout's RSS `<link rel="alternate" type="application/rss+xml">`
   locale-aware (`/rss.xml` for EN, `/de/rss.xml` for DE).

### Validation

- `npm run build` produces `dist/blog/<en-slug>/index.html` **and**
  `dist/de/blog/<de-slug>/index.html`.
- `dist/rss.xml` contains only EN posts; `dist/de/rss.xml` contains only DE
  posts.
- Visiting `/blog/` does not list any DE post; visiting `/de/blog/` does not
  list any EN post.
- New unit test for `filterPostsByLocale` passes.

---

## Task 8 — Split `BaseLayout.astro` into focused parts

### Problem

[`src/layouts/BaseLayout.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/layouts/BaseLayout.astro)
(182 lines) does **five** unrelated jobs:

1. Document shell (`<html>`, `<head>`, `<body>`).
2. SEO meta tags + JSON-LD (`<head>` block, ~30 lines).
3. Pre-paint theme bootstrap script.
4. Site chrome (`Header`, footer, scroll-to-top button).
5. Body-end interactivity (theme toggle binding, locale link clicks,
   scroll-to-top behaviour).

A single layout doing all of these is hard to test, hard to reuse, and works
against Astro's [layout guidance](https://docs.astro.build/en/basics/layouts/)
that layouts can compose smaller components.

### Outcome

Split into:

- `src/components/seo/SeoHead.astro` — receives the `pageSeo` object plus
  `title`/`description`/`ogType`/etc. and renders the entire `<head>` meta
  block (everything from `<meta charset>` down to the JSON-LD `<script>`,
  excluding the theme-bootstrap script). JSON-LD should not use `is:inline`;
  it can remain a non-JavaScript `<script type="application/ld+json"
  set:html={...}>`.
- `src/components/ThemeBootstrap.astro` — a single `<script is:inline>` that
  reads `localStorage.theme` and toggles `html.dark` before paint. **This is
  the only file that keeps `is:inline`.**
- `src/components/SiteFooter.astro` — the existing footer markup.
- `src/components/ScrollToTopButton.astro` — the button + its (now bundled)
  script.
- `src/layouts/BaseLayout.astro` — composes the above plus `Header`,
  `<slot />`, and any focused non-inline behavior components/scripts. Locale
  link persistence belongs in `Header.astro` or another focused component, not
  as inline script logic in `BaseLayout.astro`.

The new `BaseLayout.astro` should be **≤ 60 lines** and contain no inline
script logic itself.

### Outcome — props contract preserved

The `Props` interface and defaults of `BaseLayout` **must not change**.
Page files keep working without edits.

### Validation

- `npm run check` passes.
- A before/after built-output comparison shows **zero meaningful diff** in any
  HTML file. Because `dist/` is ignored, use temporary directories (for
  example build `main` in a separate worktree, copy both `dist/` trees to
  `/tmp`, then run `diff -ru`). Whitespace-only diffs are acceptable.

---

## Task 9 — Use `Section.astro` everywhere or delete it

### Problem

[`src/components/Section.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/components/Section.astro)
defines the canonical section wrapper (id, spacing, tinted background,
container max-width). But:

- `Hero.astro`, `About.astro`, `Experience.astro`, `TechStack.astro` each
  re-implement `<section ...><div class="mx-auto max-w-7xl px-4 md:px-8">`
  by hand.
- `FeaturedProject.astro`, `Projects.astro`, `LatestWriting.astro`,
  `NetlifyContactForm.astro` use `Section.astro`.
- The two `max-w-*` values disagree (`max-w-6xl` inside `Section.astro`,
  `max-w-7xl` in the hand-rolled sections).

Either every section uses the primitive, or the primitive should be deleted.
Mixed usage means design drift.

### Outcome

- `Section.astro`'s `containerClass` prop accepts the two width variants
  used today (`max-w-6xl` and `max-w-7xl`) — pick the correct one per
  caller. Do not emit both width classes on the same container and rely on
  Tailwind order; compute the container class so the selected width is
  unambiguous.
- All four hand-rolled sections (`Hero`, `About`, `Experience`, `TechStack`)
  use `<Section id="..." containerClass="max-w-7xl">…</Section>`.
- The hand-rolled spacing classes (`pt-20 md:pt-32 pb-16 md:pb-24` in Hero,
  `py-16 md:py-24` in About/Experience/TechStack) are mapped onto
  `Section.astro`'s `spacing` prop. Add a new spacing variant (e.g.
  `'hero'`) if needed — do not lose the existing visual rhythm.

### Validation

- A before/after built-output diff shows **no visible HTML diff** for the
  homepage (only attribute-order or class-order differences are acceptable).
  Use temporary `dist` snapshots rather than `git diff dist/`.
- `npm run check` passes.

---

## Task 10 — Drop redundant prop forwarding to `BaseLayout`

### Problem

`BaseLayout.astro` defines `currentPath = Astro.url.pathname` as the default
for the `currentPath` prop. Every page nevertheless passes it explicitly:

- `src/pages/index.astro` — `currentPath={Astro.url.pathname}`
- `src/pages/de/index.astro` — `currentPath={Astro.url.pathname}`
- `src/pages/blog/index.astro` — `currentPath={Astro.url.pathname}`
- `src/pages/blog/[slug].astro` — `currentPath={Astro.url.pathname}`
- `src/pages/404.astro` — `currentPath={Astro.url.pathname}`

This is noise. Same for `content={content}` and `locale="en"` — the layout
already defaults to `defaultLocale` and `getSiteContent(locale)`.

### Outcome

- Only **non-default** props are passed at each call site. Specifically:
  - English pages do not pass `locale` (it defaults to `'en'`).
  - No page passes `currentPath` (it defaults to `Astro.url.pathname`).
  - Pages do not pass `content` unless they explicitly need a different
    content object.
- The German homepage **does** still pass `locale="de"`.
- Page files become noticeably shorter.

### Validation

- `npm run check` passes.
- Diff `dist/index.html` and `dist/blog/index.html` from before/after
  temporary build snapshots — they should be byte-identical.

---

## Task 11 — Centralize magic strings and simplify schema defaults safely

### Problem

Two style problems are scattered through the repo:

1. **Magic strings**:
   - `'theme'` (storage key) — used in `BaseLayout.astro` head bootstrap
     and body-end script.
   - `'locale'` (storage key) — used in `BaseLayout.astro` and
     `LocaleRedirect.astro`.
   - `'portfolio-contact'` (form name) — used in `NetlifyContactForm.astro`.
   - `'http://localhost:4321'` (dev fallback) — used in `astro.config.mjs`,
     `pages/robots.txt.ts`, `pages/rss.xml.ts`.
2. **Schema duplication**: every section schema in
   [`src/data/site-content.schema.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/data/site-content.schema.ts)
   sets defaults **per field** *and* repeats the same object inside the
   parent `.default({...})`. Example: `heroSchema` lines 23-45.

### Outcome

- Add `src/lib/constants.ts` exporting:

  ```ts
  export const STORAGE_KEYS = { theme: 'theme', locale: 'locale' } as const;
  export const CONTACT_FORM_NAME = 'portfolio-contact';
  export const DEV_SITE_URL = 'http://localhost:4321';
  ```

  and use these in source files where the literals appear today. For the
  no-FOUC inline theme bootstrap, pass the storage key via frontmatter and
  `define:vars` inside `ThemeBootstrap.astro` if needed; do not hard-code the
  literal in the script body.
- Handle the dev-site fallback in `astro.config.mjs` deliberately. Either:
  - rename the config to `astro.config.ts` and import `DEV_SITE_URL`; or
  - keep the local literal in `astro.config.mjs` as a documented config-file
    exception.

  Do **not** import `src/lib/constants.ts` from `.mjs` unless you have verified
  `npm run check` and the Astro config loader support that path reliably.
- Do **not** simply delete parent-level `.default({...})` from section schemas.
  In Zod, field defaults are applied when parsing `{}`, but they do not make a
  missing parent object valid. If the intent is "missing section becomes an
  object populated by child defaults," replace repeated parent default objects
  with Zod 4 `.prefault({})` (or keep the explicit parent defaults).
- Add/extend a schema test that removes one optional-looking section such as
  `hero` or `about` from otherwise valid content and asserts that parsing
  still produces the expected child defaults.

### Validation

- `npm run check` passes.
- `rg -n "'theme'|'locale'|'portfolio-contact'|'http://localhost:4321'" src`
  returns hits only inside `src/lib/constants.ts`.
- If `astro.config.mjs` remains `.mjs`, the same literal may still appear
  there as the documented exception. If the config is converted to `.ts`, run
  the same search against `astro.config.*` and ensure the literal comes from
  constants.
- Schema tests prove both existing localized JSON files and missing-section
  fallback behavior still parse correctly.

---

## Task 12 — Inline the SVG paths in `Icon.astro` instead of `set:html`

### Problem

[`src/components/Icon.astro`](file:///Users/karthikeyan/Scratch/portfolio/src/components/Icon.astro)
stores each icon as an HTML string and uses `set:html={paths[name]}` to
inject it. This:

- Bypasses Astro's HTML escaping (any contributor adding an icon could
  introduce malformed/unsafe markup that Astro can't validate).
- Defeats `astro check`'s template-level type checking — typos in path
  attributes are silent.
- Reads worse than the equivalent JSX/Astro template.

### Outcome

- Each icon is a tiny `.astro` partial under `src/components/icons/`
  (one file per icon, e.g. `ArrowLeft.astro`), each rendering its own
  `<path>` elements.
- `src/components/Icon.astro` becomes a thin dispatcher:

  ```astro
  ---
  import ArrowLeft from './icons/ArrowLeft.astro';
  // ...one import per icon
  const icons = { 'arrow-left': ArrowLeft, /* ... */ } as const;
  type IconName = keyof typeof icons;
  interface Props { name: IconName; size?: number; class?: string; }
  const { name, size = 18, class: className = '' } = Astro.props;
  const Component = icons[name];
  ---
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
       class={className} aria-hidden="true">
    <Component />
  </svg>
  ```

- `set:html` is gone from this file.

### Validation

- `npm run check` passes.
- All icons render identically (visual diff against pre-change screenshots).
- `rg -n "set:html" src/components/Icon.astro` returns no matches.

---

## Task 13 — Use locale in `formatPostDate`

### Problem

[`src/lib/blog.ts`](file:///Users/karthikeyan/Scratch/portfolio/src/lib/blog.ts):

```ts
export const formatPostDate = (date: Date) => {
  return new Intl.DateTimeFormat('en', { ... }).format(date);
};
```

The site is bilingual (EN/DE), but every date is hard-coded to the English
locale. German blog posts will show "Apr 24, 2026" instead of
"24. Apr. 2026".

### Outcome

- `formatPostDate(date, locale)` takes the active `Locale` and passes it to
  `Intl.DateTimeFormat`.
- All call sites (`BlogCard.astro`, `[slug].astro`) pass the page's `locale`.
  If Task 7 already threaded `locale` through `BlogCard.astro` for localized
  links, reuse that prop here instead of adding a second mechanism.
- Existing test `src/test/blog.test.ts` is updated to assert both locales. Use
  a stable midday UTC date in tests to avoid timezone boundary failures.

### Validation

- A DE blog post detail page shows the date formatted with German
  conventions.
- New test cases pass.

---

## Suggested execution order

The task numbers above are retained for traceability, but this is the
canonical execution order:

1. Tasks 1-2 (cleanup + move HomePage).
2. Tasks 3-4 (i18n helpers + endpoint typing).
3. Task 5 (scripts cleanup) — this is the highest-risk task; do it before
   the layout split so you can compare HTML output cleanly.
4. Task 8 (split BaseLayout).
5. Tasks 9-10 (Section + prop noise).
6. Tasks 6-7 (images + locale-aware blog).
7. Tasks 11-13 (polish).

After every task: run `npm run check`, commit, move on.

## Definition of done (for the whole plan)

- `npm run check` passes from a clean clone.
- `dist/` for `/`, `/de/`, `/blog/`, `/de/blog/`, every blog post, `/404/`,
  `/rss.xml`, `/de/rss.xml`, `/sitemap-index.xml`, and `/robots.txt` all
  build successfully.
- `npm run test` still works after any `astro:i18n` virtual-module changes.
- `rg -n "is:inline" src` returns exactly **one** match (the head theme
  bootstrap).
- `rg -n "layoutHandlersBound|as \{ post:" src` returns zero matches.
- `rg -n "getLocalizedPath|getHomePath|getLocalePath" src` returns zero
  matches.
- `rg -n "src/app|src/sections|src/ui|untitled folder" --glob '!plan/**'`
  returns zero matches.
- `BaseLayout.astro` is ≤ 60 lines.
- Every section component on the homepage either uses `Section.astro` or
  `Section.astro` no longer exists.
