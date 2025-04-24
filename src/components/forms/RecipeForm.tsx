import { useState } from "react";
import type { RecipeFormProps, UserInput } from "../../types/recipe";
import {
  AllergySelector,
  CustomSelect,
  ElectricityOptions,
  IngredientManager,
} from "../ui";

// Importar opciones desde constants
import {
  ALLERGY_OPTIONS,
  MEAL_TYPE_OPTIONS,
  DIET_TYPE_OPTIONS,
  PREP_TIME_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../../constants/formOptions";

export default function RecipeForm({
  userInput,
  setUserInput,
}: RecipeFormProps) {
  // Función para manejar cambios en las alergias
  const handleAllergyChange = (allergies: string[]) => {
    setUserInput({
      ...userInput,
      dietaryRestrictions: {
        ...userInput.dietaryRestrictions,
        allergies,
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
  const handleAddIngredient = (ingredient: string) => {
    setUserInput({
      ...userInput,
      availableIngredients: [...userInput.availableIngredients, ingredient],
    });
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
      {/* Sección de Preferencias Culinarias */}
      <section className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          Tipo de Comida y Tiempo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sin/Con Electricidad */}
          <ElectricityOptions
            value={userInput.preferences.electricityType}
            onChange={(value) => handleTextChange("electricityType", value)}
          />

          {/* Tipo de comida */}
          <div className="bg-white p-4 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <CustomSelect
              id="cuisineType"
              options={MEAL_TYPE_OPTIONS}
              value={userInput.preferences.cuisineType}
              placeholder="Selecciona un tipo de comida"
              onChange={(value) => handleTextChange("cuisineType", value)}
              icon={
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              }
              label="Tipo de comida"
            />
          </div>

          {/* Tipo de dieta */}
          <div className="bg-white p-4 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <CustomSelect
              id="dietType"
              options={DIET_TYPE_OPTIONS}
              value={userInput.preferences.dietType}
              placeholder="Selecciona un tipo de dieta"
              onChange={(value) => handleTextChange("dietType", value)}
              icon={
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Tipo de dieta"
            />
          </div>

          {/* Tiempo de preparación */}
          <div className="bg-white p-4 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <CustomSelect
              id="prepTime"
              options={PREP_TIME_OPTIONS}
              value={userInput.preferences.prepTime}
              placeholder="Selecciona un tiempo"
              onChange={(value) => handleTextChange("prepTime", value)}
              icon={
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              }
              label="Tiempo de preparación"
            />
          </div>

          {/* Nivel de dificultad */}
          <div className="bg-white p-4 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <CustomSelect
              id="difficultyLevel"
              options={DIFFICULTY_OPTIONS}
              value={userInput.preferences.difficultyLevel}
              placeholder="Selecciona una dificultad"
              onChange={(value) => handleTextChange("difficultyLevel", value)}
              icon={
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                </svg>
              }
              label="Nivel de dificultad"
            />
          </div>
        </div>
      </section>

      {/* Sección de Restricciones Dietéticas */}
      <section className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
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
        <AllergySelector
          selectedAllergies={userInput.dietaryRestrictions.allergies}
          onChange={handleAllergyChange}
        />

        {/* Otras restricciones */}
        <div className="bg-white p-4 rounded-lg border border-green-100 mt-6">
          <h4 className="text-md font-medium text-green-700 mb-2">
            Otras restricciones o intolerancias
          </h4>
          <textarea
            value={userInput.dietaryRestrictions.otherRestrictions}
            onChange={(e) =>
              handleTextChange("otherRestrictions", e.target.value)
            }
            placeholder="Escribe aquí cualquier otra restricción o intolerancia que tengas..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 shadow-sm"
            rows={2}
          ></textarea>
        </div>
      </section>

      {/* Sección de Ingredientes Disponibles */}
      <section className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
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

        <IngredientManager
          ingredients={userInput.availableIngredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
        />
      </section>
    </div>
  );
}
