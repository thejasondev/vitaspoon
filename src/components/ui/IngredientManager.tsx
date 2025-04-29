import { useState, useEffect, useRef } from "react";

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
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detectar si es un dispositivo móvil basado en el ancho de la pantalla
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Verificar al cargar y cuando cambie el tamaño de la ventana
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Manejar la adición de un ingrediente
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      onAddIngredient(ingredientInput.trim());
      setIngredientInput("");
      // Enfocar el input después de añadir
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
      <div
        className={`flex ${isMobile ? "flex-col" : "flex-row space-x-2"} mb-4`}
      >
        <div className={`relative flex-1 ${isMobile ? "mb-2" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Añade un ingrediente..."
            className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          />
          {isMobile && ingredientInput.trim() && (
            <button
              type="button"
              onClick={handleAddIngredient}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 transition-all shadow-sm"
              aria-label="Añadir ingrediente"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          )}
        </div>
        {!isMobile ? (
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 transition-colors shadow-sm font-medium flex-shrink-0"
          >
            Añadir
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddIngredient}
            className={`bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md font-medium flex items-center justify-center ${
              !ingredientInput.trim() ? "" : "hidden"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Añadir ingrediente
          </button>
        )}
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
