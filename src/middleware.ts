import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();

  // Clone response to modify headers
  const newResponse = new Response(response.body, response);

  // Add aggressive caching for static assets
  const url = new URL(context.request.url);

  if (url.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|css|js)$/)) {
    // Static assets: cache for 1 year
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/\.(xml|txt|json|webmanifest)$/)) {
    // Semi-static files: cache for 1 day
    newResponse.headers.set('Cache-Control', 'public, max-age=86400, must-revalidate');
  } else if (url.pathname === '/' || !url.pathname.includes('.')) {
    // HTML pages: cache for 1 hour, revalidate
    newResponse.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }

  // Performance headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');

  // Security headers
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; frame-src https://challenges.cloudflare.com; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com;");

  return newResponse;
};
