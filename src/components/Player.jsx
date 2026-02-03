import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2 } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // <--- 1. IMPORTAR AUTH

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth(); // <--- 2. OBTENER USUARIO
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Error play:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay }}>
      {children}
      
      {/* 3. CONDICIÓN: SOLO MOSTRAR SI HAY USUARIO LOGUEADO */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] p-4 h-24 grid grid-cols-3 items-center z-50 text-white shadow-2xl">
            
            {/* INFO CANCIÓN */}
            <div className="flex items-center gap-4">
                {currentSong ? (
                    <>
                        <img 
                            src={currentSong.imagenUrl || currentSong.foto || "https://placehold.co/150"} 
                            className="w-14 h-14 rounded object-cover shadow-lg" 
                            onError={(e) => e.target.src = "https://placehold.co/150?text=Music"}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white hover:underline cursor-pointer line-clamp-1">{currentSong.titulo}</span>
                            <span className="text-xs text-gray-400 hover:underline cursor-pointer">{currentSong.artista?.nombre || "Artista desconocido"}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-500 text-xs pl-4">Selecciona una canción</div>
                )}
            </div>

            {/* CONTROLES */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white transition"><Shuffle size={16}/></button>
                    <button className="text-gray-300 hover:text-white transition"><SkipBack size={20} fill="currentColor"/></button>
                    
                    <button 
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition text-black"
                        disabled={!currentSong}
                    >
                        {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
                    </button>

                    <button className="text-gray-300 hover:text-white transition"><SkipForward size={20} fill="currentColor"/></button>
                    <button className="text-gray-400 hover:text-white transition"><Repeat size={16}/></button>
                </div>
            </div>

            {/* VOLUMEN */}
            <div className="flex items-center justify-end gap-3 pr-4">
                <Volume2 size={20} className="text-gray-400"/>
                <div className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer relative group">
                    <div className="absolute top-0 left-0 h-full w-2/3 bg-gray-400 group-hover:bg-white rounded-full"></div>
                </div>
            </div>

            {/* AUDIO TAG CORREGIDO: src={... || undefined} para evitar el error de src="" */}
            <audio 
                ref={audioRef} 
                src={currentSong?.archivoAudio || undefined} 
                onEnded={() => setIsPlaying(false)}
            />
        </div>
      )}
    </PlayerContext.Provider>
  );
};