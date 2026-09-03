import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { CLAVE_TOKEN } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    restaurarSesion();
  }, []);

  const restaurarSesion = () => {
    const tokenGuardado = localStorage.getItem(CLAVE_TOKEN);

    if (!tokenGuardado) {
      setCargando(false);
      return;
    }

    try {
      const payload = jwtDecode(tokenGuardado);

      const yaExpiro = payload.exp * 1000 < Date.now();
      if (yaExpiro) {
        localStorage.removeItem(CLAVE_TOKEN);
        setCargando(false);
        return;
      }

      setToken(tokenGuardado);
      setUsuario(mapearPayload(payload));
    } catch {
      localStorage.removeItem(CLAVE_TOKEN);
    } finally {
      setCargando(false);
    }
  };

  const actualizarUsuario = (cambios) => {
    setUsuario((prev) => ({ ...prev, ...cambios }));
  };


  const login = (tokenNuevo) => {
    const payload = jwtDecode(tokenNuevo);
    localStorage.setItem(CLAVE_TOKEN, tokenNuevo);
    setToken(tokenNuevo);
    setUsuario(mapearPayload(payload));
  };

  const logout = () => {
    localStorage.removeItem(CLAVE_TOKEN);
    setToken(null);
    setUsuario(null);
  };

  const tienePermiso = (rolesPermitidos) => {
    if (!rolesPermitidos || rolesPermitidos.length === 0) return true;
    return usuario ? rolesPermitidos.includes(usuario.rol) : false;
  };

  const value = {
    usuario,
    token,
    cargando,
    estaAutenticado: !!token,
    login,
    logout,
    tienePermiso,
    actualizarUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Único punto donde se traduce el payload del token a la forma que usa
// el resto de la app - si el backend agrega/renombra un claim, solo se
// ajusta aquí.
const mapearPayload = (payload) => {
  return {
    correo: payload.correo,
    nombre: payload.alias,
    rol: payload.rol,
    fotoUrl: payload.imagen,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
