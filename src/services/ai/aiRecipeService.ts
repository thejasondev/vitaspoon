import type { Recipe, UserInput } from "../../types/recipe";
import { generateRecipeWithAI } from "./recipeAIService";
import { generateRecipeWithGemini } from "./geminiAIService";
import { generateRecipeWithDeepSeek } from "./deepseekAIService";
import { generateId } from "../storage/storageService";
import { generateLocalRecipe } from "../recipe/localRecipeService";

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
 * Genera una receta utilizando el proveedor de IA más adecuado
 * o el modo sin conexión para usuarios en regiones con restricciones
 */
export const generateRecipeWithBestAI = async (
  userInput: UserInput
): Promise<Recipe> => {
  try {
    // Verificar si el usuario está en Cuba
    const isInCuba = await isUserInCuba();
    console.log(
      `🌎 Detección de ubicación: ${isInCuba ? "Cuba" : "Otra región"}`
    );

    // Obtener proveedores disponibles (con API keys configuradas)
    let availableProviders = getAvailableProviders();
    console.log(
      `🔑 Proveedores con API keys: ${availableProviders.join(", ")}`
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

    console.log(`✅ Proveedores accesibles: ${availableProviders.join(", ")}`);

    // Si el usuario está en Cuba, priorizar OpenRouter
    if (isInCuba && availableProviders.includes("deepseek")) {
      console.log(
        "🇨🇺 Usuario en Cuba: usando DeepSeek a través de OpenRouter como proveedor preferido"
      );
      try {
        return await generateRecipeWithDeepSeek(userInput);
      } catch (error) {
        console.error(
          "❌ Error al generar receta con DeepSeek a través de OpenRouter:",
          error
        );
        // Si OpenRouter falla, intentar con otro proveedor disponible (excepto OpenAI y Gemini que están bloqueados)
        if (availableProviders.includes("local")) {
          console.log(
            "⚠️ DeepSeek falló, usando generación local como respaldo para usuario en Cuba"
          );
          return generateLocalRecipe(userInput);
        }
      }
    }

    // Si no hay proveedores de IA disponibles o accesibles (excepto local), usar el respaldo local
    const aiProviders = availableProviders.filter((p) => p !== "local");
    if (aiProviders.length === 0) {
      console.warn(AI_CONFIG.messages.apiKeyMissing);
      return generateLocalRecipe(userInput);
    }

    // Determinar qué proveedor usar según el orden de prioridad exacto:
    // 1. OpenAI, 2. Gemini, 3. DeepSeek (OpenRouter), 4. Local
    let provider: AIProvider = "local";

    // Verificar cada proveedor en orden de prioridad
    if (availableProviders.includes("openai")) {
      provider = "openai";
    } else if (availableProviders.includes("gemini")) {
      provider = "gemini";
    } else if (availableProviders.includes("deepseek")) {
      provider = "deepseek";
    }

    console.log(`🤖 Usando proveedor de IA: ${provider}`);

    // Intentar generar con el proveedor seleccionado
    switch (provider) {
      case "openai":
        return await generateRecipeWithAI(userInput);
      case "gemini":
        return await generateRecipeWithGemini(userInput);
      case "deepseek":
        return await generateRecipeWithDeepSeek(userInput);
      case "local":
      default:
        return await generateLocalRecipe(userInput);
    }
  } catch (error) {
    console.error("❌ Error al generar receta:", error);
    console.warn(AI_CONFIG.messages.generationError);
    return generateLocalRecipe(userInput);
  }
};
