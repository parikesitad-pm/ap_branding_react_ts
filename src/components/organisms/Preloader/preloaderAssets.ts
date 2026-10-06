import { projects } from '../../../data/projects';
import type { Project } from '../../../data/types';

/**
 * Derives future-ready preloadable image & poster URLs from the project dataset.
 * Rules:
 * - Only projects with explicit `assetStatus === 'ready'` are eligible.
 * - Undefined or 'placeholder' assetStatus is strictly excluded.
 * - For image projects: includes `project.media.src`.
 * - For GLB projects: includes `project.media.poster` (GLB binary is NEVER preloaded).
 * - URLs are deduplicated.
 */
export function getPreloadableAssetUrls(dataset: readonly Project[] = projects): string[] {
  const urls = new Set<string>();

  for (const project of dataset) {
    if (project.assetStatus !== 'ready') {
      continue;
    }

    if (project.media.type === 'image' && project.media.src) {
      urls.add(project.media.src);
    } else if (project.media.type === 'glb' && project.media.poster) {
      urls.add(project.media.poster);
    }
  }

  return Array.from(urls);
}

/**
 * Preload a single image using the browser image cache.
 * Resolves with true on success, false on error or timeout.
 * Emits a single warning on timeout.
 */
export function preloadImage(url: string, timeoutMs = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;

    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        console.warn(`[Preloader] Asset timed out: ${url}`);
        resolve(false);
      }
    }, timeoutMs);

    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true;
        window.clearTimeout(timer);
        resolve(ok);
      }
    };

    const img = new Image();
    img.src = url;

    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(() => finish(true))
        .catch(() => {
          // Fall back to onload / onerror check if decode rejects on partial data
          if (img.complete && img.naturalWidth > 0) {
            finish(true);
          } else {
            finish(false);
          }
        });
    } else {
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
    }
  });
}
