import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Mic2,
  Disc,
  ListMusic,
  Heart
} from "lucide-react";
import { getAllArtists } from "../services/artistaService";
import { getAllAlbums } from "../services/albumService";
import { getAllPlaylists } from "../services/playlistService";
import { getFollowedArtists } from "../services/usuarioService";
import { getAllCanciones } from "../services/cancionService"; // Usamos el servicio mejorado
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const [artistas, setArtistas] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, albumsData, playlistsData, songsData, followedData] = await Promise.all([
          getAllArtists(),
          getAllAlbums(),
          getAllPlaylists(),
          getAllCanciones(), // Usamos el servicio que devuelve array
          getFollowedArtists()
        ]);

        setArtistas(artistsData || []);
        setAlbums(albumsData || []);
        setPlaylists(playlistsData || []);
        setCanciones(songsData || []); // songsData ya es el array
        setFollowedArtists(followedData || []);
      } catch (error) {
        console.error("Error cargando home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función auxiliar para manejar la navegación al artista sin reproducir música
  const goToArtist = (e, artistId) => {
    e.stopPropagation(); // Detiene el click para que no suene la canción
    if (artistId) {
      navigate(`/artist/${artistId}`);
    }
  };

  // Mantenemos esta función por si la necesitas para 'titles' o textos no clicables
  const formatArtistsText = (song) => {
    if (!song) return "";
    let artistName = song.artista?.nombre || song.artistaNombre || "Artista Desconocido";
    const feats = song.colaboraciones || song.colaboradores || [];
    if (feats.length > 0) {
      const featNames = feats.map(f => f.nombre).join(", ");
      return `${artistName} ft. ${featNames}`;
    }
    return artistName;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1e1e1e] to-[#121212]">

      {/* CABECERA CON BOTÓN DE PERFIL */}
      <div className="px-8 pt-6 pb-2 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {getGreeting()}, {user?.username}
        </h1>

        <button
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 transition p-1 pr-4 rounded-full border border-white/10 group"
        >
          <img
            src={user?.foto || user?.imagenUrl || "https://placehold.co/150?text=User"}
            className="w-8 h-8 rounded-full object-cover border border-white/20"
            alt="Avatar"
          />
          <span className="text-white text-sm font-bold group-hover:scale-105 transition">Mi Perfil</span>
        </button>
      </div>

      <div className="px-8 pb-32 space-y-12 overflow-y-auto custom-scrollbar mt-4">

        {/* SECCIÓN: ARTISTAS QUE SIGUES */}
        {followedArtists.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Mic2 className="text-spotify-green" /> Artistas que sigues
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {followedArtists.map((artista) => (
                <div
                  key={artista.id}
                  onClick={() => navigate(`/artist/${artista.id}`)}
                  className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col items-center text-center shadow-md"
                >
                  <img
                    src={artista.imagenUrl || "https://placehold.co/150"}
                    alt={artista.nombre}
                    className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 group-hover:shadow-2xl transition border-2 border-transparent group-hover:border-spotify-green"
                  />
                  <h3 className="text-white font-bold truncate w-full">{artista.nombre}</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Siguiendo</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECCIÓN: ACCESOS RÁPIDOS */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...albums.slice(0, 3), ...playlists.slice(0, 3)].map((item) => (
              <div
                key={item.id + item.nombre}
                onClick={() => navigate(item.canciones ? `/album/${item.id}` : `/playlist/${item.id}`)}
                className="flex items-center bg-white/5 hover:bg-white/10 transition rounded overflow-hidden cursor-pointer group"
              >
                <img src={item.imagenUrl || "https://placehold.co/60"} className="w-20 h-20 object-cover shadow-lg" />
                <span className="font-bold text-white px-4 truncate">{item.nombre}</span>
                <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition shadow-xl rounded-full bg-spotify-green p-3">
                  <Play size={20} fill="black" className="text-black ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN: CANCIONES RECIENTES (AQUÍ ESTÁ EL CAMBIO PRINCIPAL) */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Novedades para ti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {canciones.slice(0, 8).map((song) => (
              <div
                key={song.id}
                onClick={() => navigate(`/song/${song.id}`)} // Navegar a detalle o reproducir
                className="flex items-center gap-3 bg-[#181818] hover:bg-[#282828] p-2 pr-4 rounded-md group cursor-pointer transition duration-300"
              >
                {/* Imagen */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <img
                    src={song.imagenUrl || song.album?.imagenUrl || "https://placehold.co/60"}
                    className="w-full h-full object-cover rounded shadow-md"
                    alt={song.titulo}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                    <Play size={20} fill="white" className="text-white" />
                  </div>
                </div>

                {/* Info Textos */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-white font-bold truncate text-sm mb-1">{song.titulo}</h4>

                  {/* --- BLOQUE DE ARTISTAS INTERACTIVO --- */}
                  <div
                    className="text-xs text-gray-400 truncate"
                    onClick={(e) => e.stopPropagation()} // Previene click en el espacio vacío
                  >
                    {/* 1. Artista Principal */}
                    <span
                      className="hover:text-white hover:underline cursor-pointer"
                      onClick={(e) => goToArtist(e, song.artista?.id)}
                      title="Ir al artista principal"
                    >
                      {song.artista?.nombre || song.artistaNombre || "Desconocido"}
                    </span>

                    {/* 2. Colaboradores */}
                    {(song.colaboraciones || song.colaboradores || []).length > 0 && (
                      <>
                        <span className="text-gray-600"> ft. </span>
                        {(song.colaboraciones || song.colaboradores).map((feat, index, array) => (
                          <span key={index}>
                            <span
                              className="hover:text-white hover:underline cursor-pointer"
                              onClick={(e) => goToArtist(e, feat.artistaId || feat.id)}
                              title="Ir al colaborador"
                            >
                              {feat.nombre}
                            </span>
                            {index < array.length - 1 && ", "}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  {/* ------------------------------------- */}

                </div>

                {/* Duración / Like */}
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-spotify-green opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                    <Heart size={16} />
                  </button>
                  <span className="text-xs text-gray-500 font-mono">{formatDuration(song.duracion)}</span>
                </div>
              </div>
            ))}
            {canciones.length === 0 && <p className="text-gray-500 col-span-full">No hay canciones disponibles.</p>}
          </div>
        </section>

        {/* SECCIÓN: ÁLBUMES POPULARES */}
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
                  <img src={album.imagenUrl || "https://placehold.co/200"} className="w-full aspect-square object-cover rounded-md shadow-lg" alt={album.nombre} />
                  <button className="absolute bottom-2 right-2 bg-spotify-green rounded-full p-3 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Play fill="black" className="text-black ml-1" size={20} />
                  </button>
                </div>
                <h3 className="text-white font-bold truncate text-base">{album.nombre}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{album.artista?.nombre} • {album.anio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN: TODOS LOS ARTISTAS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Mic2 className="text-pink-500" /> Artistas que te pueden gustar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artistas.slice(0, 6).map((artista) => (
              <div
                key={artista.id}
                onClick={() => navigate(`/artist/${artista.id}`)}
                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group flex flex-col items-center text-center shadow-md"
              >
                <img
                  src={artista.imagenUrl || "https://placehold.co/150"}
                  alt={artista.nombre}
                  className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 group-hover:shadow-2xl transition border-2 border-transparent group-hover:border-pink-500"
                />
                <h3 className="text-white font-bold truncate w-full">{artista.nombre}</h3>
                <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-semibold">Artista</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};