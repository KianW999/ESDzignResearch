import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // Use relative base path by default ('./') so all compiled assets
  // resolve correctly on GitHub Pages (project repos, user repos, custom domains, or subpaths)
  // without white-screen path resolution errors.
  let base = './';
  if (process.env.VITE_BASE && process.env.VITE_BASE !== '/') {
    base = process.env.VITE_BASE.endsWith('/') ? process.env.VITE_BASE : `${process.env.VITE_BASE}/`;
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
  };
});
