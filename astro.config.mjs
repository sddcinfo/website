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
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: true
    }
  }
});
