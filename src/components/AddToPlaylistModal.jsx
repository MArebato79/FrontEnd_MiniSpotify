import { useState, useEffect } from "react";
import { X, Search, Loader2, Music } from "lucide-react";
import { getAllCanciones } from "../services/cancionService"; // Asegúrate de tener esto en tu servicio
import { addSongToPlaylist } from "../services/playlistService";
import { toast } from "sonner";

export const AddToPlaylistModal = ({ isOpen, onClose, playlistId, onSongAdded }) => {
    const [songs, setSongs] = useState([]); // Guarda TODAS las canciones (Catálogo completo)
    const [searchTerm, setSearchTerm] = useState(""); // El texto que escribes
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null); // ID de la canción que se está añadiendo (para el spinner)

    // Cargar canciones al abrir el modal
    useEffect(() => {
        if (isOpen) {
            loadSongs();
            setSearchTerm(""); // Resetear buscador al abrir
        }
    }, [isOpen]);

    const loadSongs = async () => {
        setLoading(true);
        try {
            const data = await getAllCanciones();
            setSongs(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar el catálogo");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSong = async (cancionId) => {
        setAddingId(cancionId);
        try {
            await addSongToPlaylist(playlistId, cancionId);
            toast.success("Canción añadida");
            if (onSongAdded) onSongAdded(); // Refresca la playlist que está debajo
        } catch (error) {
            console.error(error);
            toast.error("Error al añadir (¿Ya está en la lista?)");
        } finally {
            setAddingId(null);
        }
    };

    const filteredSongs = songs.filter((song) => {
        const term = searchTerm.toLowerCase();
        const titulo = song.titulo?.toLowerCase() || "";
        const artista = (song.artistaNombre || song.artista?.nombre || "").toLowerCase();

        return titulo.includes(term) || artista.includes(term);
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-[#282828] w-full max-w-xl rounded-xl shadow-2xl border border-white/10 flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">

                {/* Cabecera */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#202020] rounded-t-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Music size={20} className="text-green-500" />
                        Añadir a la playlist
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-white/5 p-1 rounded-full hover:bg-white/20">
                        <X size={20} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="p-4 bg-[#181818]">
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-white transition" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por título o artista..."
                            className="w-full bg-[#333] text-white pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-white/20 focus:bg-[#404040] focus:outline-none transition placeholder:text-gray-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#121212]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
                            <Loader2 className="animate-spin" size={30} />
                            <span className="text-sm">Cargando catálogo...</span>
                        </div>
                    ) : filteredSongs.length > 0 ? (
                        filteredSongs.map((song) => (
                            <div key={song.id} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg group transition border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img
                                        src={song.imagenUrl || song.foto || "https://placehold.co/50"}
                                        alt={song.titulo}
                                        className="w-11 h-11 rounded object-cover shadow-sm bg-[#333]"
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-white font-medium truncate pr-2">{song.titulo}</p>
                                        <p className="text-gray-400 text-xs truncate">
                                            {song.artistaNombre || song.artista?.nombre || "Desconocido"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddSong(song.id)}
                                    disabled={addingId === song.id}
                                    className="px-4 py-1.5 rounded-full border border-gray-600 text-white text-xs font-bold hover:border-white hover:bg-white hover:text-black transition flex items-center gap-2 min-w-[80px] justify-center"
                                >
                                    {addingId === song.id ? (
                                        <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                        "Añadir"
                                    )}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>No se encontraron canciones.</p>
                            <p className="text-xs mt-1 opacity-60">Prueba con otro término de búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};