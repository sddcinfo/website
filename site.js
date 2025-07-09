document.addEventListener('DOMContentLoaded', function () {
    // --- Sidebar Loading ---
    // Fetch the sidebar content and inject it into the placeholder
    fetch('/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
            if (sidebarPlaceholder) {
                sidebarPlaceholder.innerHTML = data;
            }
            
            // Once the sidebar is loaded, initialize its functionality
            initializeSidebar();
            setActiveLink();
        })
        .catch(error => {
            console.error('Error fetching sidebar:', error);
            // Fallback or error message
            const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
            if (sidebarPlaceholder) {
                sidebarPlaceholder.innerHTML = '<p class="p-4 text-red-500">Error loading navigation.</p>';
            }
        });

    function initializeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('is-open');
            });
        }

        // Close sidebar when clicking outside of it on mobile
        document.addEventListener('click', function (event) {
            if (sidebar && sidebar.classList.contains('is-open') && !sidebar.contains(event.target) && (!toggleBtn || !toggleBtn.contains(event.target))) {
                sidebar.classList.remove('is-open');
            }
        });
    }

    function setActiveLink() {
        // Remove 'active' class from the hardcoded link in the template
        const activeLink = document.querySelector('.sidebar-nav a.active');
        if (activeLink) {
            activeLink.classList.remove('active');
        }

        // Get the current page's path
        const currentPage = window.location.pathname;
        
        // Find the corresponding link in the newly loaded sidebar and add 'active' class
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            // Handle index.html explicitly
            if (link.getAttribute('href') === currentPage || (currentPage === '/' && link.getAttribute('href') === '/index.html')) {
                link.classList.add('active');
            }
        });
    }
});