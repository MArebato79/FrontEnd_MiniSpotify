import api from './api';

export const getArtistById = async (id) => {
  try {
    const response = await api.get(`/artistas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo artista", error);
    return null;
  }
};

export const createArtist = async (artistData) => {
    try {
        const response = await api.post('/artistas', artistData);
        return response.data;
    } catch (error) {
        console.error("Error creando artista", error);
        throw error;
    }
};

export const getFollowedArtists = async () => {
    try {
        const response = await api.get('/artistas/followed');
        return response.data;
    } catch (error) {
        console.error("Error fetching followed artists", error);
        return [];
    }
};