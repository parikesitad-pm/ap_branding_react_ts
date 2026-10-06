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
- Build production lolos verifikasi (`dist/`).
