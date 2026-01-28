import api from "./api";

export const createAlbum = async (albumData) => {
  // albumData: { nombre: "Live at Wembley", anio: 2024, imagenUrl: "..." }
    try {
        const response = await api.post('/albums', albumData);
        return response.data;
    } catch (error) {
        console.error("Error creando álbum:", error);
        throw error;
    }
};

// Obtener todos (para el Home)
export const getAllAlbums = async () => {
    try {
        const response = await api.get('/albums');
        return response.data;
    } catch (error) {
        return [];
    }
};