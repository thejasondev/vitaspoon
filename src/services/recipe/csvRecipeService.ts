import Papa from "papaparse";
import type { Recipe, Ingredient } from "../../types/recipe";
import { generateId } from "../storage/storageService";

/**
 * Interface para el formato de datos del CSV
 * Nota: Esta interfaz puede requerir ajustes según la estructura exacta del archivo CSV
 */
interface CSVRecipe {
  id?: string;
  name: string;
  ingredients: string;
  instructions: string;
  minutes: string;
  cuisine: string;
  diet?: string;
  difficulty?: string;
  // Añadir más campos según la estructura del CSV
}

// Cache para almacenar las recetas ya procesadas
let recipesCache: Recipe[] | null = null;
let processingPromise: Promise<Recipe[]> | null = null;

/**
 * Convierte una receta del formato CSV al formato interno de Recipe
 */
export const convertCSVToRecipe = (csvRecipe: CSVRecipe): Recipe => {
  // Procesar ingredientes (asumiendo que vienen como cadena separada por comas)
  let ingredients: Ingredient[] = [];

  try {
    if (csvRecipe.ingredients) {
      const ingredientsArray = csvRecipe.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      ingredients = ingredientsArray.map((item) => {
        // Intenta separar cantidad y unidad si es posible
        const parts = item.match(/^(\d+\.?\d*)\s*(\w+)?\s+(.+)$/);
        if (parts) {
          return {
            name: parts[3].trim(),
            quantity: parts[1],
            unit: parts[2] || "",
          };
        }

        // Si no se puede separar, usar el texto completo como nombre
        return {
          name: item,
          quantity: "",
          unit: "",
        };
      });
    } else {
      // Si no hay ingredientes, proporcionar un valor predeterminado
      ingredients = [
        { name: "Ingredientes no especificados", quantity: "", unit: "" },
      ];
    }
  } catch (err) {
    console.warn("Error procesando ingredientes:", err);
    ingredients = [
      { name: "Error procesando ingredientes", quantity: "", unit: "" },
    ];
  }

  // Procesar instrucciones (asumiendo que vienen como texto con saltos de línea o separadas por punto)
  let instructions: string[] = [];

  try {
    if (csvRecipe.instructions) {
      if (csvRecipe.instructions.includes("\n")) {
        instructions = csvRecipe.instructions
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean);
      } else {
        // Dividir por puntos y asegurarse de que cada instrucción termine con punto
        instructions = csvRecipe.instructions
          .split(".")
          .map((i) => i.trim())
          .filter(Boolean)
          .map((i) => (i.endsWith(".") ? i : `${i}.`));
      }
    }

    // Si no hay instrucciones o quedaron vacías, proporcionar un valor predeterminado
    if (instructions.length === 0) {
      instructions = ["Instrucciones no disponibles."];
    }
  } catch (err) {
    console.warn("Error procesando instrucciones:", err);
    instructions = ["Error procesando instrucciones."];
  }

  // Mapear los tiempos de preparación con valor predeterminado
  let prepTime = "Medio";
  try {
    const minutes = csvRecipe.minutes ? Number(csvRecipe.minutes) : 30;
    if (minutes <= 15) prepTime = "Rápido";
    else if (minutes > 45) prepTime = "Largo";
  } catch (err) {
    console.warn("Error procesando tiempo de preparación:", err);
  }

  // Mapear nivel de dificultad si no está especificado
  let difficultyLevel = "Medio";
  try {
    if (csvRecipe.difficulty) {
      difficultyLevel = csvRecipe.difficulty;
    } else if (csvRecipe.minutes) {
      const minutes = Number(csvRecipe.minutes);
      difficultyLevel =
        minutes <= 20 ? "Fácil" : minutes <= 40 ? "Medio" : "Difícil";
    }
  } catch (err) {
    console.warn("Error procesando nivel de dificultad:", err);
  }

  // Validar y asignar nombre de receta
  const title = csvRecipe.name || "Receta sin nombre";

  // Crear y devolver la receta en formato interno
  return {
    id: csvRecipe.id || generateId(),
    title,
    ingredients,
    instructions,
    prepTime,
    difficultyLevel,
    cuisineType: csvRecipe.cuisine || "Internacional",
    dietType: csvRecipe.diet || "Regular",
    createdAt: new Date().toISOString(),
    source: "csv_database",
  };
};

/**
 * Procesa el archivo CSV y devuelve un array de recetas
 * Implementa cache para evitar reprocesar el mismo archivo
 */
export const parseCSVFile = async (filePath: string): Promise<Recipe[]> => {
  // Si ya tenemos las recetas en caché, devolverlas inmediatamente
  if (recipesCache) {
    return recipesCache;
  }

  // Si ya hay una operación de procesamiento en curso, esperar a que termine
  if (processingPromise) {
    return processingPromise;
  }

  try {
    console.log("🔄 Procesando archivo CSV de recetas...");

    // Crear una promesa que podamos reutilizar si se hacen múltiples llamadas durante el procesamiento
    processingPromise = (async () => {
      try {
        // Cargar el archivo
        const response = await fetch(filePath);
        const csvText = await response.text();

        // Parsear el CSV
        return new Promise<Recipe[]>((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              console.log(
                `✅ CSV procesado correctamente. ${results.data.length} recetas encontradas.`
              );

              // Convertir cada fila a formato Recipe con manejo de errores
              const recipes: Recipe[] = [];

              for (const item of results.data) {
                try {
                  const recipe = convertCSVToRecipe(item as CSVRecipe);
                  recipes.push(recipe);
                } catch (error) {
                  console.warn("Error convirtiendo receta del CSV:", error);
                  // Continuar con la siguiente receta
                }
              }

              console.log(
                `✅ Se convirtieron ${recipes.length} recetas correctamente`
              );

              // Guardar en caché para futuras llamadas
              recipesCache = recipes;

              resolve(recipes);
            },
            error: (error: Error) => {
              console.error("Error al procesar CSV:", error);
              reject(error);
            },
          });
        });
      } catch (error) {
        console.error("Error cargando archivo CSV:", error);
        throw error;
      }
    })();

    return await processingPromise;
  } catch (error) {
    console.error("Error cargando archivo CSV:", error);
    processingPromise = null; // Resetear la promesa para permitir reintentos
    throw error;
  } finally {
    // Limpiar la referencia a la promesa cuando termine
    processingPromise = null;
  }
};

// Cache para loadAndCombineRecipes
let combinedRecipesCache: Recipe[] | null = null;

/**
 * Carga las recetas desde el CSV y las combina con las recetas locales existentes
 * dando prioridad a las recetas del CSV
 * Implementa caché para mejorar rendimiento
 */
export const loadAndCombineRecipes = async (): Promise<Recipe[]> => {
  // Si ya tenemos las recetas combinadas en caché, devolverlas inmediatamente
  if (combinedRecipesCache) {
    return combinedRecipesCache;
  }

  try {
    // Cargar recetas CSV
    const csvRecipes = await parseCSVFile("/data/train.csv");

    // Importar recetas locales existentes (para evitar importación circular)
    const { LOCAL_RECIPES } = await import("../../constants/recipes");

    // Crear un mapa de las recetas del CSV para búsqueda eficiente por título
    const csvRecipeMap = new Map<string, Recipe>();
    csvRecipes.forEach((recipe) => {
      csvRecipeMap.set(recipe.title.toLowerCase(), recipe);
    });

    // Filtrar recetas locales que no existan en el CSV (evitar duplicados)
    const uniqueLocalRecipes = LOCAL_RECIPES.filter(
      (localRecipe) => !csvRecipeMap.has(localRecipe.title.toLowerCase())
    );

    // Combinar ambas fuentes dando prioridad a las recetas del CSV
    const combinedRecipes = [...csvRecipes, ...uniqueLocalRecipes];

    console.log(
      `🍽️ Base de datos combinada: ${combinedRecipes.length} recetas (${csvRecipes.length} de CSV, ${uniqueLocalRecipes.length} locales)`
    );

    // Guardar en caché para futuras llamadas
    combinedRecipesCache = combinedRecipes;

    return combinedRecipes;
  } catch (error) {
    console.error("Error combinando recetas:", error);
    // Si hay un error, devolver solo las recetas locales
    const { LOCAL_RECIPES } = await import("../../constants/recipes");
    return LOCAL_RECIPES;
  }
};
