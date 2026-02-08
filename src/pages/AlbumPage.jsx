import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Play, Heart, MoreHorizontal, Edit2, PlusCircle, User } from "lucide-react";
import { getAlbumById } from "../services/albumService";
import { useAuth } from "../context/AuthContext";
import { EditAlbumModal } from "../components/EditAlbumModal";
import { AddSongToAlbumModal } from "../components/AddSongToAlbumModal"; 
import { usePlayer } from "../components/Player";

export const AlbumPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para los modales
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);

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

  if (loading) return <div className="p-8 text-white flex justify-center items-center h-screen"><div className="animate-pulse">Cargando álbum...</div></div>;
  if (!album) return <div className="p-8 text-white">Álbum no encontrado</div>;

  const isOwner = user?.artistId && album.artista && String(user.artistId) === String(album.artista.id);

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Helper para mostrar Artista Principal + Colaboradores
  const formatArtists = (track) => {
    let names = track.artistaNombre || album.artista?.nombre;
    if (track.colaboradores && track.colaboradores.length > 0) {
        const featNames = track.colaboradores.map(c => c.nombre).join(", ");
        names += `, ${featNames}`;
    }
    return names;
  };

  return (
    <div className="bg-gradient-to-b from-purple-900 to-[#121212] min-h-screen text-white pb-32">
      
      {/* CABECERA DEL ÁLBUM */}
      <div className="flex flex-col md:flex-row items-end gap-6 p-8 bg-gradient-to-b from-transparent to-black/20">
        <img
          src={album.imagenUrl || "https://placehold.co/400"}
          alt={album.nombre}
          className="w-52 h-52 shadow-2xl rounded-md object-cover mx-auto md:mx-0"
        />
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm font-bold uppercase hidden md:block">Álbum</span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-2 leading-none">{album.nombre}</h1>
          
          <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-gray-300 mt-2">
             {album.artista?.foto ? (
                <img src={album.artista.foto} className="w-6 h-6 rounded-full object-cover"/>
             ) : (
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center"><User size={14}/></div>
             )}
            <span className="text-white font-bold hover:underline cursor-pointer">{album.artista?.nombre}</span>
            <span>• {album.anio}</span>
            <span>• {album.canciones?.length || 0} canciones</span>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES */}
      <div className="px-8 py-6 flex items-center gap-6">
         {album.canciones?.length > 0 && (
             <button 
                onClick={() => playSong(album.canciones[0])}
                className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg hover:bg-green-400 text-black"
             >
                <Play fill="black" size={24} className="ml-1" />
             </button>
         )}

         <button className="text-gray-400 hover:text-white transition hover:scale-110"><Heart size={32} /></button>
         <button className="text-gray-400 hover:text-white transition hover:scale-110"><MoreHorizontal size={32} /></button>

         {isOwner && (
             <div className="ml-auto flex gap-3">
                 <button onClick={() => setIsAddSongOpen(true)} className="flex items-center gap-2 border border-gray-500 text-gray-300 px-4 py-2 rounded-full text-sm font-bold hover:border-white hover:text-white transition hover:bg-white/10">
                    <PlusCircle size={18} /> <span className="hidden sm:inline">Añadir Canciones</span>
                 </button>
                 <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 border border-gray-500 text-gray-300 px-4 py-2 rounded-full text-sm font-bold hover:border-white hover:text-white transition hover:bg-white/10">
                    <Edit2 size={16} /> <span className="hidden sm:inline">Editar</span>
                 </button>
             </div>
         )}
      </div>

      {/* LISTA DE CANCIONES - ESTRUCTURA CORREGIDA */}
      <div className="px-4 md:px-8">
        {/* Cabecera de la tabla: AHORA CON 4 COLUMNAS (Índice, Título, Género, Reloj) */}
        {/* Nota: La foto va DENTRO de la columna título visualmente, o podemos separarla */}
        <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_minmax(60px,auto)] gap-4 px-4 py-2 border-b border-white/10 text-gray-400 text-sm mb-2 sticky top-0 bg-[#121212] z-10">
          <span className="text-center">#</span>
          <span>TÍTULO</span>
          <span className="hidden md:block">GÉNERO</span>
          <div className="flex justify-end pr-4"><Clock size={16} /></div>
        </div>

        <div className="flex flex-col">
          {album.canciones && album.canciones.length > 0 ? (
             album.canciones.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playSong(track)}
                  className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_minmax(60px,auto)] gap-4 px-4 py-3 hover:bg-white/10 rounded-md cursor-pointer group items-center transition-colors"
                >
                  {/* 1. ÍNDICE / PLAY */}
                  <div className="text-center text-gray-400 group-hover:text-white font-medium relative flex justify-center items-center h-full">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play size={14} className="hidden group-hover:block text-white" fill="white"/>
                  </div>

                  {/* 2. FOTO + TÍTULO + ARTISTAS (Todo junto en la segunda columna) */}
                  <div className="flex items-center gap-4 overflow-hidden">
                    {/* Foto cuadrada pequeña */}
                    <img
                      src={track.imagenUrl || album.imagenUrl}
                      alt={track.titulo}
                      className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    
                    {/* Textos */}
                    <div className="flex flex-col justify-center min-w-0">
                      {/* Título de la canción */}
                      <span className="text-white font-medium truncate text-base leading-tight">
                        {track.titulo}
                      </span>
                      {/* Artistas (Principal + Colaboradores) */}
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors truncate">
                        {formatArtists(track)}
                      </span>
                    </div>
                  </div>

                  {/* 3. GÉNERO (Solo PC) */}
                  <div className="hidden md:flex items-center text-gray-400 text-sm">
                      <span className="hover:text-white transition cursor-default">
                          {track.genero ? track.genero.replace(/_/g, ' ') : 'POP'}
                      </span>
                  </div>

                  {/* 4. DURACIÓN */}
                  <div className="text-gray-400 text-sm pr-4 font-variant-numeric tabular-nums text-right">
                     {formatDuration(track.duracion)}
                  </div>
                </div>
             ))
          ) : (
             <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Play size={30} className="ml-1 opacity-50"/>
                </div>
                <p className="text-lg font-bold text-white mb-2">Empieza a añadir canciones</p>
                <p className="max-w-md mx-auto mb-6">Este álbum está vacío. Sube tu música para que el mundo la escuche.</p>
                {isOwner && (
                    <button onClick={() => setIsAddSongOpen(true)} className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition">
                        Añadir primera canción
                    </button>
                )}
             </div>
          )}
        </div>
      </div>

      <EditAlbumModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} album={album} onUpdated={fetchAlbum} />
      <AddSongToAlbumModal isOpen={isAddSongOpen} onClose={() => setIsAddSongOpen(false)} album={album} onSongAdded={fetchAlbum} />
    </div>
  );
};