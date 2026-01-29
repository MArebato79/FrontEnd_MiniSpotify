import { useEffect, useState } from "react";
import { Home, Library, PlusSquare, Disc, Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyPlaylists } from "../services/playlistService";
import { getArtistById } from "../services/artistaService";
import { CreateFormPlaylist } from "./CreateFormPlaylist"; // <--- 1. FALTA ESTO

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  // 2. FALTA ESTO: El interruptor para abrir/cerrar
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = () => {
    getMyPlaylists().then(data => setPlaylists(data));
  };

  useEffect(() => {
    fetchPlaylists();
    if (user?.artistId) {
        getArtistById(user.artistId).then(data => {
            if(data) setAlbums(data.albums || []);
        });
    }
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col bg-black text-gray-400">
        
        {/* ... (Cabecera igual) ... */}
        <div className="p-6 pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
                <Music size={28} className="text-spotify-green"/>
                <span>MiniSpotify</span>
            </div>
            
            <nav className="space-y-4">
                <a href="/home" className="flex items-center gap-4 hover:text-white transition font-bold">
                    <Home size={24} /> Inicio
                </a>
                <div className="flex items-center gap-4 hover:text-white transition font-bold cursor-pointer">
                    <Library size={24} /> Tu Biblioteca
                </div>
            </nav>
        </div>

        {/* ZONA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-thin">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold tracking-widest uppercase hover:text-white">Tus Playlists</h3>
                    
                    {/* 3. FALTA ESTO: El botón ahora activa el interruptor */}
                    <button onClick={() => setIsModalOpen(true)}>
                         <PlusSquare size={18} className="hover:text-white cursor-pointer hover:scale-110 transition" />
                    </button>

                </div>
                <ul className="space-y-2">
                    {playlists.map(list => (
                        <li key={list.id} className="text-sm hover:text-white cursor-pointer truncate">
                            {list.nombre}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* ... resto del código ... */}
        </div>

        <div className="p-6 border-t border-white/10">
            <button onClick={logout} className="text-sm hover:text-white hover:underline">
                Cerrar Sesión
            </button>
        </div>

        {/* 4. FALTA ESTO: Aquí pintamos la ventana (invisible hasta que des click) */}
        <CreateFormPlaylist 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onPlaylistCreated={fetchPlaylists} 
        />
    </div>
  );
};