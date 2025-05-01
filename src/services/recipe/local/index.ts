import type { Recipe, UserInput } from "../../../types/recipe";
import { generateId } from "../../storage/storageService";
import { LOCAL_RECIPES } from "../../../constants/recipes";
import { DEFAULT_VALUES } from "./types";
import { identifyProteinIngredients } from "./ingredientService";
import { createCustomRecipe, createFallbackRecipe } from "./recipeGenerator";
import {
  findRecipesWithProteins,
  filterRecipesByUserPreferences,
  scoreRecipesByIngredientMatch,
  sortRecipesByRelevance,
  customizeRecipeWithUserIngredients,
} from "./recipeMatchingService";
import { getLocalRecipesWhenAIUnavailable } from "./recipeMatchingService";

/**
 * Genera una receta local basada en las preferencias del usuario
 * Ideal para usuarios en Cuba y otros lugares con acceso limitado a internet
 */
export const generateLocalRecipe = async (
  userInput: UserInput
): Promise<Recipe> => {
  console.log("🏠 Generando receta local para usuario sin acceso a IA...");

  // Obtener preferencias del usuario
  const { cuisineType } = userInput.preferences;
  const availableIngredients = userInput.availableIngredients || [];

  try {
    // Identificar ingredientes proteicos importantes (cerdo, pollo, res, etc.)
    const proteinIngredients = identifyProteinIngredients(availableIngredients);

    // Si hay ingredientes proteicos, dar prioridad a recetas que los contengan
    let candidateRecipes: Recipe[] = [];

    if (proteinIngredients.length > 0) {
      console.log(
        `🥩 Usuario especificó proteínas: ${proteinIngredients.join(", ")}`
      );

      // Buscar recetas que coincidan con las proteínas especificadas
      candidateRecipes = findRecipesWithProteins(
        LOCAL_RECIPES,
        proteinIngredients,
        cuisineType
      );

      if (candidateRecipes.length > 0) {
        console.log(
          `✅ Encontradas ${candidateRecipes.length} recetas con las proteínas especificadas`
        );
      }
    }

    // Si no hay recetas con proteínas específicas o no se especificaron proteínas
    if (candidateRecipes.length === 0) {
      // Filtrar recetas que coincidan con el tipo de comida
      const exactCuisineTypeRecipes = LOCAL_RECIPES.filter(
        (recipe) => recipe.cuisineType === cuisineType
      );

      if (exactCuisineTypeRecipes.length === 0) {
        console.log(
          `No se encontraron recetas del tipo ${cuisineType}. Buscando alternativas.`
        );

        // Usar la nueva función para obtener recetas con filtrado menos estricto
        const alternativeRecipes = getLocalRecipesWhenAIUnavailable(
          LOCAL_RECIPES,
          userInput
        );

        if (alternativeRecipes.length > 0) {
          console.log(
            `✅ Encontradas ${alternativeRecipes.length} recetas alternativas.`
          );
          candidateRecipes = alternativeRecipes;
        } else {
          // Si todavía no hay recetas, crear una personalizada
          console.log(
            "No se encontraron alternativas. Creando una personalizada."
          );
          return createCustomRecipe(userInput);
        }
      } else {
        candidateRecipes = exactCuisineTypeRecipes;
      }
    }

    // Aplicar filtros adicionales (dieta, tiempo, dificultad, etc.)
    let matchingRecipes = filterRecipesByUserPreferences(
      candidateRecipes,
      userInput,
      true // Modo estricto por defecto
    );

    // Si no encontramos recetas con filtrado estricto, intentar con filtrado flexible
    if (matchingRecipes.length === 0) {
      console.log(
        "No hay recetas con filtrado estricto. Usando filtrado flexible."
      );
      matchingRecipes = filterRecipesByUserPreferences(
        candidateRecipes,
        userInput,
        false // Modo flexible
      );
    }

    // Si hay ingredientes disponibles, puntuar y ordenar las recetas
    if (availableIngredients.length > 0 && matchingRecipes.length > 0) {
      // Puntuar las recetas según coincidencia con ingredientes disponibles
      const scoredRecipes = scoreRecipesByIngredientMatch(
        matchingRecipes,
        availableIngredients
      );

      // Ordenar por mejor coincidencia
      const sortedRecipes = sortRecipesByRelevance(scoredRecipes);

      // Si hay recetas con buena coincidencia, usarlas
      if (sortedRecipes.length > 0 && sortedRecipes[0].matchingCount >= 1) {
        matchingRecipes = sortedRecipes.map((item) => item.recipe);
        console.log(
          `🔍 Recetas ordenadas por coincidencia de ingredientes. Mejor coincidencia: ${sortedRecipes[0].matchingCount} ingredientes.`
        );
      }
    }

    // Si no hay recetas que coincidan con todos los criterios
    if (matchingRecipes.length === 0) {
      console.log(
        "No hay recetas con todos los criterios, incluso con filtrado flexible. Usando función de búsqueda alternativa."
      );

      // Usar la función de búsqueda alternativa
      const localRecipes = getLocalRecipesWhenAIUnavailable(
        LOCAL_RECIPES,
        userInput
      );

      if (localRecipes.length > 0) {
        console.log(
          `✅ Encontradas ${localRecipes.length} recetas alternativas.`
        );
        matchingRecipes = localRecipes;
      } else {
        // Si todavía no hay recetas, crear una personalizada
        return createCustomRecipe(userInput);
      }
    }

    // Seleccionar la mejor receta o una aleatoria si hay varias
    const recipeIndex = Math.floor(
      Math.random() * Math.min(3, matchingRecipes.length)
    );
    const selectedRecipe = matchingRecipes[recipeIndex];

    // Personalizar la receta con ingredientes del usuario
    const customizedRecipe = customizeRecipeWithUserIngredients(
      selectedRecipe,
      userInput.availableIngredients
    );

    return {
      ...customizedRecipe,
      id: generateId(),
      createdAt: new Date().toISOString(),
      cuisineType: cuisineType || customizedRecipe.cuisineType,
      source: DEFAULT_VALUES.SOURCE,
    };
  } catch (error) {
    console.error("Error generando receta local:", error);
    return createFallbackRecipe(userInput);
  }
};

// Exportar todos los servicios modulares para uso individual
export * from "./types";
export * from "./ingredientService";
export * from "./instructionService";
export * from "./recipeGenerator";
export * from "./recipeMatchingService";
