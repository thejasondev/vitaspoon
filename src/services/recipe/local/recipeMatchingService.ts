import type { Recipe, UserInput } from "../../../types/recipe";
import type { ScoredRecipe } from "./types";
import { identifyProteinIngredients } from "./ingredientService";

/**
 * Encuentra recetas que coincidan con las proteínas especificadas por el usuario
 */
export const findRecipesWithProteins = (
  recipes: Recipe[],
  proteinIngredients: string[],
  cuisineType?: string
): Recipe[] => {
  if (proteinIngredients.length === 0) {
    return [];
  }

  // Filtrar recetas que contengan al menos una de las proteínas especificadas
  let matchingRecipes = recipes.filter((recipe) =>
    proteinIngredients.some((protein) =>
      recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(protein.toLowerCase())
      )
    )
  );

  // Si hay recetas con esas proteínas y se especificó un tipo de comida, filtrar también por tipo
  if (matchingRecipes.length > 0 && cuisineType) {
    const withCuisineType = matchingRecipes.filter(
      (r) => r.cuisineType === cuisineType
    );
    if (withCuisineType.length > 0) {
      matchingRecipes = withCuisineType;
    }
  }

  return matchingRecipes;
};

/**
 * Puntúa las recetas según su coincidencia con los ingredientes disponibles
 */
export const scoreRecipesByIngredientMatch = (
  recipes: Recipe[],
  availableIngredients: string[]
): ScoredRecipe[] => {
  if (availableIngredients.length === 0) {
    return recipes.map((recipe) => ({
      recipe,
      matchingCount: 0,
      matchPercentage: 0,
      hasAllIngredients: false,
    }));
  }

  return recipes.map((recipe) => {
    // Contar cuántos ingredientes de la receta coinciden con los disponibles
    const matchingIngredients = recipe.ingredients.filter((ing) =>
      availableIngredients.some((available) =>
        ing.name.toLowerCase().includes(available.toLowerCase())
      )
    );

    const matchingCount = matchingIngredients.length;
    const matchPercentage = matchingCount / recipe.ingredients.length;

    return {
      recipe,
      matchingCount,
      matchPercentage,
      hasAllIngredients: availableIngredients.every((available) =>
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(available.toLowerCase())
        )
      ),
    };
  });
};

/**
 * Ordena las recetas puntuadas por relevancia
 */
export const sortRecipesByRelevance = (
  scoredRecipes: ScoredRecipe[]
): ScoredRecipe[] => {
  return [...scoredRecipes].sort((a, b) => {
    // Primero, priorizar recetas que contienen todos los ingredientes disponibles
    if (a.hasAllIngredients && !b.hasAllIngredients) return -1;
    if (!a.hasAllIngredients && b.hasAllIngredients) return 1;

    // Luego por cantidad de ingredientes coincidentes
    if (a.matchingCount !== b.matchingCount) {
      return b.matchingCount - a.matchingCount; // Mayor cantidad primero
    }

    // Finalmente por porcentaje de coincidencia
    return b.matchPercentage - a.matchPercentage;
  });
};

/**
 * Filtra recetas basadas en preferencias del usuario
 */
export const filterRecipesByUserPreferences = (
  recipes: Recipe[],
  userInput: UserInput
): Recipe[] => {
  const { dietType, electricityType, difficultyLevel, prepTime } =
    userInput.preferences;
  const { allergies = [] } = userInput.dietaryRestrictions || {};

  return recipes.filter((recipe) => {
    // Filtrar por tipo de dieta si se especificó
    if (dietType && recipe.dietType !== dietType) {
      return false;
    }

    // Filtrar por tiempo de preparación si se especificó
    if (prepTime && recipe.prepTime !== prepTime) {
      return false;
    }

    // Filtrar por nivel de dificultad si se especificó
    if (difficultyLevel && recipe.difficultyLevel !== difficultyLevel) {
      return false;
    }

    // Filtrar por disponibilidad de electricidad
    if (
      electricityType === "Sin electricidad" &&
      !recipe.title.includes("(Sin Electricidad)")
    ) {
      return false;
    }

    // Verificar alergias
    if (
      allergies.length > 0 &&
      allergies.some((allergen) =>
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(allergen.toLowerCase())
        )
      )
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Personaliza una receta con los ingredientes disponibles del usuario
 */
export const customizeRecipeWithUserIngredients = (
  recipe: Recipe,
  availableIngredients: string[] = []
): Recipe => {
  // Si el usuario no ha especificado ingredientes, devolver la receta original
  if (!availableIngredients || availableIngredients.length === 0) {
    return recipe;
  }

  // Crear una copia de la receta
  const customizedRecipe = { ...recipe };

  // Contar ingredientes coincidentes
  const matchingIngredients = recipe.ingredients.filter((ing) =>
    availableIngredients.some((available) =>
      ing.name.toLowerCase().includes(available.toLowerCase())
    )
  );

  // Añadir nota personalizada según coincidencia de ingredientes
  let ingredientsNote = "";

  if (matchingIngredients.length > 0) {
    const matchRate = matchingIngredients.length / recipe.ingredients.length;

    if (matchRate >= 0.5) {
      ingredientsNote = `Nota: ¡Excelente! Tienes ${
        matchingIngredients.length
      } de los ${
        recipe.ingredients.length
      } ingredientes principales para esta receta: ${matchingIngredients
        .map((i) => i.name)
        .join(", ")}.`;
    } else {
      ingredientsNote = `Nota: Esta receta incluye ${
        matchingIngredients.length
      } de tus ingredientes disponibles: ${matchingIngredients
        .map((i) => i.name)
        .join(", ")}. Puedes adaptar la receta según lo que tengas.`;
    }
  } else {
    ingredientsNote = `Nota: Esta receta ha sido seleccionada considerando tus preferencias. Puedes adaptarla usando tus ingredientes disponibles: ${availableIngredients.join(
      ", "
    )}.`;
  }

  customizedRecipe.instructions = [...recipe.instructions, ingredientsNote];

  // Añadir indicación de personalización al título
  if (!customizedRecipe.title.includes("(Personalizada)")) {
    customizedRecipe.title = `${recipe.title} (Personalizada)`;
  }

  return customizedRecipe;
};
