/**
 * Opciones de alergias disponibles
 */
export const ALLERGY_OPTIONS = [
  "Lácteos",
  "Huevo",
  "Mariscos",
  "Frutos secos",
];

/**
 * Opciones de tipos de comida
 */
export const MEAL_TYPE_OPTIONS = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
  "Postre",
];

/**
 * Opciones de tipos de dieta
 */
export const DIET_TYPE_OPTIONS = [
  "Estándar",
  "Alto en proteínas",
  "Bajo en carbohidratos",
  "Bajo en grasas",
  "Bajo en calorías",
];

/**
 * Opciones de tiempo de preparación
 */
export const PREP_TIME_OPTIONS = [
  "< 15 minutos",
  "15-30 minutos",
  "30-60 minutos",
];

/**
 * Opciones de nivel de dificultad
 */
export const DIFFICULTY_OPTIONS = ["Fácil", "Intermedia", "Avanzada"];

/**
 * Opciones de disponibilidad de electricidad
 */
export const ELECTRICITY_OPTIONS = ["Con electricidad", "Sin electricidad"];

/**
 * Estilos personalizados para los menús desplegables
 */
export const CUSTOM_SELECT_STYLES = {
  dropdownMenu: `absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none`,
  option: `text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-50 focus:bg-green-100`,
  selectedOption: `bg-green-100 text-green-900`,
  optionText: `block truncate`,
};
