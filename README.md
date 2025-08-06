# SDDC.info Website

> **Comprehensive documentation for fully automated bare-metal Kubernetes platform provisioning**

This repository contains the source code for [sddc.info](https://sddc.info), a technical documentation website that chronicles the journey from manual server provisioning to a fully automated bare-metal Kubernetes infrastructure using modern DevOps practices.

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fsddc.info)](https://sddc.info)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

## 🏗️ Architecture

The website is built as a **custom static site generator** with modern web standards:

- **Frontend**: Vanilla HTML/CSS/JavaScript with semantic structure
- **Styling**: Tailwind CSS v4.1.11 with custom component layers
- **Build System**: Custom Node.js templating engine
- **Theme Support**: Dark/light mode with localStorage persistence
- **Responsive Design**: Mobile-first approach with hamburger navigation

### Key Features

✨ **SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards  
♿ **Accessibility**: ARIA labels, focus management, semantic HTML  
📱 **Mobile Responsive**: Collapsible navigation, touch-friendly interface  
🌙 **Dark Mode**: System preference detection with manual toggle  
⚡ **Performance**: Lightweight, optimized font loading, minimal dependencies  
🔒 **Security**: CSP headers, XSS protection, secure defaults  

## 📁 Project Structure

```
├── source/                 # Source files
│   ├── pages/             # HTML page templates
│   │   ├── layout.html    # Main layout template
│   │   ├── sidebar.html   # Navigation sidebar
│   │   ├── index.html     # Homepage content
│   │   ├── 404.html       # Error page
│   │   └── *.html         # Individual pages
│   ├── assets/            # Images and media
│   ├── styles.css         # Custom CSS with CSS variables
│   ├── site.js           # Client-side JavaScript
│   └── input.css         # Tailwind CSS input
├── public/                # Generated static files
├── build.js              # Custom build script
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/sddcinfo/website.git
cd website

# Install dependencies
npm install

# Build the website
npm run build

# Serve locally (optional)
npx serve public
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Full build process (HTML templates + CSS) |
| `npm run build:css` | Build only Tailwind CSS |

## 🛠️ Development

### Build Process

The custom build system (`build.js`) performs:

1. **Template Processing**: Merges layout, sidebar, and page content
2. **Meta Tag Generation**: Dynamic SEO meta tags per page
3. **Asset Copying**: Images and static files to public directory
4. **CSS Compilation**: Tailwind CSS processing and minification

### Adding New Pages

1. Create HTML file in `source/pages/`
2. Include proper `<h1>` tag for automatic title extraction
3. Run `npm run build` to generate the page
4. Add navigation link to `source/pages/sidebar.html`

Example page structure:
```html
<div class="hero-gradient">
    <h1>Page Title</h1>
    <p>Page description...</p>
</div>

<div class="card-container">
    <!-- Your content here -->
</div>
```

### Theme Customization

The website uses CSS custom properties for theming:

```css
:root {
    --bg-color: #ffffff;
    --text-color: #2c3e50;
    --primary-color: #3498db;
    /* ... */
}

body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ecf0f1;
    /* ... */
}
```

## 📖 Content Management

### Page Descriptions

Page descriptions for SEO are managed in `build.js`:

```javascript
const descriptions = {
    'page.html': 'Description for this page...',
    // Add new pages here
};
```

### Navigation

Update the sidebar navigation in `source/pages/sidebar.html`:

```html
<nav class="sidebar-nav">
    <h3>Section</h3>
    <ul>
        <li><a href="page.html">Page Title</a></li>
    </ul>
</nav>
```

## 🎨 Design System

### Components

- **Cards**: `.card` - Content containers with hover effects
- **Buttons**: `.btn`, `.btn-primary` - Interactive elements
- **Hero**: `.hero-gradient` - Page headers
- **Grid**: `.card-container` - Responsive grid layout

### Typography

- **Headings**: H1 (2.8em), H2 (2.2em), H3 (1.6em)
- **Font**: Inter (Google Fonts)
- **Colors**: CSS custom properties for theme consistency

## 🚢 Deployment

### Branch Strategy

- **`main`**: Production deployment (sddc.info)
- **`staging`**: Development preview (dev.sddc.info)
- **Feature branches**: For development work

### Build Output

The `public/` directory contains the complete static website ready for deployment to any static hosting service.

## 🔧 Technical Details

### SEO Implementation

- **Meta Tags**: Dynamic generation per page
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: Ready for implementation
- **Security Headers**: XSS protection, content type sniffing prevention

### Accessibility Features

- **ARIA Labels**: Navigation and interactive elements
- **Focus Management**: Visible focus indicators
- **Keyboard Navigation**: Full keyboard accessibility
- **Semantic HTML**: Proper document structure
- **Screen Reader Support**: Optimized for assistive technologies

### Performance Optimizations

- **Font Loading**: Preconnect to Google Fonts
- **CSS**: Minified Tailwind output
- **JavaScript**: Minimal, vanilla JS
- **Images**: Optimized assets
- **Build Size**: Lightweight architecture

## 📊 Analytics & Monitoring

The website is optimized for:
- **Core Web Vitals**: Fast loading, good UX metrics
- **SEO Rankings**: Comprehensive meta tag implementation  
- **Accessibility Compliance**: WCAG 2.1 guidelines
- **Mobile Performance**: Responsive design patterns

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch from `staging`
3. **Make** your changes following the existing patterns
4. **Test** the build process
5. **Submit** a pull request

### Development Guidelines

- Follow the existing component patterns
- Update page descriptions in `build.js`
- Test responsive design on mobile devices
- Verify accessibility with screen readers
- Maintain performance with minimal dependencies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [sddc.info](https://sddc.info)
- **Development Preview**: [dev.sddc.info](https://dev.sddc.info)
- **Issues**: [GitHub Issues](https://github.com/sddcinfo/website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sddcinfo/website/discussions)

---

**Built with ❤️ for the DevOps and Infrastructure Community**
