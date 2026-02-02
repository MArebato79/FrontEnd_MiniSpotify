import api from './api';

export const getFollowedArtists = async () => {
    try {
        const response = await api.get('/usuarios/following'); 
        return response.data;
    } catch (error) {
        console.error("Error obteniendo artistas seguidos", error);
        return [];
    }
};

export const followArtist = async (artistId) => {
    await api.post(`/usuarios/follow/artist/${artistId}`);
};

export const unfollowArtist = async (artistId) => {
    await api.delete(`/usuarios/follow/artist/${artistId}`);
};