import { useState, useEffect } from "react";
import RecipeForm from "./RecipeForm";
import RecipeDisplay from "./RecipeDisplay";
import GenerateButton from "./GenerateButton";
import type { Recipe, UserInput, SavedRecipes } from "../types/recipe";

// Clave para usar en localStorage
const STORAGE_KEYS = {
  USER_INPUT: "vitaspoon_user_input",
  CURRENT_RECIPE: "vitaspoon_current_recipe",
  SAVED_RECIPES: "vitaspoon_saved_recipes",
};

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export default function RecipeFormPage() {
  // Estado inicial para el formulario
  const [userInput, setUserInput] = useState<UserInput>({
    dietaryRestrictions: {
      allergies: [],
      preferences: [],
      otherRestrictions: "",
    },
    preferences: {
      cuisineType: "",
      dietType: "",
      prepTime: "",
      difficultyLevel: "",
    },
    availableIngredients: [],
  });

  // Estados para manejar la generación de recetas
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    // Cargar preferencias del usuario
    try {
      const storedUserInput = localStorage.getItem(STORAGE_KEYS.USER_INPUT);
      if (storedUserInput) {
        setUserInput(JSON.parse(storedUserInput));
      }

      // Cargar receta actual
      const storedRecipe = localStorage.getItem(STORAGE_KEYS.CURRENT_RECIPE);
      if (storedRecipe) {
        setRecipe(JSON.parse(storedRecipe));
      }

      // Cargar recetas guardadas
      const storedSavedRecipes = localStorage.getItem(
        STORAGE_KEYS.SAVED_RECIPES
      );
      if (storedSavedRecipes) {
        const savedRecipesData: SavedRecipes = JSON.parse(storedSavedRecipes);
        setSavedRecipes(savedRecipesData.recipes);
      }
    } catch (err) {
      console.error("Error cargando datos de localStorage:", err);
    }
  }, []);

  // Guardar las preferencias del usuario en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_INPUT, JSON.stringify(userInput));
  }, [userInput]);

  // Guardar la receta actual en localStorage cuando cambie
  useEffect(() => {
    if (recipe) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_RECIPE, JSON.stringify(recipe));
    }
  }, [recipe]);

  // Guardar las recetas almacenadas en localStorage cuando cambien
  useEffect(() => {
    const savedRecipesData: SavedRecipes = { recipes: savedRecipes };
    localStorage.setItem(
      STORAGE_KEYS.SAVED_RECIPES,
      JSON.stringify(savedRecipesData)
    );
  }, [savedRecipes]);

  // Función para manejar la generación de recetas
  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Aquí normalmente harías una llamada a la API
      // Por ahora simularemos un tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulación de respuesta (en un caso real, esto vendría de tu API)
      const mockRecipe: Recipe = {
        id: generateId(),
        title: "Ensalada Mediterránea con Garbanzos",
        prepTime: "15-30 minutos",
        difficultyLevel: "Fácil",
        cuisineType: "Mediterránea",
        dietType: userInput.preferences.dietType || "Estándar",
        createdAt: new Date().toISOString(),
        ingredients: [
          { name: "garbanzos cocidos", quantity: "1", unit: "taza" },
          { name: "tomates cherry", quantity: "1", unit: "taza" },
          { name: "pepino", quantity: "1/2", unit: "unidad" },
          { name: "cebolla roja", quantity: "1/4", unit: "unidad" },
          { name: "aceitunas negras", quantity: "1/4", unit: "taza" },
          { name: "queso feta", quantity: "50", unit: "g" },
          { name: "aceite de oliva", quantity: "2", unit: "cucharadas" },
          { name: "limón", quantity: "1/2", unit: "unidad" },
          { name: "orégano", quantity: "1", unit: "cucharadita" },
        ],
        instructions: [
          "Enjuaga y escurre los garbanzos.",
          "Corta los tomates cherry por la mitad.",
          "Pela y corta el pepino en cubos pequeños.",
          "Pica finamente la cebolla roja.",
          "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
          "Desmenuza el queso feta por encima.",
          "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
          "Vierte el aderezo sobre la ensalada y mezcla bien.",
          "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
        ],
      };

      setRecipe(mockRecipe);
    } catch (err) {
      setError("Error al generar la receta. Por favor intenta nuevamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar una receta en "Mis dietas"
  const handleSaveRecipe = (recipeToSave: Recipe) => {
    // Verificar si la receta ya está guardada (por ID)
    const recipeExists = savedRecipes.some((r) => r.id === recipeToSave.id);

    if (!recipeExists) {
      // Si no existe, añadirla a las recetas guardadas
      const updatedRecipe = {
        ...recipeToSave,
        isSaved: true,
      };

      setSavedRecipes([...savedRecipes, updatedRecipe]);

      // Actualizar también la receta actual para mostrar que está guardada
      if (recipe && recipe.id === recipeToSave.id) {
        setRecipe(updatedRecipe);
      }

      // Mostrar un mensaje de éxito (esto es opcional)
      alert("¡Receta guardada en Mis Dietas!");
    }
  };

  // Comprobar si la receta actual está guardada
  const isCurrentRecipeSaved = recipe?.id
    ? savedRecipes.some((r) => r.id === recipe.id)
    : false;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna del formulario */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Personaliza tu receta
            </h2>
            <p className="text-gray-600">
              Completa el formulario con tus preferencias y restricciones
              alimentarias
            </p>
          </div>

          <div className="p-6">
            <RecipeForm userInput={userInput} setUserInput={setUserInput} />

            <div className="mt-8">
              <GenerateButton
                onClick={handleGenerateRecipe}
                isLoading={isLoading}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna de resultados */}
        <div className={`${recipe || isLoading ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-4">
            {isLoading || recipe ? (
              <RecipeDisplay
                recipe={recipe}
                isLoading={isLoading}
                onSaveRecipe={handleSaveRecipe}
                isSaved={isCurrentRecipeSaved}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Tu receta aparecerá aquí
                </h3>
                <p className="text-gray-600">
                  Completa el formulario y haz clic en "Generar Receta" para
                  obtener una receta personalizada basada en tus preferencias.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contador de recetas guardadas */}
      {savedRecipes.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
          <p className="text-green-800">
            Tienes <span className="font-bold">{savedRecipes.length}</span>{" "}
            receta{savedRecipes.length !== 1 ? "s" : ""} guardada
            {savedRecipes.length !== 1 ? "s" : ""} en Mis Dietas
          </p>
          <a
            href="/mis-dietas"
            className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver Mis Dietas
          </a>
        </div>
      )}
    </div>
  );
}
