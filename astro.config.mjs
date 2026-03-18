// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sddc.info',
  adapter: cloudflare(),
  integrations: [sitemap()],
  output: 'server',
  fonts: [{
    provider: fontProviders.google(),
    name: 'Inter',
    cssVariable: '--font-inter',
    weights: [400, 500, 600, 700],
    display: 'block',
  }],
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
