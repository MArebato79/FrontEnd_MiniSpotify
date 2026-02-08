import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById, deletePlaylist, addSongToPlaylist } from "../services/playlistService"; // Asegúrate de tener removeSongFromPlaylist si lo usas
import { useAuth } from "../context/AuthContext";
import { Play, Clock, Trash2, Search, Plus, User } from "lucide-react"; // Añadido icono User
import { EditPlaylistModal } from "../components/EditPlaylistModal";
import {LinkSongModal} from "../components/LinkSongModal"; 
import { usePlayer } from "../components/Player"; 

export const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  useEffect(() => {
    cargarPlaylist();
  }, [id]);

  const cargarPlaylist = () => {
    getPlaylistById(id)
      .then(data => setPlaylist(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que quieres borrar esta playlist?")) {
      await deletePlaylist(id);
      navigate("/library");
    }
  };

  // Función para formatear duración
  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) return <div className="text-white p-8">Cargando...</div>;
  if (!playlist) return <div className="text-white p-8">Playlist no encontrada</div>;

  // Calculamos si soy el dueño para mostrar botones de editar/borrar
  const soyDueño = user?.username === playlist.creador; 

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white pb-32">
      
      {/* CABECERA */}
      <div className="flex items-end gap-6 p-8 bg-gradient-to-b from-gray-800/50 to-transparent">
        <img 
          src={playlist.imagenUrl || "https://placehold.co/250"} 
          className="w-52 h-52 shadow-2xl object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <span className="uppercase text-xs font-bold tracking-wider">Playlist {playlist.publica ? "Pública" : "Privada"}</span>
          <h1 className="text-6xl font-black mb-2">{playlist.nombre}</h1>
          
          {/* --- AQUÍ MOSTRAMOS EL CREADOR --- */}
          <div className="flex items-center gap-2 text-gray-300 font-medium">
             <User size={18} />
             <span>Creada por <span className="text-white hover:underline cursor-pointer">{playlist.creador}</span></span>
             <span>• {playlist.cancionesEntradas ? playlist.cancionesEntradas.length : 0} canciones</span>
          </div>
          {/* --------------------------------- */}
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex items-center gap-4 px-8 py-4">
        <button className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition shadow-lg">
          <Play fill="black" size={24}/>
        </button>

        {soyDueño && (
            <>
                <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 border border-gray-500 rounded hover:border-white hover:text-white transition font-bold text-sm text-gray-300 uppercase">
                    Editar
                </button>
                <button onClick={() => setIsLinkModalOpen(true)} className="px-4 py-2 border border-gray-500 rounded hover:border-white hover:text-white transition font-bold text-sm text-gray-300 uppercase flex items-center gap-2">
                    <Plus size={16}/> Añadir Canciones
                </button>
                <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition ml-auto">
                    <Trash2 size={24}/>
                </button>
            </>
        )}
      </div>

      {/* LISTA DE CANCIONES */}
      <div className="px-8 mt-4">
        {/* Encabezados de tabla */}
        <div className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 text-gray-400 border-b border-white/10 pb-2 mb-4 px-4 uppercase text-xs font-medium">
            <span>#</span>
            <span>Título</span>
            <span>Álbum</span>
            <span className="flex justify-end"><Clock size={16}/></span>
        </div>

        {/* Filas */}
        {playlist.cancionesEntradas && playlist.cancionesEntradas.map((entrada, index) => (
            <div 
                key={entrada.id} 
                className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 p-3 hover:bg-white/10 rounded group transition items-center cursor-pointer"
                onClick={() => playSong(entrada.cancion)}
            >
                <span className="text-gray-400 font-mono text-sm">{index + 1}</span>
                
                <div className="flex items-center gap-3">
                    <img src={entrada.cancion.imagenUrl || "https://placehold.co/40"} className="w-10 h-10 rounded object-cover"/>
                    <div>
                        <div className="text-white font-medium hover:underline">{entrada.cancion.titulo}</div>
                        <div className="text-xs text-gray-400">{entrada.cancion.artistaNombre}</div>
                    </div>
                </div>

                <div className="text-gray-400 text-sm hover:text-white">
                    {/* Como en el DTO de entrada no tenemos el nombre del album directo, lo dejamos vacío o habría que añadirlo al DTO */}
                     -- 
                </div>

                <div className="text-gray-400 font-mono text-sm flex justify-end">
                    {formatDuration(entrada.cancion.duracion)}
                </div>
            </div>
        ))}
        
        {(!playlist.cancionesEntradas || playlist.cancionesEntradas.length === 0) && (
            <div className="text-center py-10 text-gray-500">
                Esta playlist está vacía. ¡Añade algunas canciones!
            </div>
        )}
      </div>

      {/* MODALES */}
      <EditPlaylistModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        playlist={playlist}
        onUpdate={cargarPlaylist} // Recargar al editar
      />

      <LinkSongModal
         isOpen={isLinkModalOpen}
         onClose={() => setIsLinkModalOpen(false)}
         playlistId={id}
         onSongAdded={cargarPlaylist} // Recargar al añadir
      />

    </div>
  );
};