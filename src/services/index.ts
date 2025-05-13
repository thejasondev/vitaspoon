// Central export file for all services
// Recipe Services
export {
  generateRecipe,
  markRecipeAsSaved,
  initRecipeDatabase,
} from "./recipe/recipeService";

export {
  generateLocalRecipe,
  getIngredientsForCuisineType,
  createIngredientsFromUserInput,
  getInstructionsForRecipe,
  getRecipeTitleForCuisineType,
} from "./recipe/localRecipeService";

// Storage Services
export {
  storageService,
  generateId,
  STORAGE_KEYS,
} from "./storage/storageService";

// CSV Recipe Service
export { parseCSVFile, loadAndCombineRecipes } from "./recipe/csvRecipeService";

// Exportación centralizada de servicios
export * from "./ai/aiRecipeService";
export * from "./ai/recipeAIService";
export * from "./ai/geminiAIService";
