/**
 * Configuración para APIs de IA
 */
export const AI_API_CONFIG = {
  // OpenAI API (GPT-4o-mini)
  OPENAI: {
    API_URL: "https://api.openai.com/v1/chat/completions",
    MODEL: "gpt-4o-mini",
    MAX_TOKENS: 800,
  },

  // Google Gemini API
  GEMINI: {
    API_URL:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    API_URL_ALT:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    MAX_TOKENS: 800,
  },

  // DeepSeek API
  DEEPSEEK: {
    API_URL: "https://openrouter.ai/api/v1/chat/completions",
    MODEL: "deepseek/deepseek-chat",
    MAX_TOKENS: 800,
  },
};

// Mensajes para el usuario
export const API_MESSAGES = {
  ERROR: "Ocurrió un error al generar la receta. Usando recetas locales.",
  ATTRIBUTION: "Receta generada con inteligencia artificial",
};
