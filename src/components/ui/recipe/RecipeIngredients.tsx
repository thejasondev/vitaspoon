import React from "react";
import type { Ingredient } from "../../../types/recipe";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  isPrintView?: boolean;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
  isPrintView = false,
}) => {
  if (isPrintView) {
    return (
      <div className="print-ingredients">
        <h3>Ingredientes</h3>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <span className="font-medium">
                {ingredient.quantity} {ingredient.unit}
              </span>{" "}
              {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mb-8 recipe-ingredients">
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
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start">
            <span className="w-5 h-5 bg-green-100 text-green-800 rounded-full text-xs flex items-center justify-center mr-2 mt-1">
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
  );
};

export default RecipeIngredients;
