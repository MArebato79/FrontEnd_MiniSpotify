import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumById } from "../services/albumService";
import { Play, Clock, PlusCircle, Music } from "lucide-react";
import { CreateSongModal } from "../components/CreateSongModal"; 

export const AlbumPage = () => {
  const { id } = useParams(); 
  const [album, setAlbum] = useState(null);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  const fetchAlbum = () => {
    getAlbumById(id).then(data => setAlbum(data));
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  if (!album) return <div className="text-white p-10">Cargando...</div>;

  return (
    <div className="p-8 text-white">
      {/* CABECERA */}
      <div className="flex items-end gap-6 mb-8">
        <img 
            src={album.imagenUrl || "https://placehold.co/200"} 
            className="w-52 h-52 object-cover shadow-2xl shadow-black/50 rounded-md" 
            alt={album.nombre}
        />
        <div>
            <p className="text-xs font-bold uppercase">Álbum</p>
            <h1 className="text-6xl font-black mb-4 tracking-tighter">{album.nombre}</h1>
            <div className="flex items-center gap-2 text-sm font-bold">
                <img src="https://placehold.co/30" className="rounded-full w-6 h-6"/>
                <span>{album.artistaNombre || "Artista Desconocido"}</span>
                <span className="text-gray-400">• {album.anio} • {album.canciones?.length || 0} canciones</span>
            </div>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-4 mb-8">
        <button className="bg-spotify-green text-black p-4 rounded-full hover:scale-105 transition shadow-lg">
            <Play fill="black" size={24} />
        </button>
        
        {/* BOTÓN PARA AÑADIR CANCIONES (Solo debería verse si eres el dueño, por ahora lo dejamos visible) */}
        <button 
            onClick={() => setIsSongModalOpen(true)}
            className="text-gray-400 hover:text-white flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-full hover:border-white transition"
        >
            <PlusCircle size={20} /> Añadir Canción
        </button>
      </div>

      {/* LISTA DE CANCIONES */}
      <div className="flex flex-col">
        <div className="grid grid-cols-[16px_4fr_1fr] text-gray-400 border-b border-white/10 pb-2 mb-4 px-4 text-sm">
            <span>#</span>
            <span>TÍTULO</span>
            <span className="flex justify-end"><Clock size={16}/></span>
        </div>

        {album.canciones && album.canciones.map((track, index) => (
            <div key={track.id} className="grid grid-cols-[16px_4fr_1fr] items-center text-gray-400 hover:bg-white/10 p-2 rounded group transition px-4">
                <span className="group-hover:hidden">{index + 1}</span>
                <span className="hidden group-hover:block text-white"><Play size={12} fill="white"/></span>
                
                <div className="text-white font-medium">{track.titulo}</div>
                
                <div className="flex justify-end text-sm">
                    {/* Convertir segundos a min:seg */}
                    {Math.floor(track.duracion / 60)}:{(track.duracion % 60).toString().padStart(2, '0')}
                </div>
            </div>
        ))}
        {(!album.canciones || album.canciones.length === 0) && (
            <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                <Music size={40} className="mb-2 opacity-50"/>
                <p>Aún no hay canciones en este álbum.</p>
            </div>
        )}
      </div>

      {/* MODAL PARA SUBIR CANCIÓN */}
      <CreateSongModal 
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        albumId={id}
        onSongCreated={fetchAlbum} 
      />
    </div>
  );
};