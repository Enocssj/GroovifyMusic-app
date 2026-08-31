// Datos de ejemplo — luego los reemplazas por lo que venga de tu servicio/API
const album = {
  nombre: "Nocturno",
  artista: "Kira Luz",
  anio: 2024,
  totalCanciones: 10,
  duracionTotal: "38 min",
  portadaUrl: null, // cuando tengas la URL real de la portada, va aquí
};

const canciones = [
  { id: 1, titulo: "Bajo Neón", duracion: "3:47" },
  { id: 2, titulo: "Ciudad Dormida", duracion: "3:12" },
  { id: 3, titulo: "Espejismo", duracion: "4:01" },
  { id: 4, titulo: "Piel de Vidrio", duracion: "3:28" },
  { id: 5, titulo: "Insomnio", duracion: "2:54" },
  { id: 6, titulo: "Distancia Azul", duracion: "3:40" },
  { id: 7, titulo: "Reflejo", duracion: "3:05" },
  { id: 8, titulo: "Nocturno", duracion: "4:15" },
  { id: 9, titulo: "Silencio", duracion: "4:22" },
  { id: 10, titulo: "Amanecer", duracion: "5:16" },
];

export default function AlbumDetalle({ nombreAlbum, onVolver }) {
  return (
    <div className="min-h-screen bg-[#0f0b1a] text-white px-10 py-10">
      {/* Botón de regreso */}
      <button
        type="button"
        onClick={onVolver}
        aria-label="Volver al perfil"
        className="text-[#b9b3d0] hover:text-white transition-colors mb-6 flex items-center gap-2 text-sm"
      >
        <IconoFlechaAtras className="w-4 h-4" />
        Volver
      </button>

      {/* Encabezado del álbum */}
      <div className="flex items-end gap-6 mb-6">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-[#9a8ef0] to-[#4a3d78] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {album.portadaUrl ? (
            <img
              src={album.portadaUrl}
              alt={`Portada del álbum ${album.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconoNota className="w-12 h-12 text-[#e5e0f7]" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#a29cba] tracking-wide">Álbum</span>
          <h1 className="text-3xl md:text-4xl font-medium">
            {nombreAlbum ?? album.nombre}
          </h1>
          <span className="text-sm text-[#c7c1de]">
            <span className="font-medium text-white">{album.artista}</span> ·
            {" "}Álbum · {album.anio}
          </span>
          <span className="text-xs text-[#79738f]">
            {album.totalCanciones} canciones · {album.duracionTotal}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4 mb-7">
        <button
          type="button"
          className="bg-[#8b7ee0] text-[#1a1330] rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[#9a8ef0] transition-colors"
        >
          <IconoPlay className="w-4 h-4" />
          Reproducir
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

        <button
          type="button"
          aria-label="Más opciones"
          className="text-[#b9b3d0] p-2 ml-auto hover:text-white transition-colors"
        >
          <IconoPuntos className="w-5 h-5" />
        </button>
      </div>

      {/* Lista de canciones */}
      <div className="flex flex-col">
        <div className="grid grid-cols-[24px_1fr_70px] gap-4 px-3 py-2 text-xs text-[#79738f] border-b border-[#2a2440]">
          <span>#</span>
          <span>Título</span>
          <span className="text-right">Duración</span>
        </div>

        {canciones.map((cancion, index) => {
          const esActual = cancion.titulo === album.nombre;
          return (
            <div
              key={cancion.id}
              className={`grid grid-cols-[24px_1fr_70px] gap-4 px-3 py-2.5 items-center rounded-md hover:bg-white/5 transition-colors ${
                esActual ? "bg-[#8b7ee0]/10" : ""
              }`}
            >
              <span
                className={`text-sm ${
                  esActual ? "text-[#8b7ee0]" : "text-[#79738f]"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-sm font-medium ${
                  esActual ? "text-[#8b7ee0]" : ""
                }`}
              >
                {cancion.titulo}
              </span>
              <span
                className={`text-right text-sm ${
                  esActual ? "text-[#8b7ee0]" : "text-[#a29cba]"
                }`}
              >
                {cancion.duracion}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Íconos en SVG puro, sin dependencias extra ---

function IconoFlechaAtras({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconoCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}