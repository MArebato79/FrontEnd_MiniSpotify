import { useEffect, useState } from "react";
import { Home, Library, PlusSquare, Disc, Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyPlaylists } from "../services/playlistService";
import { getArtistById } from "../services/artistaService";
import { CreateFormPlaylist } from "./CreateFormPlaylist"; // <--- 1. IMPORTANTE: Importar el Modal

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  // 2. IMPORTANTE: Estado para abrir/cerrar
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función auxiliar para recargar (se usa al iniciar y al crear nueva)
  const fetchPlaylists = () => {
    getMyPlaylists().then(data => setPlaylists(data));
  };

  useEffect(() => {
    fetchPlaylists(); // Cargamos al inicio

    if (user?.artistId) {
        getArtistById(user.artistId).then(data => {
            if(data) setAlbums(data.albums || []);
        });
    }
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col bg-black text-gray-400">
        
        {/* ... (Cabecera igual que antes) ... */}
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
                    
                    {/* 3. IMPORTANTE: El botón ahora tiene onClick */}
                    <button onClick={() => setIsModalOpen(true)}>
                        <PlusSquare size={18} className="hover:text-white cursor-pointer hover:scale-110 transition" />
                    </button>

                </div>
                <ul className="space-y-2">
                    {playlists.length === 0 && <li className="text-sm opacity-50">Sin playlists aún...</li>}
                    {playlists.map(list => (
                        <li key={list.id} className="text-sm hover:text-white cursor-pointer truncate">
                            {list.nombre}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* ... (Sección Artista igual que antes) ... */}
            {user?.artistId && (
                <div>
                     {/* ... código de artista ... */}
                </div>
            )}
        </div>

        <div className="p-6 border-t border-white/10">
            <button onClick={logout} className="text-sm hover:text-white hover:underline">
                Cerrar Sesión de {user?.username}
            </button>
        </div>

        {/* 4. IMPORTANTE: Aquí pintamos el Modal (invisible hasta que des click) */}
        <CreateFormPlaylist 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onPlaylistCreated={fetchPlaylists} 
        />
    </div>
  );
};