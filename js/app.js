import Router from './router.js';
import Store from './store.js';

// Initialize Store
const store = new Store();

// Initialize Router
const router = new Router();

// Define Routes
router.addRoute('/', 'home');
router.addRoute('/recipe/:id', 'recipe');
router.addRoute('/create', 'editor');
router.addRoute('/edit/:id', 'editor');
router.addRoute('/profile', 'profile');

// Start App
document.addEventListener('DOMContentLoaded', () => {
    router.start();

    // Global navigation handler for SPA links
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
            e.preventDefault();
            const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
            router.navigateTo(link.getAttribute('href'));
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-symbols-rounded');

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = 'light_mode';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Update icon
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';

        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});

// Expose store for debugging
window.store = store;
