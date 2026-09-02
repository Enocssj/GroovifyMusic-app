import { NavLink } from "react-router-dom";

const opcionesMenu = [
  { etiqueta: "Inicio", icono: "pi pi-home", ruta: "/" },
  { etiqueta: "Buscar", icono: "pi pi-search", ruta: "/buscar" },
  { etiqueta: "Biblioteca", icono: "pi pi-book", ruta: "/biblioteca" },
  { etiqueta: "Perfil", icono: "pi pi-user", ruta: "/perfil" },
];

const playlists = [];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#18151f] border-r border-[#2a2635] flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <span className="text-xl font-bold text-white">Groovify</span>
      </div>

      <nav className="px-3">
        {opcionesMenu.map((opcion) => (
          <NavLink
            key={opcion.etiqueta}
            to={opcion.ruta}
            end={opcion.ruta === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? "bg-[#2a2635] text-white"
                  : "text-slate-400 hover:bg-[#221f2e] hover:text-white"
              }`
            }
          >
            <i className={`${opcion.icono} text-base`} />
            {opcion.etiqueta}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 px-6">
        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-3">
          TUS PLAYLISTS
        </p>
        {playlists.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no tienes playlists</p>
        ) : (
          <ul className="space-y-2">
            {playlists.map((nombre) => (
              <li key={nombre}>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {nombre}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}