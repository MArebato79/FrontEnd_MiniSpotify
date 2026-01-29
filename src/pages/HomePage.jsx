import { useEffect, useState } from "react";
import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getFollowedArtists } from "../services/artistaService";

export const HomePage = () => {
    const [followedArtists, setFollowedArtists] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const artists = await getFollowedArtists();
            setFollowedArtists(artists || []);
        };
        loadData();
    }, []);

    return (
        <>
            {/* HEADER */}
            <header className="sticky top-0 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between z-10">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-96 group focus-within:bg-white/20 transition">
                    <Search size={20} className="text-gray-400 group-focus-within:text-white" />
                    <input
                        type="text"
                        placeholder="Busca artistas..."
                        className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-400 text-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><Bell size={20} /></button>

                    <Link to="/perfil">
                        <div className="bg-black/50 p-1 rounded-full cursor-pointer hover:scale-105 transition">
                            <User size={24} className="text-white bg-gray-700 rounded-full p-1" />
                        </div>
                    </Link>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <div className="p-6 pt-2 pb-24">

                <h1 className="text-3xl font-bold text-white mb-6">Tus Artistas 🎤</h1>

                {/* GRID DE ARTISTAS */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

                    {followedArtists.length > 0 ? (
                        followedArtists.map(artist => (
                            <div key={artist.id} className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col items-center text-center hover:scale-[1.02]">
                                <img
                                    src={artist.imagenUrl || "https://placehold.co/200"}
                                    className="w-32 h-32 object-cover rounded-full shadow-lg mb-4 group-hover:shadow-xl transition"
                                    alt={artist.nombre}
                                />
                                <h3 className="font-bold text-white truncate w-full text-lg">{artist.nombre}</h3>
                                <p className="text-sm text-gray-400 mt-1">Artista</p>
                            </div>
                        ))
                    ) : (
                        // MENSAJE SI NO SIGUES A NADIE
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p className="text-xl">Aún no sigues a ningún artista.</p>
                            <p className="text-sm mt-2">¡Busca alguno y dale a seguir!</p>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
};