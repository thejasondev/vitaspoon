import { ELECTRICITY_OPTIONS } from "../../constants/formOptions";

interface ElectricityOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Componente para seleccionar la disponibilidad de electricidad
 */
export default function ElectricityOptions({
  value,
  onChange,
}: ElectricityOptionsProps) {
  return (
    <div className="col-span-1 md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-28 h-28 -mt-10 -mr-10 bg-yellow-100 rounded-full opacity-50"></div>
      <div className="absolute top-0 right-0 w-16 h-16 -mt-5 -mr-5 bg-yellow-200 rounded-full opacity-50"></div>

      {/* Título de la sección */}
      <label
        htmlFor="electricityType"
        className="lg:block text-md font-medium text-yellow-800 mb-3 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2 text-yellow-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="relative z-10">Disponibilidad de Electricidad</span>
        <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
          Importante para Cuba
        </span>
      </label>

      {/* Opciones como botones de radio estilizados */}
      <div className="grid grid-cols-2 gap-3 mt-2 z-10 relative">
        {ELECTRICITY_OPTIONS.map((option) => (
          <label
            key={option}
            className={`
              flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all
              ${
                value === option
                  ? "bg-yellow-200 border-2 border-yellow-400 shadow-md"
                  : "bg-white border border-yellow-200 hover:bg-yellow-50"
              }
            `}
          >
            <input
              type="radio"
              name="electricityType"
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only" // Ocultar el input real
            />
            <div className="flex flex-col items-center space-y-2">
              {option === "Sin electricidad" && (
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
              {option === "Con electricidad" && (
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
              <span className="font-medium text-sm text-center">{option}</span>
            </div>
          </label>
        ))}
      </div>

      {/* Descripción explicativa */}
      <p className="mt-3 text-sm text-yellow-700 italic relative z-10">
        Indica si necesitas recetas que puedan prepararse sin electricidad
        durante apagones.
      </p>
    </div>
  );
}
