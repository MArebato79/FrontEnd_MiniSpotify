import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mic2, Music, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createArtist } from "../services/artistaService";
import { CreateFormAlbum } from "../components/CreateFormAlbum";
import { CreateFormCancion } from "../components/CreateFormCancion";
import { CreateFormPlaylist } from "../components/CreateFormPlaylist";

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const [isArtistNow, setIsArtistNow] = useState(!!user?.artistId);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const [isSongModalOpen, setIsSongModalOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)

    const onSubmitArtist = async (data) => {
        try {
            await createArtist(data);
            toast.success("¡Felicidades! Ahora eres artista 🎤");
            setIsArtistNow(true);
            reset();
            setTimeout(() => {
                toast.info("Por favor, vuelve a iniciar sesión.");
                logout();
            }, 3000);
        } catch (error) {
            toast.error("Error al crear perfil de artista");
        }
    };

    return (
        <div className="p-8 text-white max-w-4xl mx-auto pb-24">

            {/* CABECERA */}
            <div className="flex items-center gap-6 mb-12 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-black/50">
                    <User size={64} className="text-white drop-shadow-md" />
                </div>
                <div>
                    <h2 className="text-xs font-bold uppercase text-spotify-green mb-1 tracking-widest">Perfil de Usuario</h2>
                    <h1 className="text-5xl font-black mb-2 tracking-tighter">{user?.username}</h1>
                    <p className="text-gray-400 text-sm">Miembro de MiniSpotify</p>
                    {isArtistNow && (
                        <div className="inline-flex items-center gap-2 mt-4 bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            <Award size={16} className="text-purple-600" />
                            <span>ARTISTA VERIFICADO</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="my-2">
                <div
                    onClick={() => setIsPlaylistModalOpen(true)}
                    className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-orange-400 group-hover:bg-blue-500 group-hover:text-white transition">
                        <Music size={24} />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">Subir Playlist</h3>
                    <p className="text-gray-400 text-sm">Añade una Playlist.</p>
                </div>
            </div>

            {/* CONTENIDO */}
            {isArtistNow ? (
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Panel de Artista</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* TARJETA 1: CREAR ÁLBUM */}
                        <div
                            onClick={() => setIsAlbumModalOpen(true)}
                            className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mb-4 text-spotify-green group-hover:bg-spotify-green group-hover:text-black transition">
                                <Music size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-white">Lanzar Álbum</h3>
                            <p className="text-gray-400 text-sm">Publica un nuevo disco.</p>
                        </div>

                        {/* TARJETA 2: SUBIR CANCIÓN */}
                        <div
                            onClick={() => setIsSongModalOpen(true)}
                            className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                                <Music size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-white">Subir Canción</h3>
                            <p className="text-gray-400 text-sm">Añade un tema suelto.</p>
                        </div>

                        {/* TARJETA 3: ESTADÍSTICAS */}
                        <div className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] transition cursor-default">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
                                <Mic2 size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Estadísticas</h3>
                            <p className="text-gray-400 text-sm">Próximamente.</p>
                        </div>
                    </div>
                </div>
            ) : (
                /* FORMULARIO ARTISTA */
                <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black border border-white/10 p-10 rounded-2xl relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-lg">
                        <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-white">
                            <Mic2 className="text-spotify-green" size={32} /> ¿Haces música?
                        </h2>
                        <p className="text-gray-300 mb-8">Conviértete en artista en MiniSpotify.</p>
                        <form onSubmit={handleSubmit(onSubmitArtist)} className="flex flex-col gap-5">
                            <div className="group">
                                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Nombre Artístico</label>
                                <input
                                    {...register("nombre", { required: true })}
                                    placeholder="Ej: The Beatles"
                                    className="w-full bg-white/5 border border-white/10 focus:border-spotify-green rounded-lg p-4 text-white outline-none"
                                />
                            </div>
                            <button className="bg-spotify-green text-black font-bold py-4 px-8 rounded-full hover:scale-105 transition w-fit">
                                Activar Perfil
                            </button>
                        </form>
                    </div>
                </div>
            )}


            {/* MODALES */}
            <CreateFormAlbum
                isOpen={isAlbumModalOpen}
                onClose={() => setIsAlbumModalOpen(false)}
                onAlbumCreated={() => console.log("Álbum creado")}
            />

            <CreateFormCancion
                isOpen={isSongModalOpen}
                onClose={() => setIsSongModalOpen(false)}
                onSongCreated={() => toast.success("Canción subida!")}
            />

            <CreateFormPlaylist
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                onPlaylistCreated={() => toast.success("Playlist creada")}
            />


        </div>
    );
};