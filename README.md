# Afrizal Pramudyan — Portfolio

Frontend-only static portfolio & landing page for **Afrizal Pramudyan**, multidisciplinary visual designer with a core focus on **3D modeling / CGI**, graphic design, animation/motion, photography, and videography.

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

## Authorship & Attribution

crafted by [parikesitad-pm](https://github.com/parikesitad-pm) for **Afrizal Pramudyan** — a **MODULA project**.

---

## Tech Stack

- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Build Tool**: [Vite](https://vite.dev/)
- **Animation & Motion**: [GSAP](https://gsap.com/) & ScrollTrigger
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: Vanilla CSS + CSS Variables (no external UI libraries)
- **Hosting**: [Vercel](https://vercel.com/)

---

## Asset Architecture & Source Policy

```text
public/
  img/        # Optimized web-ready images (*.avif, *.webp, *.svg)
  models/     # Production 3D models (*.glb only)
  fonts/      # Self-hosted production fonts (*.woff2)

assets-src/   # Raw source workspace (.blend, .fbx, PSD, TIFF, raw renders)
              # NOTE: Ignored by Git. NEVER commit raw source assets!
```

> **Asset Status**: Official assets are currently being gathered. All current project cards and models in staging use explicit literal placeholders.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript typecheck and build for production
npm run build

# Preview production build locally
npm run preview
```

### Image Optimization Pipeline

To process raw images in `assets-src/` into responsive WebP and AVIF variants:

```bash
node scripts/optimize-images.mjs
```

---

## Production Deployment

This project deploys to **Vercel** with pure static output (`dist/`).
- **Live URL**: [https://ap-branding-react-ts.vercel.app](https://ap-branding-react-ts.vercel.app)
- **Repository**: [https://github.com/parikesitad-pm/ap_branding_react_ts](https://github.com/parikesitad-pm/ap_branding_react_ts)
- Configuration and environment variables are documented in `.env.example`.
