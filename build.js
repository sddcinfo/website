const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const SOURCE_DIR = path.join(__dirname, 'source');
const PUBLIC_DIR = path.join(__dirname, 'public');
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
    await execPromise('node node_modules/tailwindcss/dist/lib.js -i ./source/input.css -o ./public/styles.css --minify');

    // Find all files in source directory
    const allFiles = await findFiles(SOURCE_DIR);
    
    // Read layout and sidebar templates
    const layoutPath = path.join(SOURCE_DIR, 'layout.html');
    const sidebarPath = path.join(SOURCE_DIR, 'sidebar.html');
    const layoutTemplate = await fs.readFile(layoutPath, 'utf8');
    const sidebarContent = await fs.readFile(sidebarPath, 'utf8');

    // Process each file
    for (const file of allFiles) {
        const relativePath = path.relative(SOURCE_DIR, file);
        const destPath = path.join(PUBLIC_DIR, relativePath);

        // Ensure destination directory exists
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        const ext = path.extname(file);
        const base = path.basename(file);

        if (ext === '.html' && base !== 'layout.html' && base !== 'sidebar.html') {
            // It's a content HTML file
            let pageContent = await fs.readFile(file, 'utf8');
            const pageTitle = extractTitle(pageContent);

            // Inject page content into layout
            let finalHtml = layoutTemplate.replace('<!-- PAGE_CONTENT -->', pageContent);
            finalHtml = finalHtml.replace('<!-- PAGE_TITLE -->', `${pageTitle} | sddc.info`);
            
            // Inject sidebar
            finalHtml = finalHtml.replace('<div id="sidebar-placeholder"></div>', sidebarContent);

            
            
            await fs.writeFile(destPath, finalHtml, 'utf8');

        } else if (ext !== '.html' && ext !== '.css') {
            // It's a non-CSS, non-HTML asset (JS, image, etc.), just copy it
            await fs.copyFile(file, destPath);
        }
    }

    console.log('Build finished successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});