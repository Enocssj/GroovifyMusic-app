import { useState } from "react";

export default function ListaCancionesModal({ canciones, onEliminar, onCerrar }) {
  const [busqueda, setBusqueda] = useState("");


  const cancionesFiltradas = canciones.filter((cancion) =>
    cancion.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-lg flex flex-col gap-4 max-h-[85vh]">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-[#221a36] pb-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Todas mis canciones</h2>
            <p className="text-xs text-[#79738f]">{canciones.length} registradas en total</p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="text-[#79738f] hover:text-white text-sm transition-colors bg-[#1a1330] px-3 py-1.5 rounded-lg border border-[#221a36]"
          >
            Cerrar
          </button>
        </div>

    
        <input
          type="text"
          placeholder="Buscar canción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-[#0f0b1a] border border-[#221a36] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368] w-full"
        />

    
        <div className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1">
          {cancionesFiltradas.length === 0 ? (
            <p className="text-center text-sm text-[#79738f] py-8 border border-dashed border-[#221a36] rounded-xl">
              No se encontraron canciones.
            </p>
          ) : (
            cancionesFiltradas.map((cancion, index) => (
              <div
                key={cancion.id}
                className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
              >
                
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-[#79738f] font-medium w-4 text-center">
                    {index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#31274c] flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/5">
                    {cancion.portadaUrl ? (
                      <img src={cancion.portadaUrl} alt="Portada" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#7a63c9] to-[#3a2d5c]" />
                    )}
                  </div>
                  <span className="text-sm font-medium truncate text-white">
                    {cancion.titulo}
                  </span>
                </div>

        
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-[#a29cba]">
                    {cancion.duracion}
                  </span>
                  
                  {/* BOTÓN ELIMINAR CANCIÓN */}
                  <button
                    type="button"
                    onClick={() => onEliminar(cancion.id)}
                    className="text-[#79738f] hover:text-[#ff4444] p-2 rounded-lg hover:bg-[#ff4444]/10 transition-all"
                    title="Eliminar de la lista"
                  >
                    <IconoBasureroModal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


function IconoBasureroModal({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );
}
