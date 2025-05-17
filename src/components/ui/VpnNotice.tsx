import React, { useState, useEffect } from "react";

export default function VpnNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClose = () => {
    // Guardar preferencia en localStorage para no mostrar por un tiempo
    localStorage.setItem("vpnNoticeDismissed", new Date().toISOString());
    setIsVisible(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    // Usar un requestIdleCallback o setTimeout para ejecutar código no crítico
    // cuando el navegador esté inactivo, mejorando el rendimiento de navegación
    const checkDismissalStatus = () => {
      // Comprobar si el aviso fue descartado recientemente
      const dismissedTime = localStorage.getItem("vpnNoticeDismissed");
      if (dismissedTime) {
        const dismissedDate = new Date(dismissedTime);
        const now = new Date();
        // No mostrar si fue cerrado en los últimos 7 días
        if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
          return;
        }
      }

      // Mostrar el aviso
      setIsVisible(true);
    };

    // Usar requestIdleCallback si está disponible, o setTimeout como fallback
    if ("requestIdleCallback" in window) {
      // TypeScript no reconoce requestIdleCallback por defecto
      (window as any).requestIdleCallback(() => {
        checkDismissalStatus();
      });
    } else {
      // Fallback a setTimeout con un retraso más largo para no bloquear la navegación
      setTimeout(checkDismissalStatus, 2000);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs animate-fade-in">
      <div
        className={`bg-teal-50 border border-teal-300 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${
          isMinimized ? "h-10" : ""
        }`}
      >
        {/* Encabezado */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-teal-100 cursor-pointer"
          onClick={toggleMinimize}
        >
          <div className="flex items-center">
            <div className="text-teal-600 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="font-medium text-teal-700 text-sm">
              Nota sobre acceso global
            </span>
          </div>

          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize();
              }}
              className="text-teal-600 hover:text-teal-800 focus:outline-none mr-1"
              aria-label={isMinimized ? "Expandir nota" : "Minimizar nota"}
            >
              {isMinimized ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-teal-600 hover:text-teal-800 focus:outline-none"
              aria-label="Cerrar nota"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        {!isMinimized && (
          <div className="p-3 text-teal-700 text-sm">
            <p className="mb-2">
              🌐 <span className="font-medium">¡Consejo VitaSpoon!</span> Para
              obtener mejores resultados y un rendimiento óptimo en regiones con
              restricciones, te recomendamos utilizar una VPN.
            </p>
            <p className="text-xs text-teal-600">
              Esto asegura que puedas acceder a todas nuestras funciones sin
              limitaciones y obtener recetas más precisas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
