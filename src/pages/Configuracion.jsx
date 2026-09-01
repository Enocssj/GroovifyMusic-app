import { useSesion } from "../auth/SesionTemporal";

function Fila({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between px-8 py-4">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <div className="bg-[#1a1722] border border-[#2a2635] rounded-2xl mb-8 divide-y divide-[#2a2635]">
      <h2 className="text-lg font-bold text-white px-8 pt-6 pb-2">{titulo}</h2>
      {children}
    </div>
  );
}

export default function Configuracion() {
  const { usuario } = useSesion();

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      <div className="px-8 pt-6 pb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Configuración</h1>

        <Seccion titulo="Cuenta">
          <Fila label="Correo electrónico" sub={usuario?.email || "Sin correo registrado"}>
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
              Editar
            </button>
          </Fila>
          <Fila label="Contraseña">
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
              Cambiar
            </button>
          </Fila>
        </Seccion>
      </div>
    </div>
  );
}