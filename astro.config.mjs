// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sddc.info',
  adapter: cloudflare(),
  integrations: [sitemap()],
  output: 'server',
  trailingSlash: 'never',
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',
      cssMinify: true,
    }
  }
});
