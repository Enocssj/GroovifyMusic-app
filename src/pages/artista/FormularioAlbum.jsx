import { useState, useRef } from "react";

export default function FormularioAlbum({ onAgregar, onCancelar }) {
  
  const [nombreAlbum, setNombreAlbum] = useState("");
  const [artista, setArtista] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");
  const [genero, setGenero] = useState("");
  const [descripcion, setDescripcion] = useState("");
  
  
  const [archivoPortada, setArchivoPortada] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState("");
  
  
  const fileInputRef = useRef(null);

  
  const listaGeneros = [
    "Synth-pop",
    "Electrónica",
    "Indie",
    "Rock",
    "Banda",
    "Románticas",
    "Urbano",
  ];

  // Manejador para cargar la imagen localmente
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoPortada(file);
      setVistaPreviaUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!nombreAlbum || !artista || !fechaLanzamiento || !genero) return;

    
    onAgregar({
      nombre_album: nombreAlbum,
      artista: artista,
      fecha_lanzamiento: fechaLanzamiento,
      genero: genero,
      descripcion: descripcion || null,
      portada: archivoPortada,
    });

    // Limpiamos los campos
    setNombreAlbum("");
    setArtista("");
    setFechaLanzamiento("");
    setGenero("");
    setDescripcion("");
    setArchivoPortada(null);
    setVistaPreviaUrl("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-white">Registrar álbum</h2>
          <button 
            type="button" 
            onClick={onCancelar} 
            className="text-[#79738f] hover:text-white text-sm transition-colors"
          >
            Cancelar
          </button>
        </div>

    
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#a29cba] font-medium">Portada del álbum</label>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full h-44 rounded-xl border border-dashed border-[#3e385c] bg-[#1a1330] hover:bg-[#1d1636] hover:border-[#8b7ee0] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 relative overflow-hidden"
          >
            {vistaPreviaUrl ? (
              <img src={vistaPreviaUrl} alt="Vista previa de portada" className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="text-sm text-[#79738f]">Subir portada...</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-[#79738f]">
            Formatos: JPG, PNG. Tamaño ideal 1000×1000 px.
          </span>
        </div>

    
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Nombre del álbum</label>
          <input
            type="text"
            required
            value={nombreAlbum}
            onChange={(e) => setNombreAlbum(e.target.value)}
            className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="Ej. Noches de neón"
          />
        </div>

    
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Artista</label>
          <input
            type="text"
            required
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="Ej. Sofía Reyes"
          />
        </div>

        {/* --- FILA DIVIDIDA: FECHA Y GÉNERO --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fecha de lanzamiento */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#a29cba]">Fecha de lanzamiento</label>
            <input
              type="date"
              required
              value={fechaLanzamiento}
              onChange={(e) => setFechaLanzamiento(e.target.value)}
              className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] text-center w-full"
            />
          </div>

          {/* Género (Selector Desplegable) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#a29cba]">Género</label>
            <div className="relative">
              <select
                required
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] w-full appearance-none pr-8 cursor-pointer"
              >
                <option value="" disabled hidden>Selecciona</option>
                {listaGeneros.map((gen, idx) => (
                  <option key={idx} value={gen} className="bg-[#140e24]">
                    {gen}
                  </option>
                ))}
              </select>
              {/* Icono de flecha hacia abajo nativo del diseño */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#79738f]">
                <IconoFlechaAbajo className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* --- CAMPO 5: DESCRIPCIÓN (OPCIONAL) --- */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Descripción <span className="text-[#79738f]">(opcional)</span></label>
          <textarea
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368] resize-none"
            placeholder="Cuenta un poco sobre este álbum..."
          />
        </div>

        
        <button
          type="submit"
          className="bg-[#8b7ee0] text-[#1a1330] w-full py-3 rounded-xl text-sm font-semibold hover:bg-[#9a8ef0] transition-colors shadow-lg shadow-[#8b7ee0]/10 mt-2"
        >
          Registrar álbum
        </button>
      </form>
    </div>
  );
}

// Icono pequeño de flecha hacia abajo para el selector de género
function IconoFlechaAbajo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
