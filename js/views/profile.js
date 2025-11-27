export default class Profile {
    async getHtml() {
        const favorites = window.store.state.favorites;
        const allRecipes = window.store.getRecipes();
        const favRecipes = allRecipes.filter(r => favorites.includes(r.id));

        const createCard = (recipe) => `
            <a href="/recipe/${recipe.id}" class="recipe-card mini" data-link>
                <div class="card-image" style="background-image: url('${recipe.image || 'assets/placeholder.svg'}')"></div>
                <div class="card-content">
                    <h3>${recipe.title}</h3>
                </div>
            </a>
        `;

        return `
            <div class="profile-view container fade-in">
                <div class="profile-header">
                    <div class="avatar">
                        <span class="material-symbols-rounded">person</span>
                    </div>
                    <h2>Chef Invitado</h2>
                    <p>Amante de la buena comida</p>
                </div>

                <div class="stats-row">
                    <div class="stat">
                        <span class="num">${favRecipes.length}</span>
                        <span class="label">Favoritos</span>
                    </div>
                    <div class="stat">
                        <span class="num">0</span>
                        <span class="label">Creadas</span>
                    </div>
                </div>

                <div class="divider"></div>

                <section>
                    <h3>Mis Favoritos</h3>
                    ${favRecipes.length > 0 ? `
                        <div class="recipe-grid">
                            ${favRecipes.map(createCard).join('')}
                        </div>
                    ` : '<p class="empty-state">Aún no tienes favoritos.</p>'}
                </section>

                <div class="divider"></div>

                <button class="btn-outline full-width">
                    <span class="material-symbols-rounded">settings</span>
                    Configuración
                </button>
            </div>
        `;
    }
}
