import { useState, useRef } from "react";
import { useSesion } from "../auth/SesionTemporal";

export default function EditarPerfilModal({ abierto, onCerrar }) {
  const { usuario, actualizarUsuario } = useSesion();
  const inputFotoRef = useRef(null);

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [fotoPreview, setFotoPreview] = useState(usuario?.fotoUrl || null);

  if (!abierto) return null;

  const manejarSeleccionFoto = (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => setFotoPreview(lector.result);
    lector.readAsDataURL(archivo);
  };

  const manejarGuardar = () => {
    // Conexión real con el backend (subida del archivo, etc.) se agrega después.
    actualizarUsuario({ nombre, fotoUrl: fotoPreview });
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#282828] rounded-lg w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Detalles del perfil</h2>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="pi pi-times text-lg" />
          </button>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            className="relative w-28 h-28 shrink-0 group"
          >
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <i className="pi pi-user text-white text-4xl" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="pi pi-camera text-white text-xl" />
            </div>
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            onChange={manejarSeleccionFoto}
            className="hidden"
          />

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1 bg-[#3a3a3a] border border-[#565656] rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Al continuar, aceptas darle acceso a Groovify a la imagen que decidas subir. Asegúrate de tener los derechos para subir la imagen.
        </p>

        <div className="flex justify-end">
          <button
            onClick={manejarGuardar}
            className="bg-white hover:bg-slate-200 text-black font-semibold px-8 py-2.5 rounded-full transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}