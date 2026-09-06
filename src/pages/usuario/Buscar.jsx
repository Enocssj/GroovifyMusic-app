import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { useReproductor } from "../../app/ReproductorContext"; // ajusta la ruta según dónde esté este archivo

const generos = [
  { nombre: "Pop", color: "from-purple-500 to-purple-700" },
  { nombre: "Rock", color: "from-rose-500 to-rose-800" },
  { nombre: "Jazz", color: "from-sky-600 to-sky-900" },
  { nombre: "Reggaetón", color: "from-yellow-600 to-yellow-800" },
];

export default function Buscar() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const navigate = useNavigate();
  const { reproducirCancion } = useReproductor();

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
    artista: cancion.artista?.alias,
    duracion: formatearDuracion(cancion.duracionSegundos),
    archivoAudio: cancion.archivoAudio,
    portada: cancion.portada || cancion.album?.portada || null,
  });

  const manejarReproducirCancion = (indice) => {
    const lista = resultados.canciones.map(mapearParaReproductor);
    reproducirCancion(lista[indice], lista.slice(indice + 1));
    navigate("/reproduciendo");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      <div className="px-8 pt-6 pb-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Buscar</h1>

        <form onSubmit={manejarBusqueda} className="relative mb-10">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Canciones, artistas, álbumes..."
            className="w-full bg-[#221f2e] border border-[#3a3550] rounded-full pl-11 pr-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>

        {buscando ? (
          <p className="text-center text-slate-400">Buscando...</p>
        ) : resultados === null ? (
          <>
            <h2 className="text-lg font-bold text-white mb-4">Explorar géneros</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {generos.map((genero) => (
                <div
                  key={genero.nombre}
                  className={`h-32 rounded-xl bg-gradient-to-br ${genero.color} flex items-end p-4 cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  <span className="text-white font-semibold text-lg">{genero.nombre}</span>
                </div>
              ))}
            </div>
          </>
        ) : sinResultados ? (
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {resultados.artistas.map((artista) => (
                    <div
                      key={artista.id}
                      onClick={() => navigate(`/artista/${artista.id}`)}
                      className="cursor-pointer group text-center"
                    >
                      {artista.imagen ? (
                        <img
                          src={artista.imagen}
                          alt={artista.alias}
                          className="aspect-square rounded-full object-cover mb-3 group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="aspect-square rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-3 group-hover:opacity-90 transition-opacity" />
                      )}
                      <p className="text-white font-semibold">{artista.alias}</p>
                      <p className="text-slate-500 text-sm">Artista</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultados.albumes.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-white mb-4">Álbumes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {resultados.albumes.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="cursor-pointer group"
                    >
                      {album.portada ? (
                        <img
                          src={album.portada}
                          alt={album.nombre}
                          className="aspect-square w-full rounded-xl object-cover group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-end p-4 group-hover:opacity-90 transition-opacity">
                          <span className="text-white font-semibold">{album.nombre}</span>
                        </div>
                      )}
                      <p className="text-white font-semibold mt-2">{album.nombre}</p>
                      <p className="text-slate-500 text-sm">{album.artista?.alias}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultados.canciones.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Canciones</h2>
                <div className="flex flex-col">
                  {resultados.canciones.map((cancion, indice) => (
                    <div
                      key={cancion.id}
                      onClick={() => manejarReproducirCancion(indice)}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {cancion.portada ? (
                        <img
                          src={cancion.portada}
                          alt={cancion.nombre}
                          className="w-11 h-11 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-md bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{cancion.nombre}</p>
                        <p className="text-slate-500 text-xs truncate">{cancion.artista?.alias}</p>
                      </div>
                      <span className="text-slate-500 text-xs shrink-0">
                        {formatearDuracion(cancion.duracionSegundos)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}