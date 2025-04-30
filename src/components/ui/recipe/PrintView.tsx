import React from "react";
import type { Recipe } from "../../../types/recipe";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import PrintFooter from "./PrintFooter";

interface PrintViewProps {
  recipe: Recipe;
}

const PrintView: React.FC<PrintViewProps> = ({ recipe }) => {
  return (
    <div className="hidden print:block print-content">
      <RecipeIngredients ingredients={recipe.ingredients} isPrintView={true} />
      <RecipeInstructions
        instructions={recipe.instructions}
        isPrintView={true}
      />
      <PrintFooter />
    </div>
  );
};

export default PrintView;
