import React from "react";

interface RecipeInstructionsProps {
  instructions: string[];
  isPrintView?: boolean;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({
  instructions,
  isPrintView = false,
}) => {
  if (isPrintView) {
    return (
      <div className="print-instructions">
        <h3>Instrucciones</h3>
        <ol>
          {instructions.map((instruction, index) => (
            <li
              key={index}
              className={instruction.includes("Nota:") ? "note-item" : ""}
            >
              {instruction.includes("Nota:") ? (
                instruction
              ) : (
                <>
                  <span className="font-medium mr-1">{index + 1}.</span>{" "}
                  {instruction}
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="recipe-instructions">
      <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          ></path>
        </svg>
        Instrucciones
      </h3>
      <ol className="list-decimal list-inside space-y-4 pl-4">
        {instructions.map((instruction, index) => (
          <li
            key={index}
            className={`text-gray-700 ${
              instruction.includes("Nota:")
                ? "mt-6 font-medium text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 list-none"
                : ""
            }`}
          >
            {instruction.includes("Nota:") ? (
              <div className="flex">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{instruction}</span>
              </div>
            ) : (
              <>
                <span className="font-medium text-gray-900 mr-2">
                  Paso {index + 1}:
                </span>{" "}
                {instruction}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeInstructions;
