import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // Determine optimal base path:
  // 1. Explicit VITE_BASE (from deployment workflows)
  // 2. GITHUB_REPOSITORY environment variable (auto-provided by GitHub Actions)
  // 3. Default relative './'
  let base = './';
  if (process.env.VITE_BASE && process.env.VITE_BASE.trim() !== '') {
    const raw = process.env.VITE_BASE.trim();
    if (raw !== '/' && raw !== './') {
      const cleaned = raw.replace(/\/+/g, '/');
      base = cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
    }
  } else if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    const repoName = parts[1];
    if (repoName && !repoName.toLowerCase().endsWith('.github.io')) {
      base = `/${repoName}/`;
    }
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/app.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/app.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  };
});
