export default class Home {
    async getHtml() {
        const recipes = window.store.getRecipes();
        const recentIds = window.store.state.recent;
        const recentRecipes = recipes.filter(r => recentIds.includes(r.id));

        // Helper to generate recipe card HTML
        const createCard = (recipe) => `
            <a href="/recipe/${recipe.id}" class="recipe-card" data-link>
                <div class="card-image" style="background-image: url('${recipe.image || 'assets/placeholder.svg'}')">
                    <div class="card-badge">${recipe.time}</div>
                </div>
                <div class="card-content">
                    <h3>${recipe.title}</h3>
                    <div class="card-meta">
                        <span>${recipe.difficulty}</span>
                        <span>•</span>
                        <span>${recipe.category}</span>
                    </div>
                </div>
            </a>
        `;

        return `
            <div class="home-view">
                <!-- Hero / Search -->
                <header class="hero-section">
                    <h1>¿Qué quieres cocinar hoy?</h1>
                    <div class="search-bar">
                        <span class="material-symbols-rounded">search</span>
                        <input type="text" id="search-input" placeholder="Buscar recetas, ingredientes...">
                    </div>
                </header>

                <!-- Categories -->
                <section class="categories-section">
                    <h2>Categorías</h2>
                    <div class="category-scroll">
                        <button class="category-chip active">Todas</button>
                        <button class="category-chip">Pasta</button>
                        <button class="category-chip">Arroces</button>
                        <button class="category-chip">Carnes</button>
                        <button class="category-chip">Pescado</button>
                        <button class="category-chip">Vegano</button>
                        <button class="category-chip">Postres</button>
                        <button class="category-chip">Ensaladas</button>
                        <button class="category-chip">Otros</button>
                    </div>
                </section>

                <!-- Recent Recipes -->
                ${recentRecipes.length > 0 ? `
                <section class="section">
                    <h2>Recientes</h2>
                    <div class="recipe-grid">
                        ${recentRecipes.map(createCard).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- All Recipes -->
                <section class="section">
                    <h2>Recomendadas para ti</h2>
                    <div class="recipe-grid" id="recipe-feed">
                        ${recipes.map(createCard).join('')}
                    </div>
                </section>
            </div>
        `;
    }

    executeViewScript() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const recipeFeed = document.getElementById('recipe-feed');
        const categoryChips = document.querySelectorAll('.category-chip');
        let currentCategory = 'Todas';
        let currentSearch = '';

        const renderRecipes = () => {
            const allRecipes = window.store.getRecipes();
            const filtered = allRecipes.filter(r => {
                const matchesSearch = r.title.toLowerCase().includes(currentSearch) ||
                    r.ingredients.some(i => i.item.toLowerCase().includes(currentSearch));
                const matchesCategory = currentCategory === 'Todas' || r.category === currentCategory;
                return matchesSearch && matchesCategory;
            });

            if (filtered.length === 0) {
                recipeFeed.innerHTML = '<div style="text-align:center; grid-column: 1/-1; padding: 2rem; color: var(--text-secondary);">No se encontraron recetas.</div>';
                return;
            }

            recipeFeed.innerHTML = filtered.map(r => `
                <a href="/recipe/${r.id}" class="recipe-card fade-in" data-link>
                    <div class="card-image" style="background-image: url('${r.image || 'assets/placeholder.svg'}')">
                        <div class="card-badge">${r.time}</div>
                    </div>
                    <div class="card-content">
                        <h3>${r.title}</h3>
                        <div class="card-meta">
                            <span>${r.difficulty}</span>
                            <span>•</span>
                            <span>${r.category}</span>
                        </div>
                    </div>
                </a>
            `).join('');
        };

        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderRecipes();
        });

        categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all
                categoryChips.forEach(c => c.classList.remove('active'));
                // Add to clicked
                chip.classList.add('active');

                currentCategory = chip.textContent;
                renderRecipes();
            });
        });
    }
}
