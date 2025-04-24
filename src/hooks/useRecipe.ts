import { useState } from "react";
import type { Recipe, UserInput } from "../types/recipe";
import { generateRecipe } from "../services/recipe/recipeService";
import { storageService } from "../services/storage/storageService";

/**
 * Hook personalizado para manejar la generación y gestión de recetas
 */
export const useRecipe = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(
    storageService.savedRecipes.get()
  );

  /**
   * Carga la receta actual desde el almacenamiento local
   */
  const loadCurrentRecipe = () => {
    const storedRecipe = storageService.currentRecipe.get();
    if (storedRecipe) {
      setRecipe(storedRecipe);
    }
  };

  /**
   * Genera una nueva receta basada en las preferencias del usuario
   */
  const createRecipe = async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const newRecipe = await generateRecipe(userInput);
      setRecipe(newRecipe);
      storageService.currentRecipe.save(newRecipe);
      return newRecipe;
    } catch (err) {
      setError("Error al generar la receta. Por favor intenta nuevamente.");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guarda una receta en el almacenamiento local
   */
  const saveRecipe = (recipeToSave: Recipe) => {
    const updatedRecipes = storageService.savedRecipes.add(recipeToSave);
    setSavedRecipes(updatedRecipes);

    // Actualizar también la receta actual para mostrar que está guardada
    if (recipe && recipe.id === recipeToSave.id) {
      const updatedRecipe = { ...recipeToSave, isSaved: true };
      setRecipe(updatedRecipe);
      storageService.currentRecipe.save(updatedRecipe);
    }

    return updatedRecipes;
  };

  /**
   * Elimina una receta del almacenamiento local
   */
  const deleteRecipe = (recipeId: string) => {
    const updatedRecipes = storageService.savedRecipes.remove(recipeId);
    setSavedRecipes(updatedRecipes);
    return updatedRecipes;
  };

  /**
   * Verifica si una receta está guardada
   */
  const isRecipeSaved = (recipeId: string | undefined) => {
    if (!recipeId) return false;
    return savedRecipes.some((r) => r.id === recipeId);
  };

  return {
    recipe,
    isLoading,
    error,
    savedRecipes,
    createRecipe,
    saveRecipe,
    deleteRecipe,
    isRecipeSaved,
    loadCurrentRecipe,
  };
};
