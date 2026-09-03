import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RutaPublica({ children }) {
  const { estaAutenticado, usuario } = useAuth();

  if (estaAutenticado) {
    const destino = usuario?.rol === "ARTISTA" ? "/mi-perfil-artista" : "/";
    return <Navigate to={destino} replace />;
  }

  return children;
}