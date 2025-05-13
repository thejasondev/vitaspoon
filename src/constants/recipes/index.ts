import { DESAYUNOS } from "./desayunos";
import { ALMUERZOS } from "./almuerzos";
import { CENAS } from "./cenas";
import { MERIENDAS } from "./meriendas";
import { POSTRES } from "./postres";
import type { Recipe } from "../../types/recipe";

// Variable para almacenar las recetas combinadas (CSV + locales)
let COMBINED_RECIPES: Recipe[] = [];

/**
 * Recetas locales originales
 */
export const LOCAL_RECIPES: Recipe[] = [
  ...DESAYUNOS,
  ...ALMUERZOS,
  ...CENAS,
  ...MERIENDAS,
  ...POSTRES,
];

/**
 * Obtiene todas las recetas (combinando CSV y locales)
 * La primera vez que se llama, inicializa la carga de CSV
 */
export const getAllRecipes = async (): Promise<Recipe[]> => {
  // Si ya tenemos recetas combinadas, las devolvemos directamente
  if (COMBINED_RECIPES.length > 0) {
    return COMBINED_RECIPES;
  }

  try {
    // Importar el servicio de CSV y cargar las recetas combinadas
    const { loadAndCombineRecipes } = await import(
      "../../services/recipe/csvRecipeService"
    );
    COMBINED_RECIPES = await loadAndCombineRecipes();
    return COMBINED_RECIPES;
  } catch (error) {
    console.error("Error cargando recetas combinadas:", error);
    // Si hay error, usar solo las recetas locales
    COMBINED_RECIPES = [...LOCAL_RECIPES];
    return COMBINED_RECIPES;
  }
};

/**
 * Función para obtener recetas filtradas según criterios
 */
export const getFilteredRecipes = async (
  dietType?: string,
  cuisineType?: string,
  electricityType?: string,
  difficultyLevel?: string,
  prepTime?: string
): Promise<Recipe[]> => {
  // Obtener todas las recetas (incluye CSV + locales)
  const allRecipes = await getAllRecipes();

  return allRecipes.filter((recipe) => {
    // Si no hay filtros activos, devolver todas las recetas
    if (
      !dietType &&
      !cuisineType &&
      !electricityType &&
      !difficultyLevel &&
      !prepTime
    ) {
      return true;
    }

    // Filtrar por tipo de dieta
    if (dietType && recipe.dietType !== dietType) {
      return false;
    }

    // Filtrar por tipo de comida
    if (cuisineType && recipe.cuisineType !== cuisineType) {
      return false;
    }

    // Filtrar por nivel de dificultad
    if (difficultyLevel && recipe.difficultyLevel !== difficultyLevel) {
      return false;
    }

    // Filtrar por tiempo de preparación
    if (prepTime && recipe.prepTime !== prepTime) {
      return false;
    }

    // Filtrar por disponibilidad de electricidad
    if (electricityType) {
      const recipeHasElectricity = !recipe.title.includes("(Sin Electricidad)");
      if (
        (electricityType === "Con electricidad" && !recipeHasElectricity) ||
        (electricityType === "Sin electricidad" && recipeHasElectricity)
      ) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Función para obtener una receta aleatoria basada en filtros
 */
export const getRandomFilteredRecipe = async (
  dietType?: string,
  cuisineType?: string,
  electricityType?: string,
  difficultyLevel?: string,
  prepTime?: string
): Promise<Recipe> => {
  const filteredRecipes = await getFilteredRecipes(
    dietType,
    cuisineType,
    electricityType,
    difficultyLevel,
    prepTime
  );

  if (filteredRecipes.length === 0) {
    // Si no hay recetas que coincidan con los filtros, devolver una receta aleatoria
    const allRecipes = await getAllRecipes();
    return allRecipes[Math.floor(Math.random() * allRecipes.length)];
  }

  // Devolver una receta aleatoria de las filtradas
  return filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
};

// Exportar categorías individuales para facilitar la filtracion específica
export { DESAYUNOS, ALMUERZOS, CENAS, MERIENDAS, POSTRES };
