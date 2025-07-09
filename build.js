const fs = require('fs').promises;
const path = require('path');
const exec = require('util').promisify(require('child_process').exec);

const SOURCE_DIR = path.join(__dirname, 'source');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function getGitCommitHash() {
    // Use the environment variable provided by Cloudflare Pages, or get it from git locally.
    if (process.env.CF_PAGES_COMMIT_SHA) {
        return process.env.CF_PAGES_COMMIT_SHA.slice(0, 7);
    }
    try {
        const { stdout } = await exec('git rev-parse --short HEAD');
        return stdout.trim();
    } catch (error) {
        console.warn('Could not get git commit hash. Using timestamp instead.', error);
        return Date.now().toString();
    }
}

async function findFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? findFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

async function build() {
    console.log('Starting build...');
    const version = await getGitCommitHash();
    console.log(`Using version: ${version}`);

    // Clean and create public directory
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // Find all files in source directory
    const allFiles = await findFiles(SOURCE_DIR);

    // Read sidebar content
    const sidebarPath = path.join(SOURCE_DIR, 'sidebar.html');
    const sidebarContent = await fs.readFile(sidebarPath, 'utf8');

    // Process each file
    for (const file of allFiles) {
        const relativePath = path.relative(SOURCE_DIR, file);
        const destPath = path.join(PUBLIC_DIR, relativePath);

        // Ensure destination directory exists
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        if (path.extname(file) === '.html' && path.basename(file) !== 'sidebar.html') {
            // It's an HTML file to be processed
            let content = await fs.readFile(file, 'utf8');

            // 1. Inject sidebar
            content = content.replace(/<div id="sidebar-placeholder"><\/div>/g, sidebarContent);

            // 2. Add cache-busting query string
            content = content.replace(/(href|src)="(.*?)(\.css|\.js)"/g, `$1="$2$3?v=${version}"`);
            
            await fs.writeFile(destPath, content, 'utf8');
        } else if (path.basename(file) !== 'sidebar.html') {
            // It's an asset (CSS, JS, image, etc.), just copy it
            await fs.copyFile(file, destPath);
        }
    }

    console.log('Build finished successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
