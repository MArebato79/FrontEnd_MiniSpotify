import { useEffect, useState } from "react";
import { Home, Library, PlusSquare, Disc, Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyPlaylists } from "../services/playlistService";
import { getArtistById } from "../services/artistaService";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // 1. Cargar Playlists
    getMyPlaylists().then(data => setPlaylists(data));

    // 2. Cargar Álbumes (Solo si es artista)
    if (user?.artistId) {
        getArtistById(user.artistId).then(data => {
            if(data) setAlbums(data.albums || []);
        });
    }
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col bg-black text-gray-400">
        
        {/* ZONA FIJA SUPERIOR (Logo y Menú Principal) */}
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

        {/* ZONA SCROLLABLE (Playlists y Álbumes) */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-thin">
            
            {/* Sección PLAYLISTS */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold tracking-widest uppercase hover:text-white">Tus Playlists</h3>
                    <PlusSquare size={18} className="hover:text-white cursor-pointer" />
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

            {/* Sección ARTISTA (Solo visible si tienes artistId) */}
            {user?.artistId && (
                <div>
                    <div className="flex items-center justify-between mb-2 mt-6">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-spotify-green">Mis Álbumes</h3>
                        <Disc size={18} className="text-spotify-green hover:text-white cursor-pointer" />
                    </div>
                    <ul className="space-y-2">
                        {albums.length === 0 && <li className="text-sm opacity-50">No has publicado nada</li>}
                        {albums.map(album => (
                            <li key={album.id} className="flex items-center gap-2 text-sm hover:text-white cursor-pointer group">
                                <img src={album.imagenUrl || "https://placehold.co/40"} alt="Cover" className="w-8 h-8 rounded opacity-70 group-hover:opacity-100 object-cover" />
                                <span className="truncate">{album.nombre}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* ZONA FIJA INFERIOR (Logout) */}
        <div className="p-6 border-t border-white/10">
            <button onClick={logout} className="text-sm hover:text-white hover:underline">
                Cerrar Sesión de {user?.username}
            </button>
        </div>
    </div>
  );
};