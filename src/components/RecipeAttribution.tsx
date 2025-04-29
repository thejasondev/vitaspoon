import React from "react";
import { API_MESSAGES } from "../constants/apiConfig";

/**
 * Componente para mostrar la atribución requerida por los servicios de IA
 */
export default function RecipeAttribution() {
  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>Receta generada con inteligencia artificial - VitaSpoon</p>
    </div>
  );
}

export function LocalRecipeAttribution() {
  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>Receta generada localmente - VitaSpoon</p>
      <p className="mt-1">
        Modo sin conexión activo para regiones con restricciones
      </p>
    </div>
  );
}
