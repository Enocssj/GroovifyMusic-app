import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../services/axiosClient"; // ajusta la ruta según dónde esté este archivo
import EditarPerfilModal from "./EditarPerfilModal";

const opcionesPerfil = [
  { etiqueta: "Editar perfil", icono: "pi pi-pencil", accion: "modal" },
];

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);

  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [totalFavoritas, setTotalFavoritas] = useState(0);
  const [cargandoStats, setCargandoStats] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [playlistsRes, favoritasRes] = await Promise.all([
          axiosClient.get("/playlists/mis-playlists"),
          axiosClient.get("/playlists/me-gusta"),
        ]);

        const soloPersonales = playlistsRes.data.filter((p) => p.tipo === "PERSONAL");
        setTotalPlaylists(soloPersonales.length);
        setTotalFavoritas(favoritasRes.data.length);
      } catch (err) {
        console.error("Error al cargar estadísticas del perfil:", err);
      } finally {
        setCargandoStats(false);
      }
    };
    cargarEstadisticas();
  }, []);

  const manejarCerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const manejarClicOpcion = (opcion) => {
    if (opcion.accion === "modal") setModalAbierto(true);
    else if (opcion.accion) navigate(opcion.accion);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-8 pt-6">
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
      </div>

      <div className="px-8 pt-8 max-w-2xl mx-auto">

        {/* Datos del usuario */}
        <div className="flex items-center gap-5 mb-6">
          {usuario?.fotoUrl ? (
            <img
              src={usuario.fotoUrl}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <i className="pi pi-user text-white text-3xl" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{usuario?.nombre || "Usuario"}</h2>
            <p className="text-slate-400 text-sm">{usuario?.correo || "Sin correo registrado"}</p>
          </div>
        </div>

        {/* Estadísticas: Playlists y Favoritas reales*/}
        <div className="inline-flex items-center gap-8 bg-[#1a1722] border border-[#2a2635] rounded-xl px-8 py-4 mb-8">
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {cargandoStats ? "..." : totalPlaylists}
            </p>
            <p className="text-xs text-slate-400">Playlists</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {cargandoStats ? "..." : totalFavoritas}
            </p>
            <p className="text-xs text-slate-400">Favoritas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-xs text-slate-400">Siguiendo</p>
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-3 mb-6">
          {opcionesPerfil.map((opcion) => (
            <button
              key={opcion.etiqueta}
              onClick={() => manejarClicOpcion(opcion)}
              className="w-full flex items-center gap-3 bg-[#1a1722] hover:bg-[#221f2e] border border-[#2a2635] rounded-xl px-5 py-4 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-[#2a2635] flex items-center justify-center text-slate-300">
                <i className={opcion.icono} />
              </span>
              <span className="flex-1 text-left text-white font-medium">{opcion.etiqueta}</span>
              <i className="pi pi-chevron-right text-slate-500 text-sm" />
            </button>
          ))}
        </div>

        <button
          onClick={manejarCerrarSesion}
          className="w-full border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-full transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <EditarPerfilModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />
    </div>
  );
}