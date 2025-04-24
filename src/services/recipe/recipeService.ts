import type { Recipe, UserInput } from "../../types/recipe";
import { generateId } from "../storage/storageService";
import { API_MESSAGES } from "../../constants/apiConfig";
import { generateRecipeWithBestAI } from "../ai/aiRecipeService";

/**
 * Genera una receta basada en las preferencias del usuario
 * Utiliza servicios de IA (OpenAI/Gemini) con respaldo local
 */
export const generateRecipe = async (userInput: UserInput): Promise<Recipe> => {
  try {
    console.log("🔍 Generando receta con IA...");

    // Usar el servicio de IA centralizado
    const recipe = await generateRecipeWithBestAI(userInput);

    return {
      ...recipe,
      // Asegurarse de que tenga un ID en caso de que el servicio no lo proporcione
      id: recipe.id || generateId(),
    };
  } catch (error) {
    console.error("Error generando receta:", error);

    // Mostrar mensaje de error
    alert("No se pudo generar la receta. Intenta nuevamente.");

    // Lanzar error para manejarlo en el componente
    throw new Error("No se pudo generar la receta");
  }
};

/**
 * Marca una receta como guardada
 */
export const markRecipeAsSaved = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    isSaved: true,
  };
};
