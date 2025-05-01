import React from "react";
import { ToastProvider as ToastContextProvider } from "../../contexts/ToastContext";

/**
 * Componente para proveer las notificaciones Toast a las páginas React
 */
export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}
