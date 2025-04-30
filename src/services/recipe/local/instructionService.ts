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
 * Instrucciones específicas para cocina sin electricidad usando parrilla de carbón
 */
const GRILL_INSTRUCTIONS: Record<string, string[]> = {
  General: [
    "Prepara la parrilla de carbón: coloca los carbones en una pirámide y enciéndelos.",
    "Espera hasta que los carbones estén cubiertos de ceniza blanca (aproximadamente 20-30 minutos).",
    "Distribuye los carbones de manera uniforme para tener zonas de calor directo e indirecto.",
    "Coloca la rejilla y limpiala con un cepillo de alambre.",
    "Deja que la rejilla se caliente durante 5 minutos antes de cocinar.",
  ],
  Proteína: [
    "Sazona la proteína con sal, pimienta y especias al gusto.",
    "Coloca la carne sobre la zona de calor directo para sellarla (2-3 minutos por lado).",
    "Mueve la carne a la zona de calor indirecto para terminar la cocción sin quemarla.",
    "Usa un termómetro para comprobar la cocción si es posible.",
    "Deja reposar la carne 5-10 minutos antes de cortarla.",
  ],
  Vegetales: [
    "Corta los vegetales en trozos grandes para evitar que se caigan entre la rejilla.",
    "Pincela los vegetales con aceite y sazona con sal y pimienta.",
    "Coloca los vegetales sobre la parrilla caliente.",
    "Cocina hasta que estén tiernos pero aún crujientes.",
    "Voltea ocasionalmente para que se cocinen de manera uniforme.",
  ],
  Pescado: [
    "Asegúrate de que la parrilla esté bien limpia y caliente.",
    "Pincela el pescado con aceite para evitar que se pegue.",
    "Coloca el pescado con la piel hacia abajo primero (si tiene).",
    "Cocina el pescado 4-5 minutos por lado, dependiendo del grosor.",
    "El pescado está listo cuando se desmenuce fácilmente con un tenedor.",
  ],
  Pollo: [
    "Marina el pollo por al menos 30 minutos antes de cocinarlo (opcional).",
    "Cocina piezas grandes como muslos o pechugas en calor indirecto (15-20 minutos).",
    "Para piezas pequeñas, usa calor directo pero vigila constantemente.",
    "Voltea cada 5-7 minutos para evitar que se queme.",
    "Comprueba que esté completamente cocido antes de servir (74°C internamente).",
  ],
  Arroz: [
    "Necesitarás papel de aluminio resistente para cocinar arroz en la parrilla.",
    "Lava el arroz hasta que el agua salga clara.",
    "Coloca el arroz en el centro de un trozo grande de papel aluminio.",
    "Añade agua (proporción 1:2 arroz-agua), sal y especias.",
    "Cierra el papel aluminio formando un paquete sellado.",
    "Coloca sobre la parrilla en calor indirecto y cocina 20-25 minutos.",
    "Deja reposar 5 minutos antes de abrir.",
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
    // Instrucciones para parrilla de carbón
    if (cuisineType === "Almuerzo" || cuisineType === "Cena") {
      const grillInstructions = [
        ...GRILL_INSTRUCTIONS.General,
        "Ahora prepararemos los ingredientes para la parrilla:",
      ];

      // Añadir instrucciones específicas según tipo de dieta
      if (dietType === "Vegetariana" || dietType === "Vegana") {
        grillInstructions.push(...GRILL_INSTRUCTIONS.Vegetales);
      } else {
        grillInstructions.push(
          "Para la proteína principal:",
          ...GRILL_INSTRUCTIONS.Proteína
        );
        grillInstructions.push(
          "Para los vegetales de acompañamiento:",
          ...GRILL_INSTRUCTIONS.Vegetales
        );
      }

      grillInstructions.push(
        "Sirve caliente directamente de la parrilla.",
        "Nota: Ajusta los tiempos según el tipo y tamaño de los alimentos."
      );

      return grillInstructions;
    }

    // Mantener las instrucciones existentes para otros tipos de comida
    if (cuisineType === "Desayuno") {
      return [
        "Corta el aguacate por la mitad y extrae la pulpa en un bol.",
        "Machaca con un tenedor hasta obtener una consistencia suave.",
        "Añade sal, pimienta y jugo de limón al gusto.",
        "Unta sobre las rebanadas de pan.",
        "Si tienes parrilla de carbón, puedes tostar el pan brevemente sobre ella.",
        "Agrega tus toppings favoritos por encima.",
      ];
    } else if (cuisineType === "Merienda") {
      return [
        "Lava y corta las frutas en trozos pequeños.",
        "Combina todas las frutas en un bol.",
        "Añade cereales, frutos secos o semillas si los tienes disponibles.",
        "Opcional: añade un poco de miel o algún edulcorante natural.",
        "Si tienes parrilla encendida, puedes asar algunas frutas como manzanas o plátanos para darles un sabor ahumado.",
        "Mezcla bien y sirve fresco.",
      ];
    } else if (cuisineType === "Postre") {
      return [
        "Pela y corta las frutas en trozos medianos.",
        "Si usas parrilla de carbón, envuelve las frutas en papel aluminio con un poco de azúcar y canela.",
        "Coloca el paquete en la parrilla con calor indirecto por 10-15 minutos.",
        "Alternativamente, puedes asar frutas como plátanos o manzanas directamente sobre la parrilla.",
        "Sirve caliente, opcionalmente con un poco de miel por encima.",
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
export const getRiceWithProteinInstructions = (
  electricityType?: string
): string[] => {
  if (electricityType === "Sin electricidad") {
    return [
      ...GRILL_INSTRUCTIONS.General,
      ...GRILL_INSTRUCTIONS.Arroz,
      "Mientras el arroz se cocina, prepara la proteína:",
      ...GRILL_INSTRUCTIONS.Proteína,
      "Sirve el arroz con la proteína cocinada por encima.",
    ];
  }

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
export const getRiceWithVegetablesInstructions = (
  electricityType?: string
): string[] => {
  if (electricityType === "Sin electricidad") {
    return [
      ...GRILL_INSTRUCTIONS.General,
      ...GRILL_INSTRUCTIONS.Arroz,
      "Mientras el arroz se cocina, prepara los vegetales:",
      ...GRILL_INSTRUCTIONS.Vegetales,
      "Sirve el arroz con los vegetales asados por encima.",
    ];
  }

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
export const getPlainRiceInstructions = (
  electricityType?: string
): string[] => {
  if (electricityType === "Sin electricidad") {
    return [
      ...GRILL_INSTRUCTIONS.General,
      ...GRILL_INSTRUCTIONS.Arroz,
      "Sirve el arroz caliente con tus acompañamientos favoritos.",
    ];
  }

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
export const getProteinInstructions = (electricityType?: string): string[] => {
  if (electricityType === "Sin electricidad") {
    return [
      ...GRILL_INSTRUCTIONS.General,
      ...GRILL_INSTRUCTIONS.Proteína,
      "Para acompañar, también puedes asar vegetales en la parrilla:",
      ...GRILL_INSTRUCTIONS.Vegetales.slice(0, 3),
      "Sirve la proteína con los vegetales asados como guarnición.",
    ];
  }

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
