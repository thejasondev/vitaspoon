import type { Recipe, UserInput } from "../../types/recipe";
import { generateRecipeWithAI } from "./recipeAIService";
import { generateRecipeWithGemini } from "./geminiAIService";
import { generateId } from "../storage/storageService";

// Tipos de proveedores de IA disponibles
type AIProvider = "openai" | "gemini" | "local";

// Configuración para los proveedores de IA
const AI_CONFIG = {
  // Proveedor predeterminado en caso de que haya múltiples disponibles
  defaultProvider: "openai" as AIProvider,

  // Flag para usar respaldo local
  useLocalFallback: true,

  // Mensajes para el usuario
  messages: {
    apiKeyMissing:
      "No se ha configurado una API key para ningún proveedor de IA. Usando generación local.",
    generationError: "Error al generar receta con IA. Usando generación local.",
  },
};

/**
 * Verifica qué proveedores de IA están disponibles
 * @returns Lista de proveedores disponibles o vacío si ninguno está configurado
 */
const getAvailableProviders = (): AIProvider[] => {
  const providers: AIProvider[] = [];

  if (import.meta.env.OPENAI_API_KEY) {
    providers.push("openai");
  }

  if (import.meta.env.GEMINI_API_KEY) {
    providers.push("gemini");
  }

  // Siempre añadir el proveedor local como fallback
  if (AI_CONFIG.useLocalFallback) {
    providers.push("local");
  }

  return providers;
};

/**
 * Genera una receta utilizando el proveedor de IA más adecuado
 */
export const generateRecipeWithBestAI = async (
  userInput: UserInput
): Promise<Recipe> => {
  // Obtener proveedores disponibles
  const availableProviders = getAvailableProviders();

  // Si no hay proveedores de IA disponibles, usar el respaldo local
  if (
    !availableProviders.includes("openai") &&
    !availableProviders.includes("gemini")
  ) {
    console.warn(AI_CONFIG.messages.apiKeyMissing);
    return generateLocalRecipe(userInput);
  }

  // Determinar qué proveedor usar
  let provider: AIProvider = "local";

  // Si el proveedor predeterminado está disponible, usarlo
  if (availableProviders.includes(AI_CONFIG.defaultProvider)) {
    provider = AI_CONFIG.defaultProvider;
  }
  // Si no, elegir el primer proveedor de IA disponible
  else if (availableProviders.includes("openai")) {
    provider = "openai";
  } else if (availableProviders.includes("gemini")) {
    provider = "gemini";
  }

  console.log(`🤖 Usando proveedor de IA: ${provider}`);

  try {
    switch (provider) {
      case "openai":
        return await generateRecipeWithAI(userInput);
      case "gemini":
        return await generateRecipeWithGemini(userInput);
      case "local":
      default:
        return generateLocalRecipe(userInput);
    }
  } catch (error) {
    console.error("❌ Error al generar receta:", error);
    console.warn(AI_CONFIG.messages.generationError);
    return generateLocalRecipe(userInput);
  }
};

/**
 * Genera una receta local cuando no hay servicios de IA disponibles
 */
const generateLocalRecipe = async (userInput: UserInput): Promise<Recipe> => {
  console.log("🏠 Generando receta local");

  // Construir título basado en preferencias
  let title = "";
  let instructions = [];
  const { cuisineType, dietType, electricityType } = userInput.preferences;
  const sinElectricidad = electricityType === "Sin electricidad";

  if (cuisineType === "Desayuno") {
    if (sinElectricidad) {
      title = "Avena Remojada con Frutas";
      instructions = [
        "Mezcla la avena con leche o agua en un recipiente.",
        "Añade frutas picadas y frutos secos.",
        "Deja reposar durante la noche o por al menos 30 minutos.",
        "Sirve frío, sin necesidad de cocción.",
      ];
    } else {
      title = "Tostadas de Aguacate con Huevo";
      instructions = [
        "Tuesta el pan en una tostadora.",
        "Machaca el aguacate en un bol pequeño.",
        "Esparce el aguacate sobre las tostadas.",
        "Fríe los huevos al gusto y colócalos sobre el aguacate.",
        "Añade sal, pimienta y un chorrito de limón.",
      ];
    }
  } else if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
    if (sinElectricidad) {
      if (dietType === "Vegetariana" || dietType === "Vegana") {
        title = "Ensalada Mediterránea con Garbanzos";
        instructions = [
          "Abre la lata de garbanzos, escúrrelos y enjuágalos.",
          "Corta tomates, pepino y cebolla en cubos pequeños.",
          "Mezcla los vegetales con los garbanzos en un bol.",
          "Añade aceite de oliva, zumo de limón, sal y hierbas al gusto.",
          "Mezcla bien y deja reposar 10 minutos antes de servir.",
        ];
      } else {
        title = "Wrap de Atún con Verduras";
        instructions = [
          "Abre la lata de atún y escúrrela bien.",
          "Mezcla el atún con un poco de mayonesa o aguacate machacado.",
          "Lava y corta lechuga, tomate y cebolla.",
          "Coloca el atún y las verduras en una tortilla de maíz o trigo.",
          "Enrolla la tortilla y disfruta sin necesidad de calentarla.",
        ];
      }
    } else {
      if (dietType === "Vegetariana" || dietType === "Vegana") {
        title = "Curry de Garbanzos con Arroz";
        instructions = [
          "Cocina el arroz según las instrucciones del paquete.",
          "En una sartén, sofríe cebolla, ajo y jengibre picados.",
          "Añade especias de curry y cocina por 1 minuto.",
          "Incorpora garbanzos, tomate y leche de coco.",
          "Cocina a fuego lento durante 15 minutos.",
          "Sirve sobre el arroz con cilantro fresco.",
        ];
      } else {
        title = "Pasta con Pollo al Pesto";
        instructions = [
          "Hierve la pasta según las instrucciones del paquete.",
          "Corta el pollo en trozos y sazónalo con sal y pimienta.",
          "Cocina el pollo en una sartén hasta que esté dorado.",
          "Mezcla la pasta con el pollo y la salsa pesto.",
          "Añade queso parmesano por encima y sirve caliente.",
        ];
      }
    }
  } else if (cuisineType === "Postre") {
    if (sinElectricidad) {
      title = "Pudín de Chía con Frutas";
      instructions = [
        "Mezcla semillas de chía con leche o yogur.",
        "Añade un poco de miel o sirope de agave para endulzar.",
        "Deja reposar en el refrigerador durante la noche o por al menos 4 horas.",
        "Sirve con frutas frescas picadas por encima.",
      ];
    } else {
      title = "Tarta de Manzana Casera";
      instructions = [
        "Precalienta el horno a 180°C.",
        "Pela y corta las manzanas en rodajas finas.",
        "Coloca la masa en un molde para tarta.",
        "Dispón las manzanas sobre la masa y espolvorea con canela y azúcar.",
        "Hornea durante 30-35 minutos hasta que esté dorada.",
      ];
    }
  } else if (cuisineType === "Merienda") {
    if (sinElectricidad) {
      title = "Barritas Energéticas Sin Horno";
      instructions = [
        "Tritura frutos secos con un mortero o usa frutos secos ya triturados.",
        "Mezcla con dátiles o pasas machacados para unir la mezcla.",
        "Añade semillas y cereales al gusto.",
        "Presiona la mezcla en un recipiente rectangular.",
        "Refrigera durante al menos 2 horas antes de cortar en barritas.",
      ];
    } else {
      title = "Batido Energético de Frutas";
      instructions = [
        "Pela y corta las frutas en trozos.",
        "Coloca las frutas en una licuadora.",
        "Añade yogur o leche y un poco de miel si deseas.",
        "Licúa hasta obtener una mezcla homogénea.",
        "Sirve inmediatamente.",
      ];
    }
  } else {
    title =
      "Receta Personalizada" + (sinElectricidad ? " Sin Electricidad" : "");
    instructions = [
      "Esta es una receta generada localmente adaptada a tus preferencias.",
      "Para obtener recetas personalizadas con IA, configura una API key.",
      "Puedes usar OpenAI (GPT-3.5) o Google Gemini.",
    ];
  }

  // Generar estructura básica de la receta
  return {
    id: generateId(),
    title,
    ingredients: [
      { name: "ingrediente principal", quantity: "1", unit: "unidad" },
      { name: "ingrediente secundario", quantity: "2", unit: "unidades" },
      { name: "condimento", quantity: "1", unit: "cucharada" },
    ],
    instructions,
    prepTime: userInput.preferences.prepTime,
    difficultyLevel: userInput.preferences.difficultyLevel,
    cuisineType: userInput.preferences.cuisineType,
    dietType: userInput.preferences.dietType,
    createdAt: new Date().toISOString(),
  };
};
