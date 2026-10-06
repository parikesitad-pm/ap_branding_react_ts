# Design Notes & Visual Specifications

Extracted from prototype reference: `afrizal-portfolio-mockup.html`.
*Rule: Do not read the HTML mockup again in subsequent phases unless an unresolved conflict arises.*

---

## 1. Brand Palette & Color Tokens

### Primary Tokens
- **Cobalt**: `#2438FF` (Electric primary brand accent, hero background, contact section background, focused active states)
- **Ink**: `#0A0C2B` (Deep midnight contrast color, dark theme background, reel background, primary text in light mode)
- **Flare**: `#FF5A2C` (Vibrant fiery orange, scribble accent, progress bar fill, buttons/focus outline, quote border, active highlights)
- **Haze**: `#B9BCFF` (Soft lilac/periwinkle lavender, secondary muted text in dark mode/reel, counters, subtle borders)
- **Chalk**: `#EEF0FA` (Clean soft white/light grey, light theme background, hero & reel text, chip buttons)

### Semantic Tokens (Light & Dark Themes)
- **Light Theme (default when system is light)**:
  - `--bg`: `#EEF0FA` (`--chalk`)
  - `--fg`: `#0A0C2B` (`--ink`)
  - `--muted`: `#454A7C`
  - `--line`: `rgba(10, 12, 43, 0.2)`
- **Dark Theme (default when system is dark or `data-theme="dark"`)**:
  - `--bg`: `#0A0C2B` (`--ink`)
  - `--fg`: `#EEF0FA` (`--chalk`)
  - `--muted`: `#A9ADD8`
  - `--line`: `rgba(238, 240, 250, 0.22)`
- **Shared / Invariant**:
  - `--pad`: `clamp(1.25rem, 4vw, 3.5rem)`

---

## 2. Typography

- **Display**: `'Bricolage Grotesque'`, `'Arial Narrow'`, `'Helvetica Neue'`, Arial, sans-serif
  - Weights used: `600`, `700`, `800`
  - Width/Stretch: `75%` to `85%` (condensed/compressed feel)
  - Letter spacing: `-0.01em` to `-0.025em`
  - High impact line-heights: `0.85` to `1.05`
- **Body & Text**: `'Instrument Sans'`, `'Helvetica Neue'`, Arial, sans-serif
  - Weights used: `400`, `500`, `600`, `700`
  - Base size: `1.0625rem` (17px), line-height: `1.5`
- **Target font delivery**: Self-hosted WOFF2 with `font-display: swap` in production. Safe fallback fonts defined in tokens.

---

## 3. Structural Sections & Layout Breakdown

### A. Navigation & Hero
- **Background**: Solid Cobalt (`#2438FF`), text Chalk (`#EEF0FA`).
- **Dimensions**: Full viewport height (`min-height: 100vh; min-height: 100svh;`), flex column with inner padding `--pad`.
- **Nav Header**:
  - Brand Mark: "AP" in Bricolage Grotesque 800 condensed (`font-size: 1.75rem`).
  - Menu: Unordered list (`Work`, `Disciplines`, `Contact`) with `gap: 1.75rem`, underlined on hover (`text-underline-offset: 0.3em`).
- **Hero Body**:
  - Pushed to bottom (`margin-top: auto; padding-top: 4rem;`).
  - Roles line: max 30ch, font size `clamp(1.1rem, 2vw, 1.5rem)`, line-height `1.3`:
    *"Graphic designer, 3D modeler, animator, photographer, and videographer."*
  - Gigantic Name Headline (`h1`):
    - `font-size: clamp(3.5rem, 17.5vw, 22rem); line-height: 0.85; letter-spacing: -0.025em;`
    - Line 1: "Afrizal" + inline SVG orange scribble vector (stroke `#FF5A2C`, animated draw effect).
    - Line 2: "Pramudyan".
  - Hint text: *"Keep scrolling. The work moves sideways."*

### B. Intro Section
- **Background**: Follows theme (`--bg`).
- **Padding**: `clamp(4rem, 10vw, 9rem) var(--pad)`.
- **Statement**: Large typography (`clamp(1.9rem, 4.6vw, 4rem)`, max 24ch):
  *"Posters to look at, models to turn around, loops that move, films to press play on, and photographs that hold still."*

### C. Selected Work Reel (Pinned Horizontal Scroll)
- **Background**: Ink (`#0A0C2B`), text Chalk (`#EEF0FA`).
- **Container Structure**:
  - Pinned sticky container (`top: 0`, `height: 100vh / 100svh`, `overflow: hidden`).
  - Top Bar:
    - Filter chips: `All`, `Graphic design`, `3D modeling`, `Animation`, `Photography`, `Videography`.
    - Tabular counter: e.g. `01 / 10` in Haze (`#B9BCFF`).
  - Viewport & Track:
    - Horizontal track (`width: max-content`, flex row, aligned center).
    - Asymmetric card vertical alignment: alternate `.frame.up` (`margin-top: -8vh`) and `.frame.down` (`margin-top: 8vh`).
    - Aspect ratios varied: 4/5, 4/3, 3/4, 16/9, 1/1, 9/16, etc.
    - Editorial panels and pull-quotes interspersed between project cards with Flare orange left-border accent.
    - End CTA panel: *"That's the reel. Have something similar in mind? Start a project."*
  - Bottom Progress Bar:
    - 3px high bar with Flare orange fill tracking horizontal progress (`scaleX(0 -> 1)`).

### D. Disciplines Section
- **Background**: Follows theme (`--bg`).
- **Header**: "What I make" (`clamp(1.5rem, 3vw, 2.25rem)`).
- **Interactive List Rows**:
  - Two-column grid (`minmax(0, 1.2fr) minmax(0, 1fr)`). Left column is huge discipline title (`clamp(2.25rem, 7vw, 6rem)`), right column is descriptive text.
  - Borders separated by `--line`.
  - Hover / Focus interaction: Invert to Cobalt background, Chalk text, subtle horizontal padding expansion (`padding-left: 1.25rem; padding-right: 1.25rem; transition: 0.25s`).
  - Clicking a discipline row filters the reel and navigates to the selected work.

### E. Contact & Footer
- **Background**: Solid Cobalt (`#2438FF`), text Chalk (`#EEF0FA`).
- **Headline**: Gigantic "Have a project in mind?" (`clamp(3rem, 11vw, 10rem)`).
- **Lead Text**: *"Freelance commissions and collaborations, from a single poster to a full film."*
- **Email Link**: Display typography mail link (`clamp(1.4rem, 3.4vw, 2.5rem)`).
- **Social Links**: Horizontal list with hover underline (`Instagram`, `Behance`, `YouTube`, `Vimeo`).
- **Colophon**: Top border line with copyright text.

---

## 4. Prototype vs Production Technical Architecture

| Feature | Prototype HTML Reference | Production React + TS Architecture |
|---|---|---|
| **Smooth Scrolling** | Native browser scroll | **Lenis** synchronized with GSAP ticker & ScrollTrigger |
| **Horizontal Reel** | Manual scroll delta calculation & `requestAnimationFrame` | **GSAP ScrollTrigger** with `pin: true`, dynamic horizontal scrub based on track width |
| **Text Splitting** | Hardcoded HTML lines | Manual modular text splitting / GSAP timeline stagger |
| **Hero Scribble** | Pure CSS `stroke-dashoffset` animation | GSAP DrawSVG / stroke-dashoffset linked to preloader or entry timeline |
| **Filtering Transition** | `display: none` toggle with manual layout recalculation | Reactive state with GSAP Flip / fluid transition |
| **3D Presentation** | Inline SVG placeholder graphics | **React Three Fiber (@react-three/fiber + @react-three/drei)** with lazy loading & poster-first pattern |
| **Reduced Motion** | `@media (prefers-reduced-motion)` fallback to native horizontal scroll | Lenis disabled, ScrollTrigger pin disabled, native horizontal scroll enabled |

---

## 5. Responsive & Accessibility Notes

- **Breakpoints**: Mobile breakpoint at `640px` and tablet at `1024px`.
- **Mobile adjustments**:
  - Disciplines rows collapse to single column grid with `gap: 0.5rem`.
  - Nav links spacing tightens.
  - Viewport safe areas respected with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
  - Reel supports touch-friendly sideways swipe when motion is reduced or on mobile viewport.
- **Focus States**: High contrast outline with Flare orange (`#FF5A2C`) or Chalk (`#EEF0FA`) depending on container background.
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` for project counters and timecodes.
