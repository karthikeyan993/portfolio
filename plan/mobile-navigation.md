# Mobile Navigation Plan

## Problem

On mobile, the floating header in `src/components/Header.astro` is a single full-width pill (Home, Blog, locale toggle, theme toggle) pinned to the top with `fixed top-6`. On narrow viewports it visually blocks the screen content beneath it and crowds the right edge, since all controls remain visible at full size.

## Goal

- Keep the existing floating-pill aesthetic on `md+`.
- On mobile (`<md`), collapse navigation behind a compact menu trigger so it no longer occupies horizontal space across the viewport.
- Preserve locale toggle and theme toggle accessibility on all viewports.
- No new dependencies; pure Astro + a tiny inline script (consistent with the project's no-React-island direction in `plan/professional-portfolio-redesign.md`).

## Proposed Design

- Mobile (`<md`): show a small pill on the right containing only:
  - Hamburger/menu button (icon).
  - Theme toggle (kept visible — high-frequency control).
- Tapping the menu button opens a dropdown panel anchored under the pill containing:
  - Home link
  - Blog link
  - Locale toggle (EN/DE)
- Desktop (`md+`): unchanged from current layout.
- Dropdown closes on: outside click, Escape key, link selection, viewport resize to `md+`.

## Implementation Steps

1. Add a `menu` icon to `src/components/Icon.astro` (and `x`/`close` icon for the open state) if not already present.
2. Edit `src/components/Header.astro`:
   - Wrap the current nav children in a `hidden md:flex` container so they disappear on mobile.
   - Add a mobile-only trigger (`md:hidden`) with the menu icon button and theme toggle.
   - Add a mobile dropdown panel (`md:hidden`, `hidden` by default, toggled via `data-mobile-menu`) containing Home, Blog, locale toggle.
   - Use `aria-expanded`, `aria-controls`, and `aria-label` on the trigger.
3. Add an inline `<script>` at the bottom of `Header.astro`:
   - Toggle the panel's `hidden` attribute on trigger click.
   - Close on outside click, Escape, link click, and `matchMedia('(min-width: 768px)')` change.
4. Verify existing `data-locale-link` and `data-theme-toggle` hooks still work in both placements (mobile dropdown + desktop pill). If a script queries by selector, ensure both instances are wired up — prefer reusing the same DOM node by relocating with CSS rather than duplicating, e.g. one node hidden/shown via responsive classes.

## Acceptance Criteria

- At `<768px`, header occupies only a compact pill on the right; page content below is not visually obscured horizontally.
- Tapping the menu reveals Home, Blog, and locale toggle; tapping again or outside closes it.
- Theme and locale toggles remain functional in both layouts.
- No console errors; no layout shift on load.
- `npm run build` succeeds; existing tests pass.

## Out of Scope

- Restyling the desktop nav.
- Adding new navigation entries.
- Animation polish beyond the existing `transition-*` classes.
