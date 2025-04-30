import React from "react";
import type { Recipe } from "../../../types/recipe";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import PrintButton from "./PrintButton";
import RecipeAttribution from "../../RecipeAttribution";

interface ScreenViewProps {
  recipe: Recipe;
  isLocalRecipe: boolean;
  onPrint: () => void;
}

const ScreenView: React.FC<ScreenViewProps> = ({
  recipe,
  isLocalRecipe,
  onPrint,
}) => {
  return (
    <>
      <div className="block print:hidden">
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeInstructions instructions={recipe.instructions} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center print:hidden">
        <PrintButton onClick={onPrint} />
      </div>

      {/* Atribución - Solo visible en pantalla */}
      {isLocalRecipe ? (
        <div className="mt-6 text-center text-xs text-gray-500 print:hidden">
          <p>Receta generada localmente.</p>
          <p>
            Para una receta más completa ACTIVA la VPN y utiliza el servicio de
            IA de VitaSpoon.
          </p>
        </div>
      ) : (
        <div className="print:hidden">
          <RecipeAttribution />
        </div>
      )}
    </>
  );
};

export default ScreenView;
