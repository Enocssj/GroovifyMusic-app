import { useNavigate } from "react-router-dom";
import { useReproductor } from "../app/ReproductorContext";

export default function PlayerBar() {
  const {
    cancionActual,
    reproduciendo,
    cola,
    alternarReproduccion,
    alternarColaPanel,
    colaPanelAbierto,
  } = useReproductor();
  const navigate = useNavigate();

  if (!cancionActual) return null;

  return (
    <div className="h-[72px] bg-[#18151f] border-t border-[#2a2635] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 w-64">
        <div className="w-11 h-11 rounded-md bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">
            {cancionActual.titulo}
          </p>
          <p className="text-xs text-slate-400">{cancionActual.artista}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-white transition-colors">
          <i className="pi pi-sync" />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <i className="pi pi-step-backward-alt" />
        </button>
        <button
          onClick={alternarReproduccion}
          className="w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-400 flex items-center justify-center text-white transition-colors"
        >
          <i className={`pi ${reproduciendo ? "pi-pause" : "pi-play"}`} />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
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

      <div className="w-64 flex items-center justify-end gap-4">
        <div className="w-32 h-1 bg-[#2a2635] rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-purple-400 rounded-full" />
        </div>
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
