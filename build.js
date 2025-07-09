const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const SOURCE_DIR = path.join(__dirname, 'source');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PAGES_DIR = path.join(SOURCE_DIR, 'pages');
const TAILWIND_INPUT_PATH = path.join(SOURCE_DIR, 'input.css');
const TAILWIND_OUTPUT_PATH = path.join(PUBLIC_DIR, 'styles.css');

async function findFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? findFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

function extractTitle(htmlContent) {
    const match = htmlContent.match(/<h1.*?>(.*?)<\/h1>/);
    return match ? match[1].trim() : 'sddc.info';
}

async function build() {
    console.log('Starting build...');

    // Clean and create public directory
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // 1. Build Tailwind CSS
    console.log('Building Tailwind CSS...');
    await execPromise(`node node_modules/tailwindcss/dist/lib.js -i ${TAILWIND_INPUT_PATH} -o ${TAILWIND_OUTPUT_PATH} --minify`);

    // 2. Copy all assets from source to public
    const allSourceFiles = await findFiles(SOURCE_DIR);
    for (const file of allSourceFiles) {
        if (file.includes(PAGES_DIR)) continue;
        const relativePath = path.relative(SOURCE_DIR, file);
        const destPath = path.join(PUBLIC_DIR, relativePath);
        if ((await fs.stat(file)).isDirectory()) {
            await fs.mkdir(destPath, { recursive: true });
        } else {
            await fs.copyFile(file, destPath);
        }
    }

    // 3. Process HTML files
    const layoutPath = path.join(PAGES_DIR, 'layout.html');
    const sidebarPath = path.join(PAGES_DIR, 'sidebar.html');
    const layoutTemplate = await fs.readFile(layoutPath, 'utf8');
    const sidebarContent = await fs.readFile(sidebarPath, 'utf8');

    const htmlFiles = (await findFiles(PAGES_DIR)).filter(file => file.endsWith('.html') && !file.endsWith('layout.html') && !file.endsWith('sidebar.html'));

    for (const file of htmlFiles) {
        const relativePath = path.relative(PAGES_DIR, file);
        const destPath = path.join(PUBLIC_DIR, relativePath);

        let pageContent = await fs.readFile(file, 'utf8');
        const pageTitle = extractTitle(pageContent);

        let finalHtml = layoutTemplate.replace('<!-- PAGE_CONTENT -->', pageContent);
        finalHtml = finalHtml.replace('<!-- PAGE_TITLE -->', `${pageTitle} | sddc.info`);
        finalHtml = finalHtml.replace('<div id="sidebar-placeholder"></div>', sidebarContent);

        await fs.writeFile(destPath, finalHtml, 'utf8');
    }

    console.log('Build finished successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
