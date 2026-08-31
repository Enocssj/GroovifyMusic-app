import { useSesion } from "../auth/SesionTemporal";

const playlistsDestacadas = [
  { nombre: "Éxitos del momento" },
  { nombre: "Vibras relajadas" },
  { nombre: "Chill Nocturno" },
  { nombre: "Mix diario 1" },
];

const popularAhora = [
  { titulo: "Bailando bajo la lluvia", artista: "Los Astros del Sur" },
  { titulo: "Noches de neón", artista: "Circuito Nocturno" },
  { titulo: "Café de domingo", artista: "Marea Suave" },
  { titulo: "Bajo Neón", artista: "Kira Luz" },
];

export default function Home() {
  const { usuario } = useSesion();
  const nombreUsuario = usuario?.nombre || "Usuario";

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      {/* Barra superior */}
      <div className="flex items-center justify-end px-8 pt-6">
        {usuario?.fotoUrl ? (
          <img
            src={usuario.fotoUrl}
            alt="Foto de perfil"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <button className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <i className="pi pi-user" />
          </button>
        )}
      </div>

      <div className="px-8 pt-6 pb-4">
        <p className="text-slate-400 text-sm">Hola,</p>
        <h1 className="text-3xl font-bold text-white">{nombreUsuario}</h1>
      </div>

      {/* Playlists destacadas */}
      <div className="px-8 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Playlists destacadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {playlistsDestacadas.map((playlist) => (
            <div
              key={playlist.nombre}
              className="h-32 rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-end p-4 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-white font-semibold">{playlist.nombre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular ahora - contenido general, no depende del historial del usuario */}
      <div className="px-8 pb-8">
        <h2 className="text-lg font-bold text-white mb-4">Popular ahora</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {popularAhora.map((cancion) => (
            <div key={cancion.titulo} className="cursor-pointer group">
              <div className="h-36 rounded-lg bg-gradient-to-br from-purple-300 to-purple-600 mb-3 group-hover:opacity-90 transition-opacity" />
              <p className="text-sm font-semibold text-white">{cancion.titulo}</p>
              <p className="text-xs text-slate-400">{cancion.artista}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}