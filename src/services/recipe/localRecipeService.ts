import type { Recipe, UserInput } from "../../types/recipe";
import { generateId } from "../storage/storageService";
import {
  getRandomFilteredRecipe,
  getFilteredRecipes,
  LOCAL_RECIPES,
} from "../../constants/recipes";

/**
 * Obtiene los ingredientes de una receta basada en el tipo de comida y dieta seleccionados
 */
export const getIngredientsForCuisineType = (
  cuisineType: string,
  dietType: string = "Estándar"
): { name: string; quantity: string; unit: string }[] => {
  // Ingredientes base según el tipo de comida
  let baseIngredients = [];

  switch (cuisineType) {
    case "Desayuno":
      baseIngredients = [
        { name: "pan integral", quantity: "2", unit: "rebanadas" },
        { name: "aguacate", quantity: "1", unit: "unidad" },
        { name: "huevos", quantity: "2", unit: "unidades" },
        { name: "sal", quantity: "1", unit: "pizca" },
        { name: "pimienta", quantity: "1", unit: "pizca" },
        { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
        { name: "jugo de limón", quantity: "1", unit: "cucharadita" },
      ];
      break;
    case "Almuerzo":
      baseIngredients = [
        { name: "garbanzos cocidos", quantity: "1", unit: "taza" },
        { name: "tomates cherry", quantity: "1", unit: "taza" },
        { name: "pepino", quantity: "1/2", unit: "unidad" },
        { name: "cebolla roja", quantity: "1/4", unit: "unidad" },
        { name: "aceitunas negras", quantity: "1/4", unit: "taza" },
        { name: "aceite de oliva", quantity: "2", unit: "cucharadas" },
        { name: "limón", quantity: "1/2", unit: "unidad" },
        { name: "orégano", quantity: "1", unit: "cucharadita" },
      ];
      break;
    case "Merienda":
      baseIngredients = [
        { name: "plátano", quantity: "1", unit: "unidad" },
        { name: "fresas", quantity: "1", unit: "taza" },
        { name: "yogur natural", quantity: "1/2", unit: "taza" },
        { name: "miel", quantity: "1", unit: "cucharada" },
        { name: "avena", quantity: "2", unit: "cucharadas" },
        { name: "leche de almendras", quantity: "1", unit: "taza" },
      ];
      break;
    case "Cena":
      baseIngredients = [
        { name: "pasta", quantity: "200", unit: "g" },
        { name: "pechuga de pollo", quantity: "1", unit: "unidad" },
        { name: "salsa pesto", quantity: "3", unit: "cucharadas" },
        { name: "tomates cherry", quantity: "1", unit: "taza" },
        { name: "queso parmesano", quantity: "2", unit: "cucharadas" },
        { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
        { name: "sal y pimienta", quantity: "", unit: "al gusto" },
      ];
      break;
    case "Postre":
      baseIngredients = [
        { name: "manzanas", quantity: "4", unit: "unidades" },
        { name: "masa quebrada", quantity: "1", unit: "lámina" },
        { name: "azúcar", quantity: "1/2", unit: "taza" },
        { name: "canela", quantity: "1", unit: "cucharadita" },
        { name: "mantequilla", quantity: "2", unit: "cucharadas" },
        { name: "limón", quantity: "1/2", unit: "unidad" },
      ];
      break;
    case "Snack":
      baseIngredients = [
        { name: "garbanzos cocidos", quantity: "1", unit: "lata" },
        { name: "tahini", quantity: "2", unit: "cucharadas" },
        { name: "ajo", quantity: "1", unit: "diente" },
        { name: "limón", quantity: "1", unit: "unidad" },
        { name: "aceite de oliva", quantity: "3", unit: "cucharadas" },
        { name: "pimentón", quantity: "1/2", unit: "cucharadita" },
        { name: "zanahorias", quantity: "2", unit: "unidades" },
        { name: "apio", quantity: "2", unit: "tallos" },
        { name: "pepino", quantity: "1", unit: "unidad" },
      ];
      break;
    default:
      baseIngredients = [
        { name: "ingrediente principal", quantity: "1", unit: "unidad" },
        { name: "ingrediente secundario", quantity: "2", unit: "unidades" },
        { name: "condimento", quantity: "1", unit: "cucharada" },
      ];
  }

  // Adaptar según la dieta
  if (dietType === "Vegetariana" || dietType === "Vegana") {
    // Eliminar ingredientes no vegetarianos/veganos
    baseIngredients = baseIngredients.filter(
      (ing) =>
        !["pollo", "carne", "pescado", "atún", "jamón"].some((nonVeg) =>
          ing.name.toLowerCase().includes(nonVeg)
        )
    );

    // En caso vegano, eliminar también lácteos y huevos
    if (dietType === "Vegana") {
      baseIngredients = baseIngredients.filter(
        (ing) =>
          !["queso", "leche", "yogur", "huevo", "mantequilla"].some(
            (nonVegan) => ing.name.toLowerCase().includes(nonVegan)
          )
      );

      // Reemplazar queso con alternativas
      if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
        baseIngredients.push({ name: "tofu", quantity: "150", unit: "g" });
      }
    }
  } else if (dietType === "Alto en proteínas") {
    // Añadir fuentes de proteína
    if (!baseIngredients.some((ing) => ing.name.includes("pollo"))) {
      baseIngredients.push({
        name: "pechuga de pollo",
        quantity: "200",
        unit: "g",
      });
    }
  } else if (dietType === "Bajo en carbohidratos") {
    // Eliminar ingredientes altos en carbohidratos
    baseIngredients = baseIngredients.filter(
      (ing) =>
        !["pasta", "arroz", "pan", "azúcar", "masa"].some((carb) =>
          ing.name.toLowerCase().includes(carb)
        )
    );
    // Añadir alternativas bajas en carbohidratos
    if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      baseIngredients.push({
        name: "calabacín",
        quantity: "1",
        unit: "unidad",
      });
    }
  }

  return baseIngredients;
};

/**
 * Obtiene las instrucciones de una receta basada en el tipo de comida seleccionado
 */
export const getInstructionsForCuisineType = (
  cuisineType: string
): string[] => {
  switch (cuisineType) {
    case "Desayuno":
      return [
        "Tuesta el pan hasta que esté dorado.",
        "Machaca el aguacate en un tazón y agrega sal, pimienta y jugo de limón.",
        "Extiende el aguacate sobre las tostadas.",
        "En una sartén, fríe los huevos al gusto.",
        "Coloca los huevos sobre las tostadas de aguacate.",
        "Agrega más sal y pimienta al gusto.",
      ];
    case "Almuerzo":
      return [
        "Enjuaga y escurre los garbanzos.",
        "Corta los tomates cherry por la mitad.",
        "Pela y corta el pepino en cubos pequeños.",
        "Pica finamente la cebolla roja.",
        "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
        "Desmenuza el queso feta por encima.",
        "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
        "Vierte el aderezo sobre la ensalada y mezcla bien.",
        "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
      ];
    case "Merienda":
      return [
        "Pela el plátano y córtalo en trozos.",
        "Lava y quita el tallo de las fresas.",
        "Coloca todos los ingredientes en una licuadora.",
        "Licúa hasta obtener una mezcla suave.",
        "Sirve inmediatamente.",
      ];
    case "Cena":
      return [
        "Cuece la pasta según las instrucciones del paquete.",
        "Corta la pechuga de pollo en cubos y sazona con sal y pimienta.",
        "En una sartén, calienta el aceite y cocina el pollo hasta que esté dorado.",
        "Corta los tomates cherry por la mitad.",
        "Escurre la pasta y mezcla con la salsa pesto.",
        "Agrega el pollo y los tomates a la pasta.",
        "Sirve caliente con queso parmesano rallado por encima.",
      ];
    case "Postre":
      return [
        "Precalienta el horno a 180°C.",
        "Pela y corta las manzanas en rodajas finas.",
        "Mezcla las manzanas con el azúcar, la canela y el zumo de medio limón.",
        "Extiende la masa quebrada en un molde para tarta.",
        "Coloca las manzanas sobre la masa.",
        "Añade pequeños trozos de mantequilla sobre las manzanas.",
        "Hornea durante 40-45 minutos hasta que la masa esté dorada.",
        "Deja enfriar antes de servir.",
      ];
    case "Snack":
      return [
        "Escurre y enjuaga los garbanzos.",
        "En un procesador de alimentos, mezcla los garbanzos, tahini, ajo picado y el jugo de limón.",
        "Mientras procesas, añade el aceite de oliva gradualmente hasta conseguir una textura suave.",
        "Sazona con sal y pimienta al gusto.",
        "Sirve en un bol, haz un hueco en el centro y añade un poco de aceite de oliva y pimentón.",
        "Lava y corta las verduras en bastones para acompañar.",
      ];
    default:
      // Instrucciones predeterminadas
      return [
        "Enjuaga y escurre los garbanzos.",
        "Corta los tomates cherry por la mitad.",
        "Pela y corta el pepino en cubos pequeños.",
        "Pica finamente la cebolla roja.",
        "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
        "Desmenuza el queso feta por encima.",
        "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
        "Vierte el aderezo sobre la ensalada y mezcla bien.",
        "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
      ];
  }
};

/**
 * Obtiene el título de la receta basado en el tipo de comida seleccionado
 */
export const getRecipeTitleForCuisineType = (cuisineType: string): string => {
  switch (cuisineType) {
    case "Desayuno":
      return "Tostadas de Aguacate con Huevo";
    case "Almuerzo":
      return "Ensalada Mediterránea con Garbanzos";
    case "Merienda":
      return "Batido Energético de Frutas";
    case "Cena":
      return "Pasta al Pesto con Pollo";
    case "Postre":
      return "Tarta de Manzana Fácil";
    case "Snack":
      return "Hummus Casero con Crudités";
    default:
      return "Ensalada Mediterránea con Garbanzos";
  }
};

/**
 * Genera una receta local basada en las preferencias del usuario
 * Esta función no necesita conexión a internet ni API keys
 * Ideal para usuarios en Cuba y otros lugares con acceso limitado a internet
 */
export const generateLocalRecipe = async (
  userInput: UserInput
): Promise<Recipe> => {
  console.log("🏠 Generando receta local para usuario sin acceso a IA...");

  // Obtener preferencias del usuario
  const { dietType, cuisineType, electricityType, difficultyLevel, prepTime } =
    userInput.preferences;
  const { allergies = [], preferences = [] } =
    userInput.dietaryRestrictions || {};

  try {
    // Paso 1: Filtrar recetas que coincidan EXACTAMENTE con el tipo de comida (criterio obligatorio)
    // Esto es crucial porque en la UI se muestra claramente el tipo seleccionado
    let exactCuisineTypeRecipes = LOCAL_RECIPES.filter(
      (recipe) => recipe.cuisineType === cuisineType
    );

    if (exactCuisineTypeRecipes.length === 0) {
      console.log(
        `No se encontraron recetas del tipo ${cuisineType}. Creando una personalizada.`
      );
      // Si no hay recetas del tipo de comida seleccionado, crear una receta personalizada
      return createCustomRecipe(userInput);
    }

    // Paso 2: Entre las recetas del tipo correcto, aplicar los demás filtros
    let matchingRecipes = exactCuisineTypeRecipes.filter((recipe) => {
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
      if (allergies.length > 0) {
        for (const alergia of allergies) {
          if (
            recipe.ingredients.some((ing) =>
              ing.name.toLowerCase().includes(alergia.toLowerCase())
            )
          ) {
            return false;
          }
        }
      }

      // Considerar ingredientes disponibles
      if (
        userInput.availableIngredients &&
        userInput.availableIngredients.length > 0
      ) {
        const matchingIngredients = recipe.ingredients.filter((ing) =>
          userInput.availableIngredients.some((available) =>
            ing.name.toLowerCase().includes(available.toLowerCase())
          )
        );

        if (matchingIngredients.length < 2) {
          return false;
        }
      }

      return true;
    });

    // Si no hay recetas que coincidan con todos los criterios pero sí con el tipo de comida
    if (matchingRecipes.length === 0) {
      console.log(
        "No se encontraron recetas que coincidan con todos los criterios, pero sí del tipo correcto."
      );

      // Usar solo las recetas del tipo de comida correcto y relajar otros criterios
      matchingRecipes = exactCuisineTypeRecipes;
    }

    // Seleccionar una receta aleatoria de las coincidentes
    let selectedRecipe: Recipe;
    selectedRecipe =
      matchingRecipes[Math.floor(Math.random() * matchingRecipes.length)];

    // Verificar si la receta seleccionada coincide con el tipo de comida requerido
    if (selectedRecipe.cuisineType !== cuisineType) {
      console.log(
        "La receta seleccionada no coincide con el tipo de comida requerido. Creando personalizada."
      );
      selectedRecipe = createCustomRecipe(userInput);
    }

    // Personalizar la receta con ingredientes del usuario si están disponibles
    const customizedRecipe = customizeRecipeWithUserIngredients(
      selectedRecipe,
      userInput.availableIngredients
    );

    return {
      ...customizedRecipe,
      id: generateId(), // Siempre generar un nuevo ID para que cada receta sea única
      createdAt: new Date().toISOString(),
      // Asegurar que la receta respete el tipo de comida seleccionado
      cuisineType: cuisineType || customizedRecipe.cuisineType,
      source: "local", // Añadir información sobre la fuente local
    };
  } catch (error) {
    console.error("Error generando receta local:", error);
    // En caso de error, generar una receta básica que respete el tipo de comida seleccionado
    const fallbackRecipe = createFallbackRecipe(userInput);
    fallbackRecipe.cuisineType = cuisineType || "Variado";
    return fallbackRecipe;
  }
};

/**
 * Crea una receta personalizada desde cero basada en las preferencias del usuario
 */
const createCustomRecipe = (userInput: UserInput): Recipe => {
  const { dietType, cuisineType, electricityType, difficultyLevel, prepTime } =
    userInput.preferences;
  const { allergies = [] } = userInput.dietaryRestrictions || {};

  // Generar título adaptado a las preferencias
  let title = "";

  // Generar título basado en tipo de comida (SIEMPRE respetar el tipo seleccionado)
  if (cuisineType) {
    switch (cuisineType) {
      case "Desayuno":
        title =
          dietType === "Vegetariana" || dietType === "Vegana"
            ? "Tostadas de Aguacate"
            : "Huevos Revueltos con Verduras";
        break;
      case "Almuerzo":
        title =
          dietType === "Vegetariana" || dietType === "Vegana"
            ? "Ensalada de Legumbres y Vegetales"
            : "Arroz con Pollo y Vegetales";
        break;
      case "Cena":
        title =
          dietType === "Vegetariana" || dietType === "Vegana"
            ? "Salteado de Vegetales con Tofu"
            : "Tortilla de Papas con Ensalada";
        break;
      case "Merienda":
        title = "Batido de Frutas con Avena";
        break;
      case "Postre":
        title = "Compota de Frutas con Canela";
        break;
      case "Snack":
        title = "Hummus Casero con Vegetales";
        break;
      default:
        title = "Plato Combinado";
    }
  } else {
    title = "Plato Personalizado";
  }

  // Añadir indicador de dieta si es relevante
  if (dietType && dietType !== "Estándar") {
    title += ` (${dietType})`;
  }

  // Añadir indicador de electricidad si es relevante
  if (electricityType === "Sin electricidad") {
    title += " (Sin Electricidad)";
  }

  // Generar ingredientes adaptados
  const ingredients = getIngredientsForCuisineType(
    cuisineType || "Almuerzo",
    dietType
  );

  // Eliminar ingredientes que coincidan con alergias
  const filteredIngredients = ingredients.filter(
    (ing) =>
      !allergies.some((alergia) =>
        ing.name.toLowerCase().includes(alergia.toLowerCase())
      )
  );

  // Incorporar ingredientes disponibles del usuario
  if (
    userInput.availableIngredients &&
    userInput.availableIngredients.length > 0
  ) {
    userInput.availableIngredients.forEach((ingr) => {
      // Evitar duplicados
      if (
        !filteredIngredients.some((i) =>
          i.name.toLowerCase().includes(ingr.toLowerCase())
        )
      ) {
        filteredIngredients.push({
          name: ingr,
          quantity: "Al gusto",
          unit: "",
        });
      }
    });
  }

  // Generar instrucciones adaptadas
  let instructions = getInstructionsForRecipe(
    cuisineType || "Almuerzo",
    dietType,
    electricityType
  );

  // Añadir nota sobre personalización
  instructions.push(
    "Esta receta ha sido personalizada según tus preferencias. Puedes ajustar cantidades e ingredientes a tu gusto."
  );

  return {
    id: generateId(),
    title,
    ingredients:
      filteredIngredients.length > 0
        ? filteredIngredients
        : [{ name: "ingredientes variados", quantity: "Al gusto", unit: "" }],
    instructions,
    prepTime: prepTime || "15-30 minutos",
    difficultyLevel: difficultyLevel || "Fácil",
    cuisineType: cuisineType || "Variado", // SIEMPRE respetar el tipo de comida seleccionado
    dietType: dietType || "Estándar",
    createdAt: new Date().toISOString(),
    source: "local", // Añadir información sobre la fuente local
  };
};

/**
 * Genera instrucciones adaptadas a las preferencias del usuario
 */
const getInstructionsForRecipe = (
  cuisineType: string,
  dietType?: string,
  electricityType?: string
): string[] => {
  let instructions: string[] = [];

  // Instrucciones base según tipo de comida
  switch (cuisineType) {
    case "Desayuno":
      if (electricityType === "Sin electricidad") {
        instructions = [
          "Corta el aguacate por la mitad y extrae la pulpa en un bol.",
          "Machaca con un tenedor hasta obtener una consistencia suave.",
          "Añade sal, pimienta y jugo de limón al gusto.",
          "Unta sobre las rebanadas de pan.",
          "Agrega tus toppings favoritos por encima.",
        ];
      } else {
        instructions = [
          "Tuesta el pan hasta que esté crujiente.",
          "Mientras tanto, bate los huevos en un bol con sal y pimienta.",
          "Calienta una sartén con un poco de aceite a fuego medio.",
          "Cocina los huevos removiendo constantemente hasta que estén cuajados pero jugosos.",
          "Sirve los huevos sobre el pan tostado.",
        ];
      }
      break;
    case "Almuerzo":
    case "Cena":
      if (electricityType === "Sin electricidad") {
        instructions = [
          "Lava y corta todos los vegetales en trozos pequeños.",
          "Combina los vegetales en un bol grande.",
          "Añade la proteína que hayas elegido (conservas, legumbres, etc).",
          "Prepara un aliño con aceite, limón, sal y especias.",
          "Vierte el aliño sobre la ensalada y mezcla bien.",
          "Refrigera por 15-30 minutos antes de servir para mejor sabor.",
        ];
      } else if (dietType === "Vegetariana" || dietType === "Vegana") {
        instructions = [
          "Lava y corta todos los vegetales en trozos regulares.",
          "Calienta aceite en una sartén grande a fuego medio-alto.",
          "Saltea los vegetales comenzando por los más duros (zanahorias, etc).",
          "Añade los vegetales más blandos (pimientos, etc) y cocina 3-4 minutos más.",
          "Añade las especias, sal y pimienta al gusto.",
          "Si tienes tofu, córtalo en cubos y añádelo al final.",
          "Sirve caliente, opcionalmente sobre arroz o con pan.",
        ];
      } else {
        instructions = [
          "Prepara y corta todos los ingredientes según las cantidades indicadas.",
          "Calienta aceite en una sartén a fuego medio.",
          "Si hay proteína animal, cocínala primero hasta que esté dorada.",
          "Añade las verduras y cocina hasta que estén tiernas pero crujientes.",
          "Sazona con sal, pimienta y las especias sugeridas.",
          "Combina todos los ingredientes y cocina 2-3 minutos más.",
          "Sirve caliente, acompañado de la guarnición si se indica.",
        ];
      }
      break;
    case "Merienda":
      if (electricityType === "Sin electricidad") {
        instructions = [
          "Lava y corta las frutas en trozos pequeños.",
          "Combina todas las frutas en un bol.",
          "Añade cereales, frutos secos o semillas si los tienes disponibles.",
          "Opcional: añade un poco de miel o algún edulcorante natural.",
          "Mezcla bien y sirve fresco.",
        ];
      } else {
        instructions = [
          "Pela y corta las frutas en trozos.",
          "Coloca todos los ingredientes en una licuadora.",
          "Procesa hasta obtener una mezcla homogénea.",
          "Si está muy espeso, añade un poco más de líquido.",
          "Sirve inmediatamente en un vaso alto.",
        ];
      }
      break;
    case "Postre":
      if (electricityType === "Sin electricidad") {
        instructions = [
          "Pela y corta las frutas en trozos pequeños.",
          "Colócalas en un recipiente y añade un poco de azúcar o miel.",
          "Añade especias como canela, clavo o vainilla si las tienes.",
          "Mezcla bien y deja reposar al menos 30 minutos.",
          "Sirve frío, opcionalmente con un poco de yogur o crema.",
        ];
      } else {
        instructions = [
          "Precalienta el horno a temperatura media-alta.",
          "Prepara los ingredientes según las cantidades indicadas.",
          "Mezcla los ingredientes secos por un lado y los húmedos por otro.",
          "Combina ambas mezclas con movimientos envolventes.",
          "Vierte la preparación en un molde engrasado.",
          "Hornea durante el tiempo indicado hasta que esté dorado.",
          "Deja enfriar antes de servir.",
        ];
      }
      break;
    default:
      instructions = [
        "Prepara todos los ingredientes según las cantidades especificadas.",
        "Sigue el método de cocción adecuado para cada ingrediente.",
        "Combina los ingredientes en el orden indicado.",
        "Ajusta la sazón según tu gusto personal.",
        "Sirve inmediatamente o almacena adecuadamente si es para más tarde.",
      ];
  }

  // Añadir adaptaciones según tipo de dieta
  if (dietType === "Bajo en carbohidratos") {
    instructions.push(
      "Recuerda que esta receta es baja en carbohidratos. Evita añadir pan, arroz, pasta o azúcares refinados."
    );
  } else if (dietType === "Alto en proteínas") {
    instructions.push(
      "Para aumentar el contenido proteico, puedes añadir más huevos, carnes magras, pescado o legumbres a la receta."
    );
  } else if (dietType === "Bajo en grasas") {
    instructions.push(
      "Esta receta es baja en grasas. Si utilizas aceite, hazlo con moderación o usa spray antiadherente."
    );
  }

  // Añadir nota sobre electricidad si es relevante
  if (electricityType === "Sin electricidad") {
    instructions.push(
      "Esta receta ha sido diseñada para prepararse sin necesidad de utilizar electrodomésticos o cocina eléctrica."
    );
  }

  return instructions;
};

/**
 * Personaliza una receta con los ingredientes disponibles del usuario
 */
const customizeRecipeWithUserIngredients = (
  recipe: Recipe,
  availableIngredients: string[]
): Recipe => {
  // Si el usuario no ha especificado ingredientes, devolver la receta original
  if (!availableIngredients || availableIngredients.length === 0) {
    return recipe;
  }

  // Crear una copia de la receta para modificarla
  const customizedRecipe = { ...recipe };

  // Contar cuántos ingredientes de la receta coinciden con los disponibles
  const matchingIngredients = recipe.ingredients.filter((ing) =>
    availableIngredients.some((available) =>
      ing.name.toLowerCase().includes(available.toLowerCase())
    )
  );

  // Añadir una nota personalizada según la coincidencia de ingredientes
  let ingredientsNote = "";

  if (matchingIngredients.length > 0) {
    // Si hay buena coincidencia
    if (matchingIngredients.length >= recipe.ingredients.length / 2) {
      ingredientsNote = `Nota: ¡Excelente! Tienes ${
        matchingIngredients.length
      } de los ${
        recipe.ingredients.length
      } ingredientes principales para esta receta: ${matchingIngredients
        .map((i) => i.name)
        .join(", ")}.`;
    } else {
      // Si hay pocos ingredientes coincidentes
      ingredientsNote = `Nota: Esta receta incluye ${
        matchingIngredients.length
      } de tus ingredientes disponibles: ${matchingIngredients
        .map((i) => i.name)
        .join(", ")}. Puedes adaptar la receta según lo que tengas.`;
    }
  } else {
    // Si no hay ingredientes coincidentes
    ingredientsNote = `Nota: Esta receta ha sido seleccionada considerando tus preferencias. Puedes adaptarla usando tus ingredientes disponibles: ${availableIngredients.join(
      ", "
    )}.`;
  }

  customizedRecipe.instructions = [...recipe.instructions, ingredientsNote];

  // Modificar el título para indicar que es personalizada si aún no lo tiene
  if (!customizedRecipe.title.includes("(Personalizada)")) {
    customizedRecipe.title = `${recipe.title} (Personalizada)`;
  }

  return customizedRecipe;
};

/**
 * Crea una receta de respaldo en caso de error
 */
const createFallbackRecipe = (userInput: UserInput): Recipe => {
  // Construir título basado en preferencias
  let title = "Receta Básica Personalizada";
  const { cuisineType, dietType, electricityType } = userInput.preferences;

  if (cuisineType) {
    title = `${title} - ${cuisineType}`;
  }

  if (dietType && dietType !== "Estándar") {
    title = `${title} (${dietType})`;
  }

  // Crear instrucciones básicas
  const instructions = [
    "Esta es una receta básica adaptada a tus preferencias.",
    "Puedes experimentar con los ingredientes que tengas disponibles.",
    "Recuerda ajustar las cantidades según tu gusto personal.",
  ];

  // Añadir información sobre electricidad si es relevante
  if (electricityType === "Sin electricidad") {
    instructions.push(
      "Esta receta ha sido diseñada para prepararse sin necesidad de electricidad."
    );
  }

  // Añadir lista de ingredientes disponibles
  if (
    userInput.availableIngredients &&
    userInput.availableIngredients.length > 0
  ) {
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
    prepTime: userInput.preferences.prepTime || "15-30 minutos",
    difficultyLevel: userInput.preferences.difficultyLevel || "Fácil",
    cuisineType: userInput.preferences.cuisineType || "Variado",
    dietType: userInput.preferences.dietType || "Estándar",
    createdAt: new Date().toISOString(),
    source: "local", // Añadir información sobre la fuente local
  };
};
