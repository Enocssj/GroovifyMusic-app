import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../services/axiosClient";

export default function MiBibliotecaArtista() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [albumes, setAlbumes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario?.id) {
      setCargando(false);
      return;
    }

    const cargarAlbumes = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await axiosClient.get(`/album/artista/${usuario.id}`);
        setAlbumes(response.data);
      } catch (err) {
        console.error("Error al cargar álbumes:", err);
        setError("No se pudieron cargar tus álbumes");
      } finally {
        setCargando(false);
      }
    };
    cargarAlbumes();
  }, [usuario?.id]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14] px-8 pt-10">
      <h1 className="text-3xl font-bold text-white mb-2">Mi biblioteca</h1>
      <p className="text-slate-400 text-sm mb-8">Tus álbumes como artista.</p>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando álbumes...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : albumes.length === 0 ? (
        <p className="text-sm text-slate-500">Aún no tienes álbumes creados</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {albumes.map((album) => (
            <button
              key={album.id}
              type="button"
              onClick={() => navigate(`/album/${album.id}`)}
              className="flex flex-col gap-2 text-left group"
            >
              {album.portada ? (
                <img
                  src={album.portada}
                  alt={album.nombre}
                  className="w-full aspect-square rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-[#7a63c9] to-[#3a2d5c] group-hover:opacity-90 transition-opacity" />
              )}
              <span className="text-sm font-medium text-white truncate">{album.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}