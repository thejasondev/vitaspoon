import { useState, useEffect } from "react";
import { RecipeForm } from "../forms";
import { RecipeDisplay, GenerateButton } from "../ui";
import type { Recipe, UserInput } from "../../types/recipe";
import { storageService } from "../../services/storage/storageService";
import { generateRecipe } from "../../services/recipe/recipeService";

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
      electricityType: "",
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
    const storedUserInput = storageService.userInput.get();
    if (storedUserInput) {
      setUserInput(storedUserInput);
    }

    // Cargar receta actual
    const storedRecipe = storageService.currentRecipe.get();
    if (storedRecipe) {
      setRecipe(storedRecipe);
    }

    // Cargar recetas guardadas
    const storedSavedRecipes = storageService.savedRecipes.get();
    setSavedRecipes(storedSavedRecipes);
  }, []);

  // Guardar las preferencias del usuario en localStorage cuando cambien
  useEffect(() => {
    storageService.userInput.save(userInput);
  }, [userInput]);

  // Guardar la receta actual en localStorage cuando cambie
  useEffect(() => {
    if (recipe) {
      storageService.currentRecipe.save(recipe);
    }
  }, [recipe]);

  // Función para manejar la generación de recetas
  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newRecipe = await generateRecipe(userInput);
      setRecipe(newRecipe);
    } catch (err) {
      setError("Error al generar la receta. Por favor intenta nuevamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar una receta en "Mis dietas"
  const handleSaveRecipe = (recipeToSave: Recipe) => {
    // Usar el servicio para añadir la receta
    const updatedRecipes = storageService.savedRecipes.add(recipeToSave);
    setSavedRecipes(updatedRecipes);

    // Actualizar también la receta actual para mostrar que está guardada
    if (recipe && recipe.id === recipeToSave.id) {
      setRecipe({ ...recipeToSave, isSaved: true });
    }

    // Mostrar un mensaje de éxito
    alert("¡Receta guardada en Mis Dietas!");
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
          <div className="p-6 bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Personaliza tu receta
            </h2>
            <p className="text-gray-700 ml-8">
              Selecciona tus preferencias para crear una receta adaptada a tus
              necesidades
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
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center">
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
                  Completa el formulario con tus preferencias y haz clic en "¡A
                  Cocinar!" para generar una receta personalizada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contador de recetas guardadas */}
      {savedRecipes.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center shadow-sm border border-green-200">
          <p className="text-green-800 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
            </svg>
            Tienes <span className="font-bold mx-1">{savedRecipes.length}</span>{" "}
            receta{savedRecipes.length !== 1 ? "s" : ""} guardada
            {savedRecipes.length !== 1 ? "s" : ""} en Mis Dietas
          </p>
          <a
            href="/mis-dietas"
            className="inline-flex items-center mt-3 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            Ver Mis Dietas
          </a>
        </div>
      )}
    </div>
  );
}
