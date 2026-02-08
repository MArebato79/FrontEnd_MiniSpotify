import { useEffect, useState } from "react";
import { getAllArtists } from "../services/artistaService";
import { getAllAlbums } from "../services/albumService";
import { getAllPlaylists } from "../services/playlistService";
import { useNavigate } from "react-router-dom";
import { Play, Mic2, Disc, Music, ListMusic, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // Importamos api para llamar a canciones recientes

export const HomePage = () => {
  const [artistas, setArtistas] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [canciones, setCanciones] = useState([]); // Estado para canciones recientes
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar datos en paralelo
        const [artistsData, albumsData, playlistsData, songsResponse] = await Promise.all([
          getAllArtists(),
          getAllAlbums(),
          getAllPlaylists(),
          api.get("/canciones") // Asumiendo que tienes un endpoint GET /canciones que devuelve las últimas
        ]);

        setArtistas(artistsData || []);
        setAlbums(albumsData || []);
        setPlaylists(playlistsData || []);
        setCanciones(songsResponse.data || []);
      } catch (error) {
        console.error("Error cargando home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper para formatear duración (segundos -> mm:ss)
  const formatDuration = (seconds) => {
      if (!seconds) return "--:--";
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
      
      {/* CABECERA / SALUDO */}
      <div className="px-8 pt-6 pb-2">
        <h1 className="text-3xl font-bold text-white mb-6">{getGreeting()}, {user?.username}</h1>
        
        {/* Accesos rápidos (Top 6 items mezclados) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Mezclamos un poco de todo para la vista rápida */}
            {[...albums.slice(0, 3), ...playlists.slice(0, 3)].map((item) => (
                <div 
                    key={item.id + item.nombre} 
                    onClick={() => navigate(item.canciones ? `/album/${item.id}` : `/playlist/${item.id}`)}
                    className="flex items-center bg-white/10 hover:bg-white/20 transition rounded overflow-hidden cursor-pointer group"
                >
                    <img src={item.imagenUrl || "https://placehold.co/60"} className="w-20 h-20 object-cover shadow-lg"/>
                    <span className="font-bold text-white px-4 truncate">{item.nombre}</span>
                    <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition shadow-xl rounded-full bg-spotify-green p-3">
                        <Play size={20} fill="black" className="text-black ml-1"/>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="px-8 pb-32 space-y-12 overflow-y-auto custom-scrollbar">
        
        {/* SECCIÓN 1: CANCIONES RECIENTES */}
        <section>
          <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Novedades para ti</h2>
              <span className="text-sm font-bold text-gray-400 hover:text-white cursor-pointer uppercase tracking-wider">Ver todo</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {canciones.slice(0, 8).map((song) => (
              <div
                key={song.id}
                onClick={() => navigate(`/song/${song.id}`)} // O playSong(song)
                className="flex items-center gap-3 bg-[#181818] hover:bg-[#282828] p-2 pr-4 rounded-md group cursor-pointer transition duration-300"
              >
                {/* IMAGEN CON FALLBACK */}
                <div className="relative w-14 h-14 flex-shrink-0">
                    <img 
                        src={song.imagenUrl || song.album?.imagenUrl || "https://placehold.co/60"} 
                        alt={song.titulo}
                        className="w-full h-full object-cover rounded shadow-md"
                        onError={(e) => { e.target.src = "https://placehold.co/60?text=Music"; }}
                    />
                    {/* Overlay Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <Play size={20} fill="white" className="text-white"/>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-white font-bold truncate text-sm mb-1 leading-tight">
                    {song.titulo}
                  </h4>
                  <p className="text-xs text-gray-400 hover:text-white hover:underline truncate">
                    {song.artistaNombre || "Artista Desconocido"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-spotify-green opacity-0 group-hover:opacity-100 transition"><Heart size={16}/></button>
                    <span className="text-xs text-gray-500 font-mono">{formatDuration(song.duracion)}</span>
                </div>
              </div>
            ))}
             {canciones.length === 0 && <p className="text-gray-500 col-span-full">No hay canciones disponibles.</p>}
          </div>
        </section>

        {/* SECCIÓN 2: ÁLBUMES DESTACADOS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <Disc className="text-blue-400" /> Álbumes Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {albums.slice(0, 5).map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col"
              >
                <div className="relative mb-4">
                    <img
                    src={album.imagenUrl || "https://placehold.co/200"}
                    alt={album.nombre}
                    className="w-full aspect-square object-cover rounded-md shadow-lg mb-2"
                    />
                    <button className="absolute bottom-2 right-2 bg-spotify-green rounded-full p-3 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform hover:scale-105">
                        <Play fill="black" className="text-black ml-1" size={20}/>
                    </button>
                </div>
                <h3 className="text-white font-bold truncate text-base mb-1">{album.nombre}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                    {album.artista?.nombre} • {album.anio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 3: ARTISTAS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Mic2 className="text-pink-500" /> Artistas que te pueden gustar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artistas.slice(0, 6).map((artista) => (
              <div
                key={artista.id}
                onClick={() => navigate(`/artist/${artista.id}`)}
                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col items-center text-center"
              >
                <img
                  src={artista.imagenUrl || "https://placehold.co/150"}
                  alt={artista.nombre}
                  className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 group-hover:shadow-2xl transition"
                />
                <h3 className="text-white font-bold truncate w-full">{artista.nombre}</h3>
                <p className="text-sm text-gray-400 mt-1">Artista</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 4: PLAYLISTS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ListMusic className="text-orange-500" /> Playlists Públicas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {playlists.slice(0, 5).map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
              >
                <div className="relative">
                    <img
                    src={pl.imagenUrl || "https://placehold.co/200"}
                    alt={pl.nombre}
                    className="w-full aspect-square object-cover rounded-md shadow-lg mb-4"
                    />
                 </div>
                <h3 className="text-white font-bold truncate">{pl.nombre}</h3>
                <p className="text-sm text-gray-400 mt-1">
                   De {pl.creador}
                </p>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
};