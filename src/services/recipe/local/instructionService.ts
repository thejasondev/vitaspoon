import { DEFAULT_VALUES } from "./types";

/**
 * Mapeo de tipos de cocina a sus instrucciones predeterminadas
 */
const CUISINE_TYPE_INSTRUCTIONS: Record<string, string[]> = {
  Desayuno: [
    "Tuesta el pan hasta que esté dorado.",
    "Machaca el aguacate en un tazón y agrega sal, pimienta y jugo de limón.",
    "Extiende el aguacate sobre las tostadas.",
    "En una sartén, fríe los huevos al gusto.",
    "Coloca los huevos sobre las tostadas de aguacate.",
    "Agrega más sal y pimienta al gusto.",
  ],
  Almuerzo: [
    "Enjuaga y escurre los garbanzos.",
    "Corta los tomates cherry por la mitad.",
    "Pela y corta el pepino en cubos pequeños.",
    "Pica finamente la cebolla roja.",
    "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
    "Desmenuza el queso feta por encima.",
    "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
    "Vierte el aderezo sobre la ensalada y mezcla bien.",
    "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
  ],
  Merienda: [
    "Pela el plátano y córtalo en trozos.",
    "Lava y quita el tallo de las fresas.",
    "Coloca todos los ingredientes en una licuadora.",
    "Licúa hasta obtener una mezcla suave.",
    "Sirve inmediatamente.",
  ],
  Cena: [
    "Cuece la pasta según las instrucciones del paquete.",
    "Corta la pechuga de pollo en cubos y sazona con sal y pimienta.",
    "En una sartén, calienta el aceite y cocina el pollo hasta que esté dorado.",
    "Corta los tomates cherry por la mitad.",
    "Escurre la pasta y mezcla con la salsa pesto.",
    "Agrega el pollo y los tomates a la pasta.",
    "Sirve caliente con queso parmesano rallado por encima.",
  ],
  Postre: [
    "Precalienta el horno a 180°C.",
    "Pela y corta las manzanas en rodajas finas.",
    "Mezcla las manzanas con el azúcar, la canela y el zumo de medio limón.",
    "Extiende la masa quebrada en un molde para tarta.",
    "Coloca las manzanas sobre la masa.",
    "Añade pequeños trozos de mantequilla sobre las manzanas.",
    "Hornea durante 40-45 minutos hasta que la masa esté dorada.",
    "Deja enfriar antes de servir.",
  ],
  Snack: [
    "Escurre y enjuaga los garbanzos.",
    "En un procesador de alimentos, mezcla los garbanzos, tahini, ajo picado y el jugo de limón.",
    "Mientras procesas, añade el aceite de oliva gradualmente hasta conseguir una textura suave.",
    "Sazona con sal y pimienta al gusto.",
    "Sirve en un bol, haz un hueco en el centro y añade un poco de aceite de oliva y pimentón.",
    "Lava y corta las verduras en bastones para acompañar.",
  ],
};

/**
 * Obtiene las instrucciones predeterminadas para un tipo de cocina y las adapta según las preferencias
 */
export const getInstructionsForRecipe = (
  cuisineType: string,
  dietType?: string,
  electricityType?: string
): string[] => {
  // Instrucciones base según tipo de comida
  let instructions = [
    ...(CUISINE_TYPE_INSTRUCTIONS[cuisineType] ||
      CUISINE_TYPE_INSTRUCTIONS["Almuerzo"] ||
      []),
  ];

  // Adaptar instrucciones para recetas sin electricidad
  if (electricityType === "Sin electricidad") {
    if (cuisineType === "Desayuno") {
      return [
        "Corta el aguacate por la mitad y extrae la pulpa en un bol.",
        "Machaca con un tenedor hasta obtener una consistencia suave.",
        "Añade sal, pimienta y jugo de limón al gusto.",
        "Unta sobre las rebanadas de pan.",
        "Agrega tus toppings favoritos por encima.",
      ];
    } else if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      return [
        "Lava y corta todos los vegetales en trozos pequeños.",
        "Combina los vegetales en un bol grande.",
        "Añade la proteína que hayas elegido (conservas, legumbres, etc).",
        "Prepara un aliño con aceite, limón, sal y especias.",
        "Vierte el aliño sobre la ensalada y mezcla bien.",
        "Refrigera por 15-30 minutos antes de servir para mejor sabor.",
      ];
    } else if (cuisineType === "Merienda") {
      return [
        "Lava y corta las frutas en trozos pequeños.",
        "Combina todas las frutas en un bol.",
        "Añade cereales, frutos secos o semillas si los tienes disponibles.",
        "Opcional: añade un poco de miel o algún edulcorante natural.",
        "Mezcla bien y sirve fresco.",
      ];
    } else if (cuisineType === "Postre") {
      return [
        "Pela y corta las frutas en trozos pequeños.",
        "Colócalas en un recipiente y añade un poco de azúcar o miel.",
        "Añade especias como canela, clavo o vainilla si las tienes.",
        "Mezcla bien y deja reposar al menos 30 minutos.",
        "Sirve frío, opcionalmente con un poco de yogur o crema.",
      ];
    }
  }

  // Instrucciones específicas para dietas vegetarianas/veganas
  if (
    (cuisineType === "Almuerzo" || cuisineType === "Cena") &&
    (dietType === "Vegetariana" || dietType === "Vegana")
  ) {
    return [
      "Lava y corta todos los vegetales en trozos regulares.",
      "Calienta aceite en una sartén grande a fuego medio-alto.",
      "Saltea los vegetales comenzando por los más duros (zanahorias, etc).",
      "Añade los vegetales más blandos (pimientos, etc) y cocina 3-4 minutos más.",
      "Añade las especias, sal y pimienta al gusto.",
      dietType === "Vegana"
        ? "Si tienes tofu, córtalo en cubos y añádelo al final."
        : "Añade queso si lo deseas.",
      "Sirve caliente, opcionalmente sobre arroz o con pan.",
    ];
  }

  // Añadir notas específicas para tipos de dieta
  if (dietType) {
    const dietNotes: Record<string, string> = {
      "Bajo en carbohidratos":
        "Recuerda que esta receta es baja en carbohidratos. Evita añadir pan, arroz, pasta o azúcares refinados.",
      "Alto en proteínas":
        "Para aumentar el contenido proteico, puedes añadir más huevos, carnes magras, pescado o legumbres a la receta.",
      "Bajo en grasas":
        "Esta receta es baja en grasas. Si utilizas aceite, hazlo con moderación o usa spray antiadherente.",
    };

    if (dietType in dietNotes) {
      instructions.push(dietNotes[dietType as keyof typeof dietNotes]);
    }
  }

  // Añadir nota sobre electricidad si es relevante
  if (electricityType === "Sin electricidad") {
    instructions.push(
      "Esta receta ha sido diseñada para prepararse sin necesidad de utilizar electrodomésticos o cocina eléctrica."
    );
  }

  return instructions;
};

/**
 * Genera instrucciones para recetas con arroz y proteínas
 */
export const getRiceWithProteinInstructions = (): string[] => {
  return [
    "Lava el arroz hasta que el agua salga clara.",
    "Corta la carne en trozos pequeños.",
    "En una olla, calienta el aceite a fuego medio-alto.",
    "Sofríe la carne hasta que esté dorada.",
    "Añade los condimentos y mezcla bien.",
    "Agrega el arroz y remueve para que se impregne de los sabores.",
    "Vierte agua caliente (2 partes de agua por cada parte de arroz).",
    "Lleva a ebullición, luego reduce el fuego y tapa la olla.",
    "Cocina a fuego lento por 15-20 minutos hasta que el arroz esté tierno.",
    "Deja reposar 5 minutos antes de servir.",
  ];
};

/**
 * Genera instrucciones para recetas con arroz y vegetales
 */
export const getRiceWithVegetablesInstructions = (): string[] => {
  return [
    "Lava el arroz hasta que el agua salga clara.",
    "Corta los vegetales en trozos pequeños.",
    "En una olla, calienta el aceite a fuego medio.",
    "Sofríe los vegetales hasta que estén tiernos.",
    "Añade los condimentos y mezcla bien.",
    "Agrega el arroz y remueve para que se impregne de los sabores.",
    "Vierte agua caliente (2 partes de agua por cada parte de arroz).",
    "Lleva a ebullición, luego reduce el fuego y tapa la olla.",
    "Cocina a fuego lento por 15-20 minutos hasta que el arroz esté tierno.",
    "Deja reposar 5 minutos antes de servir.",
  ];
};

/**
 * Genera instrucciones para recetas basadas solo en arroz
 */
export const getPlainRiceInstructions = (): string[] => {
  return [
    "Lava el arroz hasta que el agua salga clara.",
    "En una olla, calienta el aceite a fuego medio.",
    "Añade los condimentos y sofríe brevemente.",
    "Agrega el arroz y remueve para que se impregne de los sabores.",
    "Vierte agua caliente (2 partes de agua por cada parte de arroz).",
    "Lleva a ebullición, luego reduce el fuego y tapa la olla.",
    "Cocina a fuego lento por 15-20 minutos hasta que el arroz esté tierno.",
    "Deja reposar 5 minutos antes de servir.",
  ];
};

/**
 * Genera instrucciones para recetas basadas en proteínas
 */
export const getProteinInstructions = (): string[] => {
  return [
    "Corta la carne en trozos del tamaño deseado.",
    "Sazona la carne con sal, pimienta y tus especias preferidas.",
    "En una sartén, calienta el aceite a fuego medio-alto.",
    "Cocina la carne hasta que esté dorada por todos lados.",
    "Si tienes vegetales, añádelos ahora y cocina hasta que estén tiernos.",
    "Ajusta la sazón según tu gusto.",
    "Sirve caliente, acompañado de tu guarnición preferida.",
  ];
};

/**
 * Mapeo de títulos predeterminados por tipo de cocina
 */
export const DEFAULT_TITLES: Record<string, string> = {
  Desayuno: "Tostadas de Aguacate con Huevo",
  Almuerzo: "Ensalada Mediterránea con Garbanzos",
  Merienda: "Batido Energético de Frutas",
  Cena: "Pasta al Pesto con Pollo",
  Postre: "Tarta de Manzana Fácil",
  Snack: "Hummus Casero con Crudités",
};

/**
 * Obtiene el título predeterminado para un tipo de cocina
 */
export const getRecipeTitleForCuisineType = (cuisineType: string): string => {
  return DEFAULT_TITLES[cuisineType] || DEFAULT_TITLES["Almuerzo"];
};
