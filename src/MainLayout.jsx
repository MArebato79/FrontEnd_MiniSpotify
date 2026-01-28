import { Outlet } from "react-router-dom"; // <--- LA CLAVE
import { Sidebar } from "../components/Sidebar";
import { Player } from "../components/Player";

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      
      {/* ZONA MEDIA: Sidebar + Contenido Variable */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* El Sidebar SIEMPRE está aquí */}
        <aside className="w-64 bg-black hidden md:flex flex-col border-r border-white/5">
           <Sidebar />
        </aside>

        {/* AQUÍ OCURRE LA MAGIA DEL CAMBIO */}
        <main className="flex-1 bg-gradient-to-b from-spotify-light/50 to-spotify-dark overflow-y-auto rounded-lg m-2 relative">
            {/* El Outlet pinta la página que toque (Home, Playlist, etc.) */}
            <Outlet />
        </main>
        
      </div>

      {/* El Player SIEMPRE está aquí */}
      <footer className="h-24 bg-black border-t border-white/10 w-full z-50">
         <Player />
      </footer>
    </div>
  );
};