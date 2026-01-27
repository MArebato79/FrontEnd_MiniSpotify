import api from './api';

export const getMyPlaylists = async () => {
    try {
        const response = await api.get('/playlists/my'); // Tu endpoint GET /playlists devuelve las del usuario
        return response.data;
    } catch (error) {
        console.error("Error obteniendo playlists", error);
    return [];
    }
};

