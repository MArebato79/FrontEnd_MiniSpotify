// src/components/AddToPlaylistModal.jsx
import { useState, useEffect } from "react";
import { X, Search, Loader2, Music, Plus } from "lucide-react";
import { getAllCanciones } from "../services/cancionService"; 
import { addSongToPlaylist } from "../services/playlistService";
import { toast } from "sonner";

export const AddToPlaylistModal = ({ isOpen, onClose, playlistId, onSongAdded }) => {
    const [allSongs, setAllSongs] = useState([]); // Catálogo completo
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadCatalog();
        }
    }, [isOpen]);

    const loadCatalog = async () => {
        setLoading(true);
        try {
            const data = await getAllCanciones();
            // Asegúrate de que 'data' sea el array de canciones
            setAllSongs(data || []);
        } catch (error) {
            toast.error("No se pudo cargar el catálogo de canciones");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (cancionId) => {
        setAddingId(cancionId);
        try {
            await addSongToPlaylist(playlistId, cancionId);
            toast.success("Canción añadida a la playlist");
            if (onSongAdded) onSongAdded(); // Refresca la vista de la playlist
        } catch (error) {
            toast.error("Error al añadir la canción");
        } finally {
            setAddingId(null);
        }
    };

    // Filtrado en tiempo real sobre el catálogo completo cargado
    const filteredSongs = allSongs.filter(song => 
        song.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artista?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
            <div className="bg-[#282828] w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Music className="text-spotify-green" /> Añadir canciones
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                </div>

                {/* Buscador */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar en todo el catálogo..." 
                            className="w-full bg-[#333] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-spotify-green" /></div>
                    ) : (
                        filteredSongs.map(song => (
                            <div key={song.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <img src={song.imagenUrl || "https://placehold.co/50"} className="w-10 h-10 object-cover rounded" />
                                    <div>
                                        <p className="text-white font-medium text-sm">{song.titulo}</p>
                                        <p className="text-gray-400 text-xs">{song.artista?.nombre}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAdd(song.id)}
                                    disabled={addingId === song.id}
                                    className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:scale-105 transition disabled:opacity-50"
                                >
                                    {addingId === song.id ? "Añadiendo..." : "Añadir"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};