import api from "./api";

export const createAlbum = async (albumData) => {
    try {
        const response = await api.post('/albums', albumData);
        return response.data;
    } catch (error) {
        console.error("Error creando álbum:", error);
        throw error;
    }
};

export const getAllAlbums = async () => {
    try {
        const response = await api.get('/albums');
        return response.data;
    } catch (error) {
        return [];
    }
};

export const getAlbumById = async (id) => {
    try {
        const response = await api.get(`/albums/${id}`)
        return response.data
    } catch (error) {
        console.log("Error al acceder al album",error)
        return null
    }
}