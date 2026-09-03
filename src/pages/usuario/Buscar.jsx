import { useState } from "react";
import { useNavigate } from "react-router-dom";

const generos = [
  { nombre: "Pop", color: "from-purple-500 to-purple-700" },
  { nombre: "Rock", color: "from-rose-500 to-rose-800" },
  { nombre: "Jazz", color: "from-sky-600 to-sky-900" },
  { nombre: "Reggaetón", color: "from-yellow-600 to-yellow-800" },
];

// Datos de ejemplo mientras no hay resultados reales del backend
const artistasDisponibles = [{ id: "kira-luz", nombre: "Kira Luz" }];

const albumesDisponibles = [
  { id: "nocturno", nombre: "Nocturno", artista: "Kira Luz" },
  { id: "neon", nombre: "Neón", artista: "Kira Luz" },
  { id: "ecos", nombre: "Ecos", artista: "Kira Luz" },
];

export default function Buscar() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState(null);
  const navigate = useNavigate();

  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      setResultados(null);
      return;
    }

    const artistas = artistasDisponibles.filter((artista) =>
      artista.nombre.toLowerCase().includes(termino)
    );
    const albumes = albumesDisponibles.filter((album) =>
      album.nombre.toLowerCase().includes(termino)
    );

    setResultados({ artistas, albumes });
  };

  const sinResultados =
    resultados && resultados.artistas.length === 0 && resultados.albumes.length === 0;

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

        {resultados === null ? (
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
                      <div className="aspect-square rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-3 group-hover:opacity-90 transition-opacity" />
                      <p className="text-white font-semibold">{artista.nombre}</p>
                      <p className="text-slate-500 text-sm">Artista</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultados.albumes.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Álbumes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {resultados.albumes.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-end p-4 group-hover:opacity-90 transition-opacity">
                        <span className="text-white font-semibold">{album.nombre}</span>
                      </div>
                      <p className="text-slate-500 text-sm mt-2">{album.artista}</p>
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