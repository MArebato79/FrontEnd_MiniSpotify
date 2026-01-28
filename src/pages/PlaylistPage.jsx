import { useParams } from "react-router-dom"; // Para leer el ID de la URL
import { useEffect, useState } from "react";
// Importarás tu servicio getPlaylistById aquí...

export const PlaylistPage = () => {
  const { id } = useParams(); // Leemos el /:id de la URL
  
  return (
    <div className="text-white p-8">
        {/* Cabecera Gigante de Playlist (Estilo Spotify) */}
        <div className="flex items-end gap-6 mb-8">
            <img src="https://placehold.co/200" className="shadow-2xl shadow-black/50" />
            <div>
                <p className="text-xs font-bold uppercase">Playlist Pública</p>
                <h1 className="text-7xl font-bold mb-4">Nombre Playlist {id}</h1>
                <p className="text-gray-400">Descripción de la playlist...</p>
            </div>
        </div>

        {/* Lista de Canciones */}
        <div className="bg-black/20 p-6 rounded-lg">
            <p>Aquí iría la lista de canciones...</p>
        </div>
    </div>
  );
};