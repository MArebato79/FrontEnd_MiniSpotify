import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart, MoreHorizontal, Edit2 } from "lucide-react"; // Importar Edit2
import { getPlaylistById } from "../services/playlistService";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../components/Player";
import { EditPlaylistModal } from "../components/EditPlaylistModal"; // Asegúrate de tener este componente

export const PlaylistPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!playlist) return <div className="p-8 text-white">Playlist no encontrada</div>;

  // === LÓGICA DE DUEÑO (SOLUCIÓN) ===
  // Comprobamos si el ID del usuario logueado coincide con el creador de la playlist
  // Usamos '==' para que funcione aunque uno sea String y el otro Number
  const isOwner = user?.id && playlist.usuario?.id && (user.id == playlist.usuario.id);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-[#121212] min-h-screen text-white pb-32">
      <div className="flex items-end gap-6 p-8 bg-black/20 backdrop-blur-md pt-20">
        
        {/* IMAGEN SEGURA (placehold.co) */}
        <img 
          src={playlist.imagenUrl || playlist.foto || "https://placehold.co/400?text=Playlist"} 
          alt={playlist.nombre} 
          className="w-52 h-52 shadow-2xl rounded-md object-cover"
          onError={(e) => e.target.src = "https://placehold.co/400?text=Error"}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase">Playlist {playlist.publica ? "(Pública)" : "(Privada)"}</span>
          <h1 className="text-6xl font-black tracking-tighter">{playlist.nombre}</h1>
          <p className="text-gray-400 mt-2">{playlist.description || playlist.descripcion || "Sin descripción"}</p>
          
          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
             {/* Foto pequeña del usuario creador */}
             <img 
                src={playlist.usuario?.foto || "https://placehold.co/50"} 
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => e.target.style.display = 'none'} 
             />
             <span className="font-bold hover:underline cursor-pointer">
                {playlist.usuario?.username || "Usuario desconocido"}
             </span>
             
             {/* BOTÓN EDITAR (Solo si es dueño) */}
             {isOwner && (
                <button 
                    onClick={() => setIsEditOpen(true)}
                    className="ml-4 flex items-center gap-2 text-gray-300 border border-gray-500 hover:text-white hover:border-white px-3 py-1 rounded-full text-xs transition"
                >
                    <Edit2 size={14}/> Editar
                </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-8 mb-8">
             <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg">
                <Play fill="black" size={24} className="ml-1 text-black"/>
            </button>
            <button className="text-gray-400 hover:text-white"><Heart size={32}/></button>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal size={32}/></button>
        </div>
        
        {/* Aquí iría la lista de canciones */}
        <div className="text-gray-500 italic">
            {playlist.cancionesEntradas && playlist.cancionesEntradas.length > 0 
                ? "Lista de canciones..." // Aquí puedes mapear las canciones si las tienes
                : "Esta playlist está vacía."}
        </div>
      </div>

      <EditPlaylistModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        playlist={playlist}
        onUpdated={fetchPlaylist}
      />
    </div>
  );
};