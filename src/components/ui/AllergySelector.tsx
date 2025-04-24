import { ALLERGY_OPTIONS } from "../../constants/formOptions";

interface AllergySelectorProps {
  selectedAllergies: string[];
  onChange: (allergies: string[]) => void;
}

/**
 * Componente para seleccionar alergias
 */
export default function AllergySelector({
  selectedAllergies,
  onChange,
}: AllergySelectorProps) {
  // Función para manejar cambios en las alergias
  const handleToggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      onChange(selectedAllergies.filter((item) => item !== allergy));
    } else {
      onChange([...selectedAllergies, allergy]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-green-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Alergias e intolerancias
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
        {ALLERGY_OPTIONS.map((allergy) => (
          <div
            key={allergy}
            className={`relative p-3 rounded-lg border cursor-pointer hover:bg-green-50 transition-colors ${
              selectedAllergies.includes(allergy)
                ? "bg-green-50 border-green-500"
                : "border-gray-200"
            }`}
            onClick={() => handleToggleAllergy(allergy)}
          >
            <input
              type="checkbox"
              className="absolute top-3 right-3 h-4 w-4 accent-green-600"
              checked={selectedAllergies.includes(allergy)}
              onChange={() => {}} // Controlado por el onClick del div
              aria-label={`Alergia a ${allergy}`}
            />
            <span
              className={`text-gray-700 ${
                selectedAllergies.includes(allergy) ? "font-medium" : ""
              } block w-full pr-6 truncate`}
            >
              {allergy}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
