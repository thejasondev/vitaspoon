import type { Recipe, UserInput } from "../../../types/recipe";
import { generateId } from "../../storage/storageService";
import { getAllRecipes } from "../../../constants/recipes";
import { DEFAULT_VALUES } from "./types";
import { identifyProteinIngredients } from "./ingredientService";
import { createCustomRecipe, createFallbackRecipe } from "./recipeGenerator";
import {
  findRecipesWithProteins,
  filterRecipesByUserPreferences,
  scoreRecipesByIngredientMatch,
  sortRecipesByRelevance,
  customizeRecipeWithUserIngredients,
  recipeContainsAllUserIngredients,
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
    // Cargar recetas combinadas (CSV + locales)
    const allRecipes = await getAllRecipes();
    console.log(
      `📊 Base de datos cargada: ${allRecipes.length} recetas disponibles (CSV + locales)`
    );

    // Paso 1: Buscar recetas que contengan TODOS los ingredientes especificados
    if (availableIngredients.length > 0) {
      console.log(
        `🥘 Buscando recetas con los ingredientes: ${availableIngredients.join(
          ", "
        )}`
      );

      // Filtrar recetas que contengan TODOS los ingredientes especificados
      const exactMatches = allRecipes.filter((recipe) =>
        recipeContainsAllUserIngredients(recipe, availableIngredients)
      );

      if (exactMatches.length > 0) {
        console.log(
          `✅ Encontradas ${exactMatches.length} recetas con TODOS los ingredientes especificados`
        );

        // Verificación adicional para debug - mostrar las primeras 3 recetas encontradas
        exactMatches.slice(0, 3).forEach((recipe, index) => {
          console.log(`📝 Receta #${index + 1}: ${recipe.title}`);
          console.log(
            `   Ingredientes: ${recipe.ingredients
              .map((ing) => ing.name)
              .join(", ")}`
          );
        });

        // Aplicar otros filtros (tipo de cocina, etc.)
        let filteredExactMatches = exactMatches;

        // Filtrar por tipo de cocina si se especificó
        if (cuisineType) {
          const matchesWithCuisine = filteredExactMatches.filter(
            (recipe) => recipe.cuisineType === cuisineType
          );

          if (matchesWithCuisine.length > 0) {
            filteredExactMatches = matchesWithCuisine;
            console.log(
              `✅ Filtradas ${matchesWithCuisine.length} recetas por tipo de cocina: ${cuisineType}`
            );
          }
        }

        // Aplicar filtros adicionales con modo flexible para no ser demasiado restrictivos
        const finalMatches = filterRecipesByUserPreferences(
          filteredExactMatches,
          userInput,
          false
        );

        if (finalMatches.length > 0) {
          console.log(
            `✅ Encontradas ${finalMatches.length} recetas finales tras aplicar todos los filtros`
          );

          // Seleccionar una receta aleatoria entre las mejores coincidencias
          const recipeIndex = Math.floor(
            Math.random() * Math.min(3, finalMatches.length)
          );
          const selectedRecipe = finalMatches[recipeIndex];

          console.log(`✨ Seleccionada receta: ${selectedRecipe.title}`);
          console.log(
            `   Ingredientes: ${selectedRecipe.ingredients
              .map((ing) => ing.name)
              .join(", ")}`
          );

          // Personalizar la receta con ingredientes del usuario
          const customizedRecipe = customizeRecipeWithUserIngredients(
            selectedRecipe,
            availableIngredients
          );

          return {
            ...customizedRecipe,
            id: generateId(),
            createdAt: new Date().toISOString(),
            cuisineType: cuisineType || customizedRecipe.cuisineType,
            source: "csv_database", // Indicar que viene de la base de datos CSV
          };
        }
      } else {
        console.log(
          `⚠️ No se encontraron recetas con TODOS los ingredientes especificados`
        );
      }
    }

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
        allRecipes,
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
      const exactCuisineTypeRecipes = allRecipes.filter(
        (recipe) => recipe.cuisineType === cuisineType
      );

      if (exactCuisineTypeRecipes.length === 0) {
        console.log(
          `No se encontraron recetas del tipo ${cuisineType}. Buscando alternativas.`
        );

        // Usar la nueva función para obtener recetas con filtrado menos estricto
        const alternativeRecipes = getLocalRecipesWhenAIUnavailable(
          allRecipes,
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

      // Verificación de DEBUG: mostrar si las recetas tienen todos los ingredientes
      sortedRecipes.slice(0, 3).forEach((scored, index) => {
        console.log(`🔍 Receta puntuada #${index + 1}: ${scored.recipe.title}`);
        console.log(
          `   Tiene todos los ingredientes: ${
            scored.hasAllIngredients ? "Sí" : "No"
          }`
        );
        console.log(
          `   Coincidencia: ${scored.matchingCount}/${scored.recipe.ingredients.length} ingredientes`
        );
        console.log(
          `   Ingredientes: ${scored.recipe.ingredients
            .map((ing) => ing.name)
            .join(", ")}`
        );
      });

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
        allRecipes,
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

    // Verificación final para asegurar que se cumple el requisito de ingredientes
    const hasAllIngredients = recipeContainsAllUserIngredients(
      selectedRecipe,
      availableIngredients
    );

    console.log(`✨ Seleccionada receta: ${selectedRecipe.title}`);
    console.log(
      `   Contiene todos los ingredientes: ${hasAllIngredients ? "Sí" : "No"}`
    );
    console.log(
      `   Ingredientes: ${selectedRecipe.ingredients
        .map((ing) => ing.name)
        .join(", ")}`
    );

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
