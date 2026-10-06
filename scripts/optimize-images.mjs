import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('assets-src');
const OUTPUT_DIR = path.resolve('public/img');
const TARGET_WIDTHS = [480, 960, 1600, 2400];

async function optimizeImages() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    let entries;
    try {
      entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
    } catch {
      console.log(`[optimize-images] Source folder ${SOURCE_DIR} not found or empty. Skipping.`);
      return;
    }

    const imageFiles = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.(jpe?g|png|webp|tiff|psd)$/i.test(name));

    if (imageFiles.length === 0) {
      console.log('[optimize-images] No raw source images found in assets-src/.');
      return;
    }

    console.log(`[optimize-images] Processing ${imageFiles.length} image(s)...`);

    for (const file of imageFiles) {
      const inputPath = path.join(SOURCE_DIR, file);
      const parsed = path.parse(file);
      const baseName = parsed.name;

      for (const width of TARGET_WIDTHS) {
        // Output WebP
        const webpOut = path.join(OUTPUT_DIR, `${baseName}-${width}w.webp`);
        await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpOut);

        // Output AVIF
        const avifOut = path.join(OUTPUT_DIR, `${baseName}-${width}w.avif`);
        await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .avif({ quality: 75 })
          .toFile(avifOut);
      }
      console.log(`[optimize-images] Generated AVIF & WebP variants for: ${file}`);
    }

    console.log('[optimize-images] Completed successfully.');
  } catch (error) {
    console.error('[optimize-images] Error processing images:', error);
    process.exit(1);
  }
}

optimizeImages();
