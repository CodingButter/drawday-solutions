import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-assets',
      writeBundle() {
        // Copy manifest.json to DrawDaySpinner
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'DrawDaySpinner/manifest.json')
        );

        // Copy icons from shared assets package
        const assetsPath = resolve(__dirname, '../../packages/assets/src');
        const outputPath = resolve(__dirname, 'DrawDaySpinner');

        // Ensure directories exist
        if (!existsSync(outputPath)) {
          mkdirSync(outputPath, { recursive: true });
        }

        // Copy icon files to extension output
        const iconFiles = ['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'];
        iconFiles.forEach((file) => {
          const srcPath = resolve(assetsPath, 'icons', file);
          const destPath = resolve(outputPath, file);
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath);
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'DrawDaySpinner',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        options: resolve(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
