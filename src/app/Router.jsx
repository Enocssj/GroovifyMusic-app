import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import LoginPage from "../auth/Login";
import RegisterPage from "../auth/Register";
import RutaProtegida from "../auth/RutaProtegida";
import RutaPublica from "../auth/RutaPublica";
import Home from "../pages/Home";
import Buscar from "../pages/Buscar";
import Biblioteca from "../pages/Biblioteca";
import TusMeGusta from "../pages/TusMeGusta";
import ArtistaPerfil from "../pages/ArtistaPerfil";
import AlbumDetalle from "../pages/AlbumDetalle";
import Reproductor from "../pages/Reproductor";
import Perfil from "../pages/Perfil";
import Configuracion from "../pages/Configuracion";

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

        {/* Layout con sidebar, visible con o sin sesión */}
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

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}