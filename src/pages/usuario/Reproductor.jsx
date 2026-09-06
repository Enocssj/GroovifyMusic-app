import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReproductor } from "../../app/ReproductorContext";

const formatearTiempo = (segundos) => {
  if (!segundos || isNaN(segundos)) return "0:00";
  const mins = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${mins}:${segs < 10 ? "0" : ""}${segs}`;
};

export default function Reproductor() {
  const {
    cancionActual,
    reproduciendo,
    cola,
    tiempoActual,
    duracionAudio,
    alternarReproduccion,
    siguienteCancion,
    anteriorCancion,
    reproducirDesdeCola,
    buscarEnTiempo,
  } = useReproductor();
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarCola, setMostrarCola] = useState(!!location.state?.abrirCola);

  if (!cancionActual) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f0d14]">
        <p className="text-slate-400">No hay ninguna canción reproduciéndose</p>
      </div>
    );
  }

  const porcentaje =
    duracionAudio > 0 ? (tiempoActual / duracionAudio) * 100 : 0;

  const manejarClicBarra = (e) => {
    if (!duracionAudio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    buscarEnTiempo(ratio * duracionAudio);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14] flex flex-col">
      <div className="relative flex items-center justify-center px-8 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-8 w-9 h-9 rounded-full bg-[#221f2e] hover:bg-[#2a273a] flex items-center justify-center text-white transition-colors"
        >
          <i className="pi pi-chevron-left" />
        </button>
        <p className="text-sm text-slate-400">Reproduciendo desde playlist</p>
      </div>

      <div className="flex-1 flex gap-16 px-8 pb-12">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center mb-8 overflow-hidden">
            {cancionActual.portada ? (
              <img
                src={cancionActual.portada}
                alt={cancionActual.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-24 h-24 text-white/80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-1">
            {cancionActual.titulo}
          </h1>
          <p className="text-slate-400 mb-8">{cancionActual.artista}</p>

          <div className="w-full mb-6">
            <div
              onClick={manejarClicBarra}
              className="h-1 bg-[#2a2635] rounded-full overflow-hidden mb-2 cursor-pointer"
            >
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{formatearTiempo(tiempoActual)}</span>
              <span>{formatearTiempo(duracionAudio)}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="text-slate-400 hover:text-white transition-colors">
              <i className="pi pi-sync text-lg" />
            </button>
            <button
              onClick={anteriorCancion}
              className="text-white hover:scale-110 transition-transform"
            >
              <i className="pi pi-step-backward-alt text-xl" />
            </button>
            <button
              onClick={alternarReproduccion}
              className="w-14 h-14 rounded-full bg-white hover:scale-105 flex items-center justify-center transition-transform"
            >
              <i
                className={`pi ${reproduciendo ? "pi-pause" : "pi-play"} text-black text-xl`}
              />
            </button>
            <button
              onClick={siguienteCancion}
              className="text-white hover:scale-110 transition-transform"
            >
              <i className="pi pi-step-forward-alt text-xl" />
            </button>
            {cola.length > 0 ? (
              <button
                onClick={() => setMostrarCola(!mostrarCola)}
                className={`transition-colors ${
                  mostrarCola
                    ? "text-purple-400"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Cola de reproducción"
              >
                <i className="pi pi-list text-lg" />
              </button>
            ) : (
              <span className="w-[18px]" />
            )}
          </div>
        </div>

        {mostrarCola && cola.length > 0 && (
          <div className="w-80 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setMostrarCola(false)}
                className="w-8 h-8 rounded-full bg-[#221f2e] hover:bg-[#2a273a] flex items-center justify-center text-white transition-colors"
              >
                <i className="pi pi-chevron-left text-sm" />
              </button>
              <h2 className="text-lg font-bold text-white">A continuación</h2>
            </div>
            <div className="space-y-3">
              {cola.map((cancion, indice) => (
                <div
                  key={`${cancion.titulo}-${indice}`}
                  onClick={() => reproducirDesdeCola(indice)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[#221f2e] rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="w-11 h-11 rounded bg-gradient-to-br from-purple-400 to-purple-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {cancion.titulo}
                    </p>
                    <p className="text-slate-500 text-xs truncate">
                      {cancion.artista}
                    </p>
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">
                    {cancion.duracion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
