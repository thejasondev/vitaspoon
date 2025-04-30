import React from "react";
import type { Recipe } from "../../../types/recipe";

interface RecipeInfoProps {
  recipe: Recipe;
}

const RecipeInfo: React.FC<RecipeInfoProps> = ({ recipe }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 recipe-info">
      <div className="text-center">
        <span className="block text-sm text-gray-500 print:font-bold">
          Tiempo
        </span>
        <span className="font-medium">{recipe.prepTime}</span>
      </div>
      <div className="text-center">
        <span className="block text-sm text-gray-500 print:font-bold">
          Dificultad
        </span>
        <span className="font-medium">{recipe.difficultyLevel}</span>
      </div>
      <div className="text-center">
        <span className="block text-sm text-gray-500 print:font-bold">
          Comida
        </span>
        <span className="font-medium">{recipe.cuisineType || "Variada"}</span>
      </div>
      <div className="text-center">
        <span className="block text-sm text-gray-500 print:font-bold">
          Dieta
        </span>
        <span className="font-medium">{recipe.dietType || "Estándar"}</span>
      </div>
    </div>
  );
};

export default RecipeInfo;
