# Afrizal Pramudyan — Creative Portfolio

Frontend-only static portfolio & landing page for **Afrizal Pramudyan**, an Indonesian multidisciplinary visual designer with a core focus on **3D modeling / CGI**, graphic design, animation/motion, photography, and videography.

```text
/**
 * Afrizal Pramudyan Portfolio
 *
 * crafted with <3 by parikesitad-pm
 * https://github.com/parikesitad-pm
 *
 * a MODULA project
 */
```

---

## Authorship & Canonical Attribution

- **Crafted by**: [parikesitad-pm](https://github.com/parikesitad-pm) (Dausan Adam Parikesit) for **Afrizal Pramudyan**
- **Project**: A **MODULA** project
- **Production URL**: [https://ap-branding-react-ts.vercel.app](https://ap-branding-react-ts.vercel.app)
- **Repository**: [https://github.com/parikesitad-pm/ap_branding_react_ts](https://github.com/parikesitad-pm/ap_branding_react_ts)

---

## Architecture & Product Constraints

- **Pure Frontend**: React 19 + TypeScript (strict mode, zero `any`), bundled via Vite.
- **Zero Backend / CMS / Database**: All data is typed, static, and stored in `src/data/*`.
- **Zero External UI / Component Libraries**: Custom CSS design tokens, custom accessible modal dialogs, and custom components.
- **Zero i18n Libraries**: Lightweight custom typed translation dictionary system supporting 4 locales: English (`en`), Simplified Chinese (`zh-CN`), Japanese (`ja`), Korean (`ko`).
- **Color System**: Theme engine with system preference detection, localStorage persistence, and native View Transitions API support (`data-theme="light|dark"`).
- **Motion & 3D**:
  - Lenis smooth scroll synchronized with GSAP ticker & ScrollTrigger.
  - Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`) lazy code-split for 3D ModelStage.
  - Interactive Custom Cursor (`pointer: fine` only) with modes (`default`, `view`, `drag`, `play`, `external`).
  - Spring magnetic button interactions.
  - Developer CLI easter egg terminal (`>_`) with typed command parser.

---

## Project Structure

```text
ap_branding_react_ts/
├── assets-src/            # Raw assets (.blend, .fbx, PSD, raw renders) [GIT-IGNORED]
├── public/                # Web-ready static assets
│   ├── img/               # Optimized images (.avif, .webp, .svg)
│   ├── models/            # Production 3D models (.glb only)
│   └── fonts/             # Production web fonts (.woff2)
├── src/
│   ├── components/
│   │   ├── atoms/         # Button, Tag, Chip, Icon, Cursor, ThemeToggle, LanguageSwitcher
│   │   ├── molecules/     # FilterChips, ProjectCaption, ProgressBar, NavLink, SectionTitle
│   │   ├── organisms/     # Header, Hero, Intro, Reel, ModelStage, Disciplines, About, VideoModal, ContactFooter, DeveloperConsole
│   │   └── templates/    # PageLayout
│   ├── data/              # Typed static dataset (projects, site, timeline, types)
│   ├── hooks/             # useTheme, useLocale, useLenis
│   ├── i18n/              # en, zh-CN, ja, ko dictionaries & types
│   ├── lib/               # gsap integration & registration
│   ├── pages/             # Home
│   ├── styles/            # tokens.css, base.css, theme.css
│   ├── App.tsx
│   └── main.tsx
├── scripts/               # optimize-images.mjs image compression tool
├── PROGRESS.md            # Phase progress tracking
└── AGENTS.md              # Workflow rules and constraints
```

---

## Phase Status (F0 — F5)

- [x] **F0 Foundation**: Vite, TypeScript strict, tokens, responsive layout shell, Lenis, GSAP, asset policies.
- [x] **F1 Atoms & Molecules**: Design system tokens, polymorphic Button, FilterChips, Header, ThemeToggle, LanguageSwitcher.
- [x] **F2 Hero + Intro + Preloader**: Measured preloader, animated typographic hero, SVG signature scribble, editorial statement.
- [x] **F3 Horizontal Reel**: Filterable pinned horizontal gallery, Flip transitions, mobile swipe fallback, literal placeholders.
- [x] **F4 ModelStage 3D**: Lazy Three.js R3F canvas, procedural placeholder, FINAL/SHADED/WIREFRAME material scrub, fullscreen 3D modal viewer.
- [x] **F5 Disciplines + About + Contact + VideoModal + Polish**:
  - Interactive *What I Make* section with unique motion vocabulary per discipline and Reel category filter links.
  - Editorial *About* profile with verified public UNNES / exhibition milestones.
  - Privacy-friendly YouTube video introduction modal with poster facade pattern.
  - Final *ContactFooter* with canonical attribution and developer sales CTA.
  - Active global custom cursor (`pointer: fine`) with GSAP `quickTo()`.
  - Magnetic button spring behavior.
  - Developer CLI easter egg (`>_`) terminal with typed command system (`help`, `about`, `work`, `3d`, `intro`, `contact`, `github`, `hire`, `theme`, `lang`, `clear`).
  - Full i18n pass across 4 languages (`en`, `zh-CN`, `ja`, `ko`).
  - View Transitions API theme toggle.
  - SEO metadata and Open Graph optimization.

---

## Asset Replacement Guide

When official artwork and 3D assets from Afrizal Pramudyan become available:

### 1. 3D Model Assets
1. Export clean GLB from Blender (`assets-src/<name>.blend`).
2. Optimize with `@gltf-transform/cli` (prune, dedup, meshopt):
   ```bash
   gltf-transform optimize input.glb public/models/<slug>.glb --compress meshopt
   ```
3. Export render poster to `public/img/<slug>-poster.webp`.
4. Update `src/data/projects.ts`:
   ```ts
   {
     id: 'project-XX',
     title: 'Official Project Title',
     category: '3d',
     media: {
       type: 'glb',
       src: '/models/<slug>.glb',
       poster: '/img/<slug>-poster.webp',
     },
   }
   ```

### 2. Graphic & Photography Assets
1. Place raw render/export into `assets-src/img/`.
2. Run automated image pipeline:
   ```bash
   node scripts/optimize-images.mjs
   ```
3. Web-ready AVIF/WebP images are generated into `public/img/`.
4. Update corresponding record in `src/data/projects.ts`.

---

## Developer Service Inquiry

Need your own portfolio or personal branding landing page?
- **Developer**: parikesitad-pm (Dausan Adam Parikesit)
- **WhatsApp**: [+62 822-9850-3412](https://wa.me/6282298503412)
- **Services**: Personal Portfolio, Online Business Card, Creative Landing Page, Personal Branding

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build and typecheck
npm run build

# Preview production build locally
npm run preview
```
