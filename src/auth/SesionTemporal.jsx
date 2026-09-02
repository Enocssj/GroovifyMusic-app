import { createContext, useContext, useState, useEffect } from "react";

// Contexto temporal mientras no hay backend conectado.
// Se persiste en localStorage para sobrevivir a recargas de página.
// Cuando se conecte el backend real, esto se reemplaza por AuthContext con JWT.
const CLAVE_SESION = "groovify_sesion_temp";
const CLAVE_USUARIOS = "groovify_usuarios_mock"; // "base de datos" temporal de cuentas registradas
const SesionContext = createContext(null);

function obtenerUsuariosRegistrados() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS);
  return guardado ? JSON.parse(guardado) : [];
}

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

  // Guarda la cuenta en el "directorio" mock al registrarse
  const registrarUsuarioMock = (datos) => {
    const usuarios = obtenerUsuariosRegistrados();
    const yaExiste = usuarios.some((u) => u.email === datos.email);
    const usuariosActualizados = yaExiste
      ? usuarios.map((u) => (u.email === datos.email ? { ...u, ...datos } : u))
      : [...usuarios, datos];
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosActualizados));
  };

  // Busca el tipoCuenta real de una cuenta ya registrada, por email
  const buscarUsuarioPorEmail = (email) => {
    const usuarios = obtenerUsuariosRegistrados();
    return usuarios.find((u) => u.email === email) ?? null;
  };

  return (
    <SesionContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario,
        registrarUsuarioMock,
        buscarUsuarioPorEmail,
      }}
    >
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