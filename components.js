// Load components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = html;
            if (elementId === 'header-container') {
                initializeHeader();
            }
        }
    } catch (error) {
        console.error(`Error loading component from ${componentPath}:`, error);
    }
}

function initializeHeader() {
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Control reset button visibility
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        // Only show reset button on homepage
        if (currentPage !== '' && currentPage !== 'index.html') {
            resetButton.style.display = 'none';
        }
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-container', 'components/header.html');
    loadComponent('footer-container', 'components/footer.html');
});