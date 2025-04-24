import type { RecipeDisplayProps } from "../types/recipe";

export default function RecipeDisplay({
  recipe,
  isLoading,
  onSaveRecipe,
  isSaved = false,
}: RecipeDisplayProps) {
  if (isLoading) {
    return (
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
  }

  if (!recipe) {
    return null;
  }

  const handleSaveRecipe = () => {
    if (onSaveRecipe && recipe) {
      onSaveRecipe(recipe);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Encabezado de la receta */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-green-200 pb-2">
        <h2 className="text-3xl font-bold text-green-700">{recipe.title}</h2>
        {onSaveRecipe && (
          <button
            onClick={handleSaveRecipe}
            disabled={isSaved}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
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

      {/* Información básica */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <span className="block text-sm text-gray-500">
            Tiempo de preparación
          </span>
          <span className="font-medium">{recipe.prepTime}</span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-500">Dificultad</span>
          <span className="font-medium">{recipe.difficultyLevel}</span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-500">Tipo de cocina</span>
          <span className="font-medium">{recipe.cuisineType || "Variada"}</span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-500">Tipo de dieta</span>
          <span className="font-medium">{recipe.dietType || "Estándar"}</span>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            ></path>
          </svg>
          Ingredientes
        </h3>
        <ul className="list-none space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-5 h-5 bg-green-100 text-green-800 rounded-full text-xs flex items-center justify-center mr-2 mt-1">
                •
              </span>
              <span>
                <span className="font-medium">
                  {ingredient.quantity} {ingredient.unit}
                </span>{" "}
                {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instrucciones */}
      <div>
        <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            ></path>
          </svg>
          Instrucciones
        </h3>
        <ol className="list-decimal list-inside space-y-4 pl-4">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium text-gray-900 mr-2">
                Paso {index + 1}:
              </span>{" "}
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {/* Botones de acciones */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            ></path>
          </svg>
          Imprimir Receta
        </button>
      </div>
    </div>
  );
}
