import { useState } from "react";

interface IngredientManagerProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

/**
 * Componente para manejar ingredientes
 */
export default function IngredientManager({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientManagerProps) {
  const [ingredientInput, setIngredientInput] = useState("");

  // Manejar la adición de un ingrediente
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      onAddIngredient(ingredientInput.trim());
      setIngredientInput("");
    }
  };

  // Manejar la tecla Enter para agregar ingredientes
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-green-100">
      {/* Input para añadir ingredientes */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Añade un ingrediente..."
          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 shadow-sm"
        />
        <button
          type="button"
          onClick={handleAddIngredient}
          className="bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 transition-colors shadow-sm font-medium"
        >
          Añadir
        </button>
      </div>

      {/* Lista de ingredientes */}
      <div className="mt-4">
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-white flex items-center gap-2 px-3 py-2 rounded-full text-sm border-2 border-green-200 shadow-sm"
              >
                <span className="font-medium">{ingredient}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(ingredient)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Eliminar ingrediente ${ingredient}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p>No has añadido ningún ingrediente aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
