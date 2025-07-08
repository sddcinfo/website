document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
        <div class="nav">
            <a href="index.html">Home</a>
            <a href="hardware.html">Hardware</a>
            <a href="performance.html">Performance</a>
            <a href="documentation/index.html">Documentation</a>
        </div>
    `;
    const footerHTML = `
        <p>&copy; ${new Date().getFullYear()} sddc.info | All rights reserved.</p>
        <p>An exploration in infrastructure automation.</p>
    `;

    const navContainer = document.querySelector(".nav-container");
    const footerContainer = document.querySelector(".footer");

    if (navContainer) {
        navContainer.innerHTML = navHTML;
    }
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
});
