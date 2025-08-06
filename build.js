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

function generatePageDescription(fileName, pageContent) {
    const descriptions = {
        'index.html': 'Comprehensive documentation for fully automated bare-metal Kubernetes platform provisioning using Ansible and modern DevOps practices.',
        'hardware.html': 'Hardware specifications and infrastructure overview for our bare-metal Kubernetes cluster deployment.',
        'performance.html': 'Performance benchmarks and metrics for our Kubernetes infrastructure and bare-metal server configuration.',
        'inventory.html': 'Complete hardware inventory and bill of materials for the bare-metal Kubernetes infrastructure.',
        'documentation_index.html': 'Technical documentation overview for automated Kubernetes cluster provisioning and infrastructure management.',
        'provisioning_server.html': 'Guide to setting up and configuring the provisioning server for automated bare-metal deployment.',
        'kubernetes_cluster.html': 'Kubernetes cluster deployment and configuration using Kubespray on bare-metal infrastructure.',
        'end_to_end_workflow.html': 'Complete end-to-end workflow for automated infrastructure provisioning and Kubernetes deployment.',
        'release_process.html': 'Release management and deployment pipeline for infrastructure automation projects.',
        'journey.html': 'The technical journey from manual server provisioning to fully automated bare-metal Kubernetes infrastructure.',
        'kubespray.html': 'Kubespray deployment guide for production-ready Kubernetes clusters on bare-metal servers.',
        '404.html': 'Page not found - The requested page could not be found on SDDC.info'
    };
    
    return descriptions[fileName] || 'Technical documentation and guides for automated infrastructure provisioning and Kubernetes deployment.';
}

async function build() {
    console.log('Starting build...');

    // Clean and create public directory
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // 1. Copy all assets from source to public
    const allSourceFiles = await findFiles(SOURCE_DIR);
    for (const file of allSourceFiles) {
        if (file.includes(PAGES_DIR)) continue;
        const relativePath = path.relative(SOURCE_DIR, file);
        const destPath = path.join(PUBLIC_DIR, relativePath);
        const destDir = path.dirname(destPath);
        await fs.mkdir(destDir, { recursive: true });
        if (!(await fs.stat(file)).isDirectory()) {
            await fs.copyFile(file, destPath);
        }
    }

    // 2. Process HTML files
    const layoutPath = path.join(PAGES_DIR, 'layout.html');
    const sidebarPath = path.join(PAGES_DIR, 'sidebar.html');
    const layoutTemplate = await fs.readFile(layoutPath, 'utf8');
    const sidebarContent = await fs.readFile(sidebarPath, 'utf8');

    const htmlFiles = (await findFiles(PAGES_DIR)).filter(file => file.endsWith('.html') && !file.endsWith('layout.html') && !file.endsWith('sidebar.html'));

    for (const file of htmlFiles) {
        const relativePath = path.relative(PAGES_DIR, file);
        const fileName = path.basename(relativePath);
        const destPath = path.join(PUBLIC_DIR, relativePath);

        let pageContent = await fs.readFile(file, 'utf8');
        const pageTitle = extractTitle(pageContent);
        const pageDescription = generatePageDescription(fileName, pageContent);
        const pageUrl = relativePath === 'index.html' ? '' : relativePath;

        let finalHtml = layoutTemplate.replace('<!-- PAGE_CONTENT -->', pageContent);
        finalHtml = finalHtml.replace(/<!-- PAGE_TITLE -->/g, `${pageTitle} | sddc.info`);
        finalHtml = finalHtml.replace(/<!-- PAGE_DESCRIPTION -->/g, pageDescription);
        finalHtml = finalHtml.replace(/<!-- PAGE_URL -->/g, pageUrl);
        finalHtml = finalHtml.replace('<div id="sidebar-placeholder"></div>', sidebarContent);

        await fs.writeFile(destPath, finalHtml, 'utf8');
    }

    console.log('Build finished successfully!');
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
