import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useReproductor } from "../../app/ReproductorContext";
import axiosClient from "../../services/axiosClient";
import FormularioAlbum from "./FormularioAlbum";
import FormularioCancion from "./FormularioCancion";
import ListaCancionesModal from "./ListaCancionesModal";
import EditarPerfilArtistaModal from "./EditarPerfilArtistaModal";

export default function ArtistaPerfil() {
  const navigate = useNavigate();
  const { artistaId } = useParams();
  const { usuario } = useAuth();
  const { reproducirCancion } = useReproductor();

  const esPerfilPropio = !artistaId;
  const idAMostrar = esPerfilPropio ? usuario?.id : artistaId;

  const [artista, setArtista] = useState(null);
  const [cargandoArtista, setCargandoArtista] = useState(true);

  const [cancionesPopulares, setCancionesPopulares] = useState([]);
  const [cargandoPopulares, setCargandoPopulares] = useState(true);

  const [albumes, setAlbumes] = useState([]);
  const [cargandoAlbumes, setCargandoAlbumes] = useState(true);

  const [mostrarFormAlbum, setMostrarFormAlbum] = useState(false);
  const [mostrarFormCancion, setMostrarFormCancion] = useState(false);
  const [mostrarListaCanciones, setMostrarListaCanciones] = useState(false);
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);

  useEffect(() => {
    if (!idAMostrar) {
      setCargandoArtista(false);
      return;
    }
    const cargarArtista = async () => {
      setCargandoArtista(true);
      try {
        const response = await axiosClient.get(`/usuarios/${idAMostrar}`);
        setArtista(response.data);
      } catch (err) {
        console.error("Error al cargar el perfil del artista:", err);
      } finally {
        setCargandoArtista(false);
      }
    };
    cargarArtista();
  }, [idAMostrar]);

  useEffect(() => {
  if (!idAMostrar) {
    setCargandoPopulares(false);
    return;
  }
  const cargarPopulares = async () => {
    setCargandoPopulares(true);
    try {
      const response = await axiosClient.get(`/canciones/artista/${idAMostrar}/populares`, {
        params: { limit: 10 },
      });
      setCancionesPopulares(response.data);
    } catch (err) {
      console.error("Error al cargar canciones populares:", err);
    } finally {
      setCargandoPopulares(false);
    }
  };
  cargarPopulares();
}, [idAMostrar]);


  useEffect(() => {
    if (!esPerfilPropio || !usuario?.id) {
      setCargandoAlbumes(false);
      return;
    }
    const cargarAlbumes = async () => {
      try {
        const response = await axiosClient.get(`/album/artista/${usuario.id}`);
        setAlbumes(response.data);
      } catch (err) {
        console.error("Error al cargar álbumes:", err);
      } finally {
        setCargandoAlbumes(false);
      }
    };
    cargarAlbumes();
  }, [esPerfilPropio, usuario?.id]);

  const formatearDuracion = (segundosTotales) => {
    if (!segundosTotales) return "0:00";
    const mins = Math.floor(segundosTotales / 60);
    const segs = segundosTotales % 60;
    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  };

  const handleAlbumCreado = (albumCreado) => {
    setAlbumes([...albumes, albumCreado]);
    setMostrarFormAlbum(false);
  };

  const handleCancionCreada = (cancionCreada) => {
  setMostrarFormCancion(false);
  if (idAMostrar) {
    axiosClient
      .get(`/canciones/artista/${idAMostrar}/populares`, { params: { limit: 10 } })
      .then((res) => setCancionesPopulares(res.data))
      .catch((err) => console.error("Error al refrescar populares:", err));
  }
};


  const handlePerfilGuardado = (usuarioActualizado) => {
    setArtista(usuarioActualizado);
  };

  const mapearParaReproductor = (cancion) => ({
    id: cancion.id,
    titulo: cancion.nombre,
    artista: artista?.alias,
    duracion: formatearDuracion(cancion.duracionSegundos),
    archivoAudio: cancion.archivoAudio,
    portada: cancion.portada || null,
  });

  const manejarReproducirDesde = (indice) => {
    const lista = cancionesPopulares.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  if (cargandoArtista) {
    return (
      <div className="min-h-screen bg-[#0f0b1a] text-white flex items-center justify-center">
        <p className="text-[#79738f]">Cargando perfil...</p>
      </div>
    );
  }

  if (!artista) {
    return (
      <div className="min-h-screen bg-[#0f0b1a] text-white flex items-center justify-center">
        <p className="text-[#79738f]">No se pudo cargar este perfil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0b1a] text-white flex-1 overflow-y-auto">
      <div className="relative bg-gradient-to-b from-[#6b4fc7] to-[#2a1f45] px-8 py-10 flex items-end gap-6">
        {esPerfilPropio && (
          <button
            type="button"
            onClick={() => setMostrarEditarPerfil(true)}
            className="absolute top-5 right-8 flex items-center gap-2 border border-white/30 text-white/90 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <IconoEditar className="w-4 h-4" />
            Editar perfil
          </button>
        )}

        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#3a3155] border-4 border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {artista.imagen ? (
            <img
              src={artista.imagen}
              alt={`Foto de perfil de ${artista.alias}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconoUsuario className="w-14 h-14 text-[#cfc9e6]" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#d9d3ee] tracking-wide">Artista</span>
          <h1 className="text-3xl md:text-4xl font-medium flex items-center gap-2">
            {artista.alias}
          </h1>
        </div>
      </div>

      {esPerfilPropio && (
        <div className="px-8 pt-5 flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setMostrarFormAlbum(true)}
            className="border border-[#8b7ee0] text-[#8b7ee0] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#8b7ee0]/10 transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Agregar album
          </button>

          <button
            type="button"
            onClick={() => setMostrarFormCancion(true)}
            className="border border-[#8b7ee0] text-[#8b7ee0] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#8b7ee0]/10 transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Agregar Canción
          </button>

          <button
            type="button"
            onClick={() => setMostrarListaCanciones(true)}
            className="bg-[#8b7ee0] text-[#1a1330] rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[#9a8ef0] transition-colors"
          >
            <IconoPlay className="w-4 h-4" />
            Mis Canciones
          </button>

          <button
            type="button"
            aria-label="Más opciones"
            className="text-[#b9b3d0] p-2 hover:text-white transition-colors ml-auto"
          >
            <IconoPuntos className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="px-8 pt-4 pb-6 text-sm text-[#a29cba] max-w-xl leading-relaxed">
        {artista.biografia || "Aún no has agregado una biografía."}
      </p>

      <section className="px-8 pb-8">
        <h2 className="text-lg font-medium mb-3">Populares</h2>
        <div className="flex flex-col">
          <div className="grid grid-cols-[24px_1fr_100px_60px] gap-4 px-3 py-2 text-xs text-[#79738f] border-b border-[#2a2440]">
            <span>#</span>
            <span>Título</span>
            <span className="text-right">Reproducciones</span>
            <span className="text-right">Duración</span>
          </div>

          {cargandoPopulares ? (
            <p className="text-sm text-[#79738f] py-4">Cargando canciones...</p>
          ) : cancionesPopulares.length === 0 ? (
            <p className="text-sm text-[#79738f] py-4">Aún no hay canciones</p>
          ) : (
            cancionesPopulares.map((cancion, index) => (
              <div
                key={cancion.id}
                onClick={() => manejarReproducirDesde(index)}
                className="grid grid-cols-[24px_1fr_100px_60px] gap-4 px-3 py-3 items-center rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-[#79738f] text-sm">{index + 1}</span>
                <div className="flex items-center gap-3">
                  {cancion.portada ? (
                    <img
                      src={cancion.portada}
                      alt={cancion.nombre}
                      className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-[#4a3d78] flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{cancion.nombre}</span>
                </div>
                <span className="text-right text-sm text-[#a29cba]">
                  {cancion.reproducciones}
                </span>
                <span className="text-right text-sm text-[#a29cba]">
                  {formatearDuracion(cancion.duracionSegundos)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="px-8 pb-10">
        <h2 className="text-lg font-medium mb-3">Álbumes</h2>
        {cargandoAlbumes ? (
          <p className="text-sm text-[#79738f]">Cargando álbumes...</p>
        ) : albumes.length === 0 ? (
          <p className="text-sm text-[#79738f]">
            Aún no tienes álbumes creados
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-xl">
            {albumes.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => navigate(`/album/${album.id}`)}
                className="flex flex-col gap-2 text-left group"
              >
                {album.portada ? (
                  <img
                    src={album.portada}
                    alt={album.nombre}
                    className="w-full aspect-square rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-[#7a63c9] to-[#3a2d5c] group-hover:opacity-90 transition-opacity" />
                )}
                <span className="text-sm font-medium">{album.nombre}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {mostrarFormAlbum && (
        <FormularioAlbum
          onCreado={handleAlbumCreado}
          onCancelar={() => setMostrarFormAlbum(false)}
        />
      )}

      {mostrarFormCancion && (
        <FormularioCancion
          onCreada={handleCancionCreada}
          onCancelar={() => setMostrarFormCancion(false)}
        />
      )}

      {mostrarListaCanciones && (
        <ListaCancionesModal
          canciones={cancionesPopulares.map((c) => ({
            id: c.id,
            titulo: c.nombre,
            duracion: formatearDuracion(c.duracionSegundos),
            portadaUrl: c.portada,
          }))}
          onEliminar={() => {}}
          onCerrar={() => setMostrarListaCanciones(false)}
        />
      )}

      {mostrarEditarPerfil && (
        <EditarPerfilArtistaModal
          onGuardado={handlePerfilGuardado}
          onCancelar={() => setMostrarEditarPerfil(false)}
        />
      )}
    </div>
  );
}

function IconoEditar({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
