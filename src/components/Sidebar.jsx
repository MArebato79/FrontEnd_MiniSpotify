import { useEffect, useState } from "react";
import { Home, Library, PlusSquare, Disc, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Importante: Link y useNavigate
import { useAuth } from "../context/AuthContext";
import { getMyPlaylists } from "../services/playlistService";
import { getArtistById } from "../services/artistaService";
import { CreateFormPlaylist } from "./CreateFormPlaylist";
import { CreateFormAlbum } from "./CreateFormAlbum"; // <--- Importamos el de Álbum

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);

    // Estados para los modales
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const fetchData = () => {
        getMyPlaylists().then(data => setPlaylists(data || []));
        if (user?.artistId) {
            getArtistById(user.artistId).then(data => {
                if (data) setAlbums(data.albums || []);
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <div className="w-full h-full flex flex-col bg-black text-gray-400">

            {/* HEADER */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
                    <Music size={28} className="text-spotify-green" />
                    <span>MiniSpotify</span>
                </div>

                <nav className="space-y-4">
                    <Link to="/home" className="flex items-center gap-4 hover:text-white transition font-bold">
                        <Home size={24} /> Inicio
                    </Link>
                    {/* ENLACE A BIBLIOTECA HABILITADO */}
                    <Link to="/library" className="flex items-center gap-4 hover:text-white transition font-bold cursor-pointer">
                        <Library size={24} /> Tu Biblioteca
                    </Link>
                </nav>
            </div>

            {/* LISTAS SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-thin">

                {/* PLAYLISTS */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold tracking-widest uppercase hover:text-white">Tus Playlists</h3>
                        <button onClick={() => setIsPlaylistModalOpen(true)}>
                            <PlusSquare size={18} className="hover:text-white cursor-pointer hover:scale-110 transition" />
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {playlists.map(list => (
                            <li key={list.id} onClick={() => navigate(`/playlist/${list.id}`)} className="text-sm hover:text-white cursor-pointer truncate">
                                {list.nombre}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ÁLBUMES (SOLO ARTISTAS) */}
                {user?.artistId && (
                    <div>
                        <div className="flex items-center justify-between mb-2 mt-6">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-spotify-green">Mis Álbumes</h3>
                            {/* BOTÓN CREAR ÁLBUM HABILITADO */}
                            <button onClick={() => setIsAlbumModalOpen(true)}>
                                <Disc size={18} className="text-spotify-green hover:text-white cursor-pointer hover:scale-110 transition" />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {albums.map(album => (
                                <li key={album.id} onClick={() => navigate(`/album/${album.id}`)} className="flex items-center gap-2 text-sm hover:text-white cursor-pointer group">
                                    <img src={album.imagenUrl || "https://placehold.co/40"} className="w-8 h-8 rounded opacity-70 group-hover:opacity-100 object-cover" />
                                    <span className="truncate">{album.nombre}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-white/10">
                <button onClick={logout} className="text-sm hover:text-white hover:underline">
                    Cerrar Sesión
                </button>
            </div>

            {/* MODALES */}
            <CreateFormPlaylist
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                onPlaylistCreated={fetchData}
            />
            <CreateFormAlbum
                isOpen={isAlbumModalOpen}
                onClose={() => setIsAlbumModalOpen(false)}
                onAlbumCreated={fetchData}
            />
        </div>
    );
};