# AGENTS.md

## Cara Kerja

1. Baca `AGENTS.md` sekali di awal session.
2. Buka `PROGRESS.md`.
3. Kerjakan HANYA fase pertama yang belum selesai.
4. Satu fase = satu session.
5. Stop setelah fase selesai.
6. Maksimum sekitar 15 command per fase kecuali command tambahan benar-benar diperlukan untuk deployment bootstrap session ini.
7. Jangan eksplorasi directory besar secara membabi buta.
8. Jangan `cat` file panjang kalau cukup membaca range yang dibutuhkan.
9. Jangan meminta konfirmasi untuk keputusan teknis kecil.
10. Catat asumsi di `PROGRESS.md`.
11. `npm run build` hanya sekali di akhir fase.
12. Jangan browser automation/screenshot/testing tambahan kecuali user meminta.
13. Jangan mengerjakan fitur di luar active phase.
14. Jika build gagal dan membutuhkan lebih dari 3 attempts perbaikan:
    - stop;
    - tulis blocker di `PROGRESS.md`;
    - laporkan.
15. Laporan akhir fase maksimal 5 baris.

## Product Constraint

- Pure React + TypeScript frontend (Vite).
- Tidak ada backend, database, CMS, auth, atau API custom.
- Semua project data bertipe dan berada di `src/data/*`.

## Asset Policy

- Raw source (`.blend`, `.fbx`, raw texture, PSD, TIFF, huge PNG, source render) di `assets-src/` (di-.gitignore).
- Runtime asset web-ready di `public/` (`models/*.glb`, `img/*.avif`, `img/*.webp`, `fonts/*.woff2`).
- Jangan gunakan fake/stock artwork sebagai karya Afrizal. Gunakan placeholder literal jika aset asli belum tersedia.

## Quality Rule

- Prioritas: Visual identity, 3D presentation, motion, interaction, responsive quality, accessibility, reasonable delivery optimization.
- "Optimize delivery, not ambition."
