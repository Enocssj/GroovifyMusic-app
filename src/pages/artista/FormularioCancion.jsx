import { useState, useRef, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { useAuth } from "../../auth/AuthContext";

export default function FormularioCancion({ onCreada, onCancelar, albumIdFijo }) {
  const { usuario } = useAuth();

  const [nombre, setNombre] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");
  const [archivoAudio, setArchivoAudio] = useState(null);
  const [nombreAudio, setNombreAudio] = useState("");

  const [archivoPortada, setArchivoPortada] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState("");

  const [generos, setGeneros] = useState([]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [mostrarGeneros, setMostrarGeneros] = useState(false);
  const [cargandoGeneros, setCargandoGeneros] = useState(true);

  const [albumes, setAlbumes] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [cargandoAlbumes, setCargandoAlbumes] = useState(true);

  const [playlistsDestacadas, setPlaylistsDestacadas] = useState([]);
  const [playlistsSeleccionadas, setPlaylistsSeleccionadas] = useState([]);
  const [mostrarPlaylists, setMostrarPlaylists] = useState(false);
  const [cargandoPlaylists, setCargandoPlaylists] = useState(true);

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  useEffect(() => {
    const cargarGeneros = async () => {
      try {
        const response = await axiosClient.get("/genero");
        setGeneros(response.data);
      } catch (err) {
        console.error("Error al cargar géneros:", err);
      } finally {
        setCargandoGeneros(false);
      }
    };
    cargarGeneros();
  }, []);

  useEffect(() => {
    if (albumIdFijo || !usuario?.id) {
      setCargandoAlbumes(false);
      return;
    }
    const cargarAlbumes = async () => {
      try {
        const response = await axiosClient.get(`/album/artista/${usuario.id}`);
        setAlbumes(response.data);
      } catch (err) {
        console.error("Error al cargar álbumes:", err);
      } finally {
        setCargandoAlbumes(false);
      }
    };
    cargarAlbumes();
  }, [usuario?.id, albumIdFijo]);

  useEffect(() => {
    const cargarPlaylists = async () => {
      try {
        const response = await axiosClient.get("/playlists/destacadas");
        setPlaylistsDestacadas(response.data);
      } catch (err) {
        console.error("Error al cargar playlists destacadas:", err);
      } finally {
        setCargandoPlaylists(false);
      }
    };
    cargarPlaylists();
  }, []);

  const alternarGenero = (id) => {
    setGenerosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const alternarPlaylist = (id) => {
    setPlaylistsSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoPortada(file);
      setVistaPreviaUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoAudio(file);
      setNombreAudio(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !fechaLanzamiento) return;

    if (!archivoAudio) {
      setError("Debes subir un archivo de audio");
      return;
    }

    setEnviando(true);
    try {
      const albumIdFinal = albumIdFijo || (albumId ? parseInt(albumId, 10) : null);

      const cancionData = {
        nombre,
        fechaLanzamiento,
        duracionSegundos: 0,
        portada: null,
        archivoAudio: null,
        albumId: albumIdFinal,
        generosIds: generosSeleccionados,
      };

      const cancionBlob = new Blob([JSON.stringify(cancionData)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("cancion", cancionBlob);
      if (archivoPortada) {
        formData.append("portada", archivoPortada);
      }
      formData.append("archivoAudio", archivoAudio);

      const response = await axiosClient.post("/canciones/register", formData);
      const cancionCreada = response.data;

      // Agregar la canción recién creada a cada playlist destacada marcada.
      // Se hace una petición por playlist; si alguna falla, no bloquea el resto.
      if (playlistsSeleccionadas.length > 0) {
        await Promise.allSettled(
          playlistsSeleccionadas.map((playlistId) =>
            axiosClient.post(`/playlists/${playlistId}/canciones/${cancionCreada.id}`)
          )
        );
      }

      onCreada?.(cancionCreada);

      // Limpiar formulario
      setNombre("");
      setFechaLanzamiento("");
      setArchivoPortada(null);
      setVistaPreviaUrl("");
      setArchivoAudio(null);
      setNombreAudio("");
      setGenerosSeleccionados([]);
      setAlbumId("");
      setPlaylistsSeleccionadas([]);
      onCancelar();
    } catch (err) {
      console.error("Error al registrar canción:", err);
      setError(err.response?.data?.message || "Error al registrar la canción");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#140e24] border border-[#221a36] p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold text-white mb-1">Agregar nueva canción</h2>

        {error && (
          <div className="p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#a29cba] font-medium">Portada de la canción</label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-44 rounded-xl border border-dashed border-[#3e385c] bg-[#1a1330] hover:bg-[#221a36] hover:border-[#8b7ee0] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 relative overflow-hidden"
          >
            {vistaPreviaUrl ? (
              <img src={vistaPreviaUrl} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <>
                <IconoSubir className="w-6 h-6 text-[#79738f]" />
                <span className="text-sm text-[#b9b3d0]">Subir portada...</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-[#79738f]">
            Formatos: JPG, PNG. Tamaño ideal 1000×1000 px.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Nombre</label>
          <input
            type="text"
            required
            maxLength={150}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] placeholder-[#4a4368]"
            placeholder="Ej. Noche de neón"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Fecha de Lanzamiento</label>
          <input
            type="date"
            required
            value={fechaLanzamiento}
            onChange={(e) => setFechaLanzamiento(e.target.value)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0]"
          />
        </div>

        {!albumIdFijo && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#a29cba]">
              Álbum <span className="text-[#79738f]">(opcional)</span>
            </label>
            <div className="relative">
              <select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                disabled={cargandoAlbumes}
                className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b7ee0] w-full appearance-none pr-8 cursor-pointer disabled:opacity-50"
              >
                <option value="">Sin álbum</option>
                {albumes.map((album) => (
                  <option key={album.id} value={album.id} className="bg-[#140e24]">
                    {album.nombre}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#79738f]">
                <IconoFlechaAbajo className="w-4 h-4" />
              </div>
            </div>
            {!cargandoAlbumes && albumes.length === 0 && (
              <span className="text-[10px] text-[#79738f]">
                Aún no tienes álbumes creados
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Géneros</label>
          <button
            type="button"
            onClick={() => setMostrarGeneros(!mostrarGeneros)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-[#8b7ee0]"
          >
            <span className={generosSeleccionados.length ? "text-white" : "text-[#4a4368]"}>
              {generosSeleccionados.length > 0
                ? `${generosSeleccionados.length} género(s) seleccionado(s)`
                : "Selecciona uno o más géneros"}
            </span>
            <IconoFlechaAbajo
              className={`w-4 h-4 text-[#79738f] transition-transform ${mostrarGeneros ? "rotate-180" : ""}`}
            />
          </button>

          {mostrarGeneros && (
            <div className="mt-1 border border-[#2a2440] rounded-xl bg-[#0f0b1a] max-h-48 overflow-y-auto p-2 flex flex-col gap-1">
              {cargandoGeneros ? (
                <p className="text-xs text-[#79738f] text-center py-2">Cargando géneros...</p>
              ) : generos.length === 0 ? (
                <p className="text-xs text-[#79738f] text-center py-2">No hay géneros disponibles</p>
              ) : (
                generos.map((genero) => (
                  <label
                    key={genero.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1a1330] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={generosSeleccionados.includes(genero.id)}
                      onChange={() => alternarGenero(genero.id)}
                      className="w-4 h-4 accent-[#8b7ee0] rounded"
                    />
                    <span className="text-sm text-white">{genero.nombre}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">
            Agregar a playlist destacada <span className="text-[#79738f]">(opcional)</span>
          </label>
          <button
            type="button"
            onClick={() => setMostrarPlaylists(!mostrarPlaylists)}
            className="bg-[#0f0b1a] border border-[#2a2440] rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-[#8b7ee0]"
          >
            <span className={playlistsSeleccionadas.length ? "text-white" : "text-[#4a4368]"}>
              {playlistsSeleccionadas.length > 0
                ? `${playlistsSeleccionadas.length} playlist(s) seleccionada(s)`
                : "Selecciona una o más playlists"}
            </span>
            <IconoFlechaAbajo
              className={`w-4 h-4 text-[#79738f] transition-transform ${mostrarPlaylists ? "rotate-180" : ""}`}
            />
          </button>

          {mostrarPlaylists && (
            <div className="mt-1 border border-[#2a2440] rounded-xl bg-[#0f0b1a] max-h-48 overflow-y-auto p-2 flex flex-col gap-1">
              {cargandoPlaylists ? (
                <p className="text-xs text-[#79738f] text-center py-2">Cargando playlists...</p>
              ) : playlistsDestacadas.length === 0 ? (
                <p className="text-xs text-[#79738f] text-center py-2">No hay playlists disponibles</p>
              ) : (
                playlistsDestacadas.map((playlist) => (
                  <label
                    key={playlist.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1a1330] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={playlistsSeleccionadas.includes(playlist.id)}
                      onChange={() => alternarPlaylist(playlist.id)}
                      className="w-4 h-4 accent-[#8b7ee0] rounded"
                    />
                    <span className="text-sm text-white">{playlist.nombre}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#a29cba]">Archivo de audio</label>
          <input
            type="file"
            ref={audioInputRef}
            onChange={handleAudioChange}
            accept="audio/mpeg, audio/mp3, audio/wav"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => audioInputRef.current.click()}
            className="bg-[#0f0b1a] border border-dashed border-[#3e385c] hover:border-[#8b7ee0] rounded-xl px-4 py-3 text-sm text-left flex items-center gap-2 transition-colors"
          >
            <IconoSubir className="w-4 h-4 text-[#79738f] shrink-0" />
            <span className={nombreAudio ? "text-white truncate" : "text-[#4a4368]"}>
              {nombreAudio || "Subir archivo MP3..."}
            </span>
          </button>
          <span className="text-[10px] text-[#79738f]">
            Formatos: MP3, WAV. La duración se calcula automáticamente.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 border-t border-[#2a2440] pt-4">
          <button
            type="button"
            onClick={onCancelar}
            disabled={enviando}
            className="px-4 py-2 text-sm font-medium text-[#b9b3d0] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="bg-[#8b7ee0] text-[#1a1330] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9a8ef0] transition-all shadow-md shadow-[#8b7ee0]/20 w-full sm:w-auto disabled:opacity-50"
          >
            {enviando ? "Registrando..." : "Registrar canción"}
          </button>
        </div>
      </form>
    </div>
  );
}

function IconoSubir({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
    </svg>
  );
}

function IconoFlechaAbajo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}