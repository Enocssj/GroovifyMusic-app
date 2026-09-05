import { useState, useRef } from "react";
import axiosClient from "../../services/axiosClient"; // ajusta la ruta según dónde esté este archivo

export default function FormularioAlbum({ onCreado, onCancelar }) {
  const [nombreAlbum, setNombreAlbum] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");

  const [archivoPortada, setArchivoPortada] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState("");

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoPortada(file);
      setVistaPreviaUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombreAlbum || !fechaLanzamiento) return;

    setEnviando(true);
    try {
      const albumData = {
        nombre: nombreAlbum,
        fechaLanzamiento: `${fechaLanzamiento}T00:00:00`,
        portada: null,
      };

      const albumBlob = new Blob([JSON.stringify(albumData)], {
        type: "application/json",
      });

      const formData = new FormData();
        
      if (archivoPortada) {
        formData.append("file", archivoPortada);
      }

      const response = await axiosClient.post("/album", formData);

      onCreado?.(response.data.Album);

      // Limpiamos los campos
      setNombreAlbum("");
      setFechaLanzamiento("");
      setArchivoPortada(null);
      setVistaPreviaUrl("");
      onCancelar();
    } catch (err) {
      console.error("Error al registrar álbum:", err);
      setError(err.response?.data?.message || "Error al registrar el álbum");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-white">Registrar álbum</h2>
          <button
            type="button"
            onClick={onCancelar}
            disabled={enviando}
            className="text-[#79738f] hover:text-white text-sm transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        {error && (
          <div className="p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#a29cba] font-medium">Portada del álbum</label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-44 rounded-xl border border-dashed border-[#3e385c] bg-[#1a1330] hover:bg-[#1d1636] hover:border-[#8b7ee0] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 relative overflow-hidden"
          >
            {vistaPreviaUrl ? (
              <img src={vistaPreviaUrl} alt="Vista previa de portada" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-[#79738f]">Subir portada...</span>
            )}
          </div>
          <span className="text-[10px] text-[#79738f]">
            Formatos: JPG, PNG. Tamaño ideal 1000×1000 px.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Nombre del álbum</label>
          <input
            type="text"
            required
            value={nombreAlbum}
            onChange={(e) => setNombreAlbum(e.target.value)}
            className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="Ej. Noches de neón"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Fecha de lanzamiento</label>
          <input
            type="date"
            required
            value={fechaLanzamiento}
            onChange={(e) => setFechaLanzamiento(e.target.value)}
            className="bg-[#1a1330] border border-[#221a36] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] w-full"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="bg-[#8b7ee0] text-[#1a1330] w-full py-3 rounded-xl text-sm font-semibold hover:bg-[#9a8ef0] transition-colors shadow-lg shadow-[#8b7ee0]/10 mt-2 disabled:opacity-50"
        >
          {enviando ? "Registrando..." : "Registrar álbum"}
        </button>
      </form>
    </div>
  );
}