import { useState, useRef } from "react";

export default function FormularioCancion({ onAgregar, onCancelar }) {
  
  const [nombre, setNombre] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");
  const [minutos, setMinutos] = useState("");
  const [segundos, setSegundos] = useState("");
  const [archivoAudio, setArchivoAudio] = useState("");
  

  const [archivoPortada, setArchivoPortada] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState("");
  

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoPortada(file);
    
      setVistaPreviaUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nombre || !fechaLanzamiento || !minutos || !segundos) return;

    const duracionSegundos = (parseInt(minutos, 10) * 60) + parseInt(segundos, 10);
    
    onAgregar({
      nombre,
      fecha_lanzamiento: fechaLanzamiento, 
      duracion_segundos: duracionSegundos, 
      portada: archivoPortada, 
      archivo_audio: archivoAudio || null  
    });

    // Limpiar formulario
    setNombre("");
    setFechaLanzamiento("");
    setMinutos("");
    setSegundos("");
    setArchivoPortada(null);
    setVistaPreviaUrl("");
    setArchivoAudio("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold text-white mb-1">Agregar nueva canción</h2>

    
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#a29cba] font-medium">Portada de la canción</label>
          
          {/* Input oculto nativo */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

    
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full h-44 rounded-xl border border-dashed border-[#3e385c] bg-[#1a1330] hover:bg-[#221a36] hover:border-[#8b7ee0] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 relative overflow-hidden"
          >
            {vistaPreviaUrl ? (
              <img src={vistaPreviaUrl} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <>
                <IconoSubir className="w-6 h-6 text-[#79738f]" />
                <span className="text-sm text-[#b9b3d0]">Subir portada...</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-[#79738f]">
            Formatos: JPG, PNG. Tamaño ideal 1000×1000 px.
          </span>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Nombre</label>
          <input
            type="text"
            required
            maxLength={150}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="Ej. Noche de neón"
          />
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Fecha de Lanzamiento</label>
          <input
            type="date"
            required
            value={fechaLanzamiento}
            onChange={(e) => setFechaLanzamiento(e.target.value)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Duración</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              required
              min="0"
              placeholder="Min"
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white w-full text-center focus:outline-none focus:border-[#8b7ee0]"
            />
            <span className="text-[#a29cba] font-bold">:</span>
            <input
              type="number"
              required
              min="0"
              max="59"
              placeholder="Seg"
              value={segundos}
              onChange={(e) => setSegundos(e.target.value)}
              className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white w-full text-center focus:outline-none focus:border-[#8b7ee0]"
            />
          </div>
        </div>

        {/* URL Audio */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">URL del Archivo de Audio</label>
          <input
            type="url"
            maxLength={300}
            value={archivoAudio}
            onChange={(e) => setArchivoAudio(e.target.value)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="https://ejemplo.com"
          />
        </div>

    
        <div className="flex items-center justify-end gap-3 mt-2 border-t border-[#2a2440] pt-4">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-[#b9b3d0] hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#8b7ee0] text-[#1a1330] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9a8ef0] transition-all shadow-md shadow-[#8b7ee0]/20 w-full sm:w-auto"
          >
            Registrar canción
          </button>
        </div>
      </form>
    </div>
  );
}


function IconoSubir({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
    </svg>
  );
}
