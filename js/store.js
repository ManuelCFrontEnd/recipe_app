export default class Store {
    constructor() {
        this.state = {
            recipes: JSON.parse(localStorage.getItem('gusteau_recipes')) || [],
            favorites: JSON.parse(localStorage.getItem('gusteau_favorites')) || [],
            recent: JSON.parse(localStorage.getItem('gusteau_recent')) || []
        };

        if (this.state.recipes.length === 0) {
            this.seedData();
        }
    }

    save() {
        localStorage.setItem('gusteau_recipes', JSON.stringify(this.state.recipes));
        localStorage.setItem('gusteau_favorites', JSON.stringify(this.state.favorites));
        localStorage.setItem('gusteau_recent', JSON.stringify(this.state.recent));
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
                category: 'Pasta',
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
                category: 'Carnes',
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
                title: 'Ensalada César',
                description: 'Fresca, crujiente y con el aderezo perfecto.',
                time: '15 min',
                difficulty: 'Fácil',
                servings: 2,
                category: 'Ensaladas',
                image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
                ingredients: [
                    { item: 'Lechuga Romana', amount: '1 grande' },
                    { item: 'Crutones', amount: '1 taza' },
                    { item: 'Queso Parmesano', amount: '50g' },
                    { item: 'Salsa César', amount: 'al gusto' }
                ],
                steps: [
                    { text: 'Lavar y cortar la lechuga.', image: null },
                    { text: 'Mezclar con la salsa en un bol grande.', image: null },
                    { text: 'Añadir crutones y queso parmesano por encima.', image: null }
                ]
            }
        ];
        this.state.recipes = mockRecipes;
        this.save();
    }
}
