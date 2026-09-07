import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NuevaPlaylistModal from "./NuevaPlaylistModal";
import axiosClient from "../../services/axiosClient";

export default function Biblioteca() {
  const [tabActiva, setTabActiva] = useState("playlists");
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const [misPlaylists, setMisPlaylists] = useState([]);
  const [cargandoPlaylists, setCargandoPlaylists] = useState(true);

  const [totalMeGusta, setTotalMeGusta] = useState(0);
  const [cargandoMeGusta, setCargandoMeGusta] = useState(true);

  const artistasSeguidos = [];
  const albumesGuardados = [];

  useEffect(() => {
    const cargarPlaylists = async () => {
      try {
        const response = await axiosClient.get("/playlists/mis-playlists");

        const soloPersonales = response.data.filter(
          (p) => p.tipo === "PERSONAL"
        );
        setMisPlaylists(soloPersonales);
      } catch (err) {
        console.error("Error al cargar playlists:", err);
      } finally {
        setCargandoPlaylists(false);
      }
    };
    cargarPlaylists();
  }, []);

  useEffect(() => {
    const cargarMeGusta = async () => {
      try {
        const response = await axiosClient.get("/playlists/me-gusta");
        setTotalMeGusta(response.data.length);
      } catch (err) {
        console.error("Error al cargar tus me gusta:", err);
      } finally {
        setCargandoMeGusta(false);
      }
    };
    cargarMeGusta();
  }, []);

  const manejarCrearPlaylist = async (nuevaPlaylist) => {
    try {
      const playlistData = {
        nombre: nuevaPlaylist.nombre,
        descripcion: nuevaPlaylist.descripcion || null,
        portada: null,
      };

      const playlistBlob = new Blob([JSON.stringify(playlistData)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("playlist", playlistBlob);

      if (nuevaPlaylist.portada) {
        formData.append("portada", nuevaPlaylist.portada);
      }

      const response = await axiosClient.post("/playlists", formData);
      setMisPlaylists((actuales) => [...actuales, response.data]);
    } catch (err) {
      console.error("Error al crear playlist:", err);
    }
  };

  const tabs = [
    { id: "playlists", etiqueta: "Playlists" },
    { id: "artistas", etiqueta: "Artistas" },
    { id: "albumes", etiqueta: "Álbumes" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14]">
      <div className="px-8 pt-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Tu biblioteca</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <i className="pi pi-plus" />
            Crear playlist
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                tabActiva === tab.id
                  ? "bg-purple-500 text-white"
                  : "border border-[#3a3550] text-slate-400 hover:bg-[#221f2e]"
              }`}
            >
              {tab.etiqueta}
            </button>
          ))}
        </div>

        {tabActiva === "playlists" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div
              onClick={() => navigate("/biblioteca/tus-me-gusta")}
              className="cursor-pointer group"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:opacity-90 transition-opacity">
                <i className="pi pi-heart-fill text-white text-4xl" />
              </div>
              <p className="text-white font-semibold">Tus me gusta</p>
              <p className="text-slate-500 text-sm">
                {cargandoMeGusta ? "..." : `${totalMeGusta} canciones`}
              </p>
            </div>

            {cargandoPlaylists ? (
              <p className="text-sm text-slate-500 col-span-full">
                Cargando playlists...
              </p>
            ) : (
              misPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="cursor-pointer group"
                >
                  {playlist.portada ? (
                    <img
                      src={playlist.portada}
                      alt={playlist.nombre}
                      className="aspect-square w-full rounded-xl object-cover mb-3 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-end p-4 mb-3 group-hover:opacity-90 transition-opacity">
                      <span className="text-white font-semibold">
                        {playlist.nombre}
                      </span>
                    </div>
                  )}
                  <p className="text-white font-semibold">{playlist.nombre}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tabActiva === "artistas" && (
          <>
            {artistasSeguidos.length === 0 ? (
              <div className="text-center py-16">
                <i className="pi pi-users text-slate-600 text-4xl mb-4" />
                <p className="text-slate-400">Aún no sigues a ningún artista</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {artistasSeguidos.map((artista) => (
                  <div
                    key={artista.nombre}
                    className="cursor-pointer group text-center"
                  >
                    <div className="aspect-square rounded-full bg-gradient-to-br from-purple-400 to-purple-700 mb-3 group-hover:opacity-90 transition-opacity" />
                    <p className="text-white font-semibold">{artista.nombre}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tabActiva === "albumes" && (
          <>
            {albumesGuardados.length === 0 ? (
              <div className="text-center py-16">
                <i className="pi pi-book text-slate-600 text-4xl mb-4" />
                <p className="text-slate-400">
                  Aún no tienes álbumes guardados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {albumesGuardados.map((album) => (
                  <div key={album.nombre} className="cursor-pointer group">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 mb-3 group-hover:opacity-90 transition-opacity" />
                    <p className="text-white font-semibold">{album.nombre}</p>
                    <p className="text-slate-500 text-sm">{album.artista}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <NuevaPlaylistModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onCrear={manejarCrearPlaylist}
      />
    </div>
  );
}