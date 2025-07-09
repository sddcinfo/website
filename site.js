document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.mobile-nav-toggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('is-open');
        });
    }

    // Optional: Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', function (event) {
        if (sidebar && sidebar.classList.contains('is-open') && !sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove('is-open');
        }
    });
});
