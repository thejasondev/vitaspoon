// Este archivo ahora sirve como punto de entrada al servicio modularizado
import type { Recipe, UserInput } from "../../types/recipe";
import { generateLocalRecipe } from "./local";

// Exportar la función principal para mantener compatibilidad
export { generateLocalRecipe };

// Reexportar funcionalidades importantes
export {
  getIngredientsForCuisineType,
  createIngredientsFromUserInput,
} from "./local/ingredientService";

export {
  getInstructionsForRecipe,
  getRecipeTitleForCuisineType,
} from "./local/instructionService";
