import { writeFileSync } from 'fs';

// Fix _routes.json to include all routes in worker (not exclude static assets)
const routes = {
  version: 1,
  include: ["/*"],
  exclude: []
};

writeFileSync('dist/_routes.json', JSON.stringify(routes, null, 2));
console.log('✅ Fixed _routes.json to include all assets in worker');

// Create .assetsignore to ONLY exclude worker directory (NOT _astro!)
const assetsIgnore = `_worker.js/
_routes.json
`;

writeFileSync('dist/.assetsignore', assetsIgnore);
console.log('✅ Created .assetsignore to protect worker files');
