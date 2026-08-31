import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Datos de ejemplo mientras no hay resultados reales del backend
const albumesData = {
  nocturno: {
    nombre: "Nocturno",
    artista: "Kira Luz",
    artistaId: "kira-luz",
    anio: "2024",
    canciones: [
      { titulo: "Bajo Neón", duracion: "3:47" },
      { titulo: "Ciudad Dormida", duracion: "3:12" },
      { titulo: "Espejismo", duracion: "4:01" },
      { titulo: "Piel de Vidrio", duracion: "3:28" },
      { titulo: "Insomnio", duracion: "2:54" },
      { titulo: "Distancia Azul", duracion: "3:40" },
      { titulo: "Reflejo", duracion: "3:05" },
      { titulo: "Nocturno", duracion: "4:15" },
      { titulo: "Silencio", duracion: "4:22" },
      { titulo: "Amanecer", duracion: "5:16" },
    ],
  },
};

function calcularDuracionTotal(canciones) {
  const totalSegundos = canciones.reduce((acumulado, cancion) => {
    const [min, seg] = cancion.duracion.split(":").map(Number);
    return acumulado + min * 60 + seg;
  }, 0);
  return `${Math.round(totalSegundos / 60)} min`;
}

export default function AlbumDetalle() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const album = albumesData[albumId];

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [enBiblioteca, setEnBiblioteca] = useState(true);

  if (!album) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f0d14]">
        <p className="text-slate-400">Álbum no encontrado</p>
      </div>
    );
  }

  const manejarCompartir = () => {
    navigator.clipboard?.writeText(window.location.href);
    setMenuAbierto(false);
  };

  const manejarIrAlArtista = () => {
    navigate(`/artista/${album.artistaId}`);
    setMenuAbierto(false);
  };

  const manejarToggleBiblioteca = () => {
    setEnBiblioteca(!enBiblioteca);
    setMenuAbierto(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Header con degradado a todo lo ancho */}
      <div className="bg-gradient-to-b from-purple-800 to-[#3c1e5a] px-8 pt-10 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors mb-8"
        >
          <i className="pi pi-chevron-left" />
        </button>

        <div className="flex items-end gap-6">
          <div className="w-52 h-52 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 shadow-2xl">
            <i className="pi pi-headphones text-white text-6xl" />
          </div>
          <div>
            <p className="text-sm text-slate-200 mb-2">Álbum</p>
            <h1 className="text-6xl font-extrabold text-white mb-4">{album.nombre}</h1>
            <p className="text-sm text-slate-300">
              {album.artista} • {album.anio} • {album.canciones.length} canciones, {calcularDuracionTotal(album.canciones)}
            </p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-6 px-8 pt-8 relative">
        <button className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-400 hover:scale-105 flex items-center justify-center transition-all">
          <i className="pi pi-play text-white text-xl ml-0.5" />
        </button>
        <button className="text-slate-300 hover:text-white transition-colors">
          <i className="pi pi-sync text-2xl" />
        </button>
        <button
          onClick={manejarToggleBiblioteca}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            enBiblioteca
              ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
              : "border border-slate-500 hover:border-white text-slate-300 hover:text-white"
          }`}
        >
          <i className="pi pi-check" />
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
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuAbierto(false)}
              />
              <div className="absolute left-0 top-10 z-50 w-56 bg-[#282828] rounded-lg shadow-xl py-2">
                <button
                  onClick={manejarToggleBiblioteca}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className={enBiblioteca ? "pi pi-check-circle text-purple-400" : "pi pi-plus-circle"} />
                  {enBiblioteca ? "Eliminar de Tu biblioteca" : "Añadir a Tu biblioteca"}
                </button>
                <button
                  onClick={() => setMenuAbierto(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className="pi pi-list" />
                  Añadir a playlist
                </button>
                <button
                  onClick={manejarCompartir}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className="pi pi-share-alt" />
                  Compartir
                </button>
                <button
                  onClick={manejarIrAlArtista}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors text-left"
                >
                  <i className="pi pi-user" />
                  Ir al perfil del artista
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="px-8 pt-8 pb-12">
        <div className="border-b border-[#2a2635] pb-2 mb-2 flex items-center px-3">
          <span className="text-slate-500 text-xs w-8">#</span>
          <span className="text-slate-500 text-xs flex-1">TÍTULO</span>
          <span className="text-slate-500 text-xs">DURACIÓN</span>
        </div>
        <div>
          {album.canciones.map((cancion, indice) => (
            <div
              key={cancion.titulo}
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-[#221f2e] transition-colors cursor-pointer"
            >
              <span className="text-slate-500 w-8 text-sm">{indice + 1}</span>
              <span className="text-white text-sm font-medium flex-1">{cancion.titulo}</span>
              <span className="text-slate-500 text-sm">{cancion.duracion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}