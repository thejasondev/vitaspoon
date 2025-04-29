import { DESAYUNOS } from "./desayunos";
import { ALMUERZOS } from "./almuerzos";
import { CENAS } from "./cenas";
import { MERIENDAS } from "./meriendas";
import { POSTRES } from "./postres";
import type { Recipe } from "../../types/recipe";

/**
 * Todas las recetas cubanas e internacionales combinadas
 */
export const LOCAL_RECIPES: Recipe[] = [
  ...DESAYUNOS,
  ...ALMUERZOS,
  ...CENAS,
  ...MERIENDAS,
  ...POSTRES,
];

/**
 * Función para obtener recetas filtradas según criterios
 */
export const getFilteredRecipes = (
  dietType?: string,
  cuisineType?: string,
  electricityType?: string,
  difficultyLevel?: string,
  prepTime?: string
): Recipe[] => {
  return LOCAL_RECIPES.filter((recipe) => {
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
export const getRandomFilteredRecipe = (
  dietType?: string,
  cuisineType?: string,
  electricityType?: string,
  difficultyLevel?: string,
  prepTime?: string
): Recipe => {
  const filteredRecipes = getFilteredRecipes(
    dietType,
    cuisineType,
    electricityType,
    difficultyLevel,
    prepTime
  );

  if (filteredRecipes.length === 0) {
    // Si no hay recetas que coincidan con los filtros, devolver una receta aleatoria
    return LOCAL_RECIPES[Math.floor(Math.random() * LOCAL_RECIPES.length)];
  }

  // Devolver una receta aleatoria de las filtradas
  return filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
};

// Exportar categorías individuales para facilitar la filtracion específica
export { DESAYUNOS, ALMUERZOS, CENAS, MERIENDAS, POSTRES };
