import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "../layout/Sidebar";
import SidebarArtista from "../layout/SidebarArtista";
import PlayerBar from "../layout/PlayerBar";
import ColaPanel from "../layout/ColaPanel";

export default function AppLayoutSegunRol() {
  const { usuario } = useAuth();
  const location = useLocation();
  const ocultarBarraReproductor = location.pathname === "/reproduciendo";
  const esArtista = usuario?.rol === "ARTISTA";

  return (
    <div className="h-screen flex flex-col bg-[#0f0d14]">
      <div className="flex flex-1 overflow-hidden">
        {esArtista ? <SidebarArtista /> : <Sidebar />}
        <Outlet />
        <ColaPanel />
      </div>
      {!ocultarBarraReproductor && <PlayerBar />}
    </div>
  );
}