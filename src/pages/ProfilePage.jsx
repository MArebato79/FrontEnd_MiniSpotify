import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mic2, Music, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createArtist } from "../services/artistaService";
import { CreateFormAlbum } from "../components/CreateFormAlbum"; // Asegúrate de tener este componente creado

export const ProfilePage = () => {
  const { user, logout } = useAuth(); 
  const { register, handleSubmit, reset } = useForm();
  
  // Estado para saber si el usuario se acaba de convertir en artista visualmente
  // (Aunque lo ideal es recargar el token, esto sirve para el feedback inmediato)
  const [isArtistNow, setIsArtistNow] = useState(!!user?.artistId);
  
  // Estado para abrir/cerrar la ventana de crear álbum
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // Función para convertirse en artista
  const onSubmitArtist = async (data) => {
    try {
        await createArtist(data);
        toast.success("¡Felicidades! Ahora eres artista 🎤");
        setIsArtistNow(true);
        reset();
        
        // Aviso para que el usuario sepa que debe reloguear para tener permisos completos
        setTimeout(() => {
            toast.info("Por favor, vuelve a iniciar sesión para actualizar tus permisos.");
            logout();
        }, 3000);

    } catch (error) {
        toast.error("Error al crear perfil de artista");
    }
  };

  return (
    <div className="p-8 text-white max-w-4xl mx-auto pb-24">
        
        {/* --- CABECERA DE PERFIL --- */}
        <div className="flex items-center gap-6 mb-12 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-black/50">
                <User size={64} className="text-white drop-shadow-md" />
            </div>
            <div>
                <h2 className="text-xs font-bold uppercase text-spotify-green mb-1 tracking-widest">Perfil de Usuario</h2>
                <h1 className="text-5xl font-black mb-2 tracking-tighter">{user?.username}</h1>
                <p className="text-gray-400 text-sm">Miembro de MiniSpotify</p>
                
                {/* Etiqueta de Artista */}
                {isArtistNow && (
                    <div className="inline-flex items-center gap-2 mt-4 bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        <Award size={16} className="text-purple-600"/> 
                        <span>ARTISTA VERIFICADO</span>
                    </div>
                )}
            </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        
        {isArtistNow ? (
            /* =========================================
               VISTA A: PANEL DE CONTROL DE ARTISTA
               ========================================= */
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Panel de Artista
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* TARJETA 1: CREAR ÁLBUM (CLICABLE) */}
                    <div 
                        onClick={() => setIsAlbumModalOpen(true)}
                        className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] hover:scale-[1.02] hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                             <Music size={100} />
                        </div>
                        
                        <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mb-4 text-spotify-green group-hover:bg-spotify-green group-hover:text-black transition">
                            <Music size={24} />
                        </div>
                        
                        <h3 className="font-bold text-xl mb-2 text-white">Lanzar Nuevo Álbum</h3>
                        <p className="text-gray-400 text-sm">Sube tu música, añade carátulas y publícala para tus fans.</p>
                    </div>

                    {/* TARJETA 2: ESTADÍSTICAS (DECORATIVA) */}
                    <div className="bg-[#181818] p-8 rounded-xl border border-white/5 hover:bg-[#282828] transition cursor-default">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
                            <Mic2 size={24} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Estadísticas</h3>
                        <p className="text-gray-400 text-sm">Visualiza tus reproducciones y seguidores (Próximamente).</p>
                    </div>

                </div>
            </div>
        ) : (
            /* =========================================
               VISTA B: FORMULARIO "CONVIÉRTETE EN ARTISTA"
               ========================================= */
            <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black border border-white/10 p-10 rounded-2xl relative overflow-hidden shadow-2xl">
                
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-black mb-4 flex items-center gap-3 text-white">
                        <Mic2 className="text-spotify-green" size={32}/> 
                        ¿Haces música?
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                        Conviértete en artista en MiniSpotify. Sube tus álbumes gratis, llega a millones de fans y gestiona tu carrera desde aquí.
                    </p>

                    <form onSubmit={handleSubmit(onSubmitArtist)} className="flex flex-col gap-5">
                        <div className="group">
                            <label className="text-xs font-bold uppercase text-gray-500 mb-2 block group-focus-within:text-spotify-green transition">
                                Nombre Artístico
                            </label>
                            <input 
                                {...register("nombre", { required: true })}
                                placeholder="Ej: The Beatles"
                                className="w-full bg-white/5 border border-white/10 focus:border-spotify-green focus:bg-white/10 rounded-lg p-4 text-white outline-none transition font-medium text-lg placeholder-gray-600"
                            />
                        </div>
                        
                        <button className="bg-spotify-green text-black font-bold py-4 px-8 rounded-full hover:scale-105 hover:brightness-110 transition shadow-lg shadow-green-900/20 mt-2 uppercase tracking-widest text-sm w-fit">
                            Activar Perfil de Artista
                        </button>
                    </form>
                </div>
                
                {/* Elemento decorativo de fondo */}
                <Mic2 size={300} className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12 pointer-events-none" />
            </div>
        )}

        {/* --- VENTANA MODAL (INVISIBLE POR DEFECTO) --- */}
        <CreateFormAlbum 
            isOpen={isAlbumModalOpen}
            onClose={() => setIsAlbumModalOpen(false)}
            onAlbumCreated={() => {
                // Aquí podrías añadir lógica extra si quisieras refrescar algo
                console.log("Álbum creado");
            }}
        />

    </div>
  );
};