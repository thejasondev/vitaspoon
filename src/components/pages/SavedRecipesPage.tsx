import { useState, useEffect } from "react";
import type { Recipe } from "../../types/recipe";
import { RecipeDisplay, ConfirmDialog } from "../ui";
import { storageService } from "../../services/storage/storageService";
import { ToastProvider } from "../../contexts/ToastContext";
import { useToast } from "../../contexts/ToastContext";

function SavedRecipesPageContent() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    recipeId: "",
    recipeName: "",
  });

  // Usar el hook de Toast
  const { showToast } = useToast();

  // Cargar recetas guardadas al inicio
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedRecipesData = storageService.savedRecipes.get();
      setSavedRecipes(savedRecipesData);
      // Seleccionar la primera receta si hay alguna
      if (savedRecipesData.length > 0) {
        setSelectedRecipe(savedRecipesData[0]);
      }
    } catch (err) {
      console.error("Error cargando recetas guardadas:", err);
      showToast("Error al cargar las recetas guardadas", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Abrir el diálogo de confirmación
  const openDeleteConfirmation = (recipeId: string, recipeName: string) => {
    setConfirmDialog({
      isOpen: true,
      recipeId,
      recipeName,
    });
  };

  // Cerrar el diálogo de confirmación
  const closeDeleteConfirmation = () => {
    setConfirmDialog({
      isOpen: false,
      recipeId: "",
      recipeName: "",
    });
  };

  // Función para eliminar una receta guardada
  const handleDeleteRecipe = () => {
    const recipeId = confirmDialog.recipeId;
    if (!recipeId) return;

    const updatedRecipes = storageService.savedRecipes.remove(recipeId);
    setSavedRecipes(updatedRecipes);

    // Si se elimina la receta seleccionada, seleccionar otra
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(updatedRecipes.length > 0 ? updatedRecipes[0] : null);
    }

    // Mostrar notificación
    showToast("Receta eliminada correctamente", "info");

    // Cerrar el diálogo
    closeDeleteConfirmation();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar receta"
        message={`¿Estás seguro que deseas eliminar la receta: "${confirmDialog.recipeName}"?`}
        onConfirm={handleDeleteRecipe}
        onCancel={closeDeleteConfirmation}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : savedRecipes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No tienes recetas guardadas
          </h3>
          <p className="text-gray-600 mb-6">
            Crea recetas personalizadas y guárdalas para construir tu plan de
            alimentación.
          </p>
          <a
            href="/recetas"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Crear Recetas
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista de recetas guardadas */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h2 className="text-xl font-semibold">Mis Recetas Guardadas</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className={`p-4 cursor-pointer hover:bg-green-50 transition-colors ${
                      selectedRecipe?.id === recipe.id
                        ? "bg-green-50 border-l-4 border-green-600"
                        : ""
                    }`}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {recipe.cuisineType} • {recipe.prepTime}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmation(
                            recipe.id as string,
                            recipe.title
                          );
                        }}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Eliminar receta"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {recipe.dietType}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {recipe.difficultyLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detalle de la receta seleccionada */}
          <div className="lg:col-span-8">
            {selectedRecipe ? (
              <RecipeDisplay recipe={selectedRecipe} isLoading={false} />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                  Selecciona una receta de la lista para ver sus detalles
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal envuelto con el ToastProvider
export default function SavedRecipesPage() {
  return (
    <ToastProvider>
      <SavedRecipesPageContent />
    </ToastProvider>
  );
}
