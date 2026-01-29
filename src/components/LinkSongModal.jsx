import { useEffect, useState } from "react";
import { X, Music, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getArtistById } from "../services/artistaService";
import { linkSongToAlbum } from "../services/albumService";
import { toast } from "sonner";

export const LinkSongModal = ({ isOpen, onClose, albumId, onSongLinked }) => {
  const { user } = useAuth();
  const [mySongs, setMySongs] = useState([]);
  
  useEffect(() => {
    if (isOpen && user?.artistId) {
       
        getArtistById(user.artistId).then(data => {
            const allSongs = data.albums?.flatMap(a => a.canciones) || [];
            const availableSongs = allSongs.filter(s => s.albumId !== parseInt(albumId));
            setMySongs(availableSongs);
        });
    }
  }, [isOpen, user, albumId]);

  if (!isOpen) return null;

  const handleLink = async (cancionId) => {
      try {
          await linkSongToAlbum(albumId, cancionId);
          toast.success("Canción movida al álbum");
          onSongLinked();
      } catch (error) {
          toast.error("Error al vincular");
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
        
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Music className="text-blue-400"/> Biblioteca de Canciones
        </h2>
        <p className="text-gray-400 text-xs mb-4">Elige una canción para moverla a este álbum.</p>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
            {mySongs.map(song => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition group">
                    <span className="text-white text-sm truncate">{song.titulo}</span>
                    <button 
                        onClick={() => handleLink(song.id)}
                        className="text-gray-400 hover:text-green-500 hover:scale-110 transition"
                        title="Mover aquí"
                    >
                        <CheckCircle size={20} />
                    </button>
                </div>
            ))}
            {mySongs.length === 0 && <p className="text-gray-500 text-center py-4">No tienes otras canciones disponibles.</p>}
        </div>
      </div>
    </div>
  );
};