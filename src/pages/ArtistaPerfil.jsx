import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReproductor } from "../app/ReproductorContext";

const artistaEjemplo = {
  nombre: "Kira Luz",
  oyentesMensuales: "2.4M oyentes mensuales",
  bio: "Del barrio a las luces de neón. Mezcla synth oscuro con flow callejero — nadie suena como ella.",
  populares: [
    { titulo: "Bajo Neón", artista: "Kira Luz", reproducciones: "14.8M reproducciones", duracion: "3:47" },
    { titulo: "Ciudad Dormida", artista: "Kira Luz", reproducciones: "8.3M reproducciones", duracion: "3:12" },
    { titulo: "Espejismo", artista: "Kira Luz", reproducciones: "5.9M reproducciones", duracion: "4:01" },
  ],
  albumes: [{ id: "nocturno", nombre: "Nocturno" }],
};

export default function ArtistaPerfil() {
  const navigate = useNavigate();
  const { reproducirCancion } = useReproductor();
  const [siguiendo, setSiguiendo] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarToggleSeguir = () => {
    setSiguiendo(!siguiendo);
    setMenuAbierto(false);
  };

  const manejarCompartir = () => {
    navigator.clipboard?.writeText(window.location.href);
    setMenuAbierto(false);
  };

  const manejarReproducir = (indice) => {
    const cancion = artistaEjemplo.populares[indice];
    const resto = artistaEjemplo.populares.filter((_, i) => i !== indice);
    reproducirCancion(cancion, resto);
    navigate("/reproduciendo");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Banner grande de fondo */}
      <div className="relative h-72 bg-gradient-to-br from-purple-700 via-purple-900 to-[#0f0d14] flex items-end px-8 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-8 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
        >
          <i className="pi pi-chevron-left" />
        </button>

        <div>
          <h1 className="text-7xl font-extrabold text-white mb-3">{artistaEjemplo.nombre}</h1>
          <div className="flex items-center gap-2 mb-1">
            <i className="pi pi-verified text-blue-400" />
            <span className="text-sm text-white font-medium">Verificado</span>
          </div>
          <p className="text-sm text-slate-200">{artistaEjemplo.oyentesMensuales}</p>
        </div>
      </div>

      {/* Barra de controles */}
      <div className="flex items-center gap-5 px-8 py-6 relative">
        <button
          onClick={() => manejarReproducir(0)}
          className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-400 hover:scale-105 flex items-center justify-center transition-all"
        >
          <i className="pi pi-play text-white text-xl ml-0.5" />
        </button>
        <button className="text-slate-300 hover:text-white transition-colors">
          <i className="pi pi-sync text-2xl" />
        </button>
        <button
          onClick={() => setSiguiendo(!siguiendo)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            siguiendo
              ? "border border-slate-500 text-white hover:bg-[#221f2e]"
              : "bg-purple-500 hover:bg-purple-400 text-white"
          }`}
        >
          {siguiendo ? "Siguiendo" : "Seguir"}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <i className="pi pi-ellipsis-h text-xl" />
          </button>

          {menuAbierto && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
              <div className="absolute left-0 top-10 z-50 w-56 bg-[#282828] rounded-lg shadow-xl py-2">
                <button
                  onClick={manejarToggleSeguir}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className={siguiendo ? "pi pi-user-minus" : "pi pi-user-plus"} />
                  {siguiendo ? "Siguiendo" : "Seguir"}
                </button>
                <button
                  onClick={manejarCompartir}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className="pi pi-share-alt" />
                  Compartir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-8 pb-12 max-w-3xl">
        <p className="text-slate-300 text-sm mb-8">{artistaEjemplo.bio}</p>

        <h2 className="text-xl font-bold text-white mb-4">Populares</h2>
        <div className="space-y-1 mb-10">
          {artistaEjemplo.populares.map((cancion, indice) => (
            <div
              key={cancion.titulo}
              onClick={() => manejarReproducir(indice)}
              className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-[#221f2e] transition-colors cursor-pointer"
            >
              <span className="text-slate-500 w-4 text-sm">{indice + 1}</span>
              <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{cancion.titulo}</p>
                <p className="text-slate-500 text-xs">{cancion.reproducciones}</p>
              </div>
              <span className="text-slate-500 text-sm">{cancion.duracion}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Álbumes</h2>
        <div className="grid grid-cols-3 gap-5">
          {artistaEjemplo.albumes.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/album/${album.id}`)}
              className="cursor-pointer group"
            >
              <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-purple-700 flex items-end p-3 group-hover:opacity-90 transition-opacity">
                <span className="text-white font-semibold text-sm">{album.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}