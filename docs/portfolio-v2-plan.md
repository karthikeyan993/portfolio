# Portfolio V2 — Dark Mode, Layout Fixes & Design Polish

## Summary
Refine the V1 portfolio with dark mode support, layout consistency fixes, removal of the scroll-down label, and design polish across all sections. Every change must keep all existing automated gates passing (`npm run check`).

## Progress Snapshot
- `D1 Dark Mode`: Not started
- `D2 Remove Scroll Label`: Not started
- `D3 Card Height Alignment`: Not started
- `D4 Design Polish`: Not started
- `D5 Verification`: Not started

---

## D1 — Dark Mode

### Goal
Add a light/dark colour scheme that defaults to the user's `prefers-color-scheme` setting and can be toggled via a header button with a Sun/Moon icon (animated swap via Framer Motion).

### Implementation steps

1. **Tailwind dark-mode strategy** — set `darkMode: 'class'` in `tailwind.config.js`.

2. **CSS token layer** — add a `.dark` variant block in `src/index.css` under `:root`. Define dark palette values:
   ```
   .dark {
     --bg: 222 47% 8%;
     --surface: 222 40% 12%;
     --border: 220 20% 22%;
     --text: 210 40% 92%;
     --text-muted: 215 16% 60%;
     --brand-primary: 262 83% 72%;
     --brand-secondary: 188 86% 55%;
     --brand-accent: 24 94% 62%;
     --shadow-glass: 0 12px 30px rgba(0, 0, 0, 0.35);
   }
   ```
   Fine-tune these values visually so glass cards, gradients, and orbs look rich and not washed-out.

3. **Theme provider** — create `src/lib/use-theme.ts`:
   - Read initial theme from `localStorage('theme')` ?? `prefers-color-scheme` media query.
   - Expose `{ theme, toggle }` where `theme` is `'light' | 'dark'`.
   - On change, toggle `.dark` class on `<html>` and persist to `localStorage`.

4. **Toggle button** — add a theme toggle button to `AppShell.tsx` header (desktop and mobile menu):
   - Use `Sun` / `Moon` icons from `lucide-react`.
   - Animate the icon swap (short cross-fade or rotate via Framer Motion `AnimatePresence`).
   - Place to the left of the existing CTA button on desktop; at the top of the mobile nav menu.
   - `aria-label="Switch to dark mode"` / `"Switch to light mode"`.

5. **Audit hardcoded colours** — grep the codebase for any raw `bg-white`, `text-white`, or opacity colours that won't adapt. Replace with token-based equivalents:
   - `bg-white/50` → `bg-surface/50` (inputs in Contact).
   - `hover:bg-white/90` → `hover:bg-surface/90` (glass-card-hover, ghost button, social-circle).
   - `border-white/50` → `border-border/50` or similar.
   - `text-white` in `glass-button-primary` is fine (white-on-gradient stays readable in both modes).
   - All `.glass-card`, `.glass-card-hover`, `.social-circle`, `.glass-button-secondary`, `.glass-button`, `.tech-badge` classes in `index.css` must be reviewed for hardcoded white references.
   - `bg-gradient-to-br from-surface to-border` placeholders (project previews, initials box in Hero) should work since they use tokens, but verify contrast in dark mode.

6. **Body background gradient** — update the `body` background gradient in `index.css` to use darker base + stronger orb opacity in dark mode. Can use a separate `.dark body {}` rule or adjust the gradient opacities through CSS variables.

7. **Scrollbar** — update `::-webkit-scrollbar-track` from `bg-white/20` to a token-aware value.

### Exit criteria
- Default theme matches OS `prefers-color-scheme`.
- Manual toggle persists across page reload.
- All sections render correctly in both themes (no invisible text, broken borders, or unreadable contrast).
- `npm run check` passes.

---

## D2 — Remove Scroll Label

### Goal
Remove the "Scroll Down ↓" floating text from the Hero card.

### Implementation steps

1. In `src/sections/Hero.tsx`, delete the `<motion.div>` block at lines 191–206 (the `absolute bottom-6` element containing `content.scrollLabel`).

2. In `src/content/site-content.json`, remove the `"scrollLabel"` field from the `hero` object.

3. In `src/content/site-content.schema.ts`, remove `scrollLabel` from the `heroSchema` definition.

4. In `src/content/site-content.schema.ts`, the `HeroContent` type auto-updates (inferred from schema).

### Exit criteria
- No scroll label renders in Hero.
- Schema validates without `scrollLabel`.
- `npm run check` passes.

---

## D3 — Card Height Alignment

### Goal
In every section that uses a two-column or multi-column grid, sibling cards must fill equal height so the layout looks aligned. Currently the About left card (paragraphs) is taller/shorter than the stacked highlight cards on the right, and project cards in the 3-column grid have uneven heights due to varying summary lengths.

### Implementation steps

1. **About section** (`src/sections/About.tsx`):
   - Add `h-full` to both the left `<Card>` and the right `<div className="flex flex-col gap-4">` wrapper so they stretch to match the taller sibling in the `md:grid-cols-2` grid.
   - The `<Reveal>` wrappers also need `className="h-full"` (or equivalent) since they sit between the grid child and the Card — a `<div>` / `<motion.div>` without `h-full` will break the stretch.
   - On the right column, the highlight cards should distribute within the column. Options: equal `flex-1` on each `<Reveal>`, or `justify-between` on the column.

2. **Projects section** (`src/sections/Projects.tsx`):
   - The `<Reveal>` wrapping each project card must pass `className="h-full"`.
   - The `<Card>` already has `flex flex-col`; make sure summary `<p>` has `flex-1` so tags and links push to the bottom consistently.
   - This makes all 3 cards equal height with footer elements aligned on the same baseline.

3. **Tech Stack section** (`src/sections/TechStack.tsx`):
   - Same pattern: `<Reveal className="h-full">` and `<Card className="... h-full">` so all three category cards match.

4. **Contact section** (`src/sections/Contact.tsx`):
   - Left card (form) and right column (info cards + social links) — same fix: `h-full` through Reveal and Card.
   - Right column already uses `flex flex-col gap-4`; add `flex-1` to the info cards or `justify-between` to distribute evenly.

5. **Experience section** (`src/sections/Experience.tsx`):
   - Single-column stack — no height alignment issue, but verify cards look consistent.

6. **FeaturedProject section** (`src/sections/FeaturedProject.tsx`):
   - Single card, no siblings — no change needed.

### Exit criteria
- In every multi-column grid, sibling cards render at the same height on desktop.
- Cards degrade gracefully to auto-height on mobile (stacked layout).
- No content is clipped or overflows.
- `npm run check` passes.

---

## D4 — Design Polish

### Goal
Elevate the overall visual quality. These are targeted refinements, not a redesign.

### 4a. Glass card border refinement
- Current glass cards use `border border-white/50` which looks flat. In light mode use `border-white/60` and in dark mode use `border-white/8` for a subtler edge.
- Add a very faint inner glow: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]` to glass-card in dark mode.

### 4b. Section spacing cadence
- Current spacing is uniform `py-24`. Alternate sections with a subtle background tint (`bg-surface/30` every other section) to create visual rhythm and separation. This can be done via a prop on `<Section>` like `tinted`.

### 4c. SectionHeading accent bar
- The `w-20 h-1` gradient bar under each heading is fine but static. Consider making it slightly wider (`w-24`) and adding `rounded-full` (already there) with a subtle shimmer animation using the existing `animate-gradient` utility.

### 4d. Project card placeholder images
- The current `"Preview"` / `"Project Preview"` text in a plain gradient box looks empty. Replace with a subtle pattern (CSS-only, e.g. a repeating radial-gradient dot pattern or diagonal lines) plus the project title initial in large faded text, to give each card visual identity without requiring actual images.

### 4e. Hero initials box
- The `from-surface to-border` gradient is low-contrast. Use `from-brand-primary/15 to-brand-secondary/15` with a border matching `border-brand-primary/20` for more visual pop that ties it to the brand palette.

### 4f. Tech badge hover effect
- Current `.tech-badge` uses `glass-card-hover` which lifts the badge. Add a subtle left-border colour accent on hover: `hover:border-l-2 hover:border-l-brand-primary` for a sleek indicator.

### 4g. Footer polish
- The footer is minimal to the point of being forgettable. Add the social links (reuse the hero social links from content) and a small "back to top" button.

### 4h. Smooth-scroll reduced-motion
- In `index.css`, wrap `scroll-behavior: smooth` in `@media (prefers-reduced-motion: no-preference)` so users who prefer reduced motion get instant jumps.

### Exit criteria
- All polish items implemented.
- Design feels cohesive in both light and dark modes.
- No regressions — `npm run check` passes.

---

## D5 — Verification + Closeout

### Checklist
1. `npm run check` passes (lint, typecheck, test, build).
2. Dark mode: system default works, toggle works, persists on reload.
3. Card heights: visually verify About, Projects, Tech Stack, Contact grids at desktop breakpoint — all siblings same height.
4. No scroll label in Hero.
5. Design polish items are visible in both themes.
6. Accessibility: toggle button has correct aria-label, focus-visible works on new elements, contrast is acceptable in dark mode.
7. Responsive: mobile layout still correct after all changes.

### Reviewer judgement
- **Accept** if all checklist items pass and design quality is clearly improved.
- **Rework** with specific item IDs (`D1`–`D4`) if any items are incomplete or regressed.
