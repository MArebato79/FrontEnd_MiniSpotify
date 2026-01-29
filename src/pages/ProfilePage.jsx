import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { createArtist } from "../services/artistaService";
import { toast } from "sonner";
import { User, Mic2, Music, Award } from "lucide-react";
import { useState } from "react";

export const ProfilePage = () => {
  const { user, logout } = useAuth(); // Sacamos datos del usuario
  const { register, handleSubmit, reset } = useForm();
  
  // Estado local para saber si acabamos de crear el artista sin recargar página
  const [isArtistNow, setIsArtistNow] = useState(!!user?.artistId);

  const onSubmitArtist = async (data) => {
    try {
        // 1. Llamamos al servicio
        await createArtist(data);
        toast.success("¡Felicidades! Ahora eres artista 🎤");
        setIsArtistNow(true);
        reset();
        
        // NOTA: Aquí idealmente deberíamos recargar el token del usuario 
        // para que el 'user.artistId' se actualice en el contexto global.
        // Por ahora, pedimos relogin o simplemente mostramos el éxito visualmente.
        setTimeout(() => {
            toast.info("Por favor, vuelve a iniciar sesión para ver tus herramientas de artista");
            logout();
        }, 3000);

    } catch (error) {
        toast.error("Error al crear perfil de artista");
    }
  };

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
        
        {/* --- CABECERA DE PERFIL --- */}
        <div className="flex items-center gap-6 mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <User size={64} className="text-white" />
            </div>
            <div>
                <h2 className="text-sm font-bold uppercase text-spotify-green mb-1">Perfil</h2>
                <h1 className="text-5xl font-bold mb-2">{user?.username}</h1>
                <p className="text-gray-400 text-sm">Usuario de MiniSpotify</p>
                {/* Si es artista, mostramos una etiqueta */}
                {isArtistNow && (
                    <span className="inline-flex items-center gap-1 mt-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                        <Award size={14}/> Artista Verificado
                    </span>
                )}
            </div>
        </div>

        {/* --- SECCIÓN LÓGICA: ¿ERES ARTISTA O NO? --- */}
        
        {isArtistNow ? (
            /* CASO A: YA ES ARTISTA */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#181818] p-6 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                    <Music size={32} className="text-spotify-green mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Mis Álbumes</h3>
                    <p className="text-gray-400 text-sm">Sube y gestiona tu música.</p>
                </div>
                <div className="bg-[#181818] p-6 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                    <Mic2 size={32} className="text-purple-500 mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Estadísticas</h3>
                    <p className="text-gray-400 text-sm">Mira quién te escucha.</p>
                </div>
            </div>
        ) : (
            /* CASO B: NO ES ARTISTA (MUESTRA FORMULARIO) */
            <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 p-8 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Mic2 /> Conviértete en Artista
                    </h2>
                    <p className="text-gray-400 mb-6">Sube tu música, crea álbumes y llega a millones de fans.</p>

                    <form onSubmit={handleSubmit(onSubmitArtist)} className="flex flex-col gap-4 max-w-md">
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Nombre Artístico</label>
                            <input 
                                {...register("nombre", { required: true })}
                                placeholder="Ej: The Beatles"
                                className="w-full bg-white/10 border border-transparent focus:border-white rounded p-3 text-white outline-none transition"
                            />
                        </div>
                        
                        <button className="bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition w-fit">
                            Activar Perfil de Artista
                        </button>
                    </form>
                </div>
                
                {/* Decoración de fondo */}
                <Mic2 size={200} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </div>
        )}
    </div>
  );
};