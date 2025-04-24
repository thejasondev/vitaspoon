/**
 * Obtiene los ingredientes de una receta basada en el tipo de comida seleccionado
 */
export const getIngredientsForCuisineType = (
  cuisineType: string
): { name: string; quantity: string; unit: string }[] => {
  switch (cuisineType) {
    case "Desayuno":
      return [
        { name: "pan integral", quantity: "2", unit: "rebanadas" },
        { name: "aguacate", quantity: "1", unit: "unidad" },
        { name: "huevos", quantity: "2", unit: "unidades" },
        { name: "sal", quantity: "1", unit: "pizca" },
        { name: "pimienta", quantity: "1", unit: "pizca" },
        { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
        { name: "jugo de limón", quantity: "1", unit: "cucharadita" },
      ];
    case "Almuerzo":
      return [
        { name: "garbanzos cocidos", quantity: "1", unit: "taza" },
        { name: "tomates cherry", quantity: "1", unit: "taza" },
        { name: "pepino", quantity: "1/2", unit: "unidad" },
        { name: "cebolla roja", quantity: "1/4", unit: "unidad" },
        { name: "aceitunas negras", quantity: "1/4", unit: "taza" },
        { name: "queso feta", quantity: "50", unit: "g" },
        { name: "aceite de oliva", quantity: "2", unit: "cucharadas" },
        { name: "limón", quantity: "1/2", unit: "unidad" },
        { name: "orégano", quantity: "1", unit: "cucharadita" },
      ];
    case "Merienda":
      return [
        { name: "plátano", quantity: "1", unit: "unidad" },
        { name: "fresas", quantity: "1", unit: "taza" },
        { name: "yogur natural", quantity: "1/2", unit: "taza" },
        { name: "miel", quantity: "1", unit: "cucharada" },
        { name: "avena", quantity: "2", unit: "cucharadas" },
        { name: "leche de almendras", quantity: "1", unit: "taza" },
      ];
    case "Cena":
      return [
        { name: "pasta", quantity: "200", unit: "g" },
        { name: "pechuga de pollo", quantity: "1", unit: "unidad" },
        { name: "salsa pesto", quantity: "3", unit: "cucharadas" },
        { name: "tomates cherry", quantity: "1", unit: "taza" },
        { name: "queso parmesano", quantity: "2", unit: "cucharadas" },
        { name: "aceite de oliva", quantity: "1", unit: "cucharada" },
        { name: "sal y pimienta", quantity: "", unit: "al gusto" },
      ];
    case "Postre":
      return [
        { name: "manzanas", quantity: "4", unit: "unidades" },
        { name: "masa quebrada", quantity: "1", unit: "lámina" },
        { name: "azúcar", quantity: "1/2", unit: "taza" },
        { name: "canela", quantity: "1", unit: "cucharadita" },
        { name: "mantequilla", quantity: "2", unit: "cucharadas" },
        { name: "limón", quantity: "1/2", unit: "unidad" },
      ];
    case "Snack":
      return [
        { name: "garbanzos cocidos", quantity: "1", unit: "lata" },
        { name: "tahini", quantity: "2", unit: "cucharadas" },
        { name: "ajo", quantity: "1", unit: "diente" },
        { name: "limón", quantity: "1", unit: "unidad" },
        { name: "aceite de oliva", quantity: "3", unit: "cucharadas" },
        { name: "pimentón", quantity: "1/2", unit: "cucharadita" },
        { name: "zanahorias", quantity: "2", unit: "unidades" },
        { name: "apio", quantity: "2", unit: "tallos" },
        { name: "pepino", quantity: "1", unit: "unidad" },
      ];
    default:
      // Receta predeterminada
      return [
        { name: "garbanzos cocidos", quantity: "1", unit: "taza" },
        { name: "tomates cherry", quantity: "1", unit: "taza" },
        { name: "pepino", quantity: "1/2", unit: "unidad" },
        { name: "cebolla roja", quantity: "1/4", unit: "unidad" },
        { name: "aceitunas negras", quantity: "1/4", unit: "taza" },
        { name: "queso feta", quantity: "50", unit: "g" },
        { name: "aceite de oliva", quantity: "2", unit: "cucharadas" },
        { name: "limón", quantity: "1/2", unit: "unidad" },
        { name: "orégano", quantity: "1", unit: "cucharadita" },
      ];
  }
};

/**
 * Obtiene las instrucciones de una receta basada en el tipo de comida seleccionado
 */
export const getInstructionsForCuisineType = (
  cuisineType: string
): string[] => {
  switch (cuisineType) {
    case "Desayuno":
      return [
        "Tuesta el pan hasta que esté dorado.",
        "Machaca el aguacate en un tazón y agrega sal, pimienta y jugo de limón.",
        "Extiende el aguacate sobre las tostadas.",
        "En una sartén, fríe los huevos al gusto.",
        "Coloca los huevos sobre las tostadas de aguacate.",
        "Agrega más sal y pimienta al gusto.",
      ];
    case "Almuerzo":
      return [
        "Enjuaga y escurre los garbanzos.",
        "Corta los tomates cherry por la mitad.",
        "Pela y corta el pepino en cubos pequeños.",
        "Pica finamente la cebolla roja.",
        "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
        "Desmenuza el queso feta por encima.",
        "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
        "Vierte el aderezo sobre la ensalada y mezcla bien.",
        "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
      ];
    case "Merienda":
      return [
        "Pela el plátano y córtalo en trozos.",
        "Lava y quita el tallo de las fresas.",
        "Coloca todos los ingredientes en una licuadora.",
        "Licúa hasta obtener una mezcla suave.",
        "Sirve inmediatamente.",
      ];
    case "Cena":
      return [
        "Cuece la pasta según las instrucciones del paquete.",
        "Corta la pechuga de pollo en cubos y sazona con sal y pimienta.",
        "En una sartén, calienta el aceite y cocina el pollo hasta que esté dorado.",
        "Corta los tomates cherry por la mitad.",
        "Escurre la pasta y mezcla con la salsa pesto.",
        "Agrega el pollo y los tomates a la pasta.",
        "Sirve caliente con queso parmesano rallado por encima.",
      ];
    case "Postre":
      return [
        "Precalienta el horno a 180°C.",
        "Pela y corta las manzanas en rodajas finas.",
        "Mezcla las manzanas con el azúcar, la canela y el zumo de medio limón.",
        "Extiende la masa quebrada en un molde para tarta.",
        "Coloca las manzanas sobre la masa.",
        "Añade pequeños trozos de mantequilla sobre las manzanas.",
        "Hornea durante 40-45 minutos hasta que la masa esté dorada.",
        "Deja enfriar antes de servir.",
      ];
    case "Snack":
      return [
        "Escurre y enjuaga los garbanzos.",
        "En un procesador de alimentos, mezcla los garbanzos, tahini, ajo picado y el jugo de limón.",
        "Mientras procesas, añade el aceite de oliva gradualmente hasta conseguir una textura suave.",
        "Sazona con sal y pimienta al gusto.",
        "Sirve en un bol, haz un hueco en el centro y añade un poco de aceite de oliva y pimentón.",
        "Lava y corta las verduras en bastones para acompañar.",
      ];
    default:
      // Instrucciones predeterminadas
      return [
        "Enjuaga y escurre los garbanzos.",
        "Corta los tomates cherry por la mitad.",
        "Pela y corta el pepino en cubos pequeños.",
        "Pica finamente la cebolla roja.",
        "En un bol grande, combina los garbanzos, tomates, pepino, cebolla y aceitunas.",
        "Desmenuza el queso feta por encima.",
        "En un recipiente pequeño, mezcla el aceite de oliva, el jugo de limón y el orégano.",
        "Vierte el aderezo sobre la ensalada y mezcla bien.",
        "Sirve inmediatamente o refrigera por 30 minutos para que los sabores se integren.",
      ];
  }
};

/**
 * Obtiene el título de la receta basado en el tipo de comida seleccionado
 */
export const getRecipeTitleForCuisineType = (cuisineType: string): string => {
  switch (cuisineType) {
    case "Desayuno":
      return "Tostadas de Aguacate con Huevo";
    case "Almuerzo":
      return "Ensalada Mediterránea con Garbanzos";
    case "Merienda":
      return "Batido Energético de Frutas";
    case "Cena":
      return "Pasta al Pesto con Pollo";
    case "Postre":
      return "Tarta de Manzana Fácil";
    case "Snack":
      return "Hummus Casero con Crudités";
    default:
      return "Ensalada Mediterránea con Garbanzos";
  }
};
