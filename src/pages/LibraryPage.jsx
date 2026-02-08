import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPlaylists } from "../services/playlistService";
import { getArtistById } from "../services/artistaService";
import { getCancionesByArtista } from "../services/cancionService"; // <--- IMPORTANTE
import { useNavigate } from "react-router-dom";
import { Music, Disc, ListMusic, Clock } from "lucide-react";
import { usePlayer } from "../components/Player"; // Para poder reproducir al hacer click

// Icono personalizado
const LibraryIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16 6 4 14" />
    <path d="M12 6v14" />
    <path d="M8 8v12" />
    <path d="M4 4v16" />
  </svg>
);

export const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playSong } = usePlayer(); // Hook del reproductor

  const [playlists, setPlaylists] = useState([]);
  const [myArtistData, setMyArtistData] = useState(null);
  const [mySongs, setMySongs] = useState([]); // <--- Estado para guardar tus canciones

  useEffect(() => {
    // 1. Cargar Playlists
    getMyPlaylists().then((data) => setPlaylists(data || []));

    // 2. Si es Artista, cargar sus datos Y sus canciones
    if (user?.artistId) {
      getArtistById(user.artistId).then((data) => setMyArtistData(data));

      // PETICIÓN EXTRA: Traer todas las canciones de este artista
      getCancionesByArtista(user.artistId).then((data) =>
        setMySongs(data || []),
      );
    }
  }, [user]);

  // Helper para duración segura
  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="p-8 text-white pb-32">
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-600 p-4 rounded-full shadow-lg">
          <LibraryIcon size={40} />
        </div>
        <div>
          <h2 className="text-sm uppercase font-bold text-gray-400">
            Biblioteca Personal
          </h2>
          <h1 className="text-4xl font-bold">Biblioteca de {user?.username}</h1>
        </div>
      </div>

      {/* SECCIÓN 1: MIS PLAYLISTS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
          <ListMusic className="text-green-500" /> Mis Playlists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate(`/playlist/${pl.id}`)}
              className="bg-[#181818] p-4 rounded hover:bg-[#282828] cursor-pointer transition group"
            >
              <img
                src={pl.imagenUrl || "https://placehold.co/200"}
                className="w-full aspect-square object-cover rounded shadow-lg mb-2 group-hover:shadow-2xl"
              />
              <h3 className="font-bold truncate">{pl.nombre}</h3>
              <p className="text-xs text-gray-400">
                {pl.cancionesEntradas?.length || 0} canciones
              </p>
            </div>
          ))}
          {playlists.length === 0 && (
            <p className="text-gray-500">No tienes playlists creadas.</p>
          )}
        </div>
      </section>

      {/* SECCIONES DE ARTISTA (SOLO SI ERES ARTISTA) */}
      {user?.artistId && myArtistData && (
        <>
          {/* TUS ÁLBUMES */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Disc className="text-blue-500" /> Mis Álbumes Publicados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myArtistData.albums?.map((album) => (
                <div
                  key={album.id}
                  onClick={() => navigate(`/album/${album.id}`)}
                  className="bg-[#181818] p-4 rounded hover:bg-[#282828] cursor-pointer transition group"
                >
                  <img
                    src={album.imagenUrl || "https://placehold.co/200"}
                    className="w-full aspect-square object-cover rounded shadow-lg mb-2"
                  />
                  <h3 className="font-bold truncate">{album.nombre}</h3>
                  <p className="text-xs text-gray-400">Álbum</p>
                </div>
              ))}
              {(!myArtistData.albums || myArtistData.albums.length === 0) && (
                <p className="text-gray-500">No has publicado álbumes.</p>
              )}
            </div>
          </section>

          {/* TUS CANCIONES (AHORA SÍ FUNCIONA) */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Music className="text-purple-500" /> Todas mis Canciones
            </h2>
            <div className="bg-white/5 rounded-lg p-4">
              {mySongs.length > 0 ? (
                mySongs.map((cancion, idx) => (
                  <div
                    key={cancion.id}
                    onClick={() => playSong(cancion)} // Click para reproducir
                    className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 hover:bg-white/10 rounded cursor-pointer group items-center transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-mono w-6 text-center group-hover:text-white">
                        {idx + 1}
                      </span>
                      <img
                        src={
                          cancion.imagenUrl ||
                          cancion.album?.imagenUrl ||
                          "https://placehold.co/40"
                        }
                        alt={cancion.titulo}
                        className="w-12 h-12 rounded object-cover shadow-sm bg-[#282828]"
                      />
                      <span className="font-medium text-white">
                        {cancion.titulo}
                      </span>
                    </div>

                    <div className="flex justify-end text-sm text-gray-400">
                      {/* Mostramos el álbum si tiene */}
                      <span className="mr-4 hidden md:block">
                        {cancion.album?.nombre || "Sencillo"}
                      </span>
                      {/* Duración */}
                      <span>{formatDuration(cancion.duracion)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No has subido ninguna canción aún.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
