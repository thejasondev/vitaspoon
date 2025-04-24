import { useState, useEffect } from "react";
import { CUSTOM_SELECT_STYLES } from "../../constants/formOptions";

interface CustomSelectProps {
  id: string;
  options: string[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  label: string;
}

/**
 * Componente de selector personalizado reusable
 */
export default function CustomSelect({
  id,
  options,
  value,
  placeholder,
  onChange,
  icon,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Cerrar el selector cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as Element).closest(`.select-container-${id}`)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, id]);

  // Alternar apertura/cierre del selector
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Manejar la selección de una opción
  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative select-container-${id}`}>
      <label
        htmlFor={id}
        className="block text-md font-medium text-green-700 mb-2 items-center"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      <button
        type="button"
        id={id}
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-3 pl-4 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-gray-800 transition-all duration-300 hover:border-green-300 outline-none"
      >
        <span className={value ? "text-gray-800" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-green-600 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className={CUSTOM_SELECT_STYLES.dropdownMenu}>
          {options.map((option) => (
            <div
              key={option}
              className={`${CUSTOM_SELECT_STYLES.option} ${
                value === option ? CUSTOM_SELECT_STYLES.selectedOption : ""
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <span className={CUSTOM_SELECT_STYLES.optionText}>{option}</span>
              {value === option && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
