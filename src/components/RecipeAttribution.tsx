import React from "react";
import { API_MESSAGES } from "../constants/apiConfig";

/**
 * Componente para mostrar la atribución requerida por los servicios de IA
 */
const RecipeAttribution: React.FC = () => {
  return (
    <div className="text-xs text-gray-500 mt-4 text-center italic">
      <p>{API_MESSAGES.ATTRIBUTION}</p>
    </div>
  );
};

export default RecipeAttribution;
