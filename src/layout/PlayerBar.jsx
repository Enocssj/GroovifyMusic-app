import { useNavigate } from "react-router-dom";
import { useReproductor } from "../app/ReproductorContext";

const formatearTiempo = (segundos) => {
  if (!segundos || isNaN(segundos)) return "0:00";
  const mins = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
};

export default function PlayerBar() {
  const {
    cancionActual,
    reproduciendo,
    cola,
    tiempoActual,
    duracionAudio,
    alternarReproduccion,
    siguienteCancion,
    anteriorCancion,
    alternarColaPanel,
    colaPanelAbierto,
    buscarEnTiempo,
  } = useReproductor();
  const navigate = useNavigate();

  if (!cancionActual) return null;

  const porcentaje =
    duracionAudio > 0 ? (tiempoActual / duracionAudio) * 100 : 0;

  const manejarClicBarra = (e) => {
    if (!duracionAudio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    buscarEnTiempo(ratio * duracionAudio);
  };

  return (
    <div className="h-[72px] bg-[#18151f] border-t border-[#2a2635] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 w-64">
        <div className="w-11 h-11 rounded-md bg-gradient-to-br from-purple-400 to-purple-600 shrink-0 overflow-hidden">
          {cancionActual.portada && (
            <img
              src={cancionActual.portada}
              alt={cancionActual.titulo}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {cancionActual.titulo}
          </p>
          <p className="text-xs text-slate-400">{cancionActual.artista}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <i className="pi pi-sync" />
          </button>
          <button
            onClick={anteriorCancion}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="pi pi-step-backward-alt" />
          </button>
          <button
            onClick={alternarReproduccion}
            className="w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-400 flex items-center justify-center text-white transition-colors"
          >
            <i className={`pi ${reproduciendo ? "pi-pause" : "pi-play"}`} />
          </button>
          <button
            onClick={siguienteCancion}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="pi pi-step-forward-alt" />
          </button>
          {cola.length > 0 && (
            <button
              onClick={alternarColaPanel}
              className={`transition-colors ${colaPanelAbierto ? "text-purple-400" : "text-slate-400 hover:text-white"}`}
              title="Cola de reproducción"
            >
              <i className="pi pi-list" />
            </button>
          )}
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-slate-500 w-8 text-right">
            {formatearTiempo(tiempoActual)}
          </span>
          <div
            onClick={manejarClicBarra}
            className="flex-1 h-1 bg-[#2a2635] rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 w-8">
            {formatearTiempo(duracionAudio)}
          </span>
        </div>
      </div>

      <div className="w-64 flex items-center justify-end gap-4">
        <button
          onClick={() => navigate("/reproduciendo")}
          className="text-slate-400 hover:text-white transition-colors"
          title="Pantalla completa"
        >
          <i className="pi pi-window-maximize" />
        </button>
      </div>
    </div>
  );
}
