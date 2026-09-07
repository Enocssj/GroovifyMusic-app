import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";   
import { useReproductor } from "../../app/ReproductorContext";
import axiosClient from "../../services/axiosClient";

export default function PlaylistDetalle() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { usuario } = useAuth();
  const { reproducirCancion } = useReproductor();

  const [playlist, setPlaylist] = useState(null);
  const [canciones, setCanciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const esDueño =
    usuario?.id != null &&
    playlist?.usuario?.id === usuario.id &&
    playlist?.tipo === "PERSONAL";

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError("");
      try {
        const [playlistRes, cancionesRes] = await Promise.all([
          axiosClient.get(`/playlists/${playlistId}`),
          axiosClient.get(`/playlists/${playlistId}/canciones`),
        ]);
        setPlaylist(playlistRes.data);
        setCanciones(cancionesRes.data);
      } catch (err) {
        console.error("Error al cargar la playlist:", err);
        setError("No se pudo cargar la playlist");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [playlistId]);

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
    portada: cancion.portada || playlist?.portada || null,
  });

  const manejarReproducir = () => {
    if (canciones.length === 0) return;
    const lista = canciones.map(mapearParaReproductor);
    reproducirCancion(lista[0], lista.slice(1));
    navigate("/reproduciendo");
  };

  const manejarReproducirDesde = (indice) => {
    const lista = canciones.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  const quitarCancion = async (cancionId, e) => {
    e.stopPropagation();
    try {
      await axiosClient.delete(`/playlists/${playlistId}/canciones/${cancionId}`);
      setCanciones(canciones.filter((c) => c.id !== cancionId));
    } catch (err) {
      console.error("Error al quitar canción de la playlist:", err);
    }
  };

  const eliminarPlaylist = async () => {
    try {
      await axiosClient.delete(`/playlists/${playlistId}`);
      navigate("/biblioteca");
    } catch (err) {
      console.error("Error al eliminar la playlist:", err);
    }
  };

  if (cargando) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#0f0d14] text-white flex items-center justify-center">
        <p className="text-slate-400">Cargando playlist...</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#0f0d14] text-white flex items-center justify-center">
        <p className="text-slate-400">{error || "Playlist no encontrada"}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14] text-white">
      {/* Header con el degradado morado uniforme */}
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
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
            {playlist.portada ? (
              <img
                src={playlist.portada}
                alt={`Portada de ${playlist.nombre}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <IconoNota className="w-12 h-12 text-white/80" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-300 tracking-wide uppercase font-semibold">
              Playlist
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {playlist.nombre}
            </h1>
            {playlist.descripcion && (
              <p className="text-sm text-slate-300">{playlist.descripcion}</p>
            )}
            <span className="text-sm text-slate-300 mt-1">
              {playlist.usuario?.alias && (
                <span className="font-semibold text-white">
                  {playlist.usuario.alias}
                </span>
              )}{" "}
              · {canciones.length} canciones
            </span>
          </div>
        </div>

        {/* Acciones e interacción */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={manejarReproducir}
            disabled={canciones.length === 0}
            className="bg-purple-500 text-white rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <IconoPlay className="w-4 h-4" /> Reproducir
          </button>

          {esDueño && (
            <button
              type="button"
              onClick={eliminarPlaylist}
              className="border border-red-500/40 text-red-400 rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-red-500/10 transition-colors ml-auto"
            >
              Eliminar playlist
            </button>
          )}
        </div>
      </div>

      {/* Tabla/Lista de canciones */}
      <div className="px-10 py-8">
        <div className="flex flex-col">
          <div
            className={`grid ${
              esDueño ? "grid-cols-[24px_1fr_70px_40px]" : "grid-cols-[24px_1fr_70px]"
            } gap-4 px-3 py-2 text-xs text-slate-400 border-b border-[#2a2440]`}
          >
            <span>#</span>
            <span>Título</span>
            <span className="text-right">Duración</span>
            {esDueño && <span className="text-center"></span>}
          </div>

          {canciones.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">
              Esta playlist aún no tiene canciones
            </p>
          ) : (
            canciones.map((cancion, index) => (
              <div
                key={cancion.id}
                onClick={() => manejarReproducirDesde(index)}
                className={`grid ${
                  esDueño ? "grid-cols-[24px_1fr_70px_40px]" : "grid-cols-[24px_1fr_70px]"
                } gap-4 px-3 py-2.5 items-center rounded-md hover:bg-white/5 transition-colors group cursor-pointer`}
              >
                <span className="text-sm text-slate-500">{index + 1}</span>
                <div className="flex items-center gap-3 min-w-0">
                  {cancion.portada ? (
                    <img
                      src={cancion.portada}
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

                {esDueño && (
                  <button
                    type="button"
                    onClick={(e) => quitarCancion(cancion.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-[#ff5c5c] hover:text-[#ff3b3b] transition-all p-1 flex items-center justify-center"
                    title="Quitar de la playlist"
                  >
                    <IconoEliminar className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function IconoEliminar({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoFlechaAtras({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoNota({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="7" cy="18" r="3" fill="currentColor" />
      <circle cx="17" cy="16" r="3" fill="currentColor" />
      <path d="M10 18V5l10-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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