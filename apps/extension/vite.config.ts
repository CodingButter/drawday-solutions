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
        const outputPath = resolve(__dirname, 'DrawDaySpinner');

        // Ensure directories exist
        if (!existsSync(outputPath)) {
          mkdirSync(outputPath, { recursive: true });
        }

        // Copy manifest.json to DrawDaySpinner
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'DrawDaySpinner/manifest.json')
        );

        // Copy background.js
        copyFileSync(
          resolve(__dirname, 'src/background.js'),
          resolve(__dirname, 'DrawDaySpinner/background.js')
        );

        // Copy toggle_side_panel.js (will be compiled from TypeScript)
        if (existsSync(resolve(__dirname, 'DrawDaySpinner/toggle_side_panel.js'))) {
          // Already compiled by rollup
        } else if (existsSync(resolve(__dirname, 'src/toggle_side_panel.js'))) {
          copyFileSync(
            resolve(__dirname, 'src/toggle_side_panel.js'),
            resolve(__dirname, 'DrawDaySpinner/toggle_side_panel.js')
          );
        }

        // Rename HTML files to match manifest.json expectations
        if (existsSync(resolve(outputPath, 'sidepanel.html'))) {
          // Already named correctly
        } else if (existsSync(resolve(outputPath, 'sidepanel-iframe.html'))) {
          // Rename to expected name
          copyFileSync(
            resolve(outputPath, 'sidepanel-iframe.html'),
            resolve(outputPath, 'sidepanel.html')
          );
        }

        if (existsSync(resolve(outputPath, 'options.html'))) {
          // Already named correctly
        } else if (existsSync(resolve(outputPath, 'options-iframe.html'))) {
          // Rename to expected name
          copyFileSync(
            resolve(outputPath, 'options-iframe.html'),
            resolve(outputPath, 'options.html')
          );
        }

        // Copy icons from shared assets package
        const assetsPath = resolve(__dirname, '../../packages/assets/src');

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
    base: './',
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel-iframe.html'),
        options: resolve(__dirname, 'options-iframe.html'),
        toggle_side_panel: resolve(__dirname, 'src/toggle_side_panel.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Rename the output files to match what manifest.json expects
          if (chunkInfo.name === 'sidepanel') return 'sidepanel.js';
          if (chunkInfo.name === 'options') return 'options.js';
          if (chunkInfo.name === 'toggle_side_panel') return 'toggle_side_panel.js';
          return '[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
