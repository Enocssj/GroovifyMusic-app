import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormularioAlbum from "./FormularioAlbum";
import FormularioCancion from "./FormularioCancion";
import ListaCancionesModal from "./ListaCancionesModal";


const artista = {
  nombre: "Aracely Hernández",
  verificado: true,
  oyentesMensuales: "2.4M",
  biografia:
    "nadie suena como ella.",
  fotoUrl: null,
};

const cancionesIniciales = [
  { id: 1, titulo: "Bajo Neón", reproducciones: "14.8M", duracion: "3:47" },
  { id: 2, titulo: "Ciudad Dormida", reproducciones: "8.3M", duracion: "3:12" },
  { id: 3, titulo: "Espejismo", reproducciones: "5.9M", duracion: "4:01" },
];

const albumesIniciales = [
  { id: 1, nombre: "Rock" },
  { id: 2, nombre: "Banda" },
  { id: 3, nombre: "Romanticas" },
];

export default function ArtistaPerfil() {
  const navigate = useNavigate();
  const { artistaId } = useParams();


  const [cancionesPopulares, setCancionesPopulares] = useState(cancionesIniciales);
  const [albumes, setAlbumes] = useState(albumesIniciales);

  const [mostrarFormAlbum, setMostrarFormAlbum] = useState(false);
  const [mostrarFormCancion, setMostrarFormCancion] = useState(false);
  const [mostrarListaCanciones, setMostrarListaCanciones] = useState(false);



  const formatearSegundosAString = (segundosTotales) => {
    const mins = Math.floor(segundosTotales / 60);
    const segs = segundosTotales % 60;
    return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
  };

  
  const handleAgregarAlbum = (nuevoAlbum) => {
    const estructuraAlbum = {
      id: Date.now(), 
      nombre: nuevoAlbum.nombre_album,
    };
    setAlbumes([...albumes, estructuraAlbum]);
    setMostrarFormAlbum(false); 
  };
const handleEliminarCancion = (id) => {
  setCancionesPopulares(cancionesPopulares.filter((cancion) => cancion.id !== id));
};


  const handleAgregarCancion = (nuevaCancion) => {
    const estructuraCancion = {
      id: Date.now(),
      titulo: nuevaCancion.nombre,
      reproducciones: "0",
      duracion: formatearSegundosAString(nuevaCancion.duracion_segundos),
    };
    setCancionesPopulares([...cancionesPopulares, estructuraCancion]);
    setMostrarFormCancion(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0b1a] text-white">
      
      <div className="bg-gradient-to-b from-[#6b4fc7] to-[#2a1f45] px-8 py-10 flex items-end gap-6">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#3a3155] border-4 border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {artista.fotoUrl ? (
            <img
              src={artista.fotoUrl}
              alt={`Foto de perfil de ${artista.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconoUsuario className="w-14 h-14 text-[#cfc9e6]" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#d9d3ee] tracking-wide">
            Artista verificado
          </span>
          <h1 className="text-3xl md:text-4xl font-medium flex items-center gap-2">
            {artista.nombre}
            {artista.verificado && (
              <IconoVerificado className="w-6 h-6 text-[#8b7ee0]" />
            )}
          </h1>
          <span className="text-sm text-[#c7c1de]">
            {artista.oyentesMensuales} oyentes mensuales
          </span>
        </div>
      </div>

      {/* --- BARRA DE BOTONES --- */}
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

      <p className="px-8 pt-4 pb-6 text-sm text-[#a29cba] max-w-xl leading-relaxed">
        {artista.biografia}
      </p>

      {/* --- SECCIÓN POPULARES --- */}
      <section className="px-8 pb-8">
        <h2 className="text-lg font-medium mb-3">Populares</h2>
        <div className="flex flex-col">
          <div className="grid grid-cols-[24px_1fr_100px_60px] gap-4 px-3 py-2 text-xs text-[#79738f] border-b border-[#2a2440]">
            <span>#</span>
            <span>Título</span>
            <span className="text-right">Reproducciones</span>
            <span className="text-right">Duración</span>
          </div>

          {cancionesPopulares.map((cancion, index) => (
            <div
              key={cancion.id}
              className="grid grid-cols-[24px_1fr_100px_60px] gap-4 px-3 py-3 items-center rounded-md hover:bg-white/5 transition-colors"
            >
              <span className="text-[#79738f] text-sm">{index + 1}</span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#4a3d78] flex-shrink-0" />
                <span className="text-sm font-medium">{cancion.titulo}</span>
              </div>
              <span className="text-right text-sm text-[#a29cba]">
                {cancion.reproducciones}
              </span>
              <span className="text-right text-sm text-[#a29cba]">
                {cancion.duracion}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN ÁLBUMES --- */}
      <section className="px-8 pb-10">
        <h2 className="text-lg font-medium mb-3">Álbumes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-xl">
          {albumes.map((album) => (
            <button
              key={album.id}
              type="button"
              onClick={() => navigate(`/album/${album.id}`)}
              className="flex flex-col gap-2 text-left group"
            >
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-[#7a63c9] to-[#3a2d5c] group-hover:opacity-90 transition-opacity" />
              <span className="text-sm font-medium">{album.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --- INYECCIÓN CONDICIONAL DE FORMULARIOS MODALES --- */}
      {mostrarFormAlbum && (
        <FormularioAlbum 
          onAgregar={handleAgregarAlbum} 
          onCancelar={() => setMostrarFormAlbum(false)} 
        />
      )}

      {mostrarFormCancion && (
        <FormularioCancion 
          onAgregar={handleAgregarCancion} 
          onCancelar={() => setMostrarFormCancion(false)} 
        />
      )}
        
  {mostrarListaCanciones && (
    <ListaCancionesModal
      canciones={cancionesPopulares}
      onEliminar={handleEliminarCancion}
      onCerrar={() => setMostrarListaCanciones(false)}
    />
  )}
</div> 

    
  );
}

// --- ICONOS COMPONENTES SVG ---
function IconoUsuario({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconoVerificado({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l2.4 1.4 2.8-.3 1.1 2.6 2.6 1.1-.3 2.8L22 12l-1.4 2.4.3 2.8-2.6 1.1-1.1 2.6-2.8-.3L12 22l-2.4-1.4-2.8.3-1.1-2.6-2.6-1.1.3-2.8L2 12l1.4-2.4-.3-2.8 2.6-1.1L6.8 3.1l2.8.3L12 2z" fill="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="#1a1330" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function IconoPuntos({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
