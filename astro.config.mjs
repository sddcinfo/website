// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    mode: 'directory',  // Directory mode for Workers
    wasmModuleImports: true,
    routes: {
      strategy: 'include-all'  // Let worker handle ALL routes including static assets
    }
  }),
  output: 'server',
  trailingSlash: 'never',
  compressHTML: true,  // Minify HTML for smaller payloads
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',  // Fast minification
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined  // Disable code splitting for faster loads
        }
      }
    }
  }
});
