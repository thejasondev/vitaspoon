import { useState } from "react";
import type { RecipeFormProps, UserInput } from "../types/recipe";

// Datos predefinidos para los campos de selección
const allergyOptions = [
  "Cacahuetes",
  "Gluten",
  "Lácteos",
  "Huevo",
  "Mariscos",
  "Frutos secos",
  "Soya",
  "Trigo",
];

const dietaryPreferenceOptions = [
  "Vegetariano",
  "Vegano",
  "Paleo",
  "Keto",
  "Sin gluten",
  "Sin lácteos",
  "Bajo en carbohidratos",
  "Alto en proteínas",
];

const cuisineOptions = [
  "Mixta",
  "Italiana",
  "Mexicana",
  "Tailandesa",
  "India",
  "Mediterránea",
  "Japonesa",
  "China",
  "Americana",
  "Francesa",
  "Española",
];

const dietTypeOptions = [
  "Estándar",
  "Alto en proteínas",
  "Bajo en carbohidratos",
  "Bajo en grasas",
  "Bajo en calorías",
  "Bajo en sodio",
  "Alto en fibra",
];

const prepTimeOptions = [
  "Menos de 15 minutos",
  "15-30 minutos",
  "30-60 minutos",
  "Más de 60 minutos",
];

const difficultyOptions = ["Fácil", "Intermedia", "Avanzada"];

export default function RecipeForm({
  userInput,
  setUserInput,
}: RecipeFormProps) {
  const [ingredientInput, setIngredientInput] = useState("");

  // Función para manejar cambios en las alergias
  const handleAllergyChange = (allergy: string) => {
    const updatedAllergies = userInput.dietaryRestrictions.allergies.includes(
      allergy
    )
      ? userInput.dietaryRestrictions.allergies.filter((a) => a !== allergy)
      : [...userInput.dietaryRestrictions.allergies, allergy];

    setUserInput({
      ...userInput,
      dietaryRestrictions: {
        ...userInput.dietaryRestrictions,
        allergies: updatedAllergies,
      },
    });
  };

  // Función para manejar cambios en las preferencias dietéticas
  const handlePreferenceChange = (preference: string) => {
    const updatedPreferences =
      userInput.dietaryRestrictions.preferences.includes(preference)
        ? userInput.dietaryRestrictions.preferences.filter(
            (p) => p !== preference
          )
        : [...userInput.dietaryRestrictions.preferences, preference];

    setUserInput({
      ...userInput,
      dietaryRestrictions: {
        ...userInput.dietaryRestrictions,
        preferences: updatedPreferences,
      },
    });
  };

  // Función para manejar cambios en otros campos de texto
  const handleTextChange = (
    field: keyof UserInput["preferences"] | "otherRestrictions",
    value: string
  ) => {
    if (field === "otherRestrictions") {
      setUserInput({
        ...userInput,
        dietaryRestrictions: {
          ...userInput.dietaryRestrictions,
          otherRestrictions: value,
        },
      });
    } else {
      setUserInput({
        ...userInput,
        preferences: {
          ...userInput.preferences,
          [field]: value,
        },
      });
    }
  };

  // Función para añadir ingredientes
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setUserInput({
        ...userInput,
        availableIngredients: [
          ...userInput.availableIngredients,
          ingredientInput.trim(),
        ],
      });
      setIngredientInput("");
    }
  };

  // Función para eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setUserInput({
      ...userInput,
      availableIngredients: userInput.availableIngredients.filter(
        (i) => i !== ingredient
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Sección de Restricciones Dietéticas */}
      <section className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            ></path>
          </svg>
          Restricciones Dietéticas
        </h3>

        {/* Alergias */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-green-700 mb-2">Alergias</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {allergyOptions.map((allergy) => (
              <label
                key={allergy}
                className="flex items-center space-x-2 cursor-pointer hover:bg-green-100 p-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={userInput.dietaryRestrictions.allergies.includes(
                    allergy
                  )}
                  onChange={() => handleAllergyChange(allergy)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferencias Dietéticas */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-green-700 mb-2">
            Preferencias Dietéticas
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {dietaryPreferenceOptions.map((preference) => (
              <label
                key={preference}
                className="flex items-center space-x-2 cursor-pointer hover:bg-green-100 p-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={userInput.dietaryRestrictions.preferences.includes(
                    preference
                  )}
                  onChange={() => handlePreferenceChange(preference)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">{preference}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Otras restricciones */}
        <div>
          <h4 className="text-md font-medium text-green-700 mb-2">
            Otras restricciones o intolerancias
          </h4>
          <textarea
            value={userInput.dietaryRestrictions.otherRestrictions}
            onChange={(e) =>
              handleTextChange("otherRestrictions", e.target.value)
            }
            placeholder="Escribe aquí cualquier otra restricción o intolerancia que tengas..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            rows={2}
          ></textarea>
        </div>
      </section>

      {/* Sección de Preferencias */}
      <section className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          Preferencias Culinarias
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de cocina */}
          <div>
            <label
              htmlFor="cuisineType"
              className="block text-md font-medium text-green-700 mb-2"
            >
              Tipo de cocina
            </label>
            <select
              id="cuisineType"
              value={userInput.preferences.cuisineType}
              onChange={(e) => handleTextChange("cuisineType", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecciona un tipo de cocina</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de dieta */}
          <div>
            <label
              htmlFor="dietType"
              className="block text-md font-medium text-green-700 mb-2"
            >
              Tipo de dieta
            </label>
            <select
              id="dietType"
              value={userInput.preferences.dietType}
              onChange={(e) => handleTextChange("dietType", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecciona un tipo de dieta</option>
              {dietTypeOptions.map((diet) => (
                <option key={diet} value={diet}>
                  {diet}
                </option>
              ))}
            </select>
          </div>

          {/* Tiempo de preparación */}
          <div>
            <label
              htmlFor="prepTime"
              className="block text-md font-medium text-green-700 mb-2"
            >
              Tiempo de preparación
            </label>
            <select
              id="prepTime"
              value={userInput.preferences.prepTime}
              onChange={(e) => handleTextChange("prepTime", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecciona un tiempo</option>
              {prepTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Nivel de dificultad */}
          <div>
            <label
              htmlFor="difficultyLevel"
              className="block text-md font-medium text-green-700 mb-2"
            >
              Nivel de dificultad
            </label>
            <select
              id="difficultyLevel"
              value={userInput.preferences.difficultyLevel}
              onChange={(e) =>
                handleTextChange("difficultyLevel", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecciona una dificultad</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Sección de Ingredientes Disponibles */}
      <section className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
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
          Ingredientes Disponibles
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Agrega los ingredientes que tienes disponibles para incluirlos en tu
          receta.
        </p>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
            placeholder="Añade un ingrediente..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Añadir
          </button>
        </div>

        {/* Lista de ingredientes */}
        <div className="mt-4">
          {userInput.availableIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userInput.availableIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="bg-white flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-green-200"
                >
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient)}
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
            <div className="text-center py-4 text-gray-500 bg-white rounded-md border border-dashed border-gray-300">
              <p>No has añadido ningún ingrediente aún</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
