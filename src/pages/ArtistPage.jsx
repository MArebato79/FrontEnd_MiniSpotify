import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArtistById } from "../services/artistaService";
import { getFollowedArtists, followArtist, unfollowArtist } from "../services/usuarioService";
import { UserCheck, UserPlus, Disc } from "lucide-react";
import { toast } from "sonner";

export const ArtistPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        // 1. Cargar datos del artista
        getArtistById(id).then(data => setArtist(data));

        // 2. Comprobar si ya lo sigo
        getFollowedArtists().then(followedList => {
            // Buscamos si el ID de este artista está en mi lista de seguidos
            const found = followedList.some(a => a.id === parseInt(id));
            setIsFollowing(found);
        });
    }, [id]);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowArtist(id);
                toast("Has dejado de seguir al artista");
            } else {
                await followArtist(id);
                toast.success("¡Ahora sigues a este artista!");
            }
            setIsFollowing(!isFollowing); // Cambio visual inmediato
        } catch (error) {
            toast.error("Error al cambiar seguimiento");
        }
    };

    if (!artist) return <div className="text-white p-10">Cargando artista...</div>;

    return (
        <div className="p-8 text-white pb-24">
            {/* CABECERA ARTISTA */}
            <div className="flex items-end gap-6 mb-10">
                <img
                    src={artist.imagenUrl || "https://placehold.co/300"}
                    className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-white/10"
                    alt={artist.nombre}
                />
                <div className="flex-1">
                    <h2 className="text-sm font-bold uppercase flex items-center gap-2">
                        <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px]">VERIFICADO</span> Artista
                    </h2>
                    <h1 className="text-6xl font-black mb-4 tracking-tight">{artist.nombre}</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-300 max-w-xl text-sm">{artist.bio || "Sin biografía disponible."}</p>

                        {/* BOTÓN SEGUIR */}
                        <button
                            onClick={handleFollowToggle}
                            className={`px-6 py-2 rounded-full font-bold border transition flex items-center gap-2 ${isFollowing
                                    ? "border-gray-400 text-white hover:border-white"
                                    : "bg-white text-black border-transparent hover:scale-105"
                                }`}
                        >
                            {isFollowing ? <><UserCheck size={18} /> Siguiendo</> : <><UserPlus size={18} /> Seguir</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* DISCOGRAFÍA */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Discografía</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {artist.albums?.map(album => (
                        <div
                            key={album.id}
                            onClick={() => navigate(`/album/${album.id}`)}
                            className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] cursor-pointer transition group"
                        >
                            <img src={album.imagenUrl || "https://placehold.co/200"} className="w-full aspect-square object-cover rounded shadow-lg mb-3" />
                            <h3 className="font-bold truncate">{album.nombre}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Disc size={14} /> <span>{album.anio}</span>
                            </div>
                        </div>
                    ))}
                    {!artist.albums?.length && <p className="text-gray-500">Este artista aún no tiene álbumes publicados.</p>}
                </div>
            </section>
        </div>
    );
};