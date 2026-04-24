# Professional Portfolio Redesign Plan

## Summary

- Implement in two phases: visual/performance cleanup first, then i18n/resume/blog timeline.
- Remove gradients, glassmorphism, floating orbs, React header hydration, `framer-motion`, and `lucide-react`.
- Use an editorial light-first palette, IBM Plex Sans/Mono, local SVG icons, and mostly static Astro templates.
- Keep contact as a static Netlify form, not a React island.
- Add English/German portfolio routing with `/` and `/de/`, while blogs remain manually language-tagged.

## Key Changes

- Replace current visual system with solid editorial tokens: paper background, ink text, olive primary, clay accent, tan borders, flat panels, hairline rules, and no blur-heavy cards.
- Replace all `lucide-react` usage with a local Astro icon component/map containing only the icons used by the site.
- Replace `HeaderNav.tsx`, `Contact.tsx`, and `@/ui/Button` with Astro/static components plus small inline scripts for mobile menu, theme toggle, language toggle, and first-visit German redirect.
- Self-host IBM Plex Sans and IBM Plex Mono, remove Google Fonts links, and update Tailwind font families.
- Split portfolio content into localized files such as `site-content.en.json` and `site-content.de.json`, keeping Zod validation.
- Add blog frontmatter `language: "en" | "de"` and optional `translationKey`, then render `/blog/` as a yearly timeline with language badges.
- Add resume CTA pointing to `/resume.pdf`; keep CTA visible only if the asset exists or add a clear placeholder check in the build/test plan.

## Contact + Resume

- Contact form becomes a static Netlify form with honeypot and normal submission behavior.
- Prefer a Netlify success redirect or lightweight query-state message over React inline state.
- Keep email/LinkedIn as fallback contact paths.
- Public resume download is acceptable if sanitized: no home address, sensitive IDs, or private phone unless intended.

## Implementation Sequence

- Phase 1: visual and performance rewrite.
- Phase 1 removes gradients/glass/orbs, converts header/contact/buttons/icons to Astro/static, replaces fonts, and removes unused React/framer/lucide dependencies where possible.
- Phase 2: i18n, blog timeline, and resume UX.
- Phase 2 adds localized portfolio content, `/de/`, language toggle/redirect, blog language metadata, yearly timeline, and resume CTA.
- Keep these phases separate to avoid merge conflicts in templates that will be rewritten during the visual cleanup.

## Test Plan

- Run `npm run check`.
- Verify routes: `/`, `/de/`, `/blog/`, blog detail pages, `/rss.xml`, sitemap, and 404.
- Confirm no active references remain to `framer-motion`, `lucide-react`, `@/ui/Button`, `HeaderNav.tsx`, or hydrated `Contact.tsx`.
- Verify no active gradient/glass/orb utility classes remain.
- Verify German redirect only happens on first visit and never overrides a saved language choice.
- Verify blog timeline groups posts by year and shows `EN`/`DE` badges.
- Verify Netlify detects the static contact form in built HTML.
- Verify `/resume.pdf` exists before final deploy.

## Assumptions

- Visual direction: Editorial Systems.
- Icon strategy: local Astro SVG component, no new icon dependency.
- Contact strategy: static Netlify form.
- Font strategy: IBM Plex Sans + IBM Plex Mono.
- Language strategy: English default, German `/de/`, auto redirect for German browser users, manual toggle persists.
- German portfolio copy: add draft German copy now for later review.
- Blog content: English by default; German posts are manually added later.
- Resume: public `/resume.pdf`, supplied as a sanitized PDF before deploy.

## References

- [Astro i18n docs](https://docs.astro.build/en/guides/internationalization/)
- [Dribbble minimal developer portfolio references](https://dribbble.com/search/minimal-developer-portfolio)
- [Behance minimal development portfolio references](https://www.behance.net/search/projects/development%20portfolio%20minimal)
