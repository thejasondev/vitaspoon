import React from "react";
import type { Recipe } from "../../../types/recipe";

interface RecipeHeaderProps {
  recipe: Recipe;
  isLocalRecipe: boolean;
  onSaveRecipe?: (recipe: Recipe) => void;
  isSaved?: boolean;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipe,
  isLocalRecipe,
  onSaveRecipe,
  isSaved = false,
}) => {
  const handleSaveRecipe = () => {
    if (onSaveRecipe) {
      onSaveRecipe(recipe);
    }
  };

  return (
    <div className="flex justify-between items-start mb-6 border-b-2 border-green-200 pb-2 print-header">
      <div className="print:w-full">
        <h2 className="text-3xl font-bold text-green-700 print:text-black print:text-xl">
          {recipe.title}
        </h2>

        {/* Indicador de modo sin conexión - Solo visible en pantalla */}
        {isLocalRecipe && (
          <div className="mt-1 flex items-center print:hidden">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                ></path>
              </svg>
              Modo sin conexión
            </span>
          </div>
        )}
      </div>

      {/* Botón guardar - Solo visible en pantalla */}
      {onSaveRecipe && (
        <button
          onClick={handleSaveRecipe}
          disabled={isSaved}
          className={`print:hidden flex items-center px-4 py-2 rounded-lg transition-colors ${
            isSaved
              ? "bg-gray-100 text-gray-500 cursor-default"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          aria-label={isSaved ? "Receta guardada" : "Guardar receta"}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSaved ? (
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            ) : (
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            )}
          </svg>
          <span>{isSaved ? "Guardada" : "Guardar Receta"}</span>
        </button>
      )}
    </div>
  );
};

export default RecipeHeader;
