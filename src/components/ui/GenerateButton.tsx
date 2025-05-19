import { useState } from "react";
import type { GenerateButtonProps } from "../../types/recipe";
import ButtonReact from "./ButtonReact";

export default function GenerateButton({
  onClick,
  isLoading,
}: GenerateButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative w-full">
      <ButtonReact
        onClick={onClick}
        disabled={isLoading}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        variant="primary"
        size="lg"
        fullWidth={true}
        className={`py-4 text-xl font-bold focus:ring-4 focus:ring-green-300 ${
          isLoading ? "opacity-80" : "hover:scale-105"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Generando receta...</span>
          </div>
        ) : (
          "¡A Cocinar!"
        )}
      </ButtonReact>

      {/* Tooltip VPN */}
      {showTooltip && !isLoading && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg px-3 py-2 shadow-md z-10 w-64 animate-fade-in">
          <div className="flex items-center mb-1">
            <svg
              className="w-4 h-4 text-teal-600 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="font-semibold">Consejo</span>
          </div>
          <p>
            Para mejores resultados en regiones con restricciones, utiliza una
            VPN.
          </p>
          {/* Flecha del tooltip */}
          <div className="absolute w-3 h-3 bg-teal-50 border-r border-b border-teal-200 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}
