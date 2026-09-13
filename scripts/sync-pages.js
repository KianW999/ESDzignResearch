import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
const source404 = path.join(rootDir, '404.html');

console.log('[sync-pages] Synchronizing GitHub Pages artifacts...');

// 1. Ensure dist/.nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// 2. Ensure dist/404.html is the dedicated SPA redirector (never a clone of index.html)
if (fs.existsSync(source404)) {
  fs.copyFileSync(source404, path.join(distDir, '404.html'));
}

// 3. Clear and mirror dist -> docs for users who select "Deploy from a branch -> /docs"
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });

// 4. Ensure root .nojekyll exists
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');

// 5. Mirror dist/assets -> root ./assets for users who select "Deploy from a branch -> / (root)"
if (fs.existsSync(distAssetsDir)) {
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }
  fs.cpSync(distAssetsDir, assetsDir, { recursive: true });
}

console.log('[sync-pages] Done! Artifacts mirrored to dist/, docs/, and ./assets.');
