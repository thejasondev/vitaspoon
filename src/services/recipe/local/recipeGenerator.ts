import type { Recipe, UserInput } from "../../../types/recipe";
import { generateId } from "../../storage/storageService";
import { DEFAULT_VALUES } from "./types";
import type { Ingredient } from "./types";
import {
  createIngredientsFromUserInput,
  hasIngredientType,
} from "./ingredientService";
import {
  getInstructionsForRecipe,
  getRecipeTitleForCuisineType,
  getRiceWithProteinInstructions,
  getRiceWithVegetablesInstructions,
  getPlainRiceInstructions,
  getProteinInstructions,
} from "./instructionService";

/**
 * Genera un título para una receta personalizada basado en los ingredientes disponibles
 */
export const generateRecipeTitle = (
  userInput: UserInput,
  hasProtein: boolean,
  hasRice: boolean,
  hasVegetables: boolean
): string => {
  const { dietType, cuisineType, electricityType } = userInput.preferences;
  const availableIngredients = userInput.availableIngredients || [];

  let title = "";

  // Comenzar con los ingredientes principales para el título
  if (hasProtein) {
    // Determinar qué proteína se tiene
    const proteinIngredient =
      availableIngredients.find((ing) =>
        [
          "cerdo",
          "pollo",
          "res",
          "pescado",
          "camarones",
          "atún",
          "jamón",
          "carne",
        ].some((p) => ing.toLowerCase().includes(p.toLowerCase()))
      ) || "proteína";

    // Capitalizar el nombre de la proteína
    const protein =
      proteinIngredient.charAt(0).toUpperCase() + proteinIngredient.slice(1);

    if (hasRice) {
      title = `Arroz con ${protein}`;
    } else if (hasVegetables) {
      title = `${protein} con Vegetales`;
    } else {
      title = `${protein} al Ajillo`;
    }
  } else if (hasRice) {
    if (hasVegetables) {
      title = "Arroz con Vegetales";
    } else {
      title = "Arroz Especiado";
    }
  } else if (cuisineType) {
    // Si no hay ingredientes principales, usar el tipo de comida
    switch (cuisineType) {
      case "Desayuno":
        title =
          dietType === "Vegetariana" || dietType === "Vegana"
            ? "Tostadas de Vegetales"
            : "Desayuno Especial";
        break;
      case "Almuerzo":
        title = "Almuerzo Criollo";
        break;
      case "Cena":
        title = "Cena Ligera";
        break;
      case "Merienda":
        title = "Merienda Energética";
        break;
      case "Postre":
        title = "Postre Casero";
        break;
      case "Snack":
        title = "Aperitivo Rápido";
        break;
      default:
        title = "Plato Personalizado";
    }
  } else {
    title = "Receta Personalizada";
  }

  // Añadir indicadores de dieta y electricidad
  if (dietType && dietType !== DEFAULT_VALUES.DIET) {
    title += ` (${dietType})`;
  }

  if (electricityType === "Sin electricidad") {
    title += " (Sin Electricidad)";

    // Añadir indicador de parrilla si es una receta de almuerzo o cena
    if (cuisineType === "Almuerzo" || cuisineType === "Cena" || hasProtein) {
      title = title.replace("Sin Electricidad", "Parrilla");
    }
  }

  return title;
};

/**
 * Genera instrucciones personalizadas basadas en los ingredientes disponibles
 */
export const generateCustomInstructions = (
  userInput: UserInput,
  hasProtein: boolean,
  hasRice: boolean
): string[] => {
  const { cuisineType, dietType, electricityType } = userInput.preferences;
  const availableIngredients = userInput.availableIngredients || [];

  let instructions: string[] = [];

  // Determinar el tipo de plato basado en ingredientes
  if (hasRice && hasProtein) {
    instructions = getRiceWithProteinInstructions(electricityType);
  } else if (hasRice) {
    instructions = getRiceWithVegetablesInstructions(electricityType);
  } else if (hasProtein) {
    instructions = getProteinInstructions(electricityType);
  } else {
    // Instrucciones genéricas basadas en el tipo de comida
    instructions = getInstructionsForRecipe(
      cuisineType || "Almuerzo",
      dietType,
      electricityType
    );
  }

  // Añadir nota sobre personalización
  let personalizedNote = `Esta receta ha sido personalizada con tus ingredientes: ${availableIngredients.join(
    ", "
  )}. Ajusta las cantidades según tu preferencia.`;

  // Añadir información sobre la parrilla si es sin electricidad
  if (
    electricityType === "Sin electricidad" &&
    (cuisineType === "Almuerzo" || cuisineType === "Cena" || hasProtein)
  ) {
    personalizedNote +=
      " Esta receta está optimizada para preparación en parrilla de carbón.";
  }

  instructions.push(personalizedNote);

  return instructions;
};

/**
 * Crea una receta personalizada desde cero basada en las preferencias e ingredientes del usuario
 */
export const createCustomRecipe = (userInput: UserInput): Recipe => {
  const { dietType, cuisineType, difficultyLevel, prepTime, electricityType } =
    userInput.preferences;
  const { allergies = [] } = userInput.dietaryRestrictions || {};
  const availableIngredients = userInput.availableIngredients || [];

  // Determinar tipos de ingredientes disponibles
  const hasProtein = hasIngredientType(availableIngredients, "proteins");
  const hasRice = hasIngredientType(availableIngredients, "rice");
  const hasVegetables = hasIngredientType(availableIngredients, "vegetables");

  // Generar el título
  const title = generateRecipeTitle(
    userInput,
    hasProtein,
    hasRice,
    hasVegetables
  );

  // Crear ingredientes personalizados
  const ingredients = createIngredientsFromUserInput(
    availableIngredients,
    allergies
  );

  // Generar instrucciones
  const instructions = generateCustomInstructions(
    userInput,
    hasProtein,
    hasRice
  );

  return {
    id: generateId(),
    title,
    ingredients:
      ingredients.length > 0
        ? ingredients
        : [{ name: "ingredientes variados", quantity: "Al gusto", unit: "" }],
    instructions,
    prepTime: prepTime || DEFAULT_VALUES.PREP_TIME,
    difficultyLevel: difficultyLevel || DEFAULT_VALUES.DIFFICULTY,
    cuisineType: cuisineType || DEFAULT_VALUES.CUISINE,
    dietType: dietType || DEFAULT_VALUES.DIET,
    createdAt: new Date().toISOString(),
    source: DEFAULT_VALUES.SOURCE,
  };
};

/**
 * Crea una receta de respaldo en caso de error
 */
export const createFallbackRecipe = (userInput: UserInput): Recipe => {
  // Construir título basado en preferencias
  const { cuisineType, dietType, electricityType } = userInput.preferences;
  let title = "Receta Básica Personalizada";

  if (cuisineType) {
    title = `${title} - ${cuisineType}`;
  }

  if (dietType && dietType !== DEFAULT_VALUES.DIET) {
    title = `${title} (${dietType})`;
  }

  // Crear instrucciones básicas
  const instructions = [
    "Esta es una receta básica adaptada a tus preferencias.",
    "Puedes experimentar con los ingredientes que tengas disponibles.",
    "Recuerda ajustar las cantidades según tu gusto personal.",
  ];

  // Añadir información sobre electricidad
  if (electricityType === "Sin electricidad") {
    instructions.push(
      "Esta receta ha sido diseñada para prepararse sin necesidad de electricidad.",
      "Puedes usar una parrilla de carbón o una pequeña estufa de gas para cocinar los ingredientes."
    );
  }

  // Añadir lista de ingredientes disponibles
  if (userInput.availableIngredients?.length > 0) {
    instructions.push(
      `Ingredientes disponibles: ${userInput.availableIngredients.join(", ")}`
    );
  }

  return {
    id: generateId(),
    title,
    ingredients: [
      { name: "ingrediente principal", quantity: "1", unit: "unidad" },
      { name: "ingrediente secundario", quantity: "2", unit: "unidades" },
      { name: "condimento", quantity: "1", unit: "cucharada" },
    ],
    instructions,
    prepTime: userInput.preferences.prepTime || DEFAULT_VALUES.PREP_TIME,
    difficultyLevel:
      userInput.preferences.difficultyLevel || DEFAULT_VALUES.DIFFICULTY,
    cuisineType: userInput.preferences.cuisineType || DEFAULT_VALUES.CUISINE,
    dietType: userInput.preferences.dietType || DEFAULT_VALUES.DIET,
    createdAt: new Date().toISOString(),
    source: DEFAULT_VALUES.SOURCE,
  };
};
