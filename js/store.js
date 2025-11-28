export default class Store {
    constructor() {
        // Default subcategories
        this.defaultSubcategories = [
            'Pasta', 'Arroces', 'Pescado', 'Frutas',
            'Helado', 'Carne', 'Panadería', 'Sopas'
        ];

        this.state = {
            recipes: JSON.parse(localStorage.getItem('gusteau_recipes')) || [],
            favorites: JSON.parse(localStorage.getItem('gusteau_favorites')) || [],
            recent: JSON.parse(localStorage.getItem('gusteau_recent')) || [],
            customSubcategories: JSON.parse(localStorage.getItem('gusteau_custom_subcategories')) || []
        };

        // Migrate old recipes to new structure
        this.migrateRecipes();

        if (this.state.recipes.length === 0) {
            this.seedData();
        }
    }

    save() {
        localStorage.setItem('gusteau_recipes', JSON.stringify(this.state.recipes));
        localStorage.setItem('gusteau_favorites', JSON.stringify(this.state.favorites));
        localStorage.setItem('gusteau_recent', JSON.stringify(this.state.recent));
        localStorage.setItem('gusteau_custom_subcategories', JSON.stringify(this.state.customSubcategories));
    }

    // Get all available subcategories (default + custom)
    getAllSubcategories() {
        return [...this.defaultSubcategories, ...this.state.customSubcategories].sort();
    }

    // Add a custom subcategory
    addCustomSubcategory(name) {
        const trimmedName = name.trim();
        if (!trimmedName) return false;

        // Check if it already exists
        const allSubcategories = this.getAllSubcategories();
        if (allSubcategories.some(s => s.toLowerCase() === trimmedName.toLowerCase())) {
            return false;
        }

        this.state.customSubcategories.push(trimmedName);
        this.save();
        return true;
    }

    // Migrate old recipes to new structure
    migrateRecipes() {
        let needsSave = false;

        this.state.recipes = this.state.recipes.map(recipe => {
            // If recipe already has new structure, skip
            if (recipe.mainCategory && recipe.subcategory) {
                return recipe;
            }

            // Migrate old category to new structure
            needsSave = true;
            const oldCategory = recipe.category || 'Otros';

            // Map old categories to subcategories and assign default main category
            return {
                ...recipe,
                mainCategory: 'Lunches', // Default to Lunches
                subcategory: oldCategory,
                category: undefined // Remove old field
            };
        });

        if (needsSave) {
            this.save();
        }
    }

    getRecipes() {
        return this.state.recipes;
    }

    getRecipeById(id) {
        return this.state.recipes.find(r => r.id === id);
    }

    addRecipe(recipe) {
        this.state.recipes.push(recipe);
        this.save();
    }

    updateRecipe(updatedRecipe) {
        const index = this.state.recipes.findIndex(r => r.id === updatedRecipe.id);
        if (index !== -1) {
            this.state.recipes[index] = updatedRecipe;
            this.save();
        }
    }

    deleteRecipe(id) {
        this.state.recipes = this.state.recipes.filter(r => r.id !== id);
        this.save();
    }

    toggleFavorite(id) {
        if (this.state.favorites.includes(id)) {
            this.state.favorites = this.state.favorites.filter(favId => favId !== id);
        } else {
            this.state.favorites.push(id);
        }
        this.save();
    }

    isFavorite(id) {
        return this.state.favorites.includes(id);
    }

    addToRecent(id) {
        this.state.recent = [id, ...this.state.recent.filter(rId => rId !== id)].slice(0, 5);
        this.save();
    }

    seedData() {
        const mockRecipes = [
            {
                id: '1',
                title: 'Pasta Carbonara Auténtica',
                description: 'La receta clásica romana sin nata, solo huevo, queso pecorino y guanciale.',
                time: '20 min',
                difficulty: 'Media',
                servings: 2,
                mainCategory: 'Lunches',
                subcategory: 'Pasta',
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
                ingredients: [
                    { item: 'Espaguetis', amount: '200g' },
                    { item: 'Yemas de huevo', amount: '3' },
                    { item: 'Pecorino Romano', amount: '50g' },
                    { item: 'Guanciale o Panceta', amount: '100g' },
                    { item: 'Pimienta negra', amount: 'al gusto' }
                ],
                steps: [
                    { text: 'Hervir el agua con sal y cocinar la pasta.', image: null },
                    { text: 'Dorar el guanciale en una sartén hasta que esté crujiente.', image: null },
                    { text: 'Mezclar yemas con queso y pimienta en un bol.', image: null },
                    { text: 'Mezclar pasta caliente con el guanciale y luego con la mezcla de huevo fuera del fuego.', image: null }
                ]
            },
            {
                id: '2',
                title: 'Tacos Al Pastor Caseros',
                description: 'Deliciosos tacos mexicanos con carne de cerdo marinada y piña.',
                time: '45 min',
                difficulty: 'Difícil',
                servings: 4,
                mainCategory: 'Dinners',
                subcategory: 'Carne',
                image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
                ingredients: [
                    { item: 'Lomo de cerdo', amount: '500g' },
                    { item: 'Piña', amount: '2 rodajas' },
                    { item: 'Tortillas de maíz', amount: '12' },
                    { item: 'Cilantro y cebolla', amount: 'al gusto' }
                ],
                steps: [
                    { text: 'Marinar la carne con achiote y especias por 2 horas.', image: null },
                    { text: 'Cocinar la carne en sartén muy caliente.', image: null },
                    { text: 'Calentar tortillas y servir con piña, cilantro y cebolla.', image: null }
                ]
            },
            {
                id: '3',
                title: 'Tostadas con Frutas',
                description: 'Desayuno saludable y delicioso con frutas frescas.',
                time: '10 min',
                difficulty: 'Fácil',
                servings: 2,
                mainCategory: 'Breakfasts',
                subcategory: 'Frutas',
                image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
                ingredients: [
                    { item: 'Pan integral', amount: '4 rebanadas' },
                    { item: 'Plátano', amount: '1' },
                    { item: 'Fresas', amount: '6' },
                    { item: 'Miel', amount: 'al gusto' }
                ],
                steps: [
                    { text: 'Tostar el pan.', image: null },
                    { text: 'Cortar las frutas en rodajas.', image: null },
                    { text: 'Colocar las frutas sobre el pan y añadir miel.', image: null }
                ]
            }
        ];
        this.state.recipes = mockRecipes;
        this.save();
    }
}
