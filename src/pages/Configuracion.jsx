import { useState } from "react";
import { useSesion } from "../auth/SesionTemporal";

function Toggle({ activo, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!activo)}
      className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${
        activo ? "bg-purple-500 justify-end" : "bg-[#3a3550] justify-start"
      }`}
    >
      <span className="w-[18px] h-[18px] rounded-full bg-white mx-[3px]" />
    </button>
  );
}

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

  const [perfilPrivado, setPerfilPrivado] = useState(false);
  const [mostrarActividad, setMostrarActividad] = useState(true);
  const [notiNuevaMusica, setNotiNuevaMusica] = useState(true);
  const [notiRecomendaciones, setNotiRecomendaciones] = useState(true);
  const [notiPromociones, setNotiPromociones] = useState(false);
  const [reproduccionAutomatica, setReproduccionAutomatica] = useState(true);
  const [normalizarVolumen, setNormalizarVolumen] = useState(true);

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

        <Seccion titulo="Privacidad">
          <Fila label="Perfil privado" sub="Solo tú puedes ver tu actividad">
            <Toggle activo={perfilPrivado} onChange={setPerfilPrivado} />
          </Fila>
          <Fila label="Mostrar actividad reciente">
            <Toggle activo={mostrarActividad} onChange={setMostrarActividad} />
          </Fila>
        </Seccion>

        <Seccion titulo="Notificaciones">
          <Fila label="Nueva música de artistas que sigues">
            <Toggle activo={notiNuevaMusica} onChange={setNotiNuevaMusica} />
          </Fila>
          <Fila label="Recomendaciones semanales">
            <Toggle activo={notiRecomendaciones} onChange={setNotiRecomendaciones} />
          </Fila>
          <Fila label="Correos de novedades y promociones">
            <Toggle activo={notiPromociones} onChange={setNotiPromociones} />
          </Fila>
        </Seccion>

        <Seccion titulo="Reproducción de audio">
          <Fila label="Calidad de audio">
            <select className="bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Alta</option>
              <option>Media</option>
              <option>Baja (ahorra datos)</option>
            </select>
          </Fila>
          <Fila
            label="Reproducción automática"
            sub="Sigue reproduciendo música similar al terminar"
          >
            <Toggle activo={reproduccionAutomatica} onChange={setReproduccionAutomatica} />
          </Fila>
          <Fila label="Normalizar volumen">
            <Toggle activo={normalizarVolumen} onChange={setNormalizarVolumen} />
          </Fila>
        </Seccion>
      </div>
    </div>
  );
}