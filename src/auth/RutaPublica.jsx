import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RutaPublica({ children }) {
  const { estaAutenticado } = useAuth();

  // Si el usuario ya está autenticado, redirigir al home
  if (estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar la página pública (login o register)
  return children;
}