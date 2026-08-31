import { useReproductor } from "../app/ReproductorContext";

export default function ColaPanel() {
  const { cancionActual, cola, colaPanelAbierto, alternarColaPanel, reproducirCancion } = useReproductor();

  if (!colaPanelAbierto || !cancionActual) return null;

  const manejarSiguiente = (cancion, indice) => {
    const nuevaCola = [...cola.slice(0, indice), cancionActual, ...cola.slice(indice + 1)];
    reproducirCancion(cancion, nuevaCola);
  };

  return (
    <div className="w-80 h-full bg-[#0f0d14] border-l border-[#2a2635] flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="text-lg font-bold text-white">Fila de reproducción</h2>
        <button
          onClick={alternarColaPanel}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <i className="pi pi-times" />
        </button>
      </div>

      <div className="px-5">
        <p className="text-sm font-semibold text-slate-400 mb-3">Estás escuchando</p>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-purple-400 text-sm font-medium truncate">{cancionActual.titulo}</p>
            <p className="text-slate-500 text-xs truncate">{cancionActual.artista}</p>
          </div>
        </div>

        {cola.length > 0 && (
          <>
            <p className="text-sm font-semibold text-slate-400 mb-3">Próximas canciones</p>
            <div className="space-y-3">
              {cola.map((cancion, indice) => (
                <div
                  key={`${cancion.titulo}-${indice}`}
                  onClick={() => manejarSiguiente(cancion, indice)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[#221f2e] rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-11 h-11 rounded bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{cancion.titulo}</p>
                    <p className="text-slate-500 text-xs truncate">{cancion.artista}</p>
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">{cancion.duracion}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}