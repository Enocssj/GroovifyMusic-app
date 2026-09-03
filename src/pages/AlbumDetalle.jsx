import { useState } from "react"; // 1. Importamos useState
import { useNavigate, useParams } from "react-router-dom";
import FormularioCancion from "./FormularioCancion"; // 2. Importamos el formulario

const album = {
  nombre: "Nocturno",
  artista: "Aracely Hernández",
  anio: 2024,
  totalCanciones: 10,
  duracionTotal: "38 min",
  portadaUrl: null,
};

// Datos iniciales pasados fuera para el estado
const listaInicialCanciones = [
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

export default function AlbumDetalle() {
  const navigate = useNavigate();
  const { albumId } = useParams();

  // Estados dinámicos
  const [canciones, setCanciones] = useState(listaInicialCanciones);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Función para eliminar canción
  const eliminarCancion = (id) => {
    setCanciones(canciones.filter((cancion) => cancion.id !== id));
  };


  const agregarCancion = (nuevaCancion) => {
  const nueva = {
    id: Date.now(), // Simula el BIGSERIAL de tu base de datos
    nombre: nuevaCancion.nombre,
    duracion_segundos: nuevaCancion.duracion_segundos,
    fecha_lanzamiento: nuevaCancion.fecha_lanzamiento,
    portada: nuevaCancion.portada,
    archivo_audio: nuevaCancion.archivo_audio,
    album_id: albumId, // El parámetro obtenido de useParams()
    artista_id: 1, // Aquí asignarías el ID real del artista del álbum
  };

  setCanciones([...canciones, nueva]);
  setMostrarFormulario(false);
};

const formatearDuracion = (segundosTotales) => {
  if (!segundosTotales) return "0:00";
  const mins = Math.floor(segundosTotales / 60);
  const segs = segundosTotales % 60;
  return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
};

 
  return (
    <div className="min-h-screen bg-[#0f0b1a] text-white px-10 py-10">
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
          {album.portadaUrl ? (
            <img src={album.portadaUrl} alt={`Portada del álbum ${album.nombre}`} className="w-full h-full object-cover" />
          ) : (
            <IconoNota className="w-12 h-12 text-[#e5e0f7]" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#a29cba] tracking-wide">Álbum</span>
          <h1 className="text-3xl md:text-4xl font-medium">{album.nombre}</h1>
          <span className="text-sm text-[#c7c1de]">
            <span className="font-medium text-white">{album.artista}</span> · Álbum · {album.anio}
          </span>
          <span className="text-xs text-[#79738f]">
            {canciones.length} canciones · {album.duracionTotal} {/* Adaptado para contar canciones dinámicas */}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-7">
        <button type="button" className="bg-[#8b7ee0] text-[#1a1330] rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[#9a8ef0] transition-colors">
          <IconoPlay className="w-4 h-4" /> Reproducir
        </button>
        <button type="button" aria-label="Agregado a tu biblioteca" className="border border-[#55507a] text-[#8b7ee0] rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors">
          <IconoCheck className="w-4 h-4" />
        </button>
        <button type="button" aria-label="Reproducción aleatoria" className="text-[#b9b3d0] p-2 hover:text-white transition-colors">
          <IconoAleatorio className="w-5 h-5" />
        </button>
        
        {/* NUEVO BOTÓN: AGREGAR CANCIÓN */}
        <button 
          type="button" 
          onClick={() => setMostrarFormulario(true)}
          className="border border-[#8b7ee0] text-[#8b7ee0] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#8b7ee0]/10 transition-colors ml-2"
        >
          + Agregar Canción
        </button>

        <button type="button" aria-label="Más opciones" className="text-[#b9b3d0] p-2 ml-auto hover:text-white transition-colors">
          <IconoPuntos className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col">
        {/* Cambiado grid-cols para dar espacio al icono de eliminar */}
        <div className="grid grid-cols-[24px_1fr_70px_40px] gap-4 px-3 py-2 text-xs text-[#79738f] border-b border-[#2a2440]">
          <span>#</span>
          <span>Título</span>
          <span className="text-right">Duración</span>
          <span className="text-center"></span>
        </div>
        
        {canciones.map((cancion, index) => {
          const esActual = cancion.titulo === album.nombre;
          return (
            <div 
              key={cancion.id} 
              className={`grid grid-cols-[24px_1fr_70px_40px] gap-4 px-3 py-2.5 items-center rounded-md hover:bg-white/5 transition-colors group ${esActual ? "bg-[#8b7ee0]/10" : ""}`}
            >
              <span className={`text-sm ${esActual ? "text-[#8b7ee0]" : "text-[#79738f]"}`}>{index + 1}</span>
              <span className={`text-sm font-medium ${esActual ? "text-[#8b7ee0]" : ""}`}>{cancion.titulo}</span>
              <span className={`text-right text-sm ${esActual ? "text-[#8b7ee0]" : "text-[#a29cba]"}`}>{cancion.duracion}</span>
              
              {/* NUEVO BOTÓN: ELIMINAR CANCIÓN (Aparece al hacer hover sobre la fila) */}
              <button
                type="button"
                onClick={() => eliminarCancion(cancion.id)}
                className="opacity-0 group-hover:opacity-100 text-[#ff5c5c] hover:text-[#ff3b3b] transition-all p-1 flex items-center justify-center"
                title="Eliminar canción"
              >
                <IconoEliminar className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Renderizado condicional del formulario modal */}
      {mostrarFormulario && (
        <FormularioCancion 
          onAgregar={agregarCancion} 
          onCancelar={() => setMostrarFormulario(false)} 
        />
      )}
    </div>
  );
}

// Iconos SVGs previos (Omitidos en esta visualización por brevedad pero mantén los tuyos)...

// NUEVO ICONO: Basurero para borrar
function IconoEliminar({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Asegúrate de conservar tus otras funciones de iconos abajo...
function IconoFlechaAtras({ className }) { return ( <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> ); }
function IconoNota({ className }) { return ( <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><circle cx="7" cy="18" r="3" fill="currentColor" /><circle cx="17" cy="16" r="3" fill="currentColor" /><path d="M10 18V5l10-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> ); }
function IconoPlay({ className }) { return ( <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> ); }
function IconoCheck({ className }) { return ( <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> ); }
function IconoAleatorio({ className }) { return ( <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><path d="M3 6h3.5L15 18h6M3 18h3.5L11 12M18 6h3M18 6l-2-2M18 6l-2 2M21 18l-2-2M21 18l-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> ); }
function IconoPuntos({ className }) { return ( <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg> ); }
