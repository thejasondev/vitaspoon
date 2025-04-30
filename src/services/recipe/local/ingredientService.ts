import type { Ingredient } from "./types";
import { FOOD_GROUPS, DEFAULT_VALUES } from "./types";

/**
 * Mapeo de tipos de cocina a sus ingredientes base
 */
const CUISINE_TYPE_INGREDIENTS: Record<string, Ingredient[]> = {
  Desayuno: [
    { name: "pan integral", quantity: "2", unit: "rebanadas" },
    { name: "aguacate", quantity: "1", unit: "unidad" },
    { name: "huevos", quantity: "2", unit: "unidades" },
    { name: "sal", quantity: "1", unit: "pizca" },
    { name: "pimienta", quantity: "1", unit: "pizca" },
    { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
    { name: "jugo de limón", quantity: "1", unit: "cucharadita" },
  ],
  Almuerzo: [
    { name: "garbanzos cocidos", quantity: "1", unit: "taza" },
    { name: "tomates cherry", quantity: "1", unit: "taza" },
    { name: "pepino", quantity: "1/2", unit: "unidad" },
    { name: "cebolla roja", quantity: "1/4", unit: "unidad" },
    { name: "aceitunas negras", quantity: "1/4", unit: "taza" },
    { name: "aceite de oliva", quantity: "2", unit: "cucharadas" },
    { name: "limón", quantity: "1/2", unit: "unidad" },
    { name: "orégano", quantity: "1", unit: "cucharadita" },
  ],
  Merienda: [
    { name: "plátano", quantity: "1", unit: "unidad" },
    { name: "fresas", quantity: "1", unit: "taza" },
    { name: "yogur natural", quantity: "1/2", unit: "taza" },
    { name: "miel", quantity: "1", unit: "cucharada" },
    { name: "avena", quantity: "2", unit: "cucharadas" },
    { name: "leche de almendras", quantity: "1", unit: "taza" },
  ],
  Cena: [
    { name: "pasta", quantity: "200", unit: "g" },
    { name: "pechuga de pollo", quantity: "1", unit: "unidad" },
    { name: "salsa pesto", quantity: "3", unit: "cucharadas" },
    { name: "tomates cherry", quantity: "1", unit: "taza" },
    { name: "queso parmesano", quantity: "2", unit: "cucharadas" },
    { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
    { name: "sal y pimienta", quantity: "", unit: "al gusto" },
  ],
  Postre: [
    { name: "manzanas", quantity: "4", unit: "unidades" },
    { name: "masa quebrada", quantity: "1", unit: "lámina" },
    { name: "azúcar", quantity: "1/2", unit: "taza" },
    { name: "canela", quantity: "1", unit: "cucharadita" },
    { name: "mantequilla", quantity: "2", unit: "cucharadas" },
    { name: "limón", quantity: "1/2", unit: "unidad" },
  ],
  Snack: [
    { name: "garbanzos cocidos", quantity: "1", unit: "lata" },
    { name: "tahini", quantity: "2", unit: "cucharadas" },
    { name: "ajo", quantity: "1", unit: "diente" },
    { name: "limón", quantity: "1", unit: "unidad" },
    { name: "aceite de oliva", quantity: "3", unit: "cucharadas" },
    { name: "pimentón", quantity: "1/2", unit: "cucharadita" },
    { name: "zanahorias", quantity: "2", unit: "unidades" },
    { name: "apio", quantity: "2", unit: "tallos" },
    { name: "pepino", quantity: "1", unit: "unidad" },
  ],
};

/**
 * Obtiene los ingredientes de una receta basada en el tipo de comida y dieta seleccionados
 */
export const getIngredientsForCuisineType = (
  cuisineType: string,
  dietType: string = DEFAULT_VALUES.DIET
): Ingredient[] => {
  // Obtener ingredientes base del tipo de cocina o usar predeterminados
  const baseIngredients = [
    ...(CUISINE_TYPE_INGREDIENTS[cuisineType] ||
      CUISINE_TYPE_INGREDIENTS["Almuerzo"] ||
      []),
  ];

  let ingredients = [...baseIngredients];

  // Adaptar según la dieta
  if (dietType === "Vegetariana" || dietType === "Vegana") {
    // Eliminar ingredientes no vegetarianos/veganos
    ingredients = ingredients.filter(
      (ing) =>
        !FOOD_GROUPS.NON_VEGETARIAN.some((nonVeg) =>
          ing.name.toLowerCase().includes(nonVeg.toLowerCase())
        )
    );

    // En caso vegano, eliminar también lácteos y huevos
    if (dietType === "Vegana") {
      ingredients = ingredients.filter(
        (ing) =>
          !FOOD_GROUPS.NON_VEGAN.some((nonVegan) =>
            ing.name.toLowerCase().includes(nonVegan.toLowerCase())
          )
      );

      // Reemplazar queso con alternativas para platos principales
      if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
        ingredients.push({ name: "tofu", quantity: "150", unit: "g" });
      }
    }
  } else if (dietType === "Alto en proteínas") {
    // Añadir fuentes de proteína si no hay pollo ya
    if (!ingredients.some((ing) => ing.name.includes("pollo"))) {
      ingredients.push({
        name: "pechuga de pollo",
        quantity: "200",
        unit: "g",
      });
    }
  } else if (dietType === "Bajo en carbohidratos") {
    // Eliminar ingredientes altos en carbohidratos
    ingredients = ingredients.filter(
      (ing) =>
        !FOOD_GROUPS.HIGH_CARB.some((carb) =>
          ing.name.toLowerCase().includes(carb.toLowerCase())
        )
    );

    // Añadir alternativas bajas en carbohidratos para platos principales
    if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      ingredients.push({ name: "calabacín", quantity: "1", unit: "unidad" });
    }
  }

  return ingredients;
};

/**
 * Crea ingredientes personalizados basados en los ingredientes disponibles del usuario
 */
export const createIngredientsFromUserInput = (
  availableIngredients: string[] = [],
  allergies: string[] = []
): Ingredient[] => {
  // Si no hay ingredientes disponibles, devolver array vacío
  if (availableIngredients.length === 0) {
    return [];
  }

  // Convertir los ingredientes disponibles a objetos Ingredient
  let ingredients = availableIngredients.map((name) => ({
    name,
    quantity: "Al gusto",
    unit: "",
  }));

  // Añadir cantidades específicas para ingredientes comunes
  ingredients = ingredients.map((ing) => {
    const nameLower = ing.name.toLowerCase();

    if (nameLower.includes("arroz")) {
      return { ...ing, quantity: "2", unit: "tazas" };
    }
    if (FOOD_GROUPS.PROTEINS.some((p) => nameLower.includes(p.toLowerCase()))) {
      return { ...ing, quantity: "500", unit: "g" };
    }
    if (nameLower.includes("cebolla")) {
      return { ...ing, quantity: "1", unit: "unidad" };
    }
    if (nameLower.includes("ajo")) {
      return { ...ing, quantity: "3", unit: "dientes" };
    }
    if (nameLower.includes("tomate")) {
      return { ...ing, quantity: "2", unit: "unidades" };
    }
    return ing;
  });

  // Si hay pocos ingredientes, añadir algunos básicos
  if (ingredients.length < 3) {
    const basicIngredients = [
      { name: "sal", quantity: "Al gusto", unit: "" },
      { name: "pimienta", quantity: "Al gusto", unit: "" },
      { name: "aceite", quantity: "2", unit: "cucharadas" },
    ];

    for (const basic of basicIngredients) {
      if (
        !ingredients.some((ing) =>
          ing.name.toLowerCase().includes(basic.name.toLowerCase())
        )
      ) {
        ingredients.push(basic);
      }
    }
  }

  // Filtrar ingredientes que coincidan con alergias
  return ingredients.filter(
    (ing) =>
      !allergies.some((allergen) =>
        ing.name.toLowerCase().includes(allergen.toLowerCase())
      )
  );
};

/**
 * Identifica los ingredientes proteicos de una lista de ingredientes
 */
export const identifyProteinIngredients = (ingredients: string[]): string[] => {
  return ingredients.filter((ing) =>
    FOOD_GROUPS.PROTEINS.some((protein) =>
      ing.toLowerCase().includes(protein.toLowerCase())
    )
  );
};

/**
 * Verifica si los ingredientes disponibles contienen cierto tipo de ingrediente
 */
export const hasIngredientType = (
  ingredients: string[] = [],
  type: "proteins" | "rice" | "vegetables"
): boolean => {
  switch (type) {
    case "proteins":
      return ingredients.some((ing) =>
        FOOD_GROUPS.PROTEINS.some((p) =>
          ing.toLowerCase().includes(p.toLowerCase())
        )
      );
    case "rice":
      return ingredients.some((ing) => ing.toLowerCase().includes("arroz"));
    case "vegetables":
      return ingredients.some((ing) =>
        FOOD_GROUPS.VEGETABLES.some((v) =>
          ing.toLowerCase().includes(v.toLowerCase())
        )
      );
    default:
      return false;
  }
};
