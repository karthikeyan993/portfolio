---
name: Editorial Developer Folio
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#414846'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#717976'
  outline-variant: '#c1c8c4'
  surface-tint: '#46645c'
  primary: '#16342d'
  on-primary: '#ffffff'
  primary-container: '#2d4b43'
  on-primary-container: '#99bab0'
  inverse-primary: '#adcec3'
  secondary: '#43655d'
  on-secondary: '#ffffff'
  secondary-container: '#c2e8dd'
  on-secondary-container: '#476961'
  tertiary: '#2d302d'
  on-tertiary: '#ffffff'
  tertiary-container: '#434643'
  on-tertiary-container: '#b1b4b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8eadf'
  primary-fixed-dim: '#adcec3'
  on-primary-fixed: '#01201a'
  on-primary-fixed-variant: '#2e4c44'
  secondary-fixed: '#c5eae0'
  secondary-fixed-dim: '#a9cec4'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#2b4d45'
  tertiary-fixed: '#e1e3df'
  tertiary-fixed-dim: '#c5c7c3'
  on-tertiary-fixed: '#191c1a'
  on-tertiary-fixed-variant: '#444745'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e1'
typography:
  display-hero:
    fontFamily: Newsreader
    fontSize: 120px
    fontWeight: '300'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  section-gap: 10rem
  content-gap: 4rem
  stack-sm: 1rem
  container-max: 1280px
  gutter: 2rem
---

## Brand & Style
The design system focuses on a high-end editorial aesthetic, positioning the developer as a thoughtful architect of digital experiences rather than just a coder. The personality is intellectual, precise, and calm.

The design style is **Minimalism** with an **Editorial** focus. It eschews traditional imagery and heavy decorative elements in favor of extreme typographic hierarchy and intentional use of negative space. The goal is to evoke the feeling of a premium printed journal or a high-end design monograph. Visual interest is generated through the rhythmic repetition of text, subtle hairlines, and the contrast between expansive whitespace and dense information clusters.

## Colors
The palette is built on "Low-Contrast Depth." Instead of pure black or stark white, the system uses organic, desaturated tones to reduce eye strain and enhance the sophisticated feel.

- **Light Mode:** Uses a warm, paper-like neutral (`#F9F9F7`) as the base. Text is a deep charcoal-green (`#2D4B43`) rather than black.
- **Dark Mode:** Utilizes a deep, desaturated forest-grey (`#1A1C1C`). This "ink-well" background ensures that white text doesn't "glow" or vibrate against the dark surface, maintaining legibility.
- **Accents:** Muted teals and sages are used sparingly for interactive cues, progress indicators, or specific category labels. These are desaturated to maintain the professional, editorial tone.

## Typography
Typography is the primary visual engine of this design system. We utilize **Newsreader** for its literary, sophisticated serif qualities and **Inter** for its objective, functional clarity.

- **Scale Contrast:** The hero titles are intentionally oversized to create an immediate "magazine cover" impact.
- **Rhythm:** Body text uses a generous 1.6 line-height to ensure comfort during long-form reading of project case studies.
- **Labels:** Small-caps Inter is used for metadata, dates, and categories to provide a structural "anchor" to the more fluid serif headlines.

## Layout & Spacing
The layout follows a **Fixed Grid** model with an emphasis on asymmetrical balance. A 12-column grid is used, but content often offsets to columns 3 through 10 to create breathing room in the margins.

- **Whitespace as Content:** Large vertical gaps (10rem+) separate major sections, signaling a change in context without the need for background color blocks.
- **Editorial Alignment:** Text blocks should alternate between left-aligned and centered layouts to maintain visual momentum. 
- **The Hairline:** Use 1px borders in a very low-contrast version of the primary color to separate meta-data from body copy, mimicking the layout of a newspaper.

## Elevation & Depth
This design system avoids traditional shadows to maintain its flat, editorial aesthetic. Depth is communicated through **Tonal Layering** and **Subtle Outlines**.

- **Surface Tiers:** In dark mode, card-like elements use a slightly lighter shade of the background color rather than a shadow.
- **Ghost Borders:** Interactive elements are defined by 1px borders with 10-15% opacity. 
- **Depth via Typography:** The "Z-index" is felt through font weight and size. Larger, lighter-weight serifs feel "closer" to the user, while smaller, denser sans-serifs feel like the "base" layer.

## Shapes
The shape language is strictly **Sharp (0)**. 

To reinforce the editorial and architectural feel, all containers, buttons, and input fields use 90-degree corners. This creates a disciplined, grid-bound look that aligns with the precision of software engineering. Roundness is only permitted in typography; the UI framework itself remains rigid and structural.

## Components
Components are designed to be "invisible" until needed, letting the content take center stage.

- **Buttons:** Text-only or outlined with sharp corners. Hover states should involve a subtle background color shift (e.g., from transparent to 5% opacity) rather than a heavy fill.
- **Project Lists:** Displayed as large typographic links. On hover, the text might shift from a regular weight to an italic serif, creating a sophisticated motion effect.
- **Chips/Tags:** Small, rectangular boxes with 1px borders and `label-caps` typography. No background fill.
- **Input Fields:** A single bottom border (baseline) rather than a full box, mimicking a signature line on a document.
- **Navigation:** A minimalist top bar or side-docked list of links, using `label-caps` to distinguish navigation from content.