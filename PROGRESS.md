# Progress

- [x] F0 Foundation
- [x] F1 Atoms & Molecules
- [x] F2 Hero + Intro + Preloader
- [x] F3 Horizontal Reel
- [x] F4 ModelStage 3D
- [ ] F5 Disciplines + About + Contact + VideoModal + Polish

## Asumsi & Catatan F4

- **Placeholder scene architecture**: Menggunakan geometri prosedural Three.js (TorusKnot berpresisi tinggi + cincin gimbal orbital bertingkat) dengan palet brand (Cobalt `#0038ff`, Flare `#ff3d00`, Ink `#0b1d3a`, Platinum `#cbd7e8`) tanpa artwork fiktif atau download model eksternal yang belum resmi. Disertai label literal `[3D ASSET PENDING]` dan komentar kode `// TODO: replace procedural placeholder with Afrizal's production GLB`.
- **Lazy Canvas & poster-first pattern**: Three.js dan R3F di-code-split via `React.lazy(() => import('./ModelCanvas'))` sehingga initial bundle tetap ramping (~432 kB, chunk 3D ~987 kB terpisah). Canvas hanya di-mount ketika mendekati viewport (`rootMargin: '400px'`) atau saat modal dibuka. Poster SVG silhouette tampil instan, lalu fade-in mulus saat WebGL Canvas siap. `ModelErrorBoundary` disiapkan untuk fallback jika WebGL gagal.
- **Scroll FINAL/SHADED/WIREFRAME**: ScrollTrigger desktop pin (`+=200%`, `scrub: 0.5`) merekam progress 0.0 → 1.0 ke mutable ref `stageProgressRef` tanpa re-render raw frame React. Material bertransisi mulus di render loop:
  - `0.00 – 0.33` FINAL: Material lit kaya kilau metalik, cincin orbital Cobalt/Flare, contact shadows penuh.
  - `0.33 – 0.66` SHADED: Matte clay netral bertekstur studio, menonjolkan kurvatur dan volume bentuk.
  - `0.66 – 1.00` WIREFRAME: Translusen gelap pada bodi inti dipadu jaring kawat wireframe Cobalt bercahaya.
- **One-model-at-a-time strategy**: Mengambil dataset proyek bertipe di mana `project.category === '3d'` (`project-02` dan `project-05`). Hanya satu model aktif yang dimuat dan dirender dalam satu waktu.
- **Demand rendering & pause behavior**: Menggunakan `frameloop="demand"` dengan DPR `[1, 1.75]`. Invalidasi frame hanya berlangsung saat idle turntable berputar, user sedang mendrag/interaksi, transisi material berjalan, atau tema berganti. Rendering berhenti total saat tab tersembunyi (`Page Visibility API`) atau ModelStage di luar viewport. OrbitControls inline mematikan wheel zoom agar tidak membajak scroll halaman.
- **Fullscreen Explore viewer (`ModelViewerModal`)**: Modal dialog aksesibel (`role="dialog"`, `aria-modal="true"`, scroll lock, keyboard Esc, focus trap/return ke tombol trigger). Dilengkapi zoom kontrol 3D terkendali, navigasi antar proyek 3D (panah keyboard / tombol Previous-Next), dan pemilih stage visual.
- **Responsive & reduced-motion behavior**: Pada mobile (< 768px), pin dinonaktifkan untuk mencegah scroll jail dan touch-action dikonfigurasi (`pan-y`). Preferensi `prefers-reduced-motion` menonaktifkan auto-rotate dan animasi pin panjang, tetap menyajikan kontrol manual dan tombol Explore in 3D.
- **Real GLB asset contract & pipeline handoff**:
  - Source path: `assets-src/` (di-.gitignore).
  - Runtime path: `public/models/<slug>.glb` dan `public/img/<slug>-poster.avif|webp`.
  - Future project data: `{ id, category: '3d', media: { type: 'glb', src: '/models/<slug>.glb', poster: '...' } }`.
  - Pipeline: `.blend` → export GLB → `@gltf-transform/cli` optimize (dedup, prune, meshopt, KTX2) → web GLB (target ideal 2–8 MB, hero hingga 10–15 MB).
- Build production lolos verifikasi (`npm run build`).

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

## Asumsi & Catatan F3

- **Pin/scrub implementation**: GSAP ScrollTrigger pinned horizontal scrub dengan dynamic distance calculation (`track.scrollWidth - window.innerWidth`), `gsap.context()` cleanup `ctx.revert()`, dan sinkronisasi Lenis satu instance. Progress bar terhubung ke numeric value (`0 → 100`) dan active project index dihitung efisien berbasis viewport center tanpa re-render React berlebih pada raw frame.
- **Filter behavior**: React state driven (`all`, `graphic`, `3d`, `animation`, `photo`). Menggunakan `Flip.getState` dan `Flip.from` untuk transisi posisi kartu yang mulus. Saat filter berganti ketika pinned, posisi horizontal di-reset ke awal secara prediktif dan `ScrollTrigger.refresh()` dipanggil. Kategori Videography diabaikan pada FilterChips karena belum ada data proyek video riil (dan tidak membuat fake project).
- **Responsive/mobile fallback**: Pada viewport mobile (< 768px), pinning vertical ditiadakan dan dialihkan ke native horizontal swipe (`overflow-x: auto`, `scroll-snap-type: x mandatory`, kartu `min(84vw, 360px)`) dengan scrollbar aksen Flare dan filter chips yang dapat di-scroll horizontal, menghindari browser scroll jail.
- **Reduced-motion fallback**: Pengguna dengan preferensi `prefers-reduced-motion: reduce` menerima layout native horizontal scroll tanpa pin atau transform animation, menjaga kenyamanan dan aksesibilitas penuh.
- **Placeholder asset status**: Menampilkan 8 proyek placeholder terstruktur dengan asymmetric aspect ratio (`portrait`, `tall`, `landscape`, `wide`, `square`) dan editorial stagger alignment (`up`, `down`, `center`). Media container menggunakan wireframe SVG geometris dan label literal (`[3D MODEL PLACEHOLDER]`, `[PROJECT POSTER]`, dll.) tanpa artwork fiktif. Kartu 3D diutamakan dengan border Flare dan visual depth tanpa Three.js Canvas. Panel editorial Start, Process Note, dan Closing terintegrasi rapi di dalam rail.
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
