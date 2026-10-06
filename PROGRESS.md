# Progress

- [x] F0 Foundation
- [x] F1 Atoms & Molecules
- [x] F2 Hero + Intro + Preloader
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

## Asumsi & Catatan F1

- Atoms (Button, Chip, Tag, Icon, Cursor, ThemeToggle, LanguageSwitcher) dan Molecules (FilterChips, ProjectCaption, ProgressBar, NavLink, SectionTitle) selesai diimplementasikan.
- Organism Header dibuat dengan responsive navigation, semantic HTML, keyboard accessibility, serta integrasi ThemeToggle dan LanguageSwitcher.
- Cursor diimplementasikan sebagai presentational state shell (`default`, `view`, `drag`, `play`, `external`) tanpa active pointer tracking (pointer tracking dijadwalkan untuk F5).
- Button dibuat polymorphic (`<button>` / `<a>`) dengan class hooks `.magnetic-wrap` & `.magnetic-inner` untuk integrasi magnetic motion F5 tanpa rewrite.
- I18n sinkron di 4 bahasa (`en`, `zh-CN`, `ja`, `ko`) untuk kategori proyek (`all`, `graphic`, `3d`, `animation`, `photo`) dan label aksesibilitas.
- Integrasi showcase komponen di `Home.tsx` memverifikasi seluruh komponen aktif dan lolos typecheck tanpa dead-code.
- Build production lolos verifikasi (`npm run build`).

## Asumsi & Catatan F2

- **Preloader approach**: Menggunakan counter terukur (000 → 100) berbasis kesiapan nyata DOM dan `document.fonts.ready` dengan minimum duration 900ms agar transisi tidak flicker, diakhiri cinematic vertical `clip-path` reveal (`inset(0 0 100% 0)`).
- **Hero GSAP timeline**: Menggunakan `gsap.context()` dengan cleanup `ctx.revert()`. Urutan animasi terorkestrasi: eyebrow fade up → headline reveal via overflow mask (`yPercent: 110 → 0`) → orange SVG scribble vector drawing (`strokeDashoffset: 1 → 0`) → role & disciplines reveal → scroll hint fade → decorative 3D geometry entrance. Ditambahkan scroll parallax halus pada headline dan geometry via ScrollTrigger.
- **Lenis integration**: Sinkronisasi Lenis dengan `ScrollTrigger.update` dan GSAP ticker (`gsap.ticker.add`) pada single instance di `useLenis.ts`.
- **Reduced-motion behavior**: Branch `prefers-reduced-motion: reduce` diaktifkan di Preloader (instan complete), Hero (langsung tampil di final state tanpa parallax/stroke drawing), dan Intro (line reveal instan).
- **Placeholder asset status**: Hero menyisakan area khusus untuk 3D ModelStage berupa lightweight SVG/CSS orbital geometry dengan label subtle `[3D ASSET PENDING]`, tanpa Canvas Three.js hingga fase F4. Temporary boundary section disiapkan untuk `#work` (F3 Selected Works).
- Build production lolos verifikasi (`npm run build`).

## Specifications for Future Phases

### F5 — Developer CLI Easter Egg Specification
- **Trigger**: Subtle `>_` button atau "open developer console" in footer.
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
