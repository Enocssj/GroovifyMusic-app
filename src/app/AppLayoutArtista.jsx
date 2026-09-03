import { Outlet, useLocation } from "react-router-dom";
import SidebarArtista from "../layout/SidebarArtista";
import PlayerBar from "../layout/PlayerBar";
import ColaPanel from "../layout/ColaPanel";

export default function AppLayoutArtista() {
  const location = useLocation();
  const ocultarBarraReproductor = location.pathname === "/reproduciendo";

  return (
    <div className="h-screen flex flex-col bg-[#0f0d14]">
      <div className="flex flex-1 overflow-hidden">
        <SidebarArtista />
        <Outlet />
        <ColaPanel />
      </div>
      {!ocultarBarraReproductor && <PlayerBar />}
    </div>
  );
}