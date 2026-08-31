import { createContext, useContext, useState, useEffect } from "react";

// Contexto temporal mientras no hay backend conectado.
// Se persiste en localStorage para sobrevivir a recargas de página.
// Cuando se conecte el backend real, esto se reemplaza por AuthContext con JWT.
const CLAVE_SESION = "groovify_sesion_temp";
const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_SESION);
    return guardado ? JSON.parse(guardado) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [usuario]);

  const iniciarSesion = (datos) => setUsuario(datos);
  const cerrarSesion = () => setUsuario(null);
  const actualizarUsuario = (cambios) =>
    setUsuario((actual) => ({ ...actual, ...cambios }));

  return (
    <SesionContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, actualizarUsuario }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const context = useContext(SesionContext);
  if (!context) {
    throw new Error("useSesion debe usarse dentro de un SesionProvider");
  }
  return context;
}