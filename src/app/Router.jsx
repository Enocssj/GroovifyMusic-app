import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import AppLayoutArtista from "./AppLayoutArtista";
import AppLayoutSegunRol from "./AppLayoutSegunRol";
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

        
        <Route element={<AppLayout />}>
         
          <Route path="/" element={<Home />} />

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

       
        <Route
          element={
            <RutaProtegida>
              <AppLayoutSegunRol />
            </RutaProtegida>
          }
        >
          <Route path="/album/:albumId" element={<AlbumDetalle />} />
        </Route>

        
        <Route
          element={
            <RutaProtegida>
              <AppLayoutArtista />
            </RutaProtegida>
          }
        >
          <Route path="/mi-perfil-artista" element={<ArtistaPerfil />} />
          <Route
            path="/mi-biblioteca-artista"
            element={<MiBibliotecaArtista />}
          />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}