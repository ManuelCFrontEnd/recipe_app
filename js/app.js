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
});

// Expose store for debugging
window.store = store;
