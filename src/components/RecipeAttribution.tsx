import React from "react";
import { API_MESSAGES } from "../constants/apiConfig";

/**
 * Componente para mostrar la atribución requerida por los servicios de IA
 */
export default function RecipeAttribution() {
  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>Receta generada con la IA de VitaSpoon</p>
    </div>
  );
}

export function LocalRecipeAttribution() {
  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>Receta generada localmente.</p>
      <p>
        Para una receta más completa ACTIVA la VPN y utiliza el servicio de IA
        de VitaSpoon.
      </p>
      <p className="mt-1">
        Modo sin conexión activo para regiones con restricciones.
      </p>
    </div>
  );
}
