import React from "react";
import type { RecipeDisplayProps } from "../../types/recipe";
import {
  isLocalRecipe as checkIsLocalRecipe,
  printRecipe,
} from "./recipe/utils";
import RecipeHeader from "./recipe/RecipeHeader";
import RecipeInfo from "./recipe/RecipeInfo";
import ScreenView from "./recipe/ScreenView";
import PrintView from "./recipe/PrintView";

/**
 * Componente principal para mostrar una receta, tanto en pantalla como para impresión
 */
const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  isLoading,
  onSaveRecipe,
  isSaved = false,
}) => {
  // Mostrar estado de carga
  if (isLoading) {
    return <RecipeLoadingState />;
  }

  // No mostrar nada si no hay receta
  if (!recipe) {
    return null;
  }

  // Verificar si la receta es local
  const isLocalRecipe = checkIsLocalRecipe(recipe.title, recipe.instructions);

  // Manejador de impresión
  const handlePrint = () => {
    printRecipe(recipe.title);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md recipe-container print-layout">
      {/* Encabezado */}
      <RecipeHeader
        recipe={recipe}
        isLocalRecipe={isLocalRecipe}
        onSaveRecipe={onSaveRecipe}
        isSaved={isSaved}
      />

      {/* Información básica */}
      <RecipeInfo recipe={recipe} />

      {/* Vista de pantalla */}
      <ScreenView
        recipe={recipe}
        isLocalRecipe={isLocalRecipe}
        onPrint={handlePrint}
      />

      {/* Vista de impresión */}
      <PrintView recipe={recipe} />
    </div>
  );
};

/**
 * Componente para mostrar el estado de carga
 */
const RecipeLoadingState: React.FC = () => (
  <div className="bg-white p-8 rounded-lg shadow-md animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-1/2 mt-6 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-1/2 mt-6 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export default RecipeDisplay;
