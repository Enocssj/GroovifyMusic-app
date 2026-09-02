import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import LoginPage from "../auth/Login";
import RegisterPage from "../auth/Register";
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/biblioteca/tus-me-gusta" element={<TusMeGusta />} />
          <Route path="/artista/:artistaId" element={<ArtistaPerfil />} />
          <Route path="/album/:albumId" element={<AlbumDetalle />} />
          <Route path="/reproduciendo" element={<Reproductor />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
            
        <Route path="*" element={<Navigate to="/login" replace />} />

      
      </Routes>
    </BrowserRouter>
  );
}