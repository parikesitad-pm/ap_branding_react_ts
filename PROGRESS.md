# Progress

- [x] F0 Foundation
- [ ] F1 Atoms & Molecules
- [ ] F2 Hero + Intro + Preloader
- [ ] F3 Horizontal Reel
- [ ] F4 ModelStage 3D
- [ ] F5 Disciplines + About + Contact + VideoModal + Polish

## Asumsi & Catatan F0

- Font asset WOFF2 (Bricolage Grotesque & Instrument Sans) belum tersedia secara lokal; menggunakan Google Fonts / system fallback font declarations siap pakai dengan `font-display: swap`. Kebutuhan font self-host WOFF2 dicatat untuk fase aset berikutnya.
- Aset asli 3D GLB dan gambar Afrizal belum tersedia; menggunakan literal placeholders (`[PROJECT TITLE 01]`, dll.) sesuai panduan tanpa artwork fiktif.
- Intro video YouTube menggunakan ID placeholder dari `.env.example` (`VITE_INTRO_VIDEO_ID=yR3IpNwjKfY`).
- Strict mode diaktifkan di TypeScript compiler options (`strict: true`, no `any`).
- Canonical attribution & developer CTA ditambahkan ke `index.html`, `src/main.tsx`, `package.json`, `README.md`, dan footer.
- Build production lolos verifikasi (`dist/`).

## Specifications for Future Phases

### F5 — Developer CLI Easter Egg Specification
- **Trigger**: Subtle `>_` button or "open developer console" in footer.
- **Implementation**: Pure React state + typed parser (NO external terminal libraries).
- **Opening copy**:
  ```text
  AP // PORTFOLIO TERMINAL
  crafted with <3 by parikesitad-pm

  Hello, curious human.

  portfolio.owner = "Afrizal Pramudyan";
  portfolio.focus = "3D / CGI";
  portfolio.status = "creating";

  crafted.by = "parikesitad-pm";
  github = "github.com/parikesitad-pm";

  type "help" to explore.
  ```
- **Commands**:
  - `help`: List available commands
  - `about`: Display Afrizal bio / focus
  - `work`: Scroll to #work
  - `3d`: Scroll/filter to 3D stage
  - `intro`: Trigger VideoModal self-intro
  - `contact`: Scroll to #contact
  - `github`: Open https://github.com/parikesitad-pm
  - `hire`: Display MODULA service info & WhatsApp CTA link (https://wa.me/6282298503412)
  - `theme light|dark`: Toggle theme
  - `lang en|zh-CN|ja|ko`: Switch language
  - `clear`: Clear output history
- **Accessibility & UX**: Keyboard accessible, Esc closes terminal, focus trapped and returned to trigger on close, mobile responsive, non-intrusive.
