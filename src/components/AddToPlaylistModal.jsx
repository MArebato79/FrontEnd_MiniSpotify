import { useState, useEffect } from "react";
import { X, Search, Plus, Check } from "lucide-react";
import { getAllCanciones } from "../services/cancionService";
import { addSongToPlaylist } from "../services/playlistService";
import { toast } from "sonner";

export const AddToPlaylistModal = ({ isOpen, onClose, playlistId, onSongAdded }) => {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadSongs();
        }
    }, [isOpen]);

    const loadSongs = async () => {
        setLoading(true);
        const data = await getAllCanciones();
        setSongs(data);
        setLoading(false);
    };

    const handleAddSong = async (cancionId) => {
        setAddingId(cancionId);
        try {
            await addSongToPlaylist(playlistId, cancionId);
            toast.success("Canción añadida a la playlist");
            if (onSongAdded) onSongAdded(); // Recarga la playlist de fondo
        } catch (error) {
            toast.error("Error al añadir (¿Quizás ya está en la lista?)");
        } finally {
            setAddingId(null);
        }
    };

    // Filtrar canciones por el buscador
    const filteredSongs = songs.filter((song) =>
        song.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.artistaNombre || song.artista?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-[#282828] w-full max-w-2xl rounded-xl shadow-2xl border border-white/10 flex flex-col max-h-[80vh]">

                {/* Cabecera */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Añadir a la playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="p-4 bg-[#1e1e1e]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar canciones..."
                            className="w-full bg-[#333] text-white pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Lista de Canciones (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loading ? (
                        <div className="text-center p-8 text-gray-400">Cargando catálogo...</div>
                    ) : (
                        filteredSongs.map((song) => (
                            <div key={song.id} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-md group transition">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={song.imagenUrl || "https://placehold.co/50"}
                                        alt={song.titulo}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <div>
                                        <p className="text-white font-medium">{song.titulo}</p>
                                        <p className="text-gray-400 text-xs">{song.artistaNombre || song.artista?.nombre || "Desconocido"}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddSong(song.id)}
                                    disabled={addingId === song.id}
                                    className="px-4 py-1.5 rounded-full border border-gray-500 text-white text-sm font-bold hover:border-white hover:scale-105 transition flex items-center gap-2"
                                >
                                    {addingId === song.id ? (
                                        <span className="animate-spin">⌛</span>
                                    ) : (
                                        <>Añadir</>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                    {!loading && filteredSongs.length === 0 && (
                        <div className="text-center p-8 text-gray-500">No se encontraron canciones.</div>
                    )}
                </div>
            </div>
        </div>
    );
};