import type { Recipe, UserInput, SavedRecipes } from "../../types/recipe";

// Claves para usar en localStorage
export const STORAGE_KEYS = {
  USER_INPUT: "vitaspoon_user_input",
  CURRENT_RECIPE: "vitaspoon_current_recipe",
  SAVED_RECIPES: "vitaspoon_saved_recipes",
};

/**
 * Guarda datos en localStorage
 */
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando en localStorage: ${key}`, error);
  }
};

/**
 * Obtiene datos desde localStorage
 */
const getFromStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error obteniendo de localStorage: ${key}`, error);
    return null;
  }
};

/**
 * Servicios específicos para los distintos tipos de datos
 */
export const storageService = {
  // Operaciones para las preferencias del usuario
  userInput: {
    save: (userInput: UserInput): void =>
      saveToStorage(STORAGE_KEYS.USER_INPUT, userInput),
    get: (): UserInput | null =>
      getFromStorage<UserInput>(STORAGE_KEYS.USER_INPUT),
  },

  // Operaciones para la receta actual
  currentRecipe: {
    save: (recipe: Recipe): void =>
      saveToStorage(STORAGE_KEYS.CURRENT_RECIPE, recipe),
    get: (): Recipe | null =>
      getFromStorage<Recipe>(STORAGE_KEYS.CURRENT_RECIPE),
  },

  // Operaciones para las recetas guardadas
  savedRecipes: {
    save: (recipes: Recipe[]): void => {
      const savedRecipesData: SavedRecipes = { recipes };
      saveToStorage(STORAGE_KEYS.SAVED_RECIPES, savedRecipesData);
    },
    get: (): Recipe[] => {
      const savedRecipesData = getFromStorage<SavedRecipes>(
        STORAGE_KEYS.SAVED_RECIPES
      );
      return savedRecipesData?.recipes || [];
    },
    add: (recipe: Recipe): Recipe[] => {
      // Obtener las recetas actuales
      const currentRecipes = storageService.savedRecipes.get();

      // Verificar si la receta ya existe
      if (!currentRecipes.some((r) => r.id === recipe.id)) {
        // Añadir la nueva receta
        const updatedRecipes = [
          ...currentRecipes,
          { ...recipe, isSaved: true },
        ];
        // Guardar las recetas actualizadas
        storageService.savedRecipes.save(updatedRecipes);
        return updatedRecipes;
      }

      return currentRecipes;
    },
    remove: (recipeId: string): Recipe[] => {
      const currentRecipes = storageService.savedRecipes.get();
      const updatedRecipes = currentRecipes.filter((r) => r.id !== recipeId);
      storageService.savedRecipes.save(updatedRecipes);
      return updatedRecipes;
    },
  },
};

/**
 * Función para generar un ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};
