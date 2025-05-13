import { useEffect } from "react";
import { initRecipeDatabase } from "../../services";

/**
 * Proveedor que inicializa la base de datos de recetas
 * Carga y procesa el archivo CSV al inicio de la aplicación
 */
export function RecipeDbProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar la base de datos de recetas al montar el componente
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
  }, []);

  return <>{children}</>;
}
