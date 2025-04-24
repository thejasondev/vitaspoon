import type { Recipe, UserInput } from "../../types/recipe";
import { generateId } from "../storage/storageService";
import { AI_API_CONFIG, API_MESSAGES } from "../../constants/apiConfig";

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

  // Determinar el mensaje de electricidad según la selección
  let electricityMessage = "";
  if (electricityType === "Sin electricidad") {
    electricityMessage =
      "IMPORTANTE: La receta debe poderse preparar SIN ELECTRICIDAD. No incluyas pasos que requieran electrodomésticos como licuadora, batidora, horno eléctrico, microondas o refrigerador. Usa ÚNICAMENTE métodos de cocción que no requieran electricidad como fuego directo, parrilla a gas o preferiblemente carbón.";
  } else {
    electricityMessage =
      "Puedes incluir cualquier método de cocción o electrodoméstico en la preparación.";
  }

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

${electricityMessage}

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

/**
 * Genera una receta utilizando OpenAI (GPT-4o-mini)
 */
export const generateRecipeWithAI = async (
  userInput: UserInput
): Promise<Recipe> => {
  try {
    // Verificar si hay una API key configurada
    const apiKey = import.meta.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn(
        "⚠️ No se encontró API key para OpenAI, usando fallback local"
      );
      return generateLocalRecipe(userInput);
    }

    console.log("🔍 Generando receta con OpenAI...");

    // Crear el prompt para la IA
    const prompt = createRecipePrompt(userInput);
    console.log("📝 Prompt generado:", prompt);

    // Formatear la clave API correctamente (4 primeros caracteres para el log)
    const apiKeyPrefix = apiKey.substring(0, 4);
    console.log(`🔑 Usando API Key con prefijo: ${apiKeyPrefix}...`);

    // Configurar la solicitud
    const response = await fetch(AI_API_CONFIG.OPENAI.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_API_CONFIG.OPENAI.MODEL,
        messages: [
          {
            role: "system",
            content:
              "Eres un chef experto que crea recetas detalladas en español. Adapta tus recetas según la disponibilidad de electricidad indicada por el usuario. Si no hay electricidad, NO incluyas pasos que requieran electrodomésticos (licuadora, horno eléctrico, microondas, etc.) y usa métodos como fuego directo, cocina a gas y carbón. Respondes exclusivamente en formato JSON puro sin delimitadores markdown como ```json o ```.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: AI_API_CONFIG.OPENAI.MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error de API OpenAI: ${response.status}`, errorText);
      throw new Error(`Error de OpenAI API: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Respuesta recibida de OpenAI");

    const recipeJSON = data.choices[0].message.content;

    // Intentar parsear la respuesta JSON
    try {
      // Extraer el JSON de la respuesta (puede venir envuelto en markdown o texto)
      const jsonMatch =
        recipeJSON.match(/```json\s*([\s\S]*?)\s*```/) ||
        recipeJSON.match(/```\s*([\s\S]*?)\s*```/) ||
        recipeJSON.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.error("❌ No se encontró JSON en la respuesta");
        console.log("Respuesta recibida:", recipeJSON);
        throw new Error("Formato de respuesta no reconocido");
      }

      // Extraer el JSON de la respuesta (sea con delimitadores markdown o no)
      const jsonString = jsonMatch[1] || jsonMatch[0];
      const recipeData = JSON.parse(jsonString);
      console.log("✅ Receta generada:", recipeData.title);

      // Convertir al formato de nuestra aplicación
      return {
        id: generateId(),
        title: recipeData.title,
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
        prepTime: recipeData.prepTime || userInput.preferences.prepTime,
        difficultyLevel:
          recipeData.difficultyLevel || userInput.preferences.difficultyLevel,
        cuisineType: userInput.preferences.cuisineType,
        dietType: recipeData.dietType || userInput.preferences.dietType,
        createdAt: new Date().toISOString(),
      };
    } catch (parseError) {
      console.error("❌ Error al parsear respuesta JSON:", parseError);
      console.log("Respuesta recibida:", recipeJSON);
      throw new Error("Error al procesar la respuesta de la IA");
    }
  } catch (error) {
    console.error("❌ Error al generar receta con IA:", error);
    return generateLocalRecipe(userInput);
  }
};

/**
 * Genera una receta local de respaldo cuando la IA no está disponible
 */
const generateLocalRecipe = async (userInput: UserInput): Promise<Recipe> => {
  console.log("🏠 Generando receta local (OpenAI fallback)");

  // Extraer preferencias
  const { cuisineType, dietType, electricityType } = userInput.preferences;
  const sinElectricidad = electricityType === "Sin electricidad";

  // Definir instrucciones según disponibilidad de electricidad
  let title = `Receta de ${cuisineType}`;
  let instructions = [];

  if (sinElectricidad) {
    // Recetas sin electricidad
    if (cuisineType === "Desayuno") {
      title = "Yogur con Frutas y Granola";
      instructions = [
        "Coloca el yogur en un recipiente.",
        "Añade frutas frescas picadas por encima.",
        "Espolvorea granola y un poco de miel.",
        "Mezcla justo antes de consumir.",
      ];
    } else if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      if (dietType === "Vegetariana" || dietType === "Vegana") {
        title = "Wrap Vegetariano Frío";
        instructions = [
          "Extiende una tortilla sobre un plato.",
          "Añade hummus o guacamole como base.",
          "Coloca encima lechuga, tomate y zanahoria rallada.",
          "Enrolla la tortilla y asegúrala con un palillo si es necesario.",
        ];
      } else {
        title = "Sándwich de Jamón y Queso";
        instructions = [
          "Coloca pan de molde o baguette en un plato.",
          "Añade una capa de mayonesa o mostaza.",
          "Coloca lonchas de jamón y queso.",
          "Añade lechuga y tomate si lo deseas.",
          "Cubre con otra rebanada de pan y corta por la mitad.",
        ];
      }
    } else {
      title = "Frutas con Frutos Secos";
      instructions = [
        "Lava y trocea la fruta de temporada.",
        "Mezcla diferentes tipos de frutos secos.",
        "Combina ambos en un recipiente.",
        "Añade un poco de miel o yogur si lo deseas.",
      ];
    }
  } else {
    // Recetas con electricidad
    instructions = [
      "Esta es una receta de respaldo generada localmente.",
      "Para obtener recetas personalizadas, configura tu API key de OpenAI.",
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
