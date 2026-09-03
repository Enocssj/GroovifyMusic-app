import { useState, useRef } from "react";

export default function NuevaPlaylistModal({ abierto, onCerrar, onCrear }) {
  const inputPortadaRef = useRef(null);

  const [nombre, setNombre] = useState("");
  const [portada, setPortada] = useState(null);
  const [privada, setPrivada] = useState(true);
  const [colaborativa, setColaborativa] = useState(false);

  if (!abierto) return null;

  const manejarSeleccionPortada = (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setPortada(lector.result);
    lector.readAsDataURL(archivo);
  };

  const reiniciarFormulario = () => {
    setNombre("");
    setPortada(null);
    setPrivada(true);
    setColaborativa(false);
  };

  const manejarCerrar = () => {
    reiniciarFormulario();
    onCerrar();
  };

  const manejarCrear = (evento) => {
    evento.preventDefault();
    // Conexión real con el backend se agrega después.
    onCrear({
      nombre: nombre.trim() || "Mi playlist #1",
      portada,
      privada,
      colaborativa,
      cancionesTexto: "0 canciones",
    });
    reiniciarFormulario();
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1722] border border-[#2a2635] rounded-2xl w-full max-w-md p-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center mb-6">
          <button
            type="button"
            onClick={manejarCerrar}
            className="text-slate-400 hover:text-white transition-colors justify-self-start"
          >
            <i className="pi pi-arrow-left text-lg" />
          </button>
          <h2 className="text-center text-xl font-bold text-white">
            Nueva playlist
          </h2>
          <span />
        </div>

        <form onSubmit={manejarCrear}>
          {/* Portada */}
          <div className="flex flex-col items-center mb-6">
            <button
              type="button"
              onClick={() => inputPortadaRef.current?.click()}
              className="w-44 h-44 rounded-xl border-2 border-dashed border-[#3a3550] flex items-center justify-center hover:border-purple-500 transition-colors overflow-hidden"
            >
              {portada ? (
                <img src={portada} alt="Portada" className="w-full h-full object-cover" />
              ) : (
                <i className="pi pi-camera text-slate-500 text-3xl" />
              )}
            </button>
            <input
              ref={inputPortadaRef}
              type="file"
              accept="image/*"
              onChange={manejarSeleccionPortada}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-2">Añadir portada</p>
          </div>

          {/* Nombre */}
          <label className="block text-sm text-slate-300 mb-1">
            Nombre de la playlist
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Mi playlist #1"
            className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 mb-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Playlist privada */}
          <div className="flex items-center justify-between py-3">
            <span className="text-white text-sm">Playlist privada</span>
            <button
              type="button"
              onClick={() => setPrivada(!privada)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                privada ? "bg-purple-500 justify-end" : "bg-[#3a3550] justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white mx-0.5" />
            </button>
          </div>

          <div className="h-px bg-[#2a2635]" />

          {/* Colaborativa */}
          <div className="flex items-center justify-between py-3 mb-6">
            <span className="text-white text-sm">Colaborativa</span>
            <button
              type="button"
              onClick={() => setColaborativa(!colaborativa)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                colaborativa ? "bg-purple-500 justify-end" : "bg-[#3a3550] justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white mx-0.5" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold py-3 rounded-full transition-colors"
          >
            Crear playlist
          </button>
        </form>
      </div>
    </div>
  );
}