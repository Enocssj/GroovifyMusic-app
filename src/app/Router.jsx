import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import AppLayoutArtista from "./AppLayoutArtista";
import LoginPage from "../auth/Login";
import RegisterPage from "../auth/Register";
import RutaProtegida from "../auth/RutaProtegida";
import RutaPublica from "../auth/RutaPublica";

// Vistas de usuario
import Home from "../pages/usuario/Home";
import Buscar from "../pages/usuario/Buscar";
import Biblioteca from "../pages/usuario/Biblioteca";
import TusMeGusta from "../pages/usuario/TusMeGusta";
import AlbumDetalle from "../pages/usuario/AlbumDetalle";
import Reproductor from "../pages/usuario/Reproductor";
import Perfil from "../pages/usuario/Perfil";
import Configuracion from "../pages/usuario/Configuracion";

// Vistas de artista
import ArtistaPerfil from "../pages/artista/ArtistaPerfil";
import MiBibliotecaArtista from "../pages/artista/MiBibliotecaArtista";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas solo para no autenticados */}
        <Route
          path="/login"
          element={
            <RutaPublica>
              <LoginPage />
            </RutaPublica>
          }
        />
        <Route
          path="/register"
          element={
            <RutaPublica>
              <RegisterPage />
            </RutaPublica>
          }
        />

        {/* Layout normal, visible con o sin sesión */}
        <Route element={<AppLayout />}>
          {/* Home es pública: se puede explorar sin login */}
          <Route path="/" element={<Home />} />

          {/* Todo lo demás sigue exigiendo sesión, ruta por ruta */}
          <Route
            path="/buscar"
            element={
              <RutaProtegida>
                <Buscar />
              </RutaProtegida>
            }
          />
          <Route
            path="/biblioteca"
            element={
              <RutaProtegida>
                <Biblioteca />
              </RutaProtegida>
            }
          />
          <Route
            path="/biblioteca/tus-me-gusta"
            element={
              <RutaProtegida>
                <TusMeGusta />
              </RutaProtegida>
            }
          />
          {/* Perfil público de OTRO artista (vista de solo lectura) */}
          <Route
            path="/artista/:artistaId"
            element={
              <RutaProtegida>
                <ArtistaPerfil />
              </RutaProtegida>
            }
          />
          <Route
            path="/album/:albumId"
            element={
              <RutaProtegida>
                <AlbumDetalle />
              </RutaProtegida>
            }
          />
          <Route
            path="/reproduciendo"
            element={
              <RutaProtegida>
                <Reproductor />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
          <Route
            path="/configuracion"
            element={
              <RutaProtegida>
                <Configuracion />
              </RutaProtegida>
            }
          />
        </Route>

        {/* Layout de artista: gestión de su propio contenido */}
        <Route
          element={
            <RutaProtegida>
              <AppLayoutArtista />
            </RutaProtegida>
          }
        >
          <Route path="/mi-perfil-artista" element={<ArtistaPerfil />} />
          <Route path="/mi-biblioteca-artista" element={<MiBibliotecaArtista />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}