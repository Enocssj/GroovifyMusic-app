import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../services/axiosClient";

export default function EditarPerfilModal({ abierto, onCerrar }) {
  const { usuario, actualizarUsuario } = useAuth();
  const inputFotoRef = useRef(null);

  const [alias, setAlias] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [rolActual, setRolActual] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!abierto || !usuario?.id) return;

    const cargarUsuario = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await axiosClient.get(`/usuarios/${usuario.id}`);
        const data = response.data;
        setAlias(data.alias || "");
        setCorreo(data.correo || "");
        setFechaNacimiento(data.fechaNacimiento || "");
        setRolActual(data.rol?.nombre || usuario?.rol || null);
        setFotoPreview(data.imagen || null);
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        setError("No se pudieron cargar tus datos actuales");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [abierto, usuario?.id]);

  if (!abierto) return null;

  const manejarSeleccionFoto = (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    setArchivoFoto(archivo);
    setFotoPreview(URL.createObjectURL(archivo));
  };

  const manejarGuardar = async () => {
    setError("");

    if (!correo || !fechaNacimiento || !rolActual) {
      setError("Faltan datos necesarios para guardar. Intenta recargar el modal.");
      return;
    }

    setEnviando(true);
    try {
      const usuarioData = {
        alias,
        correo,
        biografia: null,
        password: null,
        rol: rolActual,
        fechaNacimiento,
      };

      const usuarioBlob = new Blob([JSON.stringify(usuarioData)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("usuario", usuarioBlob);
      if (archivoFoto) {
        formData.append("imagen", archivoFoto);
      }

      const response = await axiosClient.put(`/usuarios/${usuario.id}`, formData);
      const usuarioActualizado = response.data;

    
      actualizarUsuario({
        nombre: usuarioActualizado.alias,
        correo: usuarioActualizado.correo,
        fotoUrl: usuarioActualizado.imagen,
      });

      onCerrar();
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError(
        err.response?.data?.message || "Error al actualizar el perfil"
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#282828] rounded-lg w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Detalles del perfil</h2>
          <button
            onClick={onCerrar}
            disabled={enviando}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <i className="pi pi-times text-lg" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-slate-400 text-center py-6">Cargando tus datos...</p>
        ) : (
          <>
            <div className="flex items-center gap-5 mb-4">
              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                className="relative w-28 h-28 shrink-0 group"
              >
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Foto de perfil"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <i className="pi pi-user text-white text-4xl" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="pi pi-camera text-white text-xl" />
                </div>
              </button>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                onChange={manejarSeleccionFoto}
                className="hidden"
              />

              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Nombre de usuario"
                className="flex-1 bg-[#3a3a3a] border border-[#565656] rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <label className="block text-xs text-slate-400 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-[#3a3a3a] border border-[#565656] rounded px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <p className="text-xs text-slate-400 mb-6">
              Al continuar, aceptas darle acceso a Groovify a la imagen que decidas subir. Asegúrate de tener los derechos para subir la imagen.
            </p>

            <div className="flex justify-end">
              <button
                onClick={manejarGuardar}
                disabled={enviando}
                className="bg-white hover:bg-slate-200 text-black font-semibold px-8 py-2.5 rounded-full transition-colors disabled:opacity-50"
              >
                {enviando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}