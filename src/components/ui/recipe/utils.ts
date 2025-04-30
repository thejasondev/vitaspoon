/**
 * Determina si una receta es local basándose en su título y/o instrucciones
 */
export const isLocalRecipe = (
  title: string,
  instructions: string[]
): boolean => {
  return (
    title.includes("(Personalizada)") ||
    title.includes("(Sin Electricidad)") ||
    instructions.some((i) => i.includes("Nota:"))
  );
};

/**
 * Configura y ejecuta la impresión de una receta
 */
export const printRecipe = (title: string): void => {
  // Guardar el título original
  const originalTitle = document.title;

  // Cambiar el título para la impresión
  document.title = `Receta: ${title}`;

  // Forzar impresión en vertical
  const style = document.createElement("style");
  style.innerHTML =
    "@page { size: portrait !important; margin: 0 !important; }";
  document.head.appendChild(style);

  // Imprimir
  window.print();

  // Restaurar título y eliminar estilos temporales
  setTimeout(() => {
    document.title = originalTitle;
    document.head.removeChild(style);
  }, 100);
};
