import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axiosClient from "../services/axiosClient";

const opcionesMenuBase = [
  { etiqueta: "Inicio", icono: "pi pi-home", ruta: "/" },
  { etiqueta: "Biblioteca", icono: "pi pi-book", ruta: "/biblioteca" },
];

export default function Sidebar() {
  const { estaAutenticado } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!estaAutenticado) {
      setPlaylists([]);
      return;
    }

    const cargarMisPlaylists = async () => {
      setCargando(true);
      try {
        const response = await axiosClient.get("/playlists/mis-playlists");
        // Filtramos para mostrar únicamente las playlists personales
        const personales = response.data.filter((p) => p.tipo === "PERSONAL");
        setPlaylists(personales);
      } catch (err) {
        console.error("Error al cargar playlists en el Sidebar:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarMisPlaylists();
  }, [estaAutenticado]);

  return (
    <aside className="w-64 h-screen bg-[#18151f] border-r border-[#2a2635] flex flex-col shrink-0 overflow-y-auto">
      {/* Logotipo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <span className="text-xl font-bold text-white">Groovify</span>
      </div>

      {/* Menú de navegación principal */}
      <nav className="px-3">
        {opcionesMenuBase.map((opcion) => (
          <NavLink
            key={opcion.etiqueta}
            to={opcion.ruta}
            end={opcion.ruta === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? "bg-[#2a2635] text-white"
                  : "text-slate-400 hover:bg-[#221f2e] hover:text-white"
              }`
            }
          >
            <i className={`${opcion.icono} text-base`} />
            {opcion.etiqueta}
          </NavLink>
        ))}

        {estaAutenticado && (
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? "bg-[#2a2635] text-white"
                  : "text-slate-400 hover:bg-[#221f2e] hover:text-white"
              }`
            }
          >
            <i className="pi pi-user text-base" />
            Perfil
          </NavLink>
        )}
      </nav>

      {/* Lista de Playlists del Usuario con Miniaturas */}
      <div className="mt-6 px-4 flex-1">
        <p className="text-xs font-semibold text-slate-500 tracking-wide px-2 mb-3">
          TUS PLAYLISTS
        </p>
        {estaAutenticado ? (
          cargando ? (
            <p className="text-xs text-slate-500 px-2">Cargando playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">Aún no tienes playlists</p>
          ) : (
            <div className="space-y-1">
              {/* Opción rápida "me gusta" */}
              <div
                onClick={() => navigate("/biblioteca/tus-me-gusta")}
                className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#221f2e] transition-colors group"
              >
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <i className="pi pi-heart-fill text-white text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                    Tus me gusta
                  </p>
                  <p className="text-xs text-slate-500 truncate">Playlist</p>
                </div>
              </div>

              {/* Playlists Personales Creadas */}
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#221f2e] transition-colors group"
                >
                  {playlist.portada ? (
                    <img
                      src={playlist.portada}
                      alt={playlist.nombre}
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center shrink-0">
                      <i className="pi pi-music text-white/60 text-sm" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                      {playlist.nombre}
                    </p>
                    <p className="text-xs text-slate-500 truncate">Playlist</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="text-xs text-slate-500 px-2">
            Inicia sesión para ver tus playlists
          </p>
        )}
      </div>
    </aside>
  );
}