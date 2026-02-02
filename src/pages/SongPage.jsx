import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCancionById } from "../services/cancionService";
import { Music, Play, Clock, Disc } from "lucide-react";

export const SongPage = () => {
    const { id } = useParams();
    const [song, setSong] = useState(null);

    useEffect(() => {
        getCancionById(id).then(data => setSong(data));
    }, [id]);

    if (!song) return <div className="text-white p-10">Cargando canción...</div>;

    return (
        <div className="p-8 text-white flex flex-col items-center justify-center min-h-[60vh]">

            {/* CARÁTULA GIGANTE (Usamos placeholder si no viene del álbum) */}
            <div className="relative group mb-8">
                <div className="w-72 h-72 bg-gradient-to-br from-gray-800 to-black rounded-lg shadow-2xl flex items-center justify-center border border-white/10">
                    <Music size={100} className="text-gray-600" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
                    <div className="bg-green-500 p-4 rounded-full shadow-lg transform scale-110">
                        <Play fill="black" size={32} className="text-black ml-1" />
                    </div>
                </button>
            </div>

            {/* DETALLES */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black">{song.titulo}</h1>

                {/* Si tu backend envía info del álbum o artista en el DTO de canción, úsala aquí */}
                <div className="flex items-center justify-center gap-4 text-gray-400 mt-4">
                    <span className="flex items-center gap-1"><Disc size={16} /> Single / Álbum</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> {Math.floor(song.duracion / 60)}:{(song.duracion % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>

        </div>
    );
};