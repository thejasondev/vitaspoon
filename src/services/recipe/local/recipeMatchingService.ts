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
 * Verifica si una receta contiene todos los ingredientes específicos del usuario
 * Esta es una verificación estricta que requiere que cada ingrediente mencionado
 * esté presente en la receta
 */
export const recipeContainsAllUserIngredients = (
  recipe: Recipe,
  userIngredients: string[]
): boolean => {
  if (userIngredients.length === 0) return true;

  // Convertir todos los nombres de ingredientes de la receta a minúsculas para comparación insensible a mayúsculas
  const recipeIngredientsLower = recipe.ingredients.map((ing) =>
    ing.name.toLowerCase()
  );

  // Verificar que cada ingrediente del usuario esté presente en al menos un ingrediente de la receta
  return userIngredients.every((ingredient) => {
    const ingredientLower = ingredient.toLowerCase();
    // Buscar coincidencia exacta primero
    if (
      recipeIngredientsLower.some((recipeIng) => recipeIng === ingredientLower)
    ) {
      return true;
    }
    // Si no hay coincidencia exacta, buscar coincidencia parcial
    return recipeIngredientsLower.some((recipeIng) =>
      recipeIng.includes(ingredientLower)
    );
  });
};

/**
 * Puntúa las recetas según su coincidencia con los ingredientes disponibles
 * Versión mejorada que prioriza recetas con todos los ingredientes mencionados
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

    // Verificar si la receta contiene todos los ingredientes especificados por el usuario
    const hasAllIngredients = recipeContainsAllUserIngredients(
      recipe,
      availableIngredients
    );

    return {
      recipe,
      matchingCount,
      matchPercentage,
      hasAllIngredients,
    };
  });
};

/**
 * Ordena las recetas puntuadas por relevancia
 * La versión mejorada da máxima prioridad a recetas con todos los ingredientes del usuario
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
  userInput: UserInput,
  strictMatching: boolean = true
): Recipe[] => {
  const { cuisineType, dietType, electricityType, difficultyLevel, prepTime } =
    userInput.preferences;
  const { allergies = [] } = userInput.dietaryRestrictions || {};
  const availableIngredients = userInput.availableIngredients || [];

  // Si no hay recetas para filtrar, devolver array vacío
  if (!recipes || recipes.length === 0) {
    return [];
  }

  // Primera pasada: filtrar recetas que contengan todos los ingredientes especificados
  if (availableIngredients.length > 0) {
    const recipesWithAllIngredients = recipes.filter((recipe) =>
      recipeContainsAllUserIngredients(recipe, availableIngredients)
    );

    // Si encontramos recetas con todos los ingredientes, trabajamos solo con esas
    if (recipesWithAllIngredients.length > 0) {
      recipes = recipesWithAllIngredients;
    }
  }

  return recipes.filter((recipe) => {
    // Filtrar por tipo de comida (es crítico mantener esto)
    if (cuisineType && recipe.cuisineType !== cuisineType) {
      return false;
    }

    // En modo no estricto, permitimos más flexibilidad en los otros criterios
    if (!strictMatching) {
      // Para alergias siempre mantenemos el filtro por seguridad
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

      // En modo no estricto, permitimos cualquier otra condición
      return true;
    }

    // Modo estricto - aplicar todos los filtros

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

/**
 * Obtiene recetas locales cuando la IA no está disponible
 * Versión mejorada que prioriza recetas con todos los ingredientes especificados
 */
export const getLocalRecipesWhenAIUnavailable = (
  allRecipes: Recipe[],
  userInput: UserInput
): Recipe[] => {
  const { cuisineType } = userInput.preferences;
  const availableIngredients = userInput.availableIngredients || [];

  console.log(
    `🔍 Buscando recetas con ingredientes: ${availableIngredients.join(", ")}`
  );

  // Paso 1: Intentar encontrar recetas que contengan TODOS los ingredientes especificados
  if (availableIngredients.length > 0) {
    const exactMatches = allRecipes.filter((recipe) =>
      recipeContainsAllUserIngredients(recipe, availableIngredients)
    );

    // Si encontramos recetas exactas, trabajar SOLO con ellas
    if (exactMatches.length > 0) {
      console.log(
        `✅ Encontradas ${exactMatches.length} recetas con TODOS los ingredientes especificados`
      );

      let bestMatches = exactMatches;

      // Aplicar filtro por tipo de comida si está especificado
      if (cuisineType) {
        const withCuisineType = bestMatches.filter(
          (r) => r.cuisineType === cuisineType
        );
        if (withCuisineType.length > 0) {
          bestMatches = withCuisineType;
        }
      }

      // Aplicar filtros adicionales con modo flexible para maximizar resultados
      const filteredMatches = filterRecipesByUserPreferences(
        bestMatches,
        userInput,
        false
      );

      if (filteredMatches.length > 0) {
        // Limitar a 10 recetas máximo para no sobrecargar
        return filteredMatches.slice(0, 10);
      }

      // Si los filtros adicionales no dieron resultados, devolver las mejores coincidencias
      return bestMatches.slice(0, 10);
    }

    console.log(
      "❌ No se encontraron recetas con TODOS los ingredientes especificados"
    );
  }

  // Paso 2: Si se especificaron proteínas, priorizarlas
  const proteinIngredients = identifyProteinIngredients(availableIngredients);
  if (proteinIngredients.length > 0) {
    console.log(
      `🍖 Buscando recetas con proteínas: ${proteinIngredients.join(", ")}`
    );

    const proteinMatches = findRecipesWithProteins(
      allRecipes,
      proteinIngredients,
      cuisineType
    );

    if (proteinMatches.length > 0) {
      console.log(
        `✅ Encontradas ${proteinMatches.length} recetas con las proteínas especificadas`
      );

      // Aplicar filtros adicionales con modo flexible
      const filteredProteinMatches = filterRecipesByUserPreferences(
        proteinMatches,
        userInput,
        false
      );

      if (filteredProteinMatches.length > 0) {
        return filteredProteinMatches.slice(0, 10);
      }
    }
  }

  // Paso 3: Intentar con coincidencia parcial de ingredientes
  if (availableIngredients.length > 0) {
    // Encontrar recetas que coincidan con al menos un ingrediente
    const partialMatches = allRecipes.filter((recipe) =>
      availableIngredients.some((ingredient) =>
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    );

    if (partialMatches.length > 0) {
      console.log(
        `🔄 Encontradas ${partialMatches.length} recetas con coincidencia parcial de ingredientes`
      );

      // Puntuar y ordenar por mejor coincidencia
      const scoredRecipes = scoreRecipesByIngredientMatch(
        partialMatches,
        availableIngredients
      );

      const sortedRecipes = sortRecipesByRelevance(scoredRecipes);

      // Tomar las mejores coincidencias (hasta 10)
      const bestMatches = sortedRecipes
        .slice(0, 10)
        .map((scored) => scored.recipe);

      // Aplicar filtros adicionales
      const filteredMatches = filterRecipesByUserPreferences(
        bestMatches,
        userInput,
        false
      );

      if (filteredMatches.length > 0) {
        return filteredMatches;
      }
    }
  }

  // Paso 4: Si nada funciona, buscar por tipo de comida
  if (cuisineType) {
    console.log(`🍽️ Buscando recetas por tipo de cocina: ${cuisineType}`);

    const cuisineMatches = allRecipes.filter(
      (recipe) => recipe.cuisineType === cuisineType
    );

    if (cuisineMatches.length > 0) {
      console.log(
        `✅ Encontradas ${cuisineMatches.length} recetas del tipo ${cuisineType}`
      );

      // Aplicar filtros adicionales
      const filteredCuisineMatches = filterRecipesByUserPreferences(
        cuisineMatches,
        userInput,
        false
      );

      if (filteredCuisineMatches.length > 0) {
        // Limitar el número de resultados para no abrumar
        return filteredCuisineMatches.slice(0, 10);
      }
    }
  }

  // Paso 5: Último recurso - devolver algunas recetas aleatorias
  console.log(
    "⚠️ No se encontraron coincidencias. Devolviendo recetas aleatorias."
  );
  const randomRecipes = allRecipes.sort(() => 0.5 - Math.random()).slice(0, 5);

  return randomRecipes;
};
