import type { Recipe, UserInput } from "../../types/recipe";
import { generateId } from "../storage/storageService";
import { AI_API_CONFIG, API_MESSAGES } from "../../constants/apiConfig";

// URLs para Gemini API (versión estable)
const GEMINI_API_URL = AI_API_CONFIG.GEMINI.API_URL;
// URL alternativa por si la principal no funciona
const GEMINI_API_URL_ALT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Configura el prompt para la generación de recetas
 */
const createRecipePrompt = (userInput: UserInput): string => {
  // Extraer información del formulario
  const { cuisineType, dietType, prepTime, difficultyLevel, electricityType } =
    userInput.preferences;
  const { allergies, preferences, otherRestrictions } =
    userInput.dietaryRestrictions;
  const ingredients = userInput.availableIngredients || [];

  // Construir prompt estructurado
  return `Crea una receta de cocina en español con estas características:
  
TIPO DE COMIDA: ${cuisineType}
DIETA: ${dietType}
TIEMPO DE PREPARACIÓN: ${prepTime}
NIVEL DE DIFICULTAD: ${difficultyLevel}
DISPONIBILIDAD DE ELECTRICIDAD: ${electricityType}
${allergies.length > 0 ? `ALERGIAS A EVITAR: ${allergies.join(", ")}` : ""}
${
  preferences.length > 0
    ? `PREFERENCIAS ADICIONALES: ${preferences.join(", ")}`
    : ""
}
${otherRestrictions ? `OTRAS RESTRICCIONES: ${otherRestrictions}` : ""}
${
  ingredients.length > 0
    ? `INGREDIENTES DISPONIBLES: ${ingredients.join(", ")}`
    : ""
}

${
  electricityType === "Sin electricidad"
    ? "IMPORTANTE: La receta debe poderse preparar SIN ELECTRICIDAD. No incluyas pasos que requieran electrodomésticos como licuadora, batidora, horno eléctrico, microondas o refrigerador. Usa métodos de cocción que no requieran electricidad como fuego directo, parrilla a gas o carbón."
    : ""
}

La respuesta debe estar en formato JSON con esta estructura exacta:
{
  "title": "Título de la receta",
  "ingredients": [
    {"name": "nombre del ingrediente", "quantity": "cantidad", "unit": "unidad de medida"}
  ],
  "instructions": ["Paso 1", "Paso 2", "..."],
  "prepTime": "tiempo de preparación en minutos",
  "difficultyLevel": "nivel de dificultad",
  "cuisineType": "tipo de cocina",
  "dietType": "tipo de dieta"
}`;
};

// Función para parsear la respuesta de texto en formato Recipe
function parseRecipeFromText(recipeText: string, userInput: UserInput): Recipe {
  // Extraer el JSON de la respuesta (puede venir envuelto en markdown o texto)
  const jsonMatch =
    recipeText.match(/```json\s*([\s\S]*?)\s*```/) ||
    recipeText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("❌ No se encontró JSON en la respuesta");
    console.log("Respuesta recibida:", recipeText);
    throw new Error("Formato de respuesta no reconocido");
  }

  // Intentar parsear la respuesta JSON
  const jsonString = jsonMatch[1] || jsonMatch[0];
  const recipeData = JSON.parse(jsonString);
  console.log("✅ Receta extraída:", recipeData.title);

  // Convertir al formato de nuestra aplicación
  // Asegurarnos que cuisineType mantenga el valor original del formulario
  return {
    id: generateId(),
    title: recipeData.title,
    ingredients: recipeData.ingredients || [],
    instructions: recipeData.instructions || [],
    prepTime: recipeData.prepTime || 30,
    difficultyLevel: recipeData.difficultyLevel || "Media",
    cuisineType: userInput.preferences.cuisineType, // Usar el valor del formulario
    dietType: recipeData.dietType || "Regular",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Genera una receta utilizando Google Gemini
 */
export async function generateRecipeWithGemini(
  input: UserInput
): Promise<Recipe> {
  console.log("🤖 Generando receta con Gemini...");

  try {
    const prompt = createRecipePrompt(input);
    console.log("📝 Prompt generado:", prompt.substring(0, 100) + "...");

    const apiKey = import.meta.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      throw new Error("API key de Google no configurada");
    }

    const recipeText = await getResponseFromGemini(prompt, apiKey);

    try {
      const parsedRecipe = parseRecipeFromText(recipeText, input);
      console.log("✅ Receta generada correctamente");
      return parsedRecipe;
    } catch (parseError: unknown) {
      console.error("❌ Error al analizar la receta:", parseError);
      const errorMessage =
        parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Error al procesar la respuesta: ${errorMessage}`);
    }
  } catch (error: unknown) {
    console.error("❌ Error al generar receta con Gemini:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("429")) {
      throw new Error(
        "Se ha alcanzado el límite de cuota de la API. Por favor, inténtelo más tarde."
      );
    } else if (errorMessage.includes("403")) {
      throw new Error(
        "Error de autenticación con la API de Google. Verifique su configuración."
      );
    } else if (errorMessage.includes("404")) {
      throw new Error(
        "Modelo de IA no disponible en este momento. Por favor, inténtelo más tarde."
      );
    } else if (errorMessage.includes("401")) {
      throw new Error(
        "Clave de API inválida o expirada. Contacte al administrador."
      );
    }

    throw new Error(`Error al generar receta: ${errorMessage}`);
  }
}

/**
 * Genera una receta local de respaldo cuando la IA no está disponible
 */
const generateLocalRecipe = async (userInput: UserInput): Promise<Recipe> => {
  console.log("🏠 Generando receta local (Gemini fallback)");

  // Extraer preferencias
  const { cuisineType, dietType, electricityType } = userInput.preferences;
  const sinElectricidad = electricityType === "Sin electricidad";

  // Definir instrucciones según disponibilidad de electricidad
  let title = `Receta de ${cuisineType}`;
  let instructions = [];

  if (sinElectricidad) {
    // Recetas sin electricidad
    if (cuisineType === "Desayuno") {
      title = "Avena Remojada con Frutas";
      instructions = [
        "Mezcla la avena con leche o agua en un recipiente.",
        "Añade frutas picadas y frutos secos.",
        "Deja reposar durante la noche o por al menos 30 minutos.",
        "Sirve frío, sin necesidad de cocción.",
      ];
    } else if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      if (dietType === "Vegetariana" || dietType === "Vegana") {
        title = "Ensalada de Legumbres";
        instructions = [
          "Abre y escurre las legumbres enlatadas.",
          "Pica verduras como pimiento, cebolla y tomate.",
          "Mezcla todo y aliña con aceite, vinagre, sal y especias.",
          "Deja reposar 15 minutos antes de servir.",
        ];
      } else {
        title = "Conservas con Ensalada";
        instructions = [
          "Abre una lata de atún, sardinas o pollo en conserva.",
          "Mezcla con tomate y cebolla picados.",
          "Aliña con aceite, limón y especias.",
          "Sirve con pan o galletas saladas.",
        ];
      }
    } else {
      title = "Muesli Energético Sin Cocción";
      instructions = [
        "Mezcla copos de avena, frutos secos y semillas.",
        "Añade frutas frescas o deshidratadas.",
        "Incorpora miel o sirope para endulzar.",
        "Sirve con leche fría o yogur natural.",
      ];
    }
  } else {
    // Recetas con electricidad
    instructions = [
      "Esta es una receta de respaldo generada localmente.",
      "Para obtener recetas personalizadas, configura tu API key de Gemini.",
      "Consulta la documentación para más información.",
    ];
  }

  // Implementación simple de respaldo
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

async function getResponseFromGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  // Primero intentamos con la URL principal
  try {
    return await callGeminiAPI(GEMINI_API_URL, prompt, apiKey);
  } catch (error) {
    console.warn(
      "⚠️ Error con URL principal, intentando con URL alternativa..."
    );

    // Si falla, intentamos con la URL alternativa
    try {
      return await callGeminiAPI(GEMINI_API_URL_ALT, prompt, apiKey);
    } catch (altError) {
      console.error("❌ También falló la URL alternativa");
      throw altError; // Propagamos el error de la segunda llamada
    }
  }
}

// Función auxiliar para hacer la llamada a la API
async function callGeminiAPI(
  apiUrl: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  // Construir URL completa
  const url = apiUrl.includes("?key=")
    ? apiUrl.replace("GEMINI_API_KEY", apiKey)
    : `${apiUrl}?key=${apiKey}`;

  console.log(
    "🔗 Intentando con URL:",
    url.substring(0, url.indexOf("?key=") + 5) + "***"
  );

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    },
  };

  try {
    console.log(
      "🔑 Usando API Key (primeros 4 caracteres):",
      apiKey.substring(0, 4) + "..."
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorStatus = `${response.status} ${response.statusText}`;
      console.error(`❌ Error HTTP: ${errorStatus}`);

      // Intentar leer el cuerpo del error para más detalles
      try {
        const errorBody = await response.text();
        console.error("Detalle del error:", errorBody);
      } catch (e) {
        console.error("No se pudo leer el detalle del error");
      }

      throw new Error(`Error al obtener respuesta: ${errorStatus}`);
    }

    const data = await response.json();

    // Registrar una parte de la respuesta para depuración
    console.log(
      "📥 Respuesta recibida (primeros 100 caracteres):",
      JSON.stringify(data).substring(0, 100) + "..."
    );

    // Inicializar recipeText como cadena vacía
    let recipeText = "";

    // Verificar la estructura de respuesta nueva (candidates)
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];

      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        recipeText = candidate.content.parts[0].text || "";
      }
    }
    // Verificar estructura alternativa
    else if (
      data.response &&
      data.response.candidates &&
      data.response.candidates.length > 0
    ) {
      const candidate = data.response.candidates[0];

      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        recipeText = candidate.content.parts[0].text || "";
      }
    }
    // Verificar estructura antigua
    else if (data.response && data.response.text) {
      recipeText = data.response.text;
    }

    // Verificar si se encontró algún texto válido
    if (!recipeText) {
      console.error(
        "❌ No se pudo extraer texto de la respuesta:",
        JSON.stringify(data)
      );
      throw new Error("Formato de respuesta no reconocido");
    }

    return recipeText;
  } catch (error) {
    console.error(`❌ Error en la solicitud a Gemini (${apiUrl}):`, error);
    throw error;
  }
}
