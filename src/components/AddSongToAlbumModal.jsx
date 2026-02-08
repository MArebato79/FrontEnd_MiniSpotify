import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Music, Plus, Search, Disc, Upload, Loader2, Image as ImageIcon, ListMusic, Users } from "lucide-react";
import { toast } from "sonner";
import { getCancionesByArtista, createCancion } from "../services/cancionService";
import { addSongToAlbum } from "../services/albumService";
import { getAllArtists } from "../services/artistaService"; // <--- Asegúrate de tener esto
import { uploadToCloudinary } from "../services/cloudinaryService";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export const AddSongToAlbumModal = ({ isOpen, onClose, album, onSongAdded }) => {
    const [activeTab, setActiveTab] = useState("select");
    const [artistSongs, setArtistSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useAuth();
    
    // Estados para creación
    const [generos, setGeneros] = useState([]);
    const [allArtistas, setAllArtistas] = useState([]); 
    const [selectedColabs, setSelectedColabs] = useState([]); // [{id, nombre, ...}]
    const [selectedArtistId, setSelectedArtistId] = useState("");
    
    const { register, handleSubmit, reset } = useForm();
    const [newSongImageUrl, setNewSongImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // 1. Canciones del usuario
            if (user?.artistId) loadArtistSongs();

            // 2. Géneros
            api.get("/canciones/generos")
                .then(res => setGeneros(res.data))
                .catch(() => setGeneros(["POP", "ROCK", "URBANO"]));

            // 3. Artistas (para colaboradores)
            getAllArtists()
                .then(data => {
                    // Filtrar para no mostrarse a uno mismo
                    const otros = data.filter(a => String(a.id) !== String(user?.artistId));
                    setAllArtistas(otros);
                })
                .catch(err => console.error(err));

            // Resetear
            setNewSongImageUrl("");
            setSelectedColabs([]);
            reset();
        }
    }, [isOpen, user, reset]);

    const loadArtistSongs = async () => {
        try {
            const songs = await getCancionesByArtista(user.artistId);
            const availableSongs = songs.filter(s => s.albumId !== album.id);
            setArtistSongs(availableSongs);
        } catch (error) { console.error(error); }
    };

    const handleAddExisting = async (cancionId) => {
        try {
            await addSongToAlbum(album.id, cancionId);
            toast.success("Canción vinculada");
            setArtistSongs(prev => prev.filter(s => s.id !== cancionId));
            if (onSongAdded) onSongAdded(); 
        } catch (error) { toast.error("Error al vincular"); }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewSongImageUrl(url);
        } catch (error) { toast.error("Error imagen"); } finally { setUploadingImage(false); }
    };

    // --- GESTIÓN DE COLABORADORES ---
    const addColaborador = () => {
        if (!selectedArtistId) return;
        const artista = allArtistas.find(a => String(a.id) === String(selectedArtistId));
        if (artista && !selectedColabs.some(c => c.id === artista.id)) {
            setSelectedColabs([...selectedColabs, artista]);
        }
        setSelectedArtistId("");
    };

    const removeColaborador = (id) => {
        setSelectedColabs(prev => prev.filter(c => c.id !== id));
    };

    // --- EL ENVÍO DEL FORMULARIO CORREGIDO ---
    const onSubmitCreate = async (data) => {
        try {
            // AQUÍ ESTÁ LA CORRECCIÓN CLAVE
            // Transformamos la lista simple de artistas en la estructura compleja que pide Java
            const colaboradoresParaBackend = selectedColabs.map(artista => ({
                artistaColaborador: { id: artista.id }, // Java necesita esta anidación
                rol: "Feat" // Java necesita un rol (si es obligatorio en BD)
            }));

            const newSongData = {
                titulo: data.titulo,
                imagenUrl: newSongImageUrl || album.imagenUrl, 
                albumId: album.id,
                genero: data.genero,
                publica: true,
                
                // Estos campos dummy los mantenemos por seguridad
                duracion: 0,
                archivoUrl: "",
                
                // CAMPO CORREGIDO: Enviamos lista de objetos, no de IDs
                colaboradores: colaboradoresParaBackend 
            };

            await createCancion(newSongData);
            
            toast.success("Canción creada correctamente");
            if (onSongAdded) onSongAdded();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al crear. Revisa los datos.");
        }
    };

    const filteredSongs = artistSongs.filter(song => 
        song.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#181818] w-full max-w-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#202020]">
                    <h2 className="text-xl font-bold text-white flex gap-2 items-center">
                        <Disc className="text-spotify-green"/> Gestionar Canciones
                    </h2>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white transition"/></button>
                </div>

                <div className="px-5 pt-5 pb-2">
                    <div className="flex bg-[#121212] p-1 rounded-lg">
                        <button onClick={() => setActiveTab("select")} className={`flex-1 py-2.5 text-sm font-bold rounded-md transition ${activeTab === "select" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"}`}>Biblioteca</button>
                        <button onClick={() => setActiveTab("create")} className={`flex-1 py-2.5 text-sm font-bold rounded-md transition ${activeTab === "create" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"}`}>Crear Nueva</button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* TAB 1: SELECCIONAR EXISTENTE */}
                    {activeTab === "select" && (
                        <div className="space-y-4">
                             <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input type="text" placeholder="Buscar canciones..." className="w-full bg-[#333] text-white pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-spotify-green" onChange={(e) => setSearchTerm(e.target.value)}/>
                            </div>
                            <div className="space-y-2 mt-2">
                                {filteredSongs.length === 0 ? <p className="text-gray-500 text-center py-4">No hay canciones disponibles.</p> : 
                                    filteredSongs.map(song => (
                                        <div key={song.id} className="flex justify-between items-center bg-[#282828] p-3 rounded-lg hover:bg-[#333]">
                                            <div className="flex items-center gap-3">
                                                 <img src={song.imagenUrl || album.imagenUrl} className="w-10 h-10 rounded object-cover" />
                                                <span className="text-white font-medium">{song.titulo}</span>
                                            </div>
                                            <button onClick={() => handleAddExisting(song.id)} className="text-white text-xs border border-gray-500 px-3 py-1 rounded-full hover:border-spotify-green hover:text-spotify-green"><Plus size={14} /> Añadir</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CREAR NUEVA */}
                    {activeTab === "create" && (
                        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 pl-1">Título</label>
                                <input {...register("titulo", { required: true })} className="w-full p-3.5 rounded-lg bg-[#282828] text-white border border-white/10 focus:ring-2 focus:ring-spotify-green" placeholder="Nombre de la canción" />
                            </div>

                            {/* GÉNERO */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 pl-1 flex items-center gap-2"><ListMusic size={14}/> Género</label>
                                <select {...register("genero")} className="w-full p-3.5 rounded-lg bg-[#282828] text-white border border-white/10 appearance-none cursor-pointer">
                                    {generos.map(g => <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>)}
                                </select>
                            </div>

                            {/* COLABORADORES */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 pl-1 flex items-center gap-2">
                                    <Users size={14}/> Colaboradores (Feat.)
                                </label>
                                
                                <div className="flex gap-2 mb-3">
                                    <select 
                                        value={selectedArtistId}
                                        onChange={(e) => setSelectedArtistId(e.target.value)}
                                        className="flex-1 p-3 rounded-lg bg-[#282828] text-white border border-white/10 appearance-none focus:ring-2 focus:ring-spotify-green"
                                    >
                                        <option value="">Selecciona un artista...</option>
                                        {allArtistas.map(art => (
                                            <option key={art.id} value={art.id}>{art.nombre}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="button" 
                                        onClick={addColaborador}
                                        className="bg-[#333] hover:bg-[#444] text-white p-3 rounded-lg border border-white/10 transition"
                                    >
                                        <Plus size={20}/>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 min-h-[30px]">
                                    {selectedColabs.map(colab => (
                                        <span key={colab.id} className="flex items-center gap-1 bg-spotify-green/20 text-spotify-green border border-spotify-green/30 px-3 py-1 rounded-full text-xs font-bold">
                                            {colab.nombre}
                                            <button type="button" onClick={() => removeColaborador(colab.id)} className="hover:text-white ml-1">
                                                <X size={12}/>
                                            </button>
                                        </span>
                                    ))}
                                    {selectedColabs.length === 0 && <p className="text-xs text-gray-500 italic pt-1">Ningún colaborador añadido</p>}
                                </div>
                            </div>

                            {/* IMAGEN */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 pl-1 flex items-center gap-2"><ImageIcon size={14}/> Portada</label>
                                <div className="flex items-center gap-4 bg-[#282828] p-3 rounded-lg border border-white/10">
                                    <div className="w-16 h-16 bg-[#181818] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/5">
                                        {newSongImageUrl ? <img src={newSongImageUrl} className="w-full h-full object-cover" /> : <Music size={24} className="text-gray-600" />}
                                        {uploadingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-spotify-green"/></div>}
                                    </div>
                                    <label className="flex-1 cursor-pointer">
                                        <span className="text-sm font-bold text-white hover:text-spotify-green transition block mb-1">Subir imagen</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={uploadingImage} className="w-full bg-spotify-green text-black font-bold py-3.5 rounded-full mt-4 hover:scale-105 transition disabled:opacity-50">Crear Canción</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};