import { useState, useEffect } from "react";

/**
 * Hook personalizado para manejar el almacenamiento local con tipado
 * @param key Clave para el almacenamiento local
 * @param initialValue Valor inicial si no hay datos en localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Parsear JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor en localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que podamos tener la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar al estado
      setStoredValue(valueToStore);
      // Guardar a localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  };

  // Sincronizar con localStorage cuando la clave cambia
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error(
            `Error al sincronizar ${key} desde localStorage:`,
            error
          );
        }
      }
    };

    // Escuchar cambios en otras pestañas/ventanas
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
}
