import { useEffect } from "react";
import { initRecipeDatabase } from "../../services";

/**
 * Proveedor que inicializa la base de datos de recetas
 * Carga y procesa el archivo CSV al inicio de la aplicación
 * Usa lazy loading para no bloquear la renderización inicial
 */
export function RecipeDbProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar la base de datos de recetas después de que la página se haya cargado
    // para mejorar el tiempo de carga inicial y la navegación entre páginas
    const timer = setTimeout(() => {
      const initDb = async () => {
        try {
          await initRecipeDatabase();
        } catch (error) {
          console.error(
            "Error al inicializar la base de datos de recetas:",
            error
          );
        }
      };

      initDb();
    }, 500); // Pequeño retraso para priorizar la renderización de la UI

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
