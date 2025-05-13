import {
  LOCAL_RECIPES,
  getFilteredRecipes,
  getRandomFilteredRecipe,
  getAllRecipes,
} from "./recipes/index";

/**
 * Recetas para diversos tipos de comida
 * Base de datos combinada (CSV + local) de recetas para todos los tipos de platos y dietas
 *
 * La base de datos CSV tiene prioridad sobre las recetas locales.
 */
export {
  LOCAL_RECIPES, // Recetas locales originales
  getAllRecipes, // Obtiene todas las recetas combinadas (CSV + locales)
  getFilteredRecipes,
  getRandomFilteredRecipe,
};
