export default class Recipe {
    async getHtml() {
        // Placeholder, will be replaced by executeViewScript logic mostly, 
        // but we need a container. Ideally we render immediately if we have the ID.
        return `<div id="recipe-detail-container" class="loading">Cargando...</div>`;
    }

    async executeViewScript(params) {
        const recipeId = params[0]; // router passes params as array
        const recipe = window.store.getRecipeById(recipeId);
        const container = document.getElementById('recipe-detail-container');

        if (!recipe) {
            container.innerHTML = '<h2>Receta no encontrada</h2>';
            return;
        }

        // Add to recent
        window.store.addToRecent(recipeId);

        const isFav = window.store.isFavorite(recipeId);

        container.innerHTML = `
            <div class="recipe-detail-view fade-in">
                <div class="recipe-hero" style="background-image: url('${recipe.image || 'assets/placeholder.svg'}')">
                    <button class="btn-back" onclick="history.back()">
                        <span class="material-symbols-rounded">arrow_back</span>
                    </button>
                    <div class="hero-actions">
                        <button class="btn-fav ${isFav ? 'active' : ''}" id="btn-fav">
                            <span class="material-symbols-rounded">${isFav ? 'favorite' : 'favorite_border'}</span>
                        </button>
                    </div>
                </div>

                <div class="recipe-content">
                    <div class="title-row">
                        <h1 class="recipe-title">${recipe.title}</h1>
                        <div class="action-buttons">
                            <button class="btn-icon" id="btn-edit">
                                <span class="material-symbols-rounded">edit</span>
                            </button>
                            <button class="btn-icon" id="btn-delete">
                                <span class="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    </div>
                    <p class="recipe-desc">${recipe.description}</p>

                    <div class="recipe-stats">
                        <div class="stat-item">
                            <span class="material-symbols-rounded">schedule</span>
                            <span>${recipe.time}</span>
                        </div>
                        <div class="stat-item">
                            <span class="material-symbols-rounded">restaurant</span>
                            <span>${recipe.servings} rac.</span>
                        </div>
                        <div class="stat-item">
                            <span class="material-symbols-rounded">equalizer</span>
                            <span>${recipe.difficulty}</span>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <section class="ingredients-section">
                        <h2>Ingredientes</h2>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ing => `
                                <li>
                                    <span class="material-symbols-rounded check-icon">check_circle</span>
                                    <span class="ing-amount">${ing.amount}</span>
                                    <span class="ing-name">${ing.item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </section>

                    <section class="steps-section">
                        <h2>Preparación</h2>
                        <div class="steps-list">
                            ${recipe.steps.map((step, index) => `
                                <div class="step-item">
                                    <div class="step-number">${index + 1}</div>
                                    <p>${step.text}</p>
                                    ${step.image ? `<img src="${step.image}" class="step-image" alt="Paso ${index + 1}">` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <div class="floating-action">
                        <button class="btn btn-primary" id="btn-cook-mode">
                            <span class="material-symbols-rounded">play_arrow</span>
                            Modo Cocina
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cooking Mode Modal -->
            <div id="cooking-mode" class="cooking-mode hidden">
                <div class="cooking-header">
                    <button id="btn-close-cook" class="btn-icon">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                    <span>Modo Cocina</span>
                </div>
                <div class="cooking-content">
                    <!-- Dynamic Step Content -->
                    <div class="swiper-container">
                        ${recipe.steps.map((step, index) => `
                            <div class="cook-step">
                                <h2>Paso ${index + 1}</h2>
                                <p>${step.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        document.getElementById('btn-fav').addEventListener('click', () => {
            window.store.toggleFavorite(recipeId);
            const btn = document.getElementById('btn-fav');
            const icon = btn.querySelector('span');
            const newStatus = window.store.isFavorite(recipeId);

            btn.classList.toggle('active');
            icon.textContent = newStatus ? 'favorite' : 'favorite_border';
        });

        document.getElementById('btn-edit').addEventListener('click', () => {
            window.history.pushState(null, null, `/edit/${recipeId}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
        });

        document.getElementById('btn-delete').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres borrar esta receta?')) {
                window.store.deleteRecipe(recipeId);
                window.history.pushState(null, null, '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
        });

        const cookMode = document.getElementById('cooking-mode');
        document.getElementById('btn-cook-mode').addEventListener('click', () => {
            cookMode.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        document.getElementById('btn-close-cook').addEventListener('click', () => {
            cookMode.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }
}
