# sddc.info

Documentation website for a fully automated bare-metal Kubernetes home lab platform. Built with Astro 6, Tailwind CSS v4, and deployed on Cloudflare Workers.

## Tech Stack

- **Framework**: [Astro 6](https://astro.build) (SSR mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config)
- **Font**: Inter via Astro Fonts API (self-hosted at build time)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com) with static asset serving
- **Email**: Cloudflare Email Workers (contact form)
- **CAPTCHA**: Cloudflare Turnstile

## Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (`localhost:4321`) |
| `npm run build` | Build for production (`dist/`) |
| `npm run preview` | Preview build with workerd runtime |
| `npm run deploy` | Deploy to Cloudflare Workers |

## Architecture

```
src/
  layouts/Layout.astro    # Shell: head, nav sidebar, dark mode, JSON-LD
  pages/                  # 11 content pages + 404 + API endpoint
    api/contact.ts        # POST handler (Turnstile + Email Workers)
  styles/global.css       # Tailwind theme, components, dark mode
  middleware.ts           # Cache-Control, CSP, security headers
public/                   # Static assets (images, robots.txt, manifest)
wrangler.toml             # Worker config (vars, bindings, custom domains)
```

## Deployment

The site is deployed as a Cloudflare Worker with custom domains `sddc.info` and `www.sddc.info`. The Astro Cloudflare adapter (v13) uses `@cloudflare/vite-plugin` to build the worker and static assets separately:

- `dist/server/` - Worker entry point + generated `wrangler.json`
- `dist/client/` - Static assets (images, CSS, fonts)

Deploy reads the generated config: `wrangler deploy --config dist/server/wrangler.json`
