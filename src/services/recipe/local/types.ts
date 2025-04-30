import type { Recipe } from "../../../types/recipe";

/**
 * Tipo para los ingredientes de una receta
 */
export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

/**
 * Tipo para recetas puntuadas según su coincidencia con ingredientes
 */
export type ScoredRecipe = {
  recipe: Recipe;
  matchingCount: number;
  matchPercentage: number;
  hasAllIngredients: boolean;
};

/**
 * Constantes para valores predeterminados
 */
export const DEFAULT_VALUES = {
  PREP_TIME: "15-30 minutos",
  DIFFICULTY: "Fácil",
  DIET: "Estándar",
  CUISINE: "Variado",
  SOURCE: "local",
};

/**
 * Arrays para filtrar alimentos por tipo
 */
export const FOOD_GROUPS = {
  NON_VEGETARIAN: [
    "pollo",
    "cerdo",
    "res",
    "pescado",
    "atún",
    "jamón",
    "carne",
  ],
  NON_VEGAN: ["queso", "leche", "yogur", "huevo", "mantequilla"],
  HIGH_CARB: ["pasta", "arroz", "pan", "azúcar", "masa"],
  PROTEINS: [
    "cerdo",
    "pollo",
    "res",
    "pescado",
    "camarones",
    "atún",
    "jamón",
    "pavo",
    "carne",
  ],
  VEGETABLES: [
    "tomate",
    "cebolla",
    "ajo",
    "pimiento",
    "zanahoria",
    "vegetales",
    "verduras",
  ],
};
