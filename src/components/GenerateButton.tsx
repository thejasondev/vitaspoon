import type { GenerateButtonProps } from "../types/recipe";

export default function GenerateButton({
  onClick,
  isLoading,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full py-4 px-6 rounded-lg text-xl font-bold text-white 
        transition-all duration-300 transform hover:scale-105 
        focus:outline-none focus:ring-4 focus:ring-green-300
        ${
          isLoading
            ? "bg-green-400 cursor-wait"
            : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
        }
      `}
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
    </button>
  );
}
