import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useReproductor } from "../../app/ReproductorContext"; // ajusta la ruta según dónde esté este archivo
import axiosClient from "../../services/axiosClient";
import FormularioCancion from "../artista/FormularioCancion";

export default function AlbumDetalle() {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const { usuario } = useAuth();
  const { reproducirCancion } = useReproductor();

  const [album, setAlbum] = useState(null);
  const [canciones, setCanciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const esDueño = usuario?.id != null && album?.artista?.id === usuario.id;

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError("");
      try {
        const [albumRes, cancionesRes] = await Promise.all([
          axiosClient.get(`/album/${albumId}`),
          axiosClient.get(`/canciones/album/${albumId}`),
        ]);
        setAlbum(albumRes.data);
        setCanciones(cancionesRes.data);
      } catch (err) {
        console.error("Error al cargar el álbum:", err);
        setError("No se pudo cargar el álbum");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [albumId]);

  const formatearDuracion = (segundosTotales) => {
    if (!segundosTotales) return "0:00";
    const mins = Math.floor(segundosTotales / 60);
    const segs = segundosTotales % 60;
    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  };

  const mapearParaReproductor = (cancion) => ({
    id: cancion.id,
    titulo: cancion.nombre,
    artista: album?.artista?.alias,
    duracion: formatearDuracion(cancion.duracionSegundos),
    archivoAudio: cancion.archivoAudio,
    portada: cancion.portada || album?.portada || null,
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

  const eliminarCancion = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosClient.delete(`/canciones/${id}`);
      setCanciones(canciones.filter((cancion) => cancion.id !== id));
    } catch (err) {
      console.error("Error al eliminar canción:", err);
    }
  };

  const handleCancionCreada = (cancionCreada) => {
    setCanciones([...canciones, cancionCreada]);
    setMostrarFormulario(false);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0f0b1a] text-white flex items-center justify-center">
        <p className="text-[#79738f]">Cargando álbum...</p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-[#0f0b1a] text-white flex items-center justify-center">
        <p className="text-[#79738f]">{error || "Álbum no encontrado"}</p>
      </div>
    );
  }

  const anio = album.fechaLanzamiento
    ? new Date(album.fechaLanzamiento).getFullYear()
    : "";

  return (
  <div className="flex-1 overflow-y-auto bg-[#0f0b1a] text-white px-10 py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="text-[#b9b3d0] hover:text-white transition-colors mb-6 flex items-center gap-2 text-sm"
      >
        <IconoFlechaAtras className="w-4 h-4" /> Volver
      </button>

      <div className="flex items-end gap-6 mb-6">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-[#9a8ef0] to-[#4a3d78] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {album.portada ? (
            <img
              src={album.portada}
              alt={`Portada del álbum ${album.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconoNota className="w-12 h-12 text-[#e5e0f7]" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#a29cba] tracking-wide">Álbum</span>
          <h1 className="text-3xl md:text-4xl font-medium">{album.nombre}</h1>
          <span className="text-sm text-[#c7c1de]">
            <span className="font-medium text-white">
              {album.artista?.alias}
            </span>{" "}
            · Álbum {anio ? `· ${anio}` : ""}
          </span>
          <span className="text-xs text-[#79738f]">
            {canciones.length} canciones{" "}
            {album.duracion ? `· ${album.duracion}` : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-7">
        <button
          type="button"
          onClick={manejarReproducir}
          disabled={canciones.length === 0}
          className="bg-[#8b7ee0] text-[#1a1330] rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[#9a8ef0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconoPlay className="w-4 h-4" /> Reproducir
        </button>
        <button
          type="button"
          aria-label="Agregado a tu biblioteca"
          className="border border-[#55507a] text-[#8b7ee0] rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <IconoCheck className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Reproducción aleatoria"
          className="text-[#b9b3d0] p-2 hover:text-white transition-colors"
        >
          <IconoAleatorio className="w-5 h-5" />
        </button>

        {esDueño && (
          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className="border border-[#8b7ee0] text-[#8b7ee0] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#8b7ee0]/10 transition-colors ml-2"
          >
            + Agregar Canción
          </button>
        )}

        <button
          type="button"
          aria-label="Más opciones"
          className="text-[#b9b3d0] p-2 ml-auto hover:text-white transition-colors"
        >
          <IconoPuntos className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col">
        <div
          className={`grid ${esDueño ? "grid-cols-[24px_1fr_70px_40px]" : "grid-cols-[24px_1fr_70px]"} gap-4 px-3 py-2 text-xs text-[#79738f] border-b border-[#2a2440]`}
        >
          <span>#</span>
          <span>Título</span>
          <span className="text-right">Duración</span>
          {esDueño && <span className="text-center"></span>}
        </div>

        {canciones.length === 0 ? (
          <p className="text-sm text-[#79738f] py-6 text-center">
            Este álbum aún no tiene canciones
          </p>
        ) : (
          canciones.map((cancion, index) => (
            <div
              key={cancion.id}
              onClick={() => manejarReproducirDesde(index)}
              className={`grid ${esDueño ? "grid-cols-[24px_1fr_70px_40px]" : "grid-cols-[24px_1fr_70px]"} gap-4 px-3 py-2.5 items-center rounded-md hover:bg-white/5 transition-colors group cursor-pointer`}
            >
              <span className="text-sm text-[#79738f]">{index + 1}</span>
              <span className="text-sm font-medium">{cancion.nombre}</span>
              <span className="text-right text-sm text-[#a29cba]">
                {formatearDuracion(cancion.duracionSegundos)}
              </span>

              {esDueño && (
                <button
                  type="button"
                  onClick={(e) => eliminarCancion(cancion.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-[#ff5c5c] hover:text-[#ff3b3b] transition-all p-1 flex items-center justify-center"
                  title="Eliminar canción"
                >
                  <IconoEliminar className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {mostrarFormulario && (
        <FormularioCancion
          albumIdFijo={parseInt(albumId, 10)}
          onCreada={handleCancionCreada}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
}

function IconoEliminar({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconoNota({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7" cy="18" r="3" fill="currentColor" />
      <circle cx="17" cy="16" r="3" fill="currentColor" />
      <path
        d="M10 18V5l10-2v13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconoPlay({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconoCheck({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12l5 5 9-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconoAleatorio({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 6h3.5L15 18h6M3 18h3.5L11 12M18 6h3M18 6l-2-2M18 6l-2 2M21 18l-2-2M21 18l-2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconoPuntos({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
