import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; 
import { useReproductor } from "../../app/ReproductorContext";
import axiosClient from "../../services/axiosClient";

export default function TusMeGusta() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { reproducirCancion } = useReproductor();

  const [canciones, setCanciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarMeGusta = async () => {
      setCargando(true);
      try {
        const response = await axiosClient.get("/playlists/me-gusta");
        setCanciones(response.data || []);
      } catch (err) {
        console.error("Error al cargar canciones de Me Gusta:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarMeGusta();
  }, []);

  const formatearDuracion = (segundosTotales) => {
    if (!segundosTotales) return "0:00";
    const mins = Math.floor(segundosTotales / 60);
    const segs = segundosTotales % 60;
    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  };

  const mapearParaReproductor = (cancion) => ({
    id: cancion.id,
    titulo: cancion.nombre,
    artista: cancion.artista?.alias || "Artista",
    duracion: formatearDuracion(cancion.duracionSegundos),
    archivoAudio: cancion.archivoAudio,
    portada: cancion.portada || cancion.album?.portada || null,
  });

  const cancionesFiltradas = canciones.filter(
    (cancion) =>
      cancion.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cancion.artista?.alias?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarReproducir = () => {
    if (cancionesFiltradas.length === 0) return;
    const lista = cancionesFiltradas.map(mapearParaReproductor);
    reproducirCancion(lista[0], lista.slice(1));
    navigate("/reproduciendo");
  };

  const manejarReproducirDesde = (indice) => {
    const lista = cancionesFiltradas.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  if (cargando) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#0f0d14] text-white flex items-center justify-center">
        <p className="text-slate-400">Cargando tus me gusta...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14] text-white">
      {/* Header con el degradado conservado de Tus Me Gusta */}
      <div className="bg-gradient-to-b from-purple-800 to-[#3c1e5a] px-10 pt-10 pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="text-slate-300 hover:text-white transition-colors mb-6 flex items-center gap-2 text-sm"
        >
          <IconoFlechaAtras className="w-4 h-4" /> Volver
        </button>

        <div className="flex items-end gap-6 mb-6">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-2xl">
            <i className="pi pi-heart-fill text-white text-6xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-300 tracking-wide uppercase font-semibold">
              Playlist
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Tus me gusta
            </h1>
            <span className="text-sm text-slate-300 mt-1">
              <span className="font-semibold text-white">
                {usuario?.nombre || usuario?.alias || "Usuario"}
              </span>{" "}
              · {canciones.length} canciones
            </span>
          </div>
        </div>

        {/* Acciones e interacción */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={manejarReproducir}
            disabled={cancionesFiltradas.length === 0}
            className="bg-purple-500 text-white rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <IconoPlay className="w-4 h-4" /> Reproducir
          </button>
        </div>
      </div>

      {/* Contenido principal: Buscador y lista en grid de PlaylistDetalle */}
      <div className="px-10 py-8">
        <div className="relative max-w-md mb-8">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en tus me gusta..."
            className="w-full bg-[#221f2e] border border-[#3a3550] rounded-full pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          {/* Cabecera de tabla */}
          <div className="grid grid-cols-[24px_1fr_70px] gap-4 px-3 py-2 text-xs text-slate-400 border-b border-[#2a2440]">
            <span>#</span>
            <span>Título</span>
            <span className="text-right">Duración</span>
          </div>

          {/* Listado de canciones al estilo PlaylistDetalle */}
          {cancionesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-16 h-16 rounded-full border-2 border-[#3a3550] flex items-center justify-center mb-4">
                <i className="pi pi-heart text-slate-500 text-xl" />
              </div>
              <p className="text-white font-semibold mb-1">
                {busqueda ? "No se encontraron canciones" : "Aún no tienes canciones favoritas"}
              </p>
              <p className="text-slate-500 text-xs">
                {busqueda
                  ? `No hay coincidencias con "${busqueda}"`
                  : "Toca el corazón en cualquier canción para guardarla aquí"}
              </p>
            </div>
          ) : (
            cancionesFiltradas.map((cancion, index) => (
              <div
                key={cancion.id || index}
                onClick={() => manejarReproducirDesde(index)}
                className="grid grid-cols-[24px_1fr_70px] gap-4 px-3 py-2.5 items-center rounded-md hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <span className="text-sm text-slate-500">{index + 1}</span>
                <div className="flex items-center gap-3 min-w-0">
                  {cancion.portada || cancion.album?.portada ? (
                    <img
                      src={cancion.portada || cancion.album?.portada}
                      alt={cancion.nombre}
                      className="w-9 h-9 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-[#3c1e5a] flex items-center justify-center shrink-0">
                      <i className="pi pi-music text-slate-400 text-xs" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
                      {cancion.nombre}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {cancion.artista?.alias || "Artista"}
                    </p>
                  </div>
                </div>
                <span className="text-right text-sm text-slate-400">
                  {formatearDuracion(cancion.duracionSegundos)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function IconoFlechaAtras({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoPlay({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}