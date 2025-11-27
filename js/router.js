export default class Router {
    constructor() {
        this.routes = [];
        this.currentView = null;
    }

    addRoute(path, viewName) {
        this.routes.push({ path, viewName });
    }

    match(path) {
        // Simple regex matching for routes with parameters like /recipe/:id
        for (const route of this.routes) {
            const regexPath = route.path.replace(/:\w+/g, '([^/]+)');
            const match = path.match(new RegExp(`^${regexPath}$`));
            if (match) {
                return {
                    viewName: route.viewName,
                    params: match.slice(1) // Extract params
                };
            }
        }
        return null;
    }

    async navigateTo(url) {
        history.pushState(null, null, url);
        await this.handleLocation();
    }

    async handleLocation() {
        const path = window.location.pathname;
        const match = this.match(path);

        if (!match) {
            console.warn('404 Not Found', path);
            this.navigateTo('/'); // Fallback to home
            return;
        }

        // Update active state in bottom nav
        this.updateActiveNav(path);

        // Load View
        const viewModule = await import(`./views/${match.viewName}.js`);
        const view = new viewModule.default();

        const appContainer = document.getElementById('main-content');
        appContainer.innerHTML = await view.getHtml();

        // Execute view specific logic (after render)
        if (view.executeViewScript) {
            // Pass params if any (e.g. recipe ID)
            // We need to map params to keys if we want named params, but for now array is fine or we improve match
            view.executeViewScript(match.params);
        }
    }

    updateActiveNav(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === path) {
                item.classList.add('active');
            }
        });
    }

    start() {
        window.addEventListener('popstate', () => this.handleLocation());
        this.handleLocation();
    }
}
