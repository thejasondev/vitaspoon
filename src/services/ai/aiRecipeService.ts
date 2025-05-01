import type { Recipe, UserInput } from "../../types/recipe";
import { generateRecipeWithAI } from "./recipeAIService";
import { generateRecipeWithGemini } from "./geminiAIService";
import { generateRecipeWithDeepSeek } from "./deepseekAIService";
import { generateId } from "../storage/storageService";
import {
  generateLocalRecipe,
  getLocalRecipesWhenAIUnavailable,
} from "../recipe/local";
import { LOCAL_RECIPES } from "../../constants/recipes";

// Tipos de proveedores de IA disponibles
type AIProvider = "openai" | "gemini" | "deepseek" | "local";

// Configuración para los proveedores de IA
const AI_CONFIG = {
  // Orden de prioridad: 1. OpenAI, 2. Gemini, 3. DeepSeek (OpenRouter), 4. Local
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

  // Ordenar según la prioridad: 1. OpenAI, 2. Gemini, 3. DeepSeek, 4. Local
  if (import.meta.env.OPENAI_API_KEY) {
    providers.push("openai");
  }

  if (import.meta.env.GEMINI_API_KEY) {
    providers.push("gemini");
  }

  if (import.meta.env.DEEPSEEK_API_KEY) {
    providers.push("deepseek");
  }

  // Siempre añadir el proveedor local como fallback
  if (AI_CONFIG.useLocalFallback) {
    providers.push("local");
  }

  return providers;
};

/**
 * Verifica si el usuario está en Cuba basándose en diferentes criterios
 */
const isUserInCuba = async (): Promise<boolean> => {
  try {
    // Intenta detectar la ubicación por IP
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      if (data.country === "CU") {
        console.log("🇨🇺 Usuario detectado en Cuba por IP");
        return true;
      }
    }

    // Intenta acceder a OpenAI y Gemini con un timeout corto
    // Si ambos fallan pero OpenRouter funciona, probablemente estamos en Cuba
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const openaiTest = fetch("https://api.openai.com/v1/engines", {
      method: "HEAD",
      signal: controller.signal,
    })
      .then(() => false)
      .catch(() => true);

    const geminiTest = fetch("https://generativelanguage.googleapis.com/", {
      method: "HEAD",
      signal: controller.signal,
    })
      .then(() => false)
      .catch(() => true);

    const openrouterTest = fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "HEAD",
      signal: controller.signal,
    })
      .then(() => false)
      .catch(() => true);

    const [openaiBlocked, geminiBlocked, openrouterBlocked] = await Promise.all(
      [openaiTest, geminiTest, openrouterTest]
    );

    clearTimeout(timeoutId);

    // Si OpenAI y Gemini están bloqueados pero OpenRouter no, probablemente estamos en Cuba
    if (openaiBlocked && geminiBlocked && !openrouterBlocked) {
      console.log(
        "🇨🇺 Usuario probablemente en Cuba (OpenAI y Gemini bloqueados, DeepSeek a través de OpenRouter disponible)"
      );
      return true;
    }

    // Verificar hora local - Cuba tiene restricciones de internet en ciertos horarios
    const now = new Date();
    const hour = now.getHours();
    const isCubanInternetRestrictedTime = hour >= 19 || hour <= 7;

    if (isCubanInternetRestrictedTime && (openaiBlocked || geminiBlocked)) {
      console.log(
        "🇨🇺 Usuario probablemente en Cuba (horario restringido de internet)"
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al determinar ubicación:", error);
    return false;
  }
};

/**
 * Verifica si el proveedor de AI está disponible en la región del usuario
 */
const isProviderAccessible = async (provider: AIProvider): Promise<boolean> => {
  try {
    const endpoints = {
      openai: "https://api.openai.com/v1/engines",
      gemini: "https://generativelanguage.googleapis.com/",
      deepseek: "https://openrouter.ai/api/v1/auth/key",
      local: "",
    };

    if (provider === "local") return true;

    const endpoint = endpoints[provider];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(endpoint, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Un código 401/403 significa que la API está disponible pero requiere autenticación
    // lo cual es una buena señal
    return response.status === 401 || response.status === 403;
  } catch (error) {
    console.log(`❌ Proveedor ${provider} no accesible:`, error);
    return false;
  }
};

/**
 * Selecciona y devuelve una receta local cuando no hay IA disponible
 */
const getLocalRecipeWhenAIUnavailable = async (
  userInput: UserInput
): Promise<Recipe> => {
  // Intentar encontrar recetas locales que coincidan con las preferencias del usuario
  const matchingLocalRecipes = getLocalRecipesWhenAIUnavailable(
    LOCAL_RECIPES,
    userInput
  );

  if (matchingLocalRecipes.length > 0) {
    console.log(
      `✅ Usando una de ${matchingLocalRecipes.length} recetas locales encontradas.`
    );

    // Seleccionar una receta aleatoria entre las mejores coincidencias (hasta 3)
    const recipeIndex = Math.floor(
      Math.random() * Math.min(3, matchingLocalRecipes.length)
    );
    const selectedRecipe = matchingLocalRecipes[recipeIndex];

    // Generar un ID único para esta instancia de la receta
    return {
      ...selectedRecipe,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
  }

  console.log("👨‍🍳 Generando receta local con el generador integrado...");
  return await generateLocalRecipe(userInput);
};

/**
 * Genera una receta utilizando el proveedor de IA más adecuado
 * o el modo sin conexión para usuarios en regiones con restricciones
 */
export const generateRecipeWithBestAI = async (
  userInput: UserInput,
  excludedProviders: AIProvider[] = []
): Promise<Recipe> => {
  try {
    // Verificar si el usuario está en Cuba
    const isInCuba = await isUserInCuba();
    console.log(
      `🌎 Detección de ubicación: ${isInCuba ? "Cuba" : "Otra región"}`
    );

    // Obtener proveedores disponibles (con API keys configuradas)
    let availableProviders = getAvailableProviders().filter(
      (provider) => !excludedProviders.includes(provider)
    );

    console.log(
      `🔑 Proveedores con API keys disponibles: ${availableProviders.join(
        ", "
      )}`
    );

    // Filtrar los proveedores que no son accesibles en la región del usuario
    // (para no perder tiempo intentando conectar a servicios bloqueados)
    const accessibilityChecks = await Promise.all(
      availableProviders.map(async (provider) => {
        if (provider === "local") return true;
        const isAccessible = await isProviderAccessible(provider);
        console.log(
          `🔄 Proveedor ${provider}: ${
            isAccessible ? "accesible" : "no accesible"
          }`
        );
        return isAccessible;
      })
    );

    availableProviders = availableProviders.filter(
      (_, index) => accessibilityChecks[index]
    );

    // Si no hay proveedores disponibles o solo está disponible el proveedor local
    if (
      availableProviders.length === 0 ||
      (availableProviders.length === 1 && availableProviders[0] === "local")
    ) {
      console.log("⚠️ No hay proveedores de IA disponibles.");
      return await getLocalRecipeWhenAIUnavailable(userInput);
    }

    // Elegir el mejor proveedor de IA disponible
    let preferredProvider = availableProviders[0]; // El primero disponible en la lista priorizada

    // Si estamos en Cuba y DeepSeek está disponible, usarlo por defecto
    // ya que funciona a través de OpenRouter y suele ser más accesible en Cuba
    if (isInCuba && availableProviders.includes("deepseek")) {
      preferredProvider = "deepseek";
      console.log("🇨🇺 Usando DeepSeek (vía OpenRouter) para usuario en Cuba");
    }

    console.log(`🤖 Generando receta con ${preferredProvider}...`);

    try {
      // Generar receta usando el proveedor elegido
      let recipe: Recipe;

      switch (preferredProvider) {
        case "openai":
          recipe = await generateRecipeWithAI(userInput);
          break;
        case "gemini":
          recipe = await generateRecipeWithGemini(userInput);
          break;
        case "deepseek":
          recipe = await generateRecipeWithDeepSeek(userInput);
          break;
        case "local":
          return await getLocalRecipeWhenAIUnavailable(userInput);
        default:
          throw new Error(`Proveedor de IA desconocido: ${preferredProvider}`);
      }

      // Añadir metadatos adicionales a la receta
      return {
        ...recipe,
        id: recipe.id || generateId(),
        createdAt: recipe.createdAt || new Date().toISOString(),
      };
    } catch (err) {
      // Manejar el error correctamente, verificando su tipo antes de acceder a propiedades
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        `❌ Error con proveedor ${preferredProvider}:`,
        errorMessage
      );

      // Si hay un error con el proveedor principal, intentar con la siguiente opción
      const remainingProviders = availableProviders.filter(
        (p) => p !== preferredProvider
      );

      if (remainingProviders.length > 0) {
        console.log(
          `🔄 Intentando con proveedor alternativo: ${remainingProviders[0]}`
        );

        // Llamada recursiva con los proveedores restantes
        // Pasamos el array de proveedores excluidos para evitar ciclos
        return await generateRecipeWithBestAI(userInput, [
          ...excludedProviders,
          preferredProvider,
        ]);
      }

      throw err; // Re-lanzar si no hay más proveedores
    }
  } catch (err) {
    // Convertir el error a string de manera segura
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Todos los proveedores de IA fallaron:", errorMessage);
    console.log("👨‍🍳 Usando generador local como último recurso...");

    // Como último recurso, usar la función de búsqueda local
    return await getLocalRecipeWhenAIUnavailable(userInput);
  }
};
