import { useState } from "react";
import { useSesion } from "../auth/SesionTemporal";

export default function TusMeGusta() {
  const { usuario } = useSesion();
  const [busqueda, setBusqueda] = useState("");

  // Se llenará con las canciones reales que el usuario marque con me gusta
  const cancionesFavoritas = [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Header degradado */}
      <div className="bg-gradient-to-b from-purple-800 to-[#3c1e5a] px-8 pt-10 pb-16">
        <div className="flex items-end gap-8">
          <div className="w-52 h-52 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-2xl">
            <i className="pi pi-heart-fill text-white text-6xl" />
          </div>
          <div>
            <p className="text-sm text-slate-200 mb-2">Playlist</p>
            <h1 className="text-6xl font-extrabold text-white mb-4">Tus me gusta</h1>
            <p className="text-sm text-slate-300">
              {usuario?.nombre || "Usuario"} • {cancionesFavoritas.length} canciones
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-6 mt-8">
          <button className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 flex items-center justify-center transition-all">
            <i className="pi pi-play text-black text-xl ml-0.5" />
          </button>
          <button className="text-slate-300 hover:text-white transition-colors">
            <i className="pi pi-sync text-2xl" />
          </button>
        </div>
      </div>

      {/* Buscador dentro de la playlist */}
      <div className="px-8 pt-8">
        <div className="relative max-w-md mb-10">
          <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en esta playlist..."
            className="w-full bg-[#221f2e] border border-[#3a3550] rounded-full pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Lista de canciones o estado vacío */}
        {cancionesFavoritas.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-20 h-20 rounded-full border-2 border-[#3a3550] flex items-center justify-center mb-6">
              <i className="pi pi-heart text-slate-500 text-2xl" />
            </div>
            <p className="text-white font-semibold mb-2">Aún no tienes canciones favoritas</p>
            <p className="text-slate-500 text-sm">
              Toca el corazón en cualquier canción para guardarla aquí
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {cancionesFavoritas.map((cancion, indice) => (
              <div
                key={`${cancion.titulo}-${indice}`}
                className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-[#221f2e] transition-colors"
              >
                <span className="text-slate-500 w-6 text-sm">{indice + 1}</span>
                <div>
                  <p className="text-white text-sm font-medium">{cancion.titulo}</p>
                  <p className="text-slate-500 text-xs">{cancion.artista}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}