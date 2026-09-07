import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useReproductor } from "../../app/ReproductorContext";
import axiosClient from "../../services/axiosClient";

export default function Home() {
  const { usuario, estaAutenticado } = useAuth();
  const { reproducirCancion } = useReproductor();
  const navigate = useNavigate();
  const nombreUsuario = usuario?.nombre || usuario?.alias || "Usuario";

  // Estados de Home
  const [playlistsDestacadas, setPlaylistsDestacadas] = useState([]);
  const [cargandoDestacadas, setCargandoDestacadas] = useState(true);

  const [popularAhora, setPopularAhora] = useState([]);
  const [cargandoPopulares, setCargandoPopulares] = useState(true);

  // Estados de Búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const cargarDestacadas = async () => {
      try {
        const response = await axiosClient.get("/playlists/destacadas");
        setPlaylistsDestacadas(response.data);
      } catch (err) {
        console.error("Error al cargar playlists destacadas:", err);
      } finally {
        setCargandoDestacadas(false);
      }
    };
    cargarDestacadas();
  }, []);

  useEffect(() => {
    const cargarPopulares = async () => {
      try {
        const response = await axiosClient.get("/canciones/populares", {
          params: { limit: 8 },
        });
        setPopularAhora(response.data);
      } catch (err) {
        console.error("Error al cargar canciones populares:", err);
      } finally {
        setCargandoPopulares(false);
      }
    };
    cargarPopulares();
  }, []);

  // Lógica de Búsqueda
  const manejarBusqueda = async (evento) => {
    evento.preventDefault();
    const termino = busqueda.trim();

    if (!termino) {
      setResultados(null);
      return;
    }

    setBuscando(true);
    try {
      const [artistasRes, albumesRes, cancionesRes] = await Promise.all([
        axiosClient.get(`/usuarios/search`, { params: { alias: termino } }),
        axiosClient.get(`/album/search`, { params: { nombre: termino } }),
        axiosClient.post(`/canciones/search`, { nombre: termino }),
      ]);

      setResultados({
        artistas: artistasRes.data,
        albumes: albumesRes.data,
        canciones: cancionesRes.data,
      });
    } catch (err) {
      console.error("Error al buscar:", err);
      setResultados({ artistas: [], albumes: [], canciones: [] });
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setResultados(null);
  };

  const sinResultados =
    resultados &&
    resultados.artistas.length === 0 &&
    resultados.albumes.length === 0 &&
    resultados.canciones.length === 0;

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

  const manejarReproducirPopulares = (indice) => {
    const lista = popularAhora.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  const manejarReproducirBusqueda = (indice) => {
    const lista = resultados.canciones.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Header con la barra de búsqueda centrada en pantalla */}
      <div className="grid grid-cols-3 items-center px-8 pt-6 mb-6">
        <div /> {/* Espaciador izquierdo para centrado exacto */}

        {/* Buscador Centrado */}
        <form onSubmit={manejarBusqueda} className="relative w-full max-w-lg mx-auto">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              if (!e.target.value.trim()) setResultados(null);
            }}
            placeholder="¿Qué quieres escuchar hoy?"
            className="w-full bg-[#221f2e] border border-[#3a3550] rounded-full pl-11 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-lg"
          />
          {busqueda && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <i className="pi pi-times text-xs" />
            </button>
          )}
        </form>

        {/* Perfil alineado a la derecha */}
        <div className="flex items-center justify-end gap-3">
          {estaAutenticado ? (
            <Link to="/perfil" className="hover:opacity-80 transition-opacity">
              {usuario?.fotoUrl ? (
                <img
                  src={usuario.fotoUrl}
                  alt="Foto de perfil"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <i className="pi pi-user" />
                </div>
              )}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-purple-500 hover:bg-purple-400 px-5 py-2 rounded-full transition-colors"
              >
                Registrarte
              </Link>
            </>
          )}
        </div>
      </div>

      {!resultados && (
        <div className="px-8 pt-2 pb-6">
          {estaAutenticado ? (
            <h1 className="text-3xl font-bold text-white">
              {usuario?.rol === "ARTISTA"
                ? `¡Hola, ${nombreUsuario}! Gestiona tu música y descubre tendencias`
                : `¡Sube el volumen, ${nombreUsuario}! Bienvenido a tu escenario`}
            </h1>
          ) : (
            <>
              <p className="text-slate-400 text-sm">Bienvenido</p>
              <h1 className="text-3xl font-bold text-white">
                Descubre y escucha música libremente
              </h1>
            </>
          )}
        </div>
      )}

      {buscando ? (
        <div className="px-8 py-12 text-center text-slate-400">
          <i className="pi pi-spin pi-spinner text-2xl mb-2" />
          <p>Buscando...</p>
        </div>
      ) : resultados !== null ? (
        <div className="px-8 pb-10">
          {sinResultados ? (
            <div className="text-center py-16">
              <i className="pi pi-search text-slate-600 text-4xl mb-4" />
              <p className="text-slate-400">
                No se encontraron resultados para "{busqueda}"
              </p>
            </div>
          ) : (
            <>
              {resultados.artistas.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-white mb-4">Artistas</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {resultados.artistas.map((artista) => (
                      <div
                        key={artista.id}
                        onClick={() => navigate(`/artista/${artista.id}`)}
                        className="cursor-pointer group text-center bg-[#181524] p-4 rounded-xl hover:bg-[#221e33] transition-colors"
                      >
                        {artista.imagen ? (
                          <img
                            src={artista.imagen}
                            alt={artista.alias}
                            className="aspect-square rounded-full object-cover mb-3 mx-auto group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="aspect-square rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-3 flex items-center justify-center">
                            <i className="pi pi-user text-3xl text-white/50" />
                          </div>
                        )}
                        <p className="text-white font-semibold truncate">
                          {artista.alias}
                        </p>
                        <p className="text-slate-500 text-sm">Artista</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultados.albumes.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-white mb-4">Álbumes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {resultados.albumes.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => navigate(`/album/${album.id}`)}
                        className="cursor-pointer group bg-[#181524] p-4 rounded-xl hover:bg-[#221e33] transition-colors"
                      >
                        {album.portada ? (
                          <img
                            src={album.portada}
                            alt={album.nombre}
                            className="aspect-square w-full rounded-lg object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 mb-3 flex items-center justify-center">
                            <i className="pi pi-book text-3xl text-white/50" />
                          </div>
                        )}
                        <p className="text-white font-semibold truncate">
                          {album.nombre}
                        </p>
                        <p className="text-slate-500 text-sm truncate">
                          {album.artista?.alias}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Canciones en Tarjetas Grandes de Grilla */}
              {resultados.canciones.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Canciones</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {resultados.canciones.map((cancion, indice) => (
                      <div
                        key={cancion.id}
                        onClick={() => manejarReproducirBusqueda(indice)}
                        className="bg-[#181524] p-4 rounded-xl cursor-pointer group hover:bg-[#221e33] transition-colors flex flex-col"
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#2a253b] relative">
                          {cancion.portada || cancion.album?.portada ? (
                            <img
                              src={cancion.portada || cancion.album?.portada}
                              alt={cancion.nombre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                              <i className="pi pi-music text-3xl text-white/50" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                          {cancion.nombre}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {cancion.artista?.alias || "Artista"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatearDuracion(cancion.duracionSegundos)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="px-8 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">
              Playlists destacadas
            </h2>
            {cargandoDestacadas ? (
              <p className="text-sm text-slate-500">Cargando...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {playlistsDestacadas.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className="h-32 rounded-xl overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {playlist.portada ? (
                      <img
                        src={playlist.portada}
                        alt={playlist.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-700" />
                    )}
                    <span className="absolute bottom-4 left-4 text-white font-semibold">
                      {playlist.nombre}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-8 pb-8">
            <h2 className="text-lg font-bold text-white mb-4">
              Canciones Populares ahora
            </h2>
            {cargandoPopulares ? (
              <p className="text-sm text-slate-500">Cargando...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {popularAhora.map((cancion, indice) => (
                  <div
                    key={cancion.id}
                    onClick={() => manejarReproducirPopulares(indice)}
                    className="bg-[#181524] p-4 rounded-xl cursor-pointer group hover:bg-[#221e33] transition-colors flex flex-col"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#2a253b] relative">
                      {cancion.portada ? (
                        <img
                          src={cancion.portada}
                          alt={cancion.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center">
                          <i className="pi pi-music text-3xl text-white/50" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white truncate">
                      {cancion.nombre}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatearDuracion(cancion.duracionSegundos)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}