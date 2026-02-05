import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Clock, Trash2, Edit2, MoreHorizontal, Heart, PlusCircle, X } from "lucide-react";
import { getPlaylistById, deletePlaylist, removerCancionDePlaylist } from "../services/playlistService"; // Asegúrate de tener removerCancionDePlaylist en tu servicio
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../components/Player";
import { EditPlaylistModal } from "../components/EditPlaylistModal";
import { AddToPlaylistModal } from "../components/AddToPlaylistModal"; // Asegúrate de haber creado este componente
import { toast } from "sonner";

export const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data);
    } catch (error) {
      console.error("Error cargando playlist", error);
      toast.error("Error al cargar la playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres borrar esta playlist?")) return;
    try {
      await deletePlaylist(id);
      toast.success("Playlist eliminada");
      navigate("/library");
    } catch (error) {
      toast.error("Error al eliminar playlist");
    }
  };

  const handleRemoveSong = async (e, songId) => {
    e.stopPropagation();
    if (!window.confirm("¿Quitar canción de la lista?")) return;
    try {
      // Nota: Revisa que tu servicio tenga esta función exportada correctamente
      await removerCancionDePlaylist(id, songId); 
      toast.success("Canción eliminada");
      fetchPlaylist(); // Recargar la lista
    } catch (error) {
      toast.error("Error al quitar canción");
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!playlist) return <div className="p-8 text-white">Playlist no encontrada</div>;

  const isOwner = user && playlist.usuario && (user.username === playlist.usuario.username || user.email === playlist.usuario.email);

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-[#121212] min-h-screen text-white pb-24">
      {/* Cabecera */}
      <div className="flex items-end gap-6 p-8 bg-black/20 backdrop-blur-md">
        <img
          src={playlist.imagenUrl || "https://placehold.co/400?text=Playlist"}
          alt={playlist.nombre}
          className="w-52 h-52 shadow-2xl rounded-md object-cover"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase">Playlist {playlist.publica ? "Pública" : "Privada"}</span>
          <h1 className="text-6xl font-black tracking-tighter">{playlist.nombre}</h1>
          
          {/* Descripción (Ahora sí se debería ver) */}
          <p className="text-gray-300 text-sm max-w-2xl mt-2 mb-2 opacity-80">
            {playlist.descripcion || "Sin descripción"}
          </p>

          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
            <span className="font-bold hover:underline cursor-pointer">
                {playlist.usuario ? playlist.usuario.username : "Desconocido"}
            </span>
            {playlist.cancionesEntradas && (
                <span>• {playlist.cancionesEntradas.length} canciones</span>
            )}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg group">
            <Play fill="black" size={24} className="ml-1 text-black" />
          </button>
          
          <button className="text-gray-400 hover:text-white transition">
            <Heart size={32} />
          </button>
          
          <button className="text-gray-400 hover:text-white transition">
            <MoreHorizontal size={32} />
          </button>

          {isOwner && (
            <>
              {/* Botón Editar */}
              <button 
                onClick={() => setIsEditOpen(true)}
                className="text-gray-400 hover:text-white flex items-center gap-2 hover:scale-105 transition"
                title="Editar detalles"
              >
                <Edit2 size={24} />
              </button>

              {/* Botón AÑADIR CANCIONES (NUEVO) */}
              <button 
                onClick={() => setIsAddSongOpen(true)}
                className="text-gray-400 hover:text-white flex items-center gap-2 hover:scale-105 transition ml-4 border border-gray-600 px-4 py-2 rounded-full"
                title="Añadir canciones"
              >
                <PlusCircle size={20} />
                <span className="text-sm font-bold">Añadir Canciones</span>
              </button>

              {/* Botón Borrar Playlist */}
              <button 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition ml-auto"
                title="Eliminar Playlist"
              >
                <Trash2 size={24} />
              </button>
            </>
          )}
        </div>

        {/* Tabla de Canciones */}
        <div className="flex flex-col">
          {/* Cabecera de tabla */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10 text-gray-400 text-sm mb-2 sticky top-0 bg-[#121212] z-10">
            <span className="w-8 text-center">#</span>
            <span>TÍTULO</span>
            <span>ÁLBUM</span>
            <span className="flex justify-end"><Clock size={16} /></span>
            {isOwner && <span className="w-8"></span>}
          </div>

          {/* Lista */}
          {playlist.cancionesEntradas && playlist.cancionesEntradas.length > 0 ? (
            playlist.cancionesEntradas.map((entrada, index) => {
                // Dependiendo de tu DTO, a veces entrada es la canción directa o entrada.cancion
                const track = entrada.cancion || entrada; 
                
                return (
                    <div
                    key={entrada.id || track.id} // Usa el ID de la entrada si es posible para borrar
                    onClick={() => playSong(track)}
                    className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 hover:bg-white/10 rounded-md cursor-pointer group items-center transition"
                    >
                        {/* Índice */}
                        <span className="text-gray-400 group-hover:text-white w-8 text-center">
                            {index + 1}
                        </span>

                        {/* Foto + Título */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img 
                                src={track.imagenUrl || track.foto || "https://placehold.co/40"} 
                                alt={track.titulo} 
                                className="w-10 h-10 object-cover rounded shadow-sm"
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-white font-medium truncate">{track.titulo || track.nombre}</span>
                                <span className="text-gray-400 text-xs truncate group-hover:text-white">
                                    {track.artistaNombre || (track.artista ? track.artista.nombre : "Artista")}
                                </span>
                            </div>
                        </div>

                        {/* Álbum */}
                        <span className="text-gray-400 text-sm truncate hover:text-white hover:underline">
                            {track.albumNombre || "Sencillo"}
                        </span>

                        {/* Duración (Hardcodeado o real si tienes el campo) */}
                        <span className="text-gray-400 text-sm text-right">3:45</span>

                        {/* Botón Quitar (Solo dueño) */}
                        {isOwner && (
                            <button
                                onClick={(e) => handleRemoveSong(e, track.id)}
                                className="text-transparent group-hover:text-gray-400 hover:!text-red-500 transition w-8 flex justify-center"
                                title="Quitar de la playlist"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
                <p className="mb-4">Esta playlist está vacía.</p>
                {isOwner && (
                    <button 
                        onClick={() => setIsAddSongOpen(true)}
                        className="text-white font-bold underline hover:text-green-500"
                    >
                        ¡Añade canciones ahora!
                    </button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      <EditPlaylistModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        playlist={playlist}
        onUpdated={fetchPlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddSongOpen}
        onClose={() => setIsAddSongOpen(false)}
        playlistId={id}
        onSongAdded={fetchPlaylist}
      />
    </div>
  );
};