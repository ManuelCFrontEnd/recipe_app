export default class Editor {
    async getHtml() {
        return `
            <div class="editor-view container fade-in">
                <header class="editor-header">
                    <button class="btn-icon" onclick="history.back()">
                        <span class="material-symbols-rounded">arrow_back</span>
                    </button>
                    <h2 id="editor-title">Nueva Receta</h2>
                    <div style="width: 40px;"></div> <!-- Spacer for alignment -->
                </header>

                <form id="recipe-form" style="padding-bottom: 80px;">
                    <div class="form-group">
                        <label>Foto del plato</label>
                        <div class="image-upload-container" id="main-image-container">
                            <input type="file" id="main-image" accept="image/*" hidden>
                            <button type="button" class="btn-upload" onclick="document.getElementById('main-image').click()">
                                <span class="material-symbols-rounded">add_photo_alternate</span>
                                <span>Añadir foto principal</span>
                            </button>
                            <div class="image-preview hidden"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Título de la receta</label>
                        <input type="text" id="title" required placeholder="Ej. Paella Valenciana">
                    </div>

                    <div class="form-group">
                        <label>Descripción corta</label>
                        <textarea id="description" rows="3" placeholder="Una breve historia..."></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Tiempo</label>
                            <input type="text" id="time" placeholder="Ej. 30 min">
                        </div>
                        <div class="form-group">
                            <label>Raciones</label>
                            <input type="number" id="servings" placeholder="2">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Dificultad</label>
                            <select id="difficulty">
                                <option value="Fácil">Fácil</option>
                                <option value="Media">Media</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Categoría</label>
                            <select id="category">
                                <option value="Pasta">Pasta</option>
                                <option value="Arroces">Arroces</option>
                                <option value="Carnes">Carnes</option>
                                <option value="Pescado">Pescado</option>
                                <option value="Vegano">Vegano</option>
                                <option value="Postres">Postres</option>
                                <option value="Ensaladas">Ensaladas</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="section-header">
                        <h3>Ingredientes</h3>
                        <button type="button" id="add-ingredient" class="btn-small">+ Añadir</button>
                    </div>
                    <div id="ingredients-list" class="dynamic-list">
                        <!-- Ingredients inputs will go here -->
                    </div>

                    <div class="divider"></div>

                    <div class="section-header">
                        <h3>Pasos</h3>
                        <button type="button" id="add-step" class="btn-small">+ Añadir</button>
                    </div>
                    <div id="steps-list" class="dynamic-list">
                        <!-- Steps inputs will go here -->
                    </div>

                    <div class="floating-action">
                        <button type="button" class="btn btn-primary" id="btn-save" style="width: 100%; justify-content: center;">
                            Guardar Receta
                        </button>
                    </div>

                </form>
            </div>
        `;
    }

    executeViewScript(params) {
        const ingredientsList = document.getElementById('ingredients-list');
        const stepsList = document.getElementById('steps-list');
        const recipeId = params && params[0];
        let isEditing = false;

        // Image Compression Helper
        const processImage = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        const maxWidth = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                    };
                    img.onerror = (err) => reject(err);
                };
                reader.onerror = (err) => reject(err);
            });
        };

        // Preview Helper
        const setupImagePreview = (input, container, initialUrl = null) => {
            const previewDiv = container.querySelector('.image-preview');
            const btn = container.querySelector('.btn-upload') || container.querySelector('.btn-upload-small');

            if (initialUrl) {
                previewDiv.style.backgroundImage = `url('${initialUrl}')`;
                previewDiv.classList.remove('hidden');
                if (btn) btn.classList.add('hidden');
                input.dataset.imageData = initialUrl;
            }

            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const previewUrl = await processImage(file);
                    previewDiv.style.backgroundImage = `url('${previewUrl}')`;
                    previewDiv.classList.remove('hidden');
                    if (btn) btn.classList.add('hidden');
                    input.dataset.imageData = previewUrl;
                }
            });
        };

        // Helper to add ingredient row
        const addIngredientRow = (val = { item: '', amount: '' }) => {
            const div = document.createElement('div');
            div.className = 'dynamic-row fade-in';
            div.innerHTML = `
                <input type="text" placeholder="Ingrediente" class="ing-item" value="${val.item}">
                <input type="text" placeholder="Cant." class="ing-amount" value="${val.amount}">
                <button type="button" class="btn-remove">×</button>
            `;
            div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
            ingredientsList.appendChild(div);
        };

        // Helper to add step row
        const addStepRow = (val = { text: '', image: null }) => {
            const div = document.createElement('div');
            div.className = 'dynamic-row column fade-in';
            const uniqueId = 'step-img-' + Date.now() + Math.random().toString(36).substr(2, 9);

            div.innerHTML = `
                <textarea placeholder="Describe el paso..." class="step-text" rows="2">${val.text}</textarea>
                <div class="step-image-upload" id="container-${uniqueId}">
                    <input type="file" id="${uniqueId}" accept="image/*" hidden class="step-file-input">
                    <button type="button" class="btn-upload-small" onclick="document.getElementById('${uniqueId}').click()">
                        <span class="material-symbols-rounded">add_a_photo</span> Añadir foto
                    </button>
                    <div class="image-preview hidden"></div>
                </div>
                <button type="button" class="btn-remove-step">Eliminar Paso</button>
            `;

            setupImagePreview(
                div.querySelector(`#${uniqueId}`),
                div.querySelector(`#container-${uniqueId}`),
                val.image
            );

            div.querySelector('.btn-remove-step').addEventListener('click', () => div.remove());
            stepsList.appendChild(div);
        };

        // Setup Main Image Listener
        setupImagePreview(
            document.getElementById('main-image'),
            document.getElementById('main-image-container')
        );

        document.getElementById('add-ingredient').addEventListener('click', () => addIngredientRow());
        document.getElementById('add-step').addEventListener('click', () => addStepRow());

        // Check for Edit Mode
        if (recipeId) {
            const recipe = window.store.getRecipeById(recipeId);
            if (recipe) {
                isEditing = true;
                document.getElementById('editor-title').textContent = 'Editar Receta';
                document.getElementById('title').value = recipe.title;
                document.getElementById('description').value = recipe.description;
                document.getElementById('time').value = recipe.time;
                document.getElementById('servings').value = recipe.servings;
                document.getElementById('difficulty').value = recipe.difficulty;
                document.getElementById('category').value = recipe.category;

                if (recipe.image) {
                    setupImagePreview(
                        document.getElementById('main-image'),
                        document.getElementById('main-image-container'),
                        recipe.image
                    );
                }

                recipe.ingredients.forEach(ing => addIngredientRow(ing));
                recipe.steps.forEach(step => addStepRow(step));
            }
        } else {
            // Initial empty rows for new recipe
            addIngredientRow();
            addStepRow();
        }

        // Save Logic
        document.getElementById('btn-save').addEventListener('click', async (e) => {
            e.preventDefault();
            const btnSave = document.getElementById('btn-save');
            btnSave.textContent = 'Guardando...';
            btnSave.disabled = true;

            try {
                const title = document.getElementById('title').value;
                if (!title) throw new Error('El título es obligatorio');

                const mainInput = document.getElementById('main-image');
                const mainImage = mainInput.dataset.imageData || null;

                const ingredients = Array.from(document.querySelectorAll('#ingredients-list .dynamic-row')).map(row => ({
                    item: row.querySelector('.ing-item').value,
                    amount: row.querySelector('.ing-amount').value
                })).filter(i => i.item);

                const steps = Array.from(document.querySelectorAll('#steps-list .dynamic-row')).map(row => ({
                    text: row.querySelector('.step-text').value,
                    image: row.querySelector('.step-file-input').dataset.imageData || null
                })).filter(s => s.text);

                if (ingredients.length === 0) {
                    throw new Error('Debes añadir al menos un ingrediente.');
                }

                if (steps.length === 0) {
                    throw new Error('Debes añadir al menos un paso.');
                }

                const recipeData = {
                    id: isEditing ? recipeId : Date.now().toString(),
                    title,
                    description: document.getElementById('description').value,
                    time: document.getElementById('time').value,
                    servings: document.getElementById('servings').value,
                    difficulty: document.getElementById('difficulty').value,
                    category: document.getElementById('category').value,
                    image: mainImage,
                    ingredients,
                    steps
                };

                if (isEditing) {
                    window.store.updateRecipe(recipeData);
                    alert('Receta actualizada!');
                } else {
                    window.store.addRecipe(recipeData);
                    alert('Receta creada!');
                }

                window.history.back(); // Go back to previous page
                setTimeout(() => window.dispatchEvent(new PopStateEvent('popstate')), 50);

            } catch (err) {
                alert(err.message);
                btnSave.textContent = 'Guardar';
                btnSave.disabled = false;
            }
        });
    }
}
