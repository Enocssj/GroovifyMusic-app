import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../services/axiosClient";

export default function EditarPerfilArtistaModal({ onCancelar, onGuardado }) {
  const { usuario } = useAuth();

  const [alias, setAlias] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [rolActual, setRolActual] = useState(null);
  const [biografia, setBiografia] = useState("");
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!usuario?.id) {
      setCargando(false);
      return;
    }
    const cargarUsuario = async () => {
      try {
        const response = await axiosClient.get(`/usuarios/${usuario.id}`);
        const data = response.data;
        setAlias(data.alias || "");
        setCorreo(data.correo || "");
        setFechaNacimiento(data.fechaNacimiento || "");
        setRolActual(data.rol?.nombre || usuario?.rol || null);
        setBiografia(data.biografia || "");
        setVistaPreviaUrl(data.imagen || null);
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        setError("No se pudieron cargar tus datos actuales");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [usuario?.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoFoto(file);
      setVistaPreviaUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !fechaNacimiento || !rolActual) {
      setError(
        "Faltan datos necesarios para guardar. Intenta recargar el modal.",
      );
      return;
    }

    setEnviando(true);
    try {
      const usuarioData = {
        alias,
        correo,
        biografia: biografia || null,
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

      const response = await axiosClient.put(
        `/usuarios/${usuario.id}`,
        formData,
      );

      onGuardado?.(response.data);
      onCancelar();
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-white">Editar perfil</h2>
          <button
            type="button"
            onClick={onCancelar}
            disabled={enviando}
            className="text-[#79738f] hover:text-white text-sm transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        {error && (
          <div className="p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-[#79738f] text-center py-6">
            Cargando tus datos...
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-[#3a3155] flex items-center justify-center group"
              >
                {vistaPreviaUrl ? (
                  <img
                    src={vistaPreviaUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconoUsuario className="w-10 h-10 text-[#cfc9e6]" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconoCamara className="w-6 h-6 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#a29cba]">Alias</label>
              <input
                type="text"
                required
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#a29cba]">Biografía</label>
              <textarea
                rows={4}
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                placeholder="Cuéntanos sobre ti como artista..."
                className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] resize-none placeholder-[#4a4368]"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="bg-[#8b7ee0] text-[#1a1330] w-full py-3 rounded-xl text-sm font-semibold hover:bg-[#9a8ef0] transition-colors shadow-lg shadow-[#8b7ee0]/10 mt-2 disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Guardar cambios"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function IconoUsuario({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M4 20c0-4 3.6-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoCamara({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
