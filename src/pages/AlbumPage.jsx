import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Play, Heart, MoreHorizontal, Edit2 } from "lucide-react";
import { getAlbumById } from "../services/albumService";
import { useAuth } from "../context/AuthContext";
import { EditAlbumModal } from "../components/EditAlbumModal"; // <--- IMPORTAR MODAL
import { usePlayer } from "../components/Player";

export const AlbumPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false); // Estado

  const fetchAlbum = async () => {
    try {
      const data = await getAlbumById(id);
      setAlbum(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!album) return <div className="p-8 text-white">Álbum no encontrado</div>;

  const isOwner = user?.artistId && album.artista && String(user.artistId) === String(album.artista.id);

  return (
    <div className="bg-gradient-to-b from-purple-900 to-[#121212] min-h-screen text-white pb-24">
      <div className="flex items-end gap-6 p-8 bg-black/20 backdrop-blur-md">
        <img
          src={album.imagenUrl || "https://placehold.co/400"}
          alt={album.nombre}
          className="w-52 h-52 shadow-2xl rounded-md object-cover"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase">Álbum</span>
          <h1 className="text-6xl font-black tracking-tighter">{album.nombre}</h1>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <span className="font-bold hover:underline cursor-pointer">{album.artista?.nombre}</span>
            <span>• {album.anio}</span>
            <span>• {album.canciones?.length || 0} canciones</span>

            {isOwner && (
              <button
                onClick={() => setIsEditOpen(true)}
                className="ml-4 flex items-center gap-2 text-gray-300 border border-gray-500 hover:text-white hover:border-white px-3 py-1 rounded-full text-xs transition"
              >
                <Edit2 size={14} /> Editar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Canciones */}
      <div className="p-8">
        <div className="flex items-center gap-8 mb-8">
          <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg">
            <Play fill="black" size={24} className="ml-1 text-black" />
          </button>
          <button className="text-gray-400 hover:text-white"><Heart size={32} /></button>
          <button className="text-gray-400 hover:text-white"><MoreHorizontal size={32} /></button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-gray-400 text-sm mb-2">
            <span>#</span>
            <span>TÍTULO</span>
            <Clock size={16} />
          </div>
          {album.canciones && album.canciones.map((track, index) => (
            <div
              key={track.id}
              onClick={() => playSong(track)}
              className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 hover:bg-white/10 rounded-md cursor-pointer group items-center"
            >
              {/* Índice */}
              <span className="text-gray-400 group-hover:text-white w-5 text-center">{index + 1}</span>

              {/* NUEVO BLOQUE: FOTO + TÍTULO */}
              <div className="flex items-center gap-4">
                <img
                  src={track.imagenUrl || album.imagenUrl}
                  alt={track.nombre}
                  className="w-10 h-10 object-cover rounded shadow-sm"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-white font-medium line-clamp-1">
                    {track.nombre || track.titulo}
                  </span>
                  <span className="text-gray-400 text-xs group-hover:text-white transition-colors">
                    {track.artistaNombre || album.artista?.nombre}
                  </span>
                </div>
              </div>

              {/* Duración */}
              <span className="text-gray-400 text-sm">3:45</span>
            </div>
          ))}
        </div>
      </div>

      <EditAlbumModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        album={album}
        onUpdated={fetchAlbum}
      />
    </div>
  );
};