import { useEffect, useState } from "react";
import { Search, Bell, User, Play, Music, Disc, ListMusic } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Importamos los servicios para pedir datos
import { getAllArtists } from "../services/artistaService";
import { getAllCanciones } from "../services/cancionService";
import { getMyPlaylists } from "../services/playlistService";

export const HomePage = () => {
    const navigate = useNavigate();

    // Estados para cada sección
    const [artistas, setArtistas] = useState([]);
    const [canciones, setCanciones] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        // Cargamos todo de una vez al entrar
        const loadData = async () => {
            const artistsData = await getAllArtists();
            setArtistas(artistsData || []);

            const songsData = await getAllCanciones();
            setCanciones(songsData || []);

            const playlistsData = await getMyPlaylists();
            setPlaylists(playlistsData || []);
        };
        loadData();
    }, []);

    return (
        <div className="flex flex-col h-full">

            {/* HEADER FLOTANTE */}
            <header className="sticky top-0 bg-black/80 backdrop-blur-md p-6 flex items-center justify-between z-20">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-3 w-96 group focus-within:bg-white/20 transition">
                    <Search size={22} className="text-gray-400 group-focus-within:text-white" />
                    <input
                        type="text"
                        placeholder="¿Qué quieres escuchar?"
                        className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-400 text-sm font-medium"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-white transition transform hover:scale-110">
                        <Bell size={22} />
                    </button>
                    <Link to="/perfil">
                        <div className="bg-black/50 p-1 rounded-full cursor-pointer hover:scale-105 transition ring-2 ring-transparent hover:ring-white/20">
                            <User size={28} className="text-white bg-[#282828] rounded-full p-1.5" />
                        </div>
                    </Link>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL SCROLLABLE */}
            <div className="p-8 pt-2 pb-32 space-y-12 overflow-y-auto">

                {/* SECCIÓN 1: ARTISTAS */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="text-blue-500" /> Artistas Populares
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {artistas.slice(0, 6).map(artist => (
                            <div
                                key={artist.id}
                                onClick={() => navigate(`/artist/${artist.id}`)} // No hay página detalle artista aún, lo dejamos en home o futuras mejoras
                                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col items-center text-center hover:-translate-y-2 duration-300"
                            >
                                <img
                                    src={artist.imagenUrl || "https://placehold.co/200"}
                                    className="w-32 h-32 object-cover rounded-full shadow-lg mb-4 group-hover:shadow-2xl transition"
                                    alt={artist.nombre}
                                />
                                <h3 className="font-bold text-white truncate w-full text-lg">{artist.nombre}</h3>
                                <p className="text-sm text-gray-400 mt-1">Artista</p>
                            </div>
                        ))}
                        {artistas.length === 0 && <p className="text-gray-500 col-span-full">No hay artistas disponibles.</p>}
                    </div>
                </section>

                {/* SECCIÓN 2: CANCIONES */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Music className="text-green-500" /> Canciones Recientes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {canciones.slice(0, 9).map(song => (
                            <div key={song.id}
                                onClick={() => navigate(`/song/${song.id}`)}
                                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-md group cursor-pointer transition"
                            >
                                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center rounded text-gray-400 group-hover:text-white">
                                    <Music size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold truncate">{song.titulo}</h4>
                                    <p className="text-xs text-gray-400">
                                        {Math.floor(song.duracion / 60)}:{(song.duracion % 60).toString().padStart(2, '0')}
                                    </p>
                                </div>
                                <button className="bg-spotify-green rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110">
                                    <Play size={16} fill="black" className="text-black ml-0.5" />
                                </button>
                            </div>
                        ))}
                        {canciones.length === 0 && <p className="text-gray-500 col-span-full">No hay canciones subidas aún.</p>}
                    </div>
                </section>

                {/* SECCIÓN 3: PLAYLISTS */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <ListMusic className="text-purple-500" /> Playlists Destacadas
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {playlists.map(pl => (
                            <div
                                key={pl.id}
                                onClick={() => navigate(`/playlist/${pl.id}`)}
                                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
                            >
                                <div className="relative mb-4 overflow-hidden rounded-md">
                                    <img src={pl.imagenUrl || "https://placehold.co/200"} className="w-full aspect-square object-cover shadow-lg group-hover:scale-105 transition duration-500" />
                                    <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl hover:scale-110">
                                        <Play fill="black" size={20} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-white truncate">{pl.nombre}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{pl.description || "Sin descripción"}</p>
                            </div>
                        ))}
                        {playlists.length === 0 && <p className="text-gray-500 col-span-full">No tienes playlists.</p>}
                    </div>
                </section>

            </div>
        </div>
    );
};