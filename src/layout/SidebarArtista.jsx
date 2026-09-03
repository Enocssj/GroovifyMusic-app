import { NavLink } from "react-router-dom";

const opcionesMenu = [
  { etiqueta: "Mi perfil", icono: "pi pi-user", ruta: "/mi-perfil-artista" },
  { etiqueta: "Mi biblioteca", icono: "pi pi-book", ruta: "/mi-biblioteca-artista" },
];

export default function SidebarArtista() {
  return (
    <aside className="w-64 h-screen bg-[#18151f] border-r border-[#2a2635] flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <svg className="w-7 h-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <span className="text-xl font-bold text-white">Groovify</span>
      </div>

      <p className="px-6 text-xs font-semibold text-purple-400 tracking-wide mb-2">
        PANEL DE ARTISTA
      </p>

      <nav className="px-3">
        {opcionesMenu.map((opcion) => (
          <NavLink
            key={opcion.etiqueta}
            to={opcion.ruta}
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
    </aside>
  );
}