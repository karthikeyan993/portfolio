# Portfolio V1 Implementation + Completion Review Contract

## Summary
- Goal: transform the current underdeveloped, non-compiling portfolio into a production-ready V1.
- Stack target: React + Vite + Tailwind + Framer Motion, migrated to TypeScript.
- Content model: local JSON + schema validation (single source of truth).
- Hosting target: Netlify with deploy previews.
- Design direction: premium minimal glass (clean, restrained, non-template look).

## Progress Snapshot (2026-04-23)
- `P0 Foundation`: Complete
- `P1 Architecture + Content`: Complete
- `P2 Design System`: Complete
- `P3 Product Sections`: Complete
- `P4 Production Hardening`: Complete
- `P5 Verification + Closeout`: Complete

## Implementation Phases (Decision-Complete)
1. `P0 Foundation`
- Fix compile blockers by creating missing sections/components imported by `App`.
- Migrate `src/*.jsx` to TypeScript where applicable (`.tsx`/`.ts`).
- Add `tsconfig`, lint, test, typecheck, and build scripts.
- Exit criteria: `npm run check` passes (`lint`, `typecheck`, `test`, `build`).

2. `P1 Architecture + Content`
- Create feature-oriented structure: app shell, sections, shared UI, content, lib.
- Create `src/content/site-content.json`.
- Create typed schema validator (`zod`) and loader; app consumes validated typed content only.
- Remove hardcoded person/project strings from section components.
- Exit criteria: invalid JSON fails with clear schema error.

3. `P2 Design System`
- Introduce CSS token system (colors, spacing, radii, shadows, motion, typography).
- Typography: `Space Grotesk` headings, `Manrope` body.
- Build shared primitives: section wrapper, heading block, button variants, card variants.
- Motion policy: tasteful enter/reveal/hover only, with `prefers-reduced-motion` support.
- Exit criteria: all sections use shared primitives and tokens.

4. `P3 Product Sections`
- Implement Hero, About, Tech Stack, Experience, Featured Project, Projects, Contact.
- Add sticky header with active section highlight.
- Ensure fully responsive layout and navigation behavior.
- Implement Netlify form submission in Contact (honeypot + success/error UI).
- Exit criteria: all content renders from JSON; nav anchors and contact flow work.

5. `P4 Production Hardening`
- SEO and social metadata wired from content.
- Accessibility: semantic landmarks, heading hierarchy, keyboard nav, contrast, focus-visible.
- Performance: optimized assets, avoid layout shift, lazy-load where useful.
- CI: GitHub Action runs `npm run check` on PR.
- Exit criteria: Netlify preview deploy and CI both green.

6. `P5 Verification + Closeout`
- Fill TODO evidence for each phase with command output summary and manual checks.
- Reviewer applies completion rubric (below) and records verdict.
- Keep this plan file as repo source of truth.

## Public Interfaces / Types
- `SiteContent` root object with keys: `seo`, `nav`, `hero`, `about`, `techStack`, `experience`, `featuredProject`, `projects`, `contact`.
- `ExperienceItem`, `ProjectItem`, `NavItem`, `ContactConfig` typed and exported.
- Rule: UI components receive typed props only; raw JSON access restricted to content loader.

## Test and Verification Matrix
1. Automated gates
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

2. Integration checks
- App renders all required sections from validated content.
- Header links/active state work for all sections.
- Contact form states (idle/success/error) work.

3. Manual checks
- Responsive behavior at mobile/tablet/desktop.
- Keyboard-only navigation and visible focus order.
- Reduced-motion behavior honored.
- Netlify preview behavior matches local build.

## Reviewer Judgement Protocol (Complete vs Incomplete)
1. Required evidence inputs
- Final diff/PR from implementation agent.
- Updated TODO file with status + evidence per phase.
- Output summary for all automated gates.
- Short manual QA summary for accessibility/responsive/reduced-motion/contact flow.

2. Hard fail conditions (automatic `INCOMPLETE`)
- Any automated gate fails.
- Any phase `P0` to `P4` missing exit criteria.
- Schema validation not enforced.
- App still has hardcoded portfolio content outside JSON model.
- Accessibility basics missing (keyboard/focus/landmarks).

3. Completion criteria (`COMPLETE`)
- All hard gates pass.
- All phases `P0` to `P5` marked done with evidence.
- No high-severity regressions in core UX (navigation, rendering, contact form).
- Netlify preview and CI green.

4. Reviewer output format
- Verdict: `COMPLETE` or `INCOMPLETE`
- Blocking findings: numbered list with file/path references
- Residual risks: numbered list
- Rework tasks: numbered list mapped to phase IDs (`P0`..`P5`)

## Assumptions
- Static site; no custom backend beyond Netlify Forms.
- Plan and TODO artifacts are retained in repo (not deleted after completion).
- TypeScript migration happens in this V1 effort, not deferred.
