import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Play, Heart, MoreHorizontal, Edit2 } from "lucide-react";
import { getCancionById } from "../services/cancionService";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../components/Player";
import { EditSongModal } from "../components/EditSongModal";

export const SongPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchSong = async () => {
    try {
      const data = await getCancionById(id);
      setSong(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSong();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!song) return <div className="p-8 text-white">Canción no encontrada</div>;

  // === LÓGICA DE DUEÑO ROBUSTA ===
  // Usamos '==' en vez de '===' para que "5" sea igual a 5
  const isOwner = user?.artistId && song.artista?.id && (user.artistId == song.artista.id);

  return (
    <div className="bg-gradient-to-b from-blue-900 to-[#121212] min-h-screen text-white pb-32">
      <div className="flex items-end gap-6 p-8 bg-black/20 backdrop-blur-md pt-20">
        
        {/* IMAGEN ARREGLADA (Sin via.placeholder) */}
        <img 
          src={song.imagenUrl || song.foto || "https://placehold.co/400?text=No+Image"} 
          alt={song.titulo} 
          className="w-52 h-52 shadow-2xl rounded-md object-cover"
          onError={(e) => e.target.src = "https://placehold.co/400?text=Error"}
        />
        
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase">Canción</span>
          <h1 className="text-6xl font-black tracking-tighter">{song.titulo}</h1>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            {/* Foto pequeña del artista */}
            <img 
               src={song.artista?.imagenUrl || "https://placehold.co/50"} 
               className="w-6 h-6 rounded-full"
               onError={(e) => e.target.style.display = 'none'} 
            />
            <span className="hover:underline cursor-pointer">{song.artista?.nombre || "Artista desconocido"}</span>
            <span>• {song.anio || "2024"}</span>
            
            {/* BOTÓN EDITAR */}
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
            <button 
                onClick={() => playSong(song)}
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition shadow-lg"
            >
                <Play fill="black" size={24} className="ml-1"/>
            </button>
            <button className="text-gray-400 hover:text-white"><Heart size={32}/></button>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal size={32}/></button>
        </div>
      </div>

      <EditSongModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        song={song} 
        onUpdated={fetchSong}
      />
    </div>
  );
};